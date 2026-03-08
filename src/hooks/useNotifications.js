import { useEffect } from 'react'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export function useNotifications(currentUser) {
  useEffect(() => {
    if (!currentUser || !('Notification' in window) || !('serviceWorker' in navigator)) return

    async function setup() {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return

      const swReg = await navigator.serviceWorker.ready
      const messaging = getMessaging()
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: swReg,
      })

      if (token) {
        await setDoc(doc(db, 'fcmTokens', currentUser), {
          token,
          updatedAt: serverTimestamp(),
        })
      }

      return onMessage(messaging, (payload) => {
        const { title, body } = payload.data ?? {}
        if (title) {
          new Notification(title, { body: body ?? '', icon: '/icons/icon-192.png' })
        }
      })
    }

    let cleanup
    setup().then((unsub) => {
      cleanup = unsub
    })
    return () => cleanup?.()
  }, [currentUser])
}
