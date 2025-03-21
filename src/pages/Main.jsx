import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import keys from '../../keys.json'; // Importa las llaves VAPID

const Main = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  // Obtener datos del usuario desde localStorage
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (!userId) {
      alert("No has iniciado sesión. Redirigiendo al login.");
      navigate('/login');
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (userRole === 'admin') {
      fetch('https://server-1yxj.onrender.com/api/users')
        .then(response => {
          if (!response.ok) throw new Error('Error al obtener los usuarios');
          return response.json();
        })
        .then(data => {
          const usersWithSubscription = data.filter(user => user.suscripcion);
          setUsers(usersWithSubscription);
        })
        .catch(error => console.error('Error al cargar los usuarios:', error));
    }
  }, [userRole]);
  

  const registerServiceWorker = async () => {
    try {
      console.log("Registrando el Service Worker...");
      const registration = await navigator.serviceWorker.register('./sw.js', { type: 'module' });
      console.log("Service Worker registrado:", registration);
  
      // Verificar si ya hay una suscripción existente
      const existingSubscription = await registration.pushManager.getSubscription();
      console.log("Suscripción existente:", existingSubscription);
  
      if (existingSubscription) {
        console.log("El usuario ya tiene una suscripción activa.");
        return; // No hacer nada si ya está suscrito
      }
  
      console.log("No hay suscripción, creando una nueva...");
  
      // Solicitar permiso de notificación
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log("El usuario denegó el permiso de notificaciones.");
        return;
      }
  
      // Suscribir al usuario a las notificaciones push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keys.publicKey
      });
  
      console.log("Nueva suscripción creada:", subscription.toJSON());
  
      // Guardar la suscripción en la base de datos
      const response = await fetch('https://server-1yxj.onrender.com/api/suscripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, suscripcion: subscription.toJSON() })
      });
  
      if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
      const data = await response.json();
      console.log('Suscripción guardada en la base de datos:', data);
  
    } catch (error) {
      console.error("Error en el registro del Service Worker:", error);
    }
  };
  
  useEffect(() => {
    registerServiceWorker();
  }, []);
  
  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessage('');
  };

  const handleSendMessage = async () => {
    try {
      const response = await fetch('https://server-1yxj.onrender.com/api/suscripcionMod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suscripcion: selectedUser.suscripcion,
          mensaje: message
        })
      });

      if (!response.ok) throw new Error('Error al enviar el mensaje');

      const data = await response.json();
      console.log('Mensaje enviado:', data);
      alert('Mensaje enviado con éxito');
      handleCloseModal();
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      alert('Hubo un error al enviar el mensaje');
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Bienvenido</h2>
      <button className="button" onClick={() => alert('¡Hola!')}>
        Click
      </button>

      {userRole === 'admin' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleOpenModal(user)}>Enviar Mensaje</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Enviar mensaje a {selectedUser?.nombre}</h3>
            <textarea
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleCloseModal}>Cerrar</button>
              <button onClick={handleSendMessage}>Enviar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
