import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div style={styles.homeContainer}>
      <img src="src/icons/icon-512x512.png" alt="Logo de la app" />
      <p style={styles.subheading}>Descubre consejos, información y recursos para llevar una vida más saludable.</p>
      <div style={styles.buttonContainer}>
        <button style={styles.btn} onClick={goToLogin}>
          Iniciar Sesión
        </button>
        <button style={styles.btn} onClick={goToRegister}>
          Registrarse
        </button>
      </div>
    </div>
  );
};

const styles = {
  homeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // Alineación hacia arriba
    minHeight: '100vh', // Cambio de height a minHeight para permitir que se ajuste a la pantalla
    backgroundColor: '#ffffff',
    padding: '20px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    paddingTop: '10px', // Reducir aún más el espacio superior
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    color: '#343a40',
    textAlign: 'center',
  },
  subheading: {
    fontSize: '1.2rem',
    marginBottom: '15px', // Reducir el margen inferior para acercar el texto
    color: '#6c757d',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px', // Reducir el margen superior para los botones
  },
  btn: {
    padding: '12px 25px',
    fontSize: '1rem',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
};

styles.btnHover = {
  ':hover': {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  },
};

export default Home;
