const { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } =
  require('firebase-functions/v2/firestore')
const { defineSecret } = require('firebase-functions/params')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const webpush = require('web-push')

initializeApp()

const VAPID_PRIVATE_KEY = defineSecret('VAPID_PRIVATE_KEY')
const VAPID_PUBLIC_KEY = 'BD_FQlSigYFs9090YM7OJGQNQaxOwODQFNpsIiDLjrS1unBT2kgh6cjaMga3EuSjQS02uAvV_X1zQ-IP_wOD39M'

const OTHER_USER = { James: 'Mimi', Mimi: 'James' }

async function sendPush(toUser, title, body) {
  const tokenDoc = await getFirestore().collection('fcmTokens').doc(toUser).get()
  if (!tokenDoc.exists) return
  const subscription = tokenDoc.data()?.subscription
  if (!subscription) return
  webpush.setVapidDetails('mailto:noreply@video-watch-app.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY.value())
  await webpush.sendNotification(subscription, JSON.stringify({ title, body }))
}

const FUNCTION_OPTS = { secrets: [VAPID_PRIVATE_KEY] }

// 1. New video added
exports.notifyOnNewVideo = onDocumentCreated(
  { document: 'videos/{videoId}', ...FUNCTION_OPTS },
  async (event) => {
    const video = event.data.data()
    const addedBy = video.addedBy
    if (!addedBy || !OTHER_USER[addedBy]) return
    const title = video.title || 'A new video'
    await sendPush(OTHER_USER[addedBy], `${addedBy} added a video`, title)
  }
)

// 2. Status changes and note edits
exports.notifyOnVideoUpdate = onDocumentUpdated(
  { document: 'videos/{videoId}', ...FUNCTION_OPTS },
  async (event) => {
    const before = event.data.before.data()
    const after = event.data.after.data()
    const videoTitle = after.title || 'a video'
    const videoAddedBy = after.addedBy

    const STATUS_MESSAGES = {
      watched: (user) => [`${user} just watched one of your videos!`, videoTitle],
      going_today: (user) => [`${user} is going to watch ${videoTitle} today!`, ''],
      going_future: (user) => [`${user} wants to watch ${videoTitle}`, ''],
      not_interested: (user) => [`${user} isn't interested in ${videoTitle}`, ''],
    }

    for (const user of ['James', 'Mimi']) {
      const beforeStatus = before.interactions?.[user]?.status
      const afterStatus = after.interactions?.[user]?.status
      if (afterStatus && afterStatus !== beforeStatus && afterStatus !== 'history_dismissed') {
        const msgFn = STATUS_MESSAGES[afterStatus]
        if (msgFn) {
          const [title, body] = msgFn(user)
          await sendPush(OTHER_USER[user], title, body)
        }
      }
    }

    const beforeNote = before.note?.text
    const afterNote = after.note?.text
    if (afterNote && afterNote !== beforeNote && videoAddedBy && OTHER_USER[videoAddedBy]) {
      const preview = afterNote.length > 60 ? afterNote.slice(0, 57) + '...' : afterNote
      await sendPush(
        OTHER_USER[videoAddedBy],
        `${videoAddedBy} left a note on ${videoTitle}`,
        preview
      )
    }
  }
)

// 3. Video deleted
exports.notifyOnVideoDelete = onDocumentDeleted(
  { document: 'videos/{videoId}', ...FUNCTION_OPTS },
  async (event) => {
    const video = event.data.data()
    const deletedBy = video.addedBy
    if (!deletedBy || !OTHER_USER[deletedBy]) return
    await sendPush(OTHER_USER[deletedBy], `${deletedBy} removed a video`, video.title || '')
  }
)
