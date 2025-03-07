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
      const response = await axios.post('http://localhost:4000/api/register', userData);
      setMessage(response.data.message);
    } catch (err) {
      setMessage('Error al registrarse. Guardado en espera de conexión.');
  
      // Guardar en IndexedDB
      insertIndexDB(userData);
  
      // Registrar sincronización en el Service Worker
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
          registration.sync.register('syncLibros');
        });
      }
    }
  };
  
  
  function insertIndexDB(data){
    let db=window.indexedDB.open("database");
    db.onsuccess=event=>{
        let result=event.target.result;

        let transaction=result.transaction("libros","readwrite");
        let obj=transaction.objectStore("libros");

        //const resultado=obj.openCursor(null,'prev');// buescar el ultimo index
        const resultado=obj.add(data);  //insertar
        ///const resultado=obj.get(3);     //buescar 
        //const resultado=obj.delete(1);  // eliminar idex


        resultado.onsuccess=event2=>{
            console.log("insertar", event2.target.result);
            //console.log("last key", event2.target.key);
        }
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Crea tu cuenta</h2>
        <p style={styles.subheading}>Únete a nuestra comunidad y empieza a disfrutar de nuestros servicios.</p>
        <form>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              //required
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
              //required
              placeholder="Escribe tu contraseña"
              style={styles.input}
            />
          </div>
          
          <button  onClick={() => insertIndexDB({email: "paco@gmail.com ", password: "hola1234" })} style={styles.button}>Registrar</button>

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
    margin: 0,
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
    textAlign: 'center',
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
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    marginTop: '5px',
    boxSizing: 'border-box',
  },
  button:{
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    marginTop: '20px',
    transition: 'background-color 0.3s ease',
  },
  message: {
    marginTop: '15px',
    color: '#0000ff', // Color rojo para mensajes de error
    textAlign: 'center',
  },
};

// Efecto hover para el botón
styles.btnSubmitHover = {
  ':hover': {
    backgroundColor: '#0056b3', // Color más oscuro al pasar el ratón
  },
};

export default Register;