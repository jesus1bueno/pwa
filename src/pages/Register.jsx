import React, { useState } from 'react';
import axios from 'axios';



const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = { email, password };

    try {
      const response = await axios.post('https://server-1yxj.onrender.com/auth/register', userData);
      setMessage(response.data.message);
    } catch (err) {
      setMessage('Error al registrarse. Guardado en espera de conexión.');
      insertIndexedDB(userData);

      // Registrar la sincronización si el navegador lo soporta
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
      registration.sync.register('syncRegistro')
        .then(() => console.log("Sincronización registrada"))
        .catch(err => console.error("Error registrando sincronización", err));
    });
  }
    }
  };

  function insertIndexedDB(data) {
    const request = indexedDB.open("database", 1);

    request.onupgradeneeded = event => {
        let db = event.target.result;
        if (!db.objectStoreNames.contains("Usuarios")) {
            db.createObjectStore("Usuarios", { keyPath: "email" });
        }
    };

    request.onsuccess = event => {
        let db = event.target.result;
        let transaction = db.transaction("Usuarios", "readwrite");
        let store = transaction.objectStore("Usuarios");

        store.add(data).onsuccess = () => {
            console.log("Usuario guardado en IndexedDB");
        };
    };
}


  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Crea tu cuenta</h2>
        <form onSubmit={handleRegister}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Escribe tu contraseña"
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Registrar</button>
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
    backgroundColor: '#e9ecef',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '400px',
    padding: '30px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
  },
  heading: {
    marginBottom: '10px',
    color: '#333',
    textAlign: 'center',
    fontSize: '2rem',
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
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    marginTop: '20px',
  },
  message: {
    marginTop: '15px',
    color: '#0000ff',
    textAlign: 'center',
  },
};

export default Register;
    

