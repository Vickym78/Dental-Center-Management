import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AdminLayout from '../../components/AdminLayout';

const CalendarView = () => {
  const [incidents, setIncidents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('incidents')) || [];
    setIncidents(stored);
  }, []);

  // Get appointments for a given date
  const getAppointmentsForDate = (date) => {
    return incidents.filter((incident) => {
      const apptDate = new Date(incident.appointmentDate);
      return apptDate.toDateString() === date.toDateString();
    });
  };

  // Render small dots or titles under date
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const appointments = getAppointmentsForDate(date);
      return appointments.length > 0 ? (
        <div className="mt-1 space-y-0.5">
          {appointments.slice(0, 2).map((appt, idx) => (
            <div key={idx} className="text-[10px] text-blue-600 truncate">• {appt.title}</div>
          ))}
          {appointments.length > 2 && (
            <div className="text-[10px] text-gray-500">+{appointments.length - 2} more</div>
          )}
        </div>
      ) : null;
    }
    return null;
  };

  const selectedAppointments = getAppointmentsForDate(selectedDate);

  return (
    <AdminLayout>
      <div className="p-6 min-h-screen bg-gray-50">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">📆 Appointment Calendar</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Calendar Section */}
          <div className="bg-white rounded shadow-md p-4">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              className="w-full"
            />
          </div>

          {/* Appointments List */}
          <div className="bg-white rounded shadow-md p-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-700">
              Appointments on {selectedDate.toDateString()}
            </h3>
            {selectedAppointments.length === 0 ? (
              <p className="text-gray-500">No appointments scheduled.</p>
            ) : (
              <ul className="space-y-3">
                {selectedAppointments.map((appt, idx) => (
                  <li
                    key={idx}
                    className="border border-blue-100 rounded-lg p-3 bg-blue-50"
                  >
                    <p className="font-semibold text-blue-800">{appt.title}</p>
                    <p className="text-sm text-gray-600">{appt.description}</p>
                    <p className="text-sm text-gray-700">Status: <strong>{appt.status || 'Pending'}</strong></p>
                    <p className="text-sm text-gray-700">Time: {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CalendarView;
