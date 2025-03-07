import React, { useEffect, useState } from "react";
import "./SplashScreen.css"; // Estilos del splash

const SplashScreen = ({ onComplete }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFade(true);
      setTimeout(onComplete, 500); // Se ejecuta después de que la animación termine
    }, 2000); // 2 segundos antes de desvanecerse
  }, [onComplete]);

  return (
    <div className={`splash-screen ${fade ? "fade-out" : ""}`}>
      <img src="/icons/icon-192x192.png" alt="Logo de la app" />
    </div>
  );
};

export default SplashScreen;
