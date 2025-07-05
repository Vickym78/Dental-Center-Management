import React, { useEffect, useState } from 'react';
import PatientLayout from '../../components/PatientLayout';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const allPatients = JSON.parse(localStorage.getItem('patients')) || [];
    const allIncidents = JSON.parse(localStorage.getItem('incidents')) || [];

    if (user?.role === 'Patient') {
      const current = allPatients.find(p => p.id === user.patientId);
      setPatient(current);

      const patientIncidents = allIncidents
        .filter(i => i.patientId === user.patientId)
        .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

      setIncidents(patientIncidents);
      const future = patientIncidents.find(i => new Date(i.appointmentDate) > new Date());
      setNextAppointment(future || null);
    }
  }, []);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'done' || s === 'completed') return 'bg-green-100 text-green-700';
    if (s === 'pending') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <PatientLayout>
      <div className="bg-gray-100 min-h-screen p-6 max-w-5xl mx-auto space-y-6">
        {/* Greeting & Profile */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-3xl font-bold text-blue-800">👋 Welcome, {patient?.name || 'Patient'}</h1>
          <button
            onClick={() => window.location.href = '/patient/profile'}
            className="text-blue-600 underline hover:text-blue-800 text-sm"
          >
            Edit Profile
          </button>
        </div>

        {/* Next Appointment */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">📅 Upcoming Appointment</h2>
          {nextAppointment ? (
            <div className="text-gray-700 text-sm space-y-1">
              <p className="text-lg font-semibold text-blue-800">{nextAppointment.title}</p>
              <p>🕒 <strong>Date & Time:</strong> {new Date(nextAppointment.appointmentDate).toLocaleString()}</p>
              <p>💬 <strong>Issue:</strong> {nextAppointment.description}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">You have no upcoming appointments scheduled.</p>
          )}
        </section>

        {/* Recent Treatments */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">🦷 Recent Treatments</h2>
          {incidents.length === 0 ? (
            <p className="text-gray-500 italic">No treatment history found.</p>
          ) : (
            <ul className="space-y-4">
              {incidents.slice(0, 3).map((incident) => (
                <li key={incident.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-blue-800 font-bold">{incident.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(incident.status)}`}>
                      {incident.status || 'Unknown'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    🧾 <strong>Treatment:</strong> {incident.treatment || 'N/A'} • ₹{incident.cost || 0}
                  </p>
                  <p className="text-sm text-gray-500">
                    📅 <strong>Date:</strong> {new Date(incident.appointmentDate).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;
