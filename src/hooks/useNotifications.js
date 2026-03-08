import { useEffect } from 'react'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export function useNotifications(currentUser) {
  useEffect(() => {
    if (!currentUser || !('Notification' in window) || !('serviceWorker' in navigator)) return

    async function setup() {
      console.log('[Notifications] requesting permission...')
      const permission = await Notification.requestPermission()
      console.log('[Notifications] permission:', permission)
      if (permission !== 'granted') return

      console.log('[Notifications] waiting for SW...')
      const swReg = await navigator.serviceWorker.ready
      console.log('[Notifications] SW ready:', swReg.scope)
      const messaging = getMessaging()
      console.log('[Notifications] getting token, vapidKey:', import.meta.env.VITE_FIREBASE_VAPID_KEY ? 'set' : 'MISSING')
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: swReg,
      })
      console.log('[Notifications] token:', token ? 'received' : 'null/empty')

      if (token) {
        await setDoc(doc(db, 'fcmTokens', currentUser), {
          token,
          updatedAt: serverTimestamp(),
        })
        console.log('[Notifications] token saved for', currentUser)
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
    }).catch((err) => {
      console.error('[Notifications] setup failed:', err)
    })
    return () => cleanup?.()
  }, [currentUser])
}
