import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import keys from '../keys.json'


export async function registerServiceWorkerAndSubscribe() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js', { type: 'module' })
      .then(async (registro) => {
        if (Notification.permission === 'denied' || Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            registro.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: keys.publicKey
            })
            .then(res => res.toJSON())
            .then(async json => {
              console.log(json);
              
        
              try {
                const response = await fetch('http://localhost:5000/auth/subscribe', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(json)
                });
  
                const result = await response.json();
                console.log(' Respuesta del backend:', result);

                if (Notification.permission === 'granted') {
                  new Notification('Notificación Activa', {
                    body: '¡Ya estás suscrito a las notificaciones!',
                    icon: '/src/icons/icon-96x96.png' // Reemplaza con el ícono de tu preferencia
                  });
                }
                
              } catch (error) {
                console.error('❌ Error al suscribirse o enviar la suscripción al backend:', error);
              }
            });
          }
        }
      })
      .catch(error => console.error(' Error al registrar Service Worker:', error));
  }  
}



// Inicializar IndexedDB
let db = window.indexedDB.open('database');


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);





