self.addEventListener('install',event=>{
    caches.open('appShell-v5')
    .then(cache=>{
        cache.addAll([
            "/src/App.jsx",
            "/src/main.jsx",
            "/src/components/Home.js",	
            "/src/components/Login.js",
            "/src/components/Register.js"
            

        ])
    })
    self.skipWaiting();
})

function InsertIndexedDB(data){
    let db=window.indexedDB.open("database");

    db.onupgradeneeded = event => {
        let db = event.target.result;
        if (!db.objectStoreNames.contains("Libros")) {
            db.createObjectStore("Libros", { keyPath: "id", autoIncrement: true });
        }
    };

    db.onsuccess=event=>
    {
        let result=event.target.result;

        let transaction=result.transaction("Libros","readwrite");
        let obj=transaction.objectStore("Libros");

        const resultado=obj.add(data);

        resultado.onsuccess=event2=>
        {
            console.log("insersion",event2.target.result);
            self.registration.sync.register("syncLibros");
        }
    }
    
    db.onerror = event => {
        console.error("Error al abrir IndexedDB:", event.target.error);
    };
}


self.addEventListener("activate",event=>{
    caches.delete("appShell-v4");
    caches.delete("dinamico-v4");
});



self.addEventListener('fetch', event=>{
    
    caches.match(event.request)
    .then(console.log);

    if (event.request.method === "POST") {
        event.request.clone().json()
            .then(body => {
                return fetch(event.request).catch(() => {
                    InsertIndexedDB(body);
                    return new Response(JSON.stringify({ message: "Datos guardados offline" }), { headers: { "Content-Type": "application/json" } });
                });
            })
            .catch(error => console.error("Error al procesar el body del POST:", error));
    } else {

        const respuesta = fetch (event.request)
        .then(resp=>{
            if(!resp){
                return caches.match(event.request);
            }else{
               caches.open('dinamico-v5')
               .then(cache=>{
                cache.put(event.request, resp);
                })
            return resp.clone();
            }
            
        })
        .catch(error=>{
            console.log(error);
            self.registration.sync.register("insertar");
            return caches.match(event.request)
        });
        event.respondWith(respuesta)  
    }   
});



// Escuchar evento de sincronización
self.addEventListener('sync', event => {
    if (event.tag === "syncLibros") {
        event.waitUntil(
            new Promise((resolve, reject) => {
                let dbRequest = indexedDB.open("database", 1);

                dbRequest.onsuccess = event => {
                    let db = event.target.result;
                    let transaction = db.transaction("Libros", "readonly");
                    let store = transaction.objectStore("Libros");

                    let getAllRequest = store.getAll();

                    getAllRequest.onsuccess = () => {
                        let libros = getAllRequest.result;
                        if (libros.length === 0) {
                            resolve();
                            return;
                        }

                        let postPromises = libros.map(libro =>
                            fetch('/api/libros', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(libro)
                            })
                        );

                        Promise.all(postPromises)
                            .then(() => {
                                let deleteTransaction = db.transaction("Libros", "readwrite");
                                let deleteStore = deleteTransaction.objectStore("Libros");
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



self.addEventListener('push', event=>{
 const options ={
    body :"hola como estas",
    Image: "src/icons/icon-96x96.png"

 }
 self.registration.showNotification("Titulo", options);

});





/*
self.addEventListener('sync', event=>{



});
*/



/*
const APP_SHELL_CACHE = 'appShell-v1';
const DYNAMIC_CACHE = 'dinamico-v1';

const APP_SHELL_FILES = [
    "/",               
    "/index.html",     
    "/src/index.css",
    "/src/App.css",
    "/src/App.jsx",
    "/src/main.jsx",
    "/src/pages/Home.jsx",	
    "/src/pages/Login.jsx",
    "/src/pages/Register.jsx"
];

// Instalación: Guarda el App Shell en caché
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(APP_SHELL_CACHE).then(cache => {
            return cache.addAll(APP_SHELL_FILES);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse; // Si está en caché, lo devuelve
            }

            return fetch(event.request).then(networkResponse => {
                // Verifica si la URL está en APP_SHELL_FILES
                const url = new URL(event.request.url);
                if (!APP_SHELL_FILES.includes(url.pathname)) {
                    return caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }
                return networkResponse;
            }).catch(() => caches.match('/offline.html')); // Respuesta por defecto si falla
        })
    );
});

// Eliminación de caché obsoleta
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== APP_SHELL_CACHE && key !== DYNAMIC_CACHE)
                    .map(key => caches.delete(key))
            );
        })
    );
});


*/