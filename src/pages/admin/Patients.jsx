import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    contact: '',
    healthInfo: '',
    status: 'Active',
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPatients = JSON.parse(localStorage.getItem('patients')) || [];
    setPatients(storedPatients);
  }, []);

  const savePatients = (updatedList) => {
    localStorage.setItem('patients', JSON.stringify(updatedList));
    setPatients(updatedList);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split('T')[0];
    if (formData.dob > today) {
      alert('❌ DOB cannot be in the future.');
      return;
    }

    if (editingIndex !== null) {
      const updated = [...patients];
      updated[editingIndex] = { ...updated[editingIndex], ...formData };
      savePatients(updated);
      setEditingIndex(null);
    } else {
      const newPatient = {
        id: `p${Date.now()}`,
        ...formData,
      };
      savePatients([...patients, newPatient]);
    }

    setFormData({
      name: '',
      dob: '',
      contact: '',
      healthInfo: '',
      status: 'Active',
    });
  };

  const handleEdit = (index) => {
    setFormData(patients[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...patients];
    updated.splice(index, 1);
    savePatients(updated);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">🧑‍⚕️ Patient Management</h2>

        {/* Patient Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">
            {editingIndex !== null ? '✏️ Edit Patient' : '➕ Add New Patient'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                required
                className="border p-2 w-full rounded"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                max={today}
                className="border p-2 w-full rounded"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Number *</label>
              <input
                type="text"
                required
                className="border p-2 w-full rounded"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="border p-2 w-full rounded"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Health Info</label>
              <textarea
                className="border p-2 w-full rounded"
                rows="2"
                value={formData.healthInfo}
                onChange={(e) => setFormData({ ...formData, healthInfo: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition mt-4"
          >
            {editingIndex !== null ? 'Update Patient' : 'Add Patient'}
          </button>
        </form>

        {/* Patients Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📋 All Registered Patients</h3>
          {patients.length === 0 ? (
            <p className="text-gray-500">No patients available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">DOB</th>
                    <th className="p-3 border">Contact</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Health Info</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, index) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{patient.name}</td>
                      <td className="p-3 border">{patient.dob}</td>
                      <td className="p-3 border">{patient.contact}</td>
                      <td className="p-3 border">{patient.status}</td>
                      <td className="p-3 border">{patient.healthInfo}</td>
                      <td className="p-3 border space-x-2">
                        <button
                          onClick={() => handleEdit(index)}
                          className="bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => navigate(`/admin/patient/${patient.id}/incidents`)}
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          Incidents
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Patients;
