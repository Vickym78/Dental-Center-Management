import React, { useEffect, useState } from 'react';
import PatientLayout from '../../components/PatientLayout';

const Profile = () => {
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    contact: '',
    email: '',
    healthInfo: '',
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const allPatients = JSON.parse(localStorage.getItem('patients')) || [];

    if (user?.role === 'Patient') {
      const current = allPatients.find(p => p.id === user.patientId);
      if (current) {
        setPatient(current);
        setFormData(current);
      } else {
        setError('❌ Patient data not found.');
      }
    }

    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!/^\d{10}$/.test(formData.contact)) {
      setError('📱 Contact number must be exactly 10 digits.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('✉️ Please enter a valid email address.');
      return;
    }

    const allPatients = JSON.parse(localStorage.getItem('patients')) || [];
    const updated = allPatients.map(p =>
      p.id === patient?.id ? { ...p, ...formData } : p
    );
    localStorage.setItem('patients', JSON.stringify(updated));
    setSuccessMessage('Profile updated successfully!');
  };

  if (loading) {
    return (
      <PatientLayout>
        <div className="p-6 text-center text-gray-500">⏳ Loading your profile...</div>
      </PatientLayout>
    );
  }

  if (!patient) {
    return (
      <PatientLayout>
        <div className="p-6 text-center text-red-500">{error || '❌ Patient not found.'}</div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="max-w-xl mx-auto bg-white mt-10 p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">👤 My Profile</h2>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-300 text-red-700 p-3 rounded">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 bg-green-100 border border-green-300 text-green-700 p-3 rounded">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <InputField
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(val) => setFormData({ ...formData, name: val })}
            required
          />

          {/* DOB */}
          <InputField
            label="Date of Birth"
            type="date"
            value={formData.dob}
            onChange={(val) => setFormData({ ...formData, dob: val })}
            required
          />

          {/* Contact */}
          <InputField
            label="Contact Number"
            type="text"
            value={formData.contact}
            onChange={(val) => setFormData({ ...formData, contact: val })}
            required
            pattern="\d{10}"
            title="Must be 10-digit number"
          />

          {/* Email */}
          <InputField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(val) => setFormData({ ...formData, email: val })}
            required
          />

          {/* Health Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Health Information</label>
            <textarea
              value={formData.healthInfo}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({ ...formData, healthInfo: e.target.value })}
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </PatientLayout>
  );
};

const InputField = ({ label, type, value, onChange, ...rest }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  </div>
);

export default Profile;
