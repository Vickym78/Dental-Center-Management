import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';

const PatientLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/patient/dashboard', icon: <FaTachometerAlt /> },
    { label: 'Profile', path: '/patient/profile', icon: <FaUserCircle /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-2xl text-blue-700 flex items-center gap-2">
          🦷 Patient Panel
        </h1>
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md transition ${
                location.pathname === link.path
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              {link.icon} {link.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm px-3 py-1 text-red-500 hover:text-white hover:bg-red-500 rounded-md transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main className="p-6">{children}</main>
    </div>
  );
};

export default PatientLayout;
