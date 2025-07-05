import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { FaUserInjured, FaCalendarAlt, FaCheckCircle, FaClock, FaRupeeSign, FaStar } from 'react-icons/fa';

const AdminDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [kpis, setKpis] = useState({
    totalPatients: 0,
    completed: 0,
    pending: 0,
    revenue: 0,
  });
  const [topPatients, setTopPatients] = useState([]);
  const [nextAppointments, setNextAppointments] = useState([]);

  useEffect(() => {
    const patientsData = JSON.parse(localStorage.getItem('patients')) || [];
    const incidentsData = JSON.parse(localStorage.getItem('incidents')) || [];

    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    const completed = incidentsData.filter(i =>
      ['completed', 'done'].includes(i.status?.toLowerCase())
    );
    const pending = incidentsData.filter(i =>
      ['pending', 'scheduled'].includes(i.status?.toLowerCase())
    );
    const revenue = incidentsData.reduce((acc, i) => {
      const date = new Date(i.appointmentDate);
      const cost = parseFloat(i.cost) || 0;
      if (date.getMonth() === thisMonth && date.getFullYear() === thisYear) {
        return acc + cost;
      }
      return acc;
    }, 0);

    const appointments = incidentsData
      .filter(i => new Date(i.appointmentDate) > today)
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
      .slice(0, 10);

    const patientTreatmentCount = {};
    incidentsData.forEach(i => {
      if (i.patientId) {
        patientTreatmentCount[i.patientId] = (patientTreatmentCount[i.patientId] || 0) + 1;
      }
    });

    const top = Object.entries(patientTreatmentCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => {
        const patient = patientsData.find(p => p.id === id);
        return { ...patient, count };
      });

    setPatients(patientsData);
    setIncidents(incidentsData);
    setTopPatients(top);
    setNextAppointments(appointments);
    setKpis({
      totalPatients: patientsData.length,
      completed: completed.length,
      pending: pending.length,
      revenue,
    });
  }, []);

  return (
    <AdminLayout>
      <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen p-6 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-blue-900">🦷 Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of appointments, treatments, and revenue</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPI icon={<FaUserInjured />} label="Total Patients" value={kpis.totalPatients} color="text-blue-700" />
          <KPI icon={<FaCheckCircle />} label="Completed Treatments" value={kpis.completed} color="text-green-600" />
          <KPI icon={<FaClock />} label="Pending Treatments" value={kpis.pending} color="text-yellow-600" />
          <KPI icon={<FaRupeeSign />} label="This Month's Revenue" value={`₹${kpis.revenue.toLocaleString()}`} color="text-orange-600" />
        </div>

        {/* Latest Appointments */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">📅 Next 10 Appointments</h2>
          {nextAppointments.length === 0 ? (
            <p className="text-gray-500">No upcoming appointments.</p>
          ) : (
            <ul className="divide-y divide-gray-200 text-sm">
              {nextAppointments.map((a) => (
                <li key={a.id} className="py-3 flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-700">{a.title}</p>
                    <p className="text-gray-500">🗓 {new Date(a.appointmentDate).toLocaleString()}</p>
                    <p className="text-gray-400 text-xs">💬 {a.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600">₹{a.cost}</p>
                    <span className="text-xs text-gray-500">{a.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top Patients */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">⭐ Top 5 Patients (Most Treatments)</h2>
          {topPatients.length === 0 ? (
            <p className="text-gray-500">No data available.</p>
          ) : (
            <ul className="divide-y divide-gray-200 text-sm">
              {topPatients.map((p) => (
                <li key={p.id} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium text-gray-700">{p.name}</p>
                    <p className="text-gray-500 text-xs">📞 {p.contact}</p>
                  </div>
                  <div className="text-right text-blue-600 font-semibold flex items-center gap-1">
                    <FaStar className="text-yellow-400" /> {p.count}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

const KPI = ({ icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center">
    <div className={`text-4xl mb-2 ${color}`}>{icon}</div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-gray-800 animate-pulse">{value}</p>
  </div>
);

export default AdminDashboard;
