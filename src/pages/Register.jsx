import React, { useState, useEffect } from 'react';
import axios from 'axios';



const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError] = useState('');
  const [message, setMessage] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);


  
  useEffect(() => {
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    return () => {
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);


  const handleReghister = async (e) => {
    e.preventDefault();
    const userData = { email, password };

    if (!isOnline) {
      console.warn("⚠️ No hay conexión. Guardando en IndexedDB...");
      InsertIndexedDB(userData);
      alert("Registro guardado offline. Se enviará cuando haya internet.");
      return;
  }

    try {
        const response = await fetch('https://server-1yxj.onrender.com/api/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error("Error al convertir la respuesta en JSON:", jsonError);
            setError("Error inesperado en la respuesta del servidor.");
            return;
        }

        if (response.ok) {
            alert('Registro exitoso');
            navigate('/login');
        // console.log(data);
      } else {
        setError(data.message || 'Error al registrarte.');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor. Inténtalo nuevamente.');
    } 
  };
  


const handleRegister = async (e) => {
  e.preventDefault();

  const userData = {  email, password };


  if (!isOnline) {
    console.warn("⚠️ No hay conexión. Guardando en IndexedDB...");
    InsertIndexedDB(userData);
    alert("Registro guardado offline. Se enviará cuando haya internet.");
    return;
}
    
  try {

    const response = await fetch('https://server-1yxj.onrender.com/api/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
     alert('Registro exitoso. Ahora puedes iniciar sesión.');
      navigate('/login');
     // console.log(data);
    } else {
      setError(data.message || 'Error al registrarte.');
    }
  } catch (err) {
    setError('No se pudo conectar al servidor. Inténtalo nuevamente.');
  } 
};

function InsertIndexedDB(data) {
  let dbRequest = window.indexedDB.open("database");
  dbRequest.onupgradeneeded = event => {
    let db = event.target.result;
    if (!db.objectStoreNames.contains("Usuarios")) {
      db.createObjectStore("Usuarios", { keyPath: "email" });
    }
  };

  dbRequest.onsuccess = event => {
      let db = event.target.result;

          // Verificamos que el object store exista antes de hacer la transacción
      if (!db.objectStoreNames.contains("Usuarios")) {
        console.error("❌ El object store 'Usuarios' no existe.");
        return;
      }

      let transaction = db.transaction("Usuarios", "readwrite");
      let objStore = transaction.objectStore("Usuarios");

      let addRequest = objStore.add(data);

      addRequest.onsuccess = event2 => {
          console.log("Datos insertados en IndexedDB:", event2.target.result);

          if ('serviceWorker' in navigator && 'SyncManager' in window) {
              navigator.serviceWorker.ready
                  .then(registration => {
                      console.log("Intentando registrar la sincronización...");
                      return registration.sync.register("syncUsuarios");
                  })
                  .then(() => { 
                      console.log("✅ Sincronización registrada con éxito");
                  })
                  .catch(err => {
                      console.error("❌ Error registrando la sincronización:", err);
                  });
          } else {
              console.warn("⚠️ Background Sync no es soportado en este navegador.");
          }
      };

      addRequest.onerror = () => {
          console.error("❌ Error insertando en IndexedDB");
      };
  };

  dbRequest.onerror = () => {
      console.error("❌ Error abriendo IndexedDB");
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
    

