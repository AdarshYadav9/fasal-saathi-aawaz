const CACHE_NAME = 'smart-crop-advisory-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/offline.html'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }
        
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        }).catch(() => {
          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/offline.html')
          }
        })
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Sync offline data when connection is restored
    const offlineData = await getOfflineData()
    if (offlineData && offlineData.length > 0) {
      await syncOfflineData(offlineData)
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

async function getOfflineData() {
  // Get offline data from IndexedDB
  return new Promise((resolve) => {
    const request = indexedDB.open('SmartCropDB', 1)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['offlineData'], 'readonly')
      const store = transaction.objectStore('offlineData')
      const getAllRequest = store.getAll()
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result)
      }
      getAllRequest.onerror = () => {
        resolve([])
      }
    }
    request.onerror = () => {
      resolve([])
    }
  })
}

async function syncOfflineData(data) {
  // Sync data with server
  for (const item of data) {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item)
      })
      
      // Remove from offline storage after successful sync
      await removeOfflineData(item.id)
    } catch (error) {
      console.error('Failed to sync item:', error)
    }
  }
}

async function removeOfflineData(id) {
  return new Promise((resolve) => {
    const request = indexedDB.open('SmartCropDB', 1)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['offlineData'], 'readwrite')
      const store = transaction.objectStore('offlineData')
      store.delete(id)
      resolve()
    }
    request.onerror = () => {
      resolve()
    }
  })
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Smart Crop Advisory', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})