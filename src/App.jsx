import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import SplashScreen from './SplashScreen';

const App = () => {
 const [loading, setLoading] = useState(true);

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
