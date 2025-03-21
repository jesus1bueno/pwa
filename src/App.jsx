import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import SplashScreen from './SplashScreen';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js', { type: 'module' })
        .then(registration => console.log('Service Worker registrado:', registration))
        .catch(error => console.error('Error al registrar el Service Worker:', error));
    }
  }, []);

  return (
    loading ? (
      <SplashScreen onComplete={() => setLoading(false)} />
    ) : (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    )
  );
};

export default App;
