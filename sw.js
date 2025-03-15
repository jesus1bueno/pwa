
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('appShell-v5').then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/manifest.json",
        "/src/App.jsx",
        "/src/App.css",
        "/src/App.jsx",
        "/src/SplashScreen.jsx",
        "/src/components/Home.js",	
        "/src/components/Login.js",
        "/src/components/Register.js",
        "/src/icons/icon-96x96.png",
        "/src/icons/icon-144x144.png",
        "/src/icons/icon-192x192.png",
        "/src/icons/cap.png",
        "/src/icons/cap1.png"
      ]);
    })
  );
  self.skipWaiting();
});

function InsertIndexedDB(data) {
  let dbRequest = window.indexedDB.open("database");

  dbRequest.onupgradeneeded = event => {
    let db = event.target.result;
    if (!db.objectStoreNames.contains("Libros")) {
      db.createObjectStore("Libros", { keyPath: "id", autoIncrement: true });
    }
  };

  dbRequest.onsuccess = event => {
    let db = event.target.result;
    let transaction = db.transaction("Libros", "readwrite");
    let obj = transaction.objectStore("Libros");
    const result = obj.add(data);

    result.onsuccess = event2 => {
      console.log("Inserción exitosa en IndexedDB:", event2.target.result);
      self.registration.sync.register("syncLibros");
    };
  };

  dbRequest.onerror = event => {
    console.error("Error al abrir IndexedDB:", event.target.error);
  };
}

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== "appShell-v5" && key !== "dinamico-v5")
            .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        console.log("Respuesta obtenida del cache para:", event.request.url);
        return cachedResponse;
      }

      return fetch(event.request).then(networkResponse => {
        if (!networkResponse) {
          throw new Error('Network response was null or undefined');
        }

        // Guardar en cache si la respuesta es exitosa
        return caches.open('dinamico-v5').then(cache => {
          cache.put(event.request, networkResponse.clone());
          console.log("Respuesta guardada en cache para:", event.request.url);
          return networkResponse;
        });
      }).catch(error => {
        console.error('Fetch failed:', error);
        // Si no hay conexión o falla la petición, intentar buscar en el cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            console.log("Respuesta obtenida del cache debido a fallo de red:", event.request.url);
            return cachedResponse;
          }
          // Si no hay respuesta en caché, devolver una respuesta de error
          return new Response('Network error occurred and no cache is available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      });
    })
  );
});

// Abre o crea la base de datos IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('myDatabase', 1);

    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      // Crea un almacén de objetos para almacenar los datos
      if (!db.objectStoreNames.contains('myDataStore')) {
        db.createObjectStore('myDataStore', { keyPath: 'id' });
      }
    };

    request.onsuccess = function(event) {
      resolve(event.target.result);
    };

    request.onerror = function(event) {
      reject('Error al abrir la base de datos');
    };
  });
}

// Función para guardar datos en IndexedDB
function saveDataToIndexedDB(data) {
  openDatabase().then(db => {
    const transaction = db.transaction(['myDataStore'], 'readwrite');
    const store = transaction.objectStore('myDataStore');
    store.put(data);

    transaction.oncomplete = function() {
      console.log('Datos guardados correctamente en IndexedDB:', data);
    };

    transaction.onerror = function() {
      console.error('Error al guardar los datos:', data);
    };
  }).catch(error => {
    console.error(error);
  });
}

// Función para recuperar los datos de IndexedDB
function getDataFromIndexedDB() {
  return new Promise((resolve, reject) => {
    openDatabase().then(db => {
      const transaction = db.transaction(['myDataStore'], 'readonly');
      const store = transaction.objectStore('myDataStore');
      const request = store.getAll(); // Obtener todos los registros

      request.onsuccess = function() {
        resolve(request.result); // Resolver los datos obtenidos
      };

      request.onerror = function() {
        reject("Error al recuperar los datos de IndexedDB");
      };
    }).catch(error => {
      reject("Error al abrir la base de datos");
    });
  });
}

// Función para eliminar los datos de IndexedDB
function deleteDataFromIndexedDB() {
  openDatabase().then(db => {
    const transaction = db.transaction(['myDataStore'], 'readwrite');
    const store = transaction.objectStore('myDataStore');
    const request = store.clear(); // Eliminar todos los registros

    request.onsuccess = function() {
      console.log("Datos eliminados de IndexedDB");
    };

    request.onerror = function() {
      console.error("Error al eliminar los datos de IndexedDB");
    };
  }).catch(error => {
    console.error(error);
  });
}

// Función para enviar los datos a la base de datos externa
function sendDataToExternalDatabase(data) {
  // Aquí se puede utilizar `fetch` o cualquier otra API para enviar los datos a la base de datos externa
  fetch('https://server-1yxj.onrender.com/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Datos enviados a la base de datos externa:', data);
    deleteDataFromIndexedDB(); // Eliminar datos de IndexedDB después de ser enviados
  })
  .catch(error => {
    console.error('Error al enviar datos a la base de datos externa:', error);
  });
}
/*
// Detectar la reconexión a Internet
window.addEventListener('online', () => {
  console.log('Conectado a Internet');
  // Recuperar los datos de IndexedDB y enviarlos a la base de datos externa
  getDataFromIndexedDB().then(data => {
    if (data.length > 0) {
      console.log('Enviando datos a la base de datos externa:', data);
      sendDataToExternalDatabase(data);
    } else {
      console.log('No hay datos en IndexedDB para enviar.');
    }
  }).catch(error => {
    console.error('Error al obtener los datos de IndexedDB:', error);
  });
});*/

self.addEventListener('push', event => {
  const options = {
    body: "Hola, cómo estás?",
    image: "/src/icons/icon-96x96.png"
  };
  console.log('Notificación push recibida:', event);
  self.registration.showNotification("Título de la Notificación", options);
});


// Escuchar evento de sincronización para registrar usuarios
self.addEventListener('sync', event => {
    if (event.tag === "syncRegistro") {
        event.waitUntil(
            new Promise((resolve, reject) => {
                let dbRequest = indexedDB.open("database", 1);

                dbRequest.onsuccess = event => {
                    let db = event.target.result;
                    let transaction = db.transaction("Usuarios", "readonly");
                    let store = transaction.objectStore("Usuarios");

                    let getAllRequest = store.getAll();

                    getAllRequest.onsuccess = () => {
                        let usuarios = getAllRequest.result;
                        if (usuarios.length === 0) {
                            resolve();
                            return;
                        }

                        let postPromises = usuarios.map(usuario =>
                            fetch('https://server-1yxj.onrender.com/auth/register', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(usuario)
                            })
                        );

                        Promise.all(postPromises)
                            .then(() => {
                                let deleteTransaction = db.transaction("Usuarios", "readwrite");
                                let deleteStore = deleteTransaction.objectStore("Usuarios");
                                deleteStore.clear();
                                resolve();
                            })
                            .catch(reject);
                    };
                };

                dbRequest.onerror = reject;
            })
        );
    }
});
