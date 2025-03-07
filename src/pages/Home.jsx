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
      <h2 style={styles.heading}>¡Bienvenido a Tu Espacio de Bienestar!</h2>
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
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#e9ecef', // Color de fondo más suave
    padding: '20px', // Espaciado alrededor
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Sombra suave
  },
  heading: {
    fontSize: '2.5rem', // Tamaño de fuente más grande
    marginBottom: '10px',
    color: '#343a40', // Color más oscuro
    textAlign: 'center',
  },
  subheading: {
    fontSize: '1.2rem',
    marginBottom: '30px',
    color: '#6c757d', // Color gris para el subtítulo
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
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
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', // Sombra en los botones
  },
};

// Efecto hover para los botones
styles.btnHover = {
  ':hover': {
    backgroundColor: '#0056b3', // Color más oscuro al pasar el ratón
    transform: 'scale(1.05)', // Aumentar ligeramente el tamaño
  },
};

export default Home;
