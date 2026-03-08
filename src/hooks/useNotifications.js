import { useEffect } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export function useNotifications(currentUser) {
  useEffect(() => {
    if (!currentUser || !('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) return

    async function setup() {
      console.log('[Notifications] requesting permission...')
      const permission = await Notification.requestPermission()
      console.log('[Notifications] permission:', permission)
      if (permission !== 'granted') return

      console.log('[Notifications] waiting for SW...')
      const swReg = await navigator.serviceWorker.ready
      console.log('[Notifications] SW ready:', swReg.scope)

      console.log('[Notifications] subscribing to push...')
      const subscription = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_FIREBASE_VAPID_KEY),
      })
      console.log('[Notifications] push subscription obtained')

      await setDoc(doc(db, 'fcmTokens', currentUser), {
        subscription: JSON.parse(JSON.stringify(subscription)),
        updatedAt: serverTimestamp(),
      })
      console.log('[Notifications] subscription saved for', currentUser)
    }

    setup().catch((err) => {
      console.error('[Notifications] setup failed:', err)
    })
  }, [currentUser])
}
