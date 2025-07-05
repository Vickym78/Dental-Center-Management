import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

const Incidents = () => {
  const { patientId } = useParams();
  const [incidents, setIncidents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    appointmentDate: '',
    cost: '',
    treatment: '',
    status: '',
    nextDate: '',
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('incidents')) || [];
    const filtered = stored.filter(i => i.patientId === patientId);
    setIncidents(filtered);
  }, [patientId]);

  const saveToLocal = (newList) => {
    const all = JSON.parse(localStorage.getItem('incidents')) || [];
    const updated = all.filter(i => i.patientId !== patientId).concat(newList);
    localStorage.setItem('incidents', JSON.stringify(updated));
    setIncidents(newList);
  };

  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files);
    const readers = fileList.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ name: file.name, url: reader.result });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(results => {
      setFiles(results);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newIncident = {
      id: `i${Date.now()}`,
      patientId,
      ...formData,
      cost: parseFloat(formData.cost) || 0,
      files: files || [],
    };

    const newList = [...incidents, newIncident];
    saveToLocal(newList);

    setFormData({
      title: '',
      description: '',
      appointmentDate: '',
      cost: '',
      treatment: '',
      status: '',
      nextDate: '',
    });
    setFiles([]);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">
          🦷 Manage Incidents for Patient ID: <span className="text-blue-600">{patientId}</span>
        </h2>

        {/* Incident Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md mb-6">
          <div>
            <label className="block text-sm font-medium">Title *</label>
            <input className="border p-2 w-full rounded" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium">Description *</label>
            <textarea className="border p-2 w-full rounded" required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium">Appointment Date & Time *</label>
            <input type="datetime-local" className="border p-2 w-full rounded" required value={formData.appointmentDate} onChange={e => setFormData({ ...formData, appointmentDate: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium">Cost (₹)</label>
            <input type="number" className="border p-2 w-full rounded" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium">Treatment Given</label>
            <input className="border p-2 w-full rounded" value={formData.treatment} onChange={e => setFormData({ ...formData, treatment: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <input className="border p-2 w-full rounded" placeholder="e.g., done, completed" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium">Next Visit Date</label>
            <input type="date" className="border p-2 w-full rounded" value={formData.nextDate} onChange={e => setFormData({ ...formData, nextDate: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium">Upload Files (PDF/Image)</label>
            <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg" className="border p-2 w-full rounded" onChange={handleFileChange} />
          </div>

          <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition">
            Add Incident
          </button>
        </form>

        {/* Incident List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">📋 Patient Incidents</h3>
          {incidents.length === 0 ? (
            <p className="text-gray-500">No incidents recorded yet.</p>
          ) : (
            <ul className="space-y-4">
              {incidents.map((i) => (
                <li key={i.id} className="border border-blue-100 bg-blue-50 p-4 rounded-lg shadow-sm">
                  <h4 className="text-md font-semibold text-blue-900">{i.title}</h4>
                  <p className="text-sm text-gray-700">
                    <strong>Date:</strong> {new Date(i.appointmentDate).toLocaleString()}<br />
                    <strong>Description:</strong> {i.description}<br />
                    <strong>Cost:</strong> ₹{i.cost} | <strong>Status:</strong> {i.status || 'Pending'}<br />
                    <strong>Next Visit:</strong> {i.nextDate || 'N/A'}<br />
                    <strong>Treatment:</strong> {i.treatment || 'N/A'}
                  </p>

                  {i.files?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">📎 Attachments:</p>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        {i.files.map((f, idx) => (
                          <li key={idx}>
                            <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                              {f.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Incidents;
