import React, { useEffect, useState } from 'react';
import { seedLocalStorage } from './data/initData';
import AppRouter from './AppRouter';
import './App.css'; // assuming you have your dynamic CSS here

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedLocalStorage(); // initialize local data
    const timer = setTimeout(() => setLoading(false), 1000); // fake delay for effect
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="App">
        <div className="loader-container">
          <div className="spinner" />
          <p className="loader-text">Launching Dental App...</p>
        </div>
      </div>
    );
  }

  return <AppRouter />;
}

export default App;
