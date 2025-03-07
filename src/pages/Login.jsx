import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/login', {
        email,
        password,
      });
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Inicia sesión en tu cuenta</h2>
        <p style={styles.subheading}>Accede para continuar y disfrutar de todas nuestras funcionalidades.</p>
        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Escribe tu correo electrónico"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Escribe tu contraseña"
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.btnSubmit}>
            Iniciar Sesión
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#e9ecef', // Color de fondo más suave
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    maxWidth: '400px',
    padding: '30px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
  },
  heading: {
    marginBottom: '10px',
    color: '#333',
    fontSize: '2rem', // Tamaño de fuente más grande
  },
  subheading: {
    marginBottom: '20px',
    color: '#6c757d', // Color gris para el subtítulo
    fontSize: '1rem',
    textAlign: 'center',
  },
  formGroup: {
    width: '100%',
    marginBottom: '15px',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    marginTop: '5px',
  },
  btnSubmit: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    transition: 'background-color 0.3s ease',
  },
  message: {
    marginTop: '15px',
    color: '#dc3545', // Color rojo para mensajes de error
    textAlign: 'center',
  },
};

// Efecto hover para el botón
styles.btnSubmitHover = {
  ':hover': {
    backgroundColor: '#0056b3', // Color más oscuro al pasar el ratón
  },
};

export default Login;
