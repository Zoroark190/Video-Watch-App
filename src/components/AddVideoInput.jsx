import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { extractVideoId, fetchVideoMetadata } from '../utils/youtube'

export default function AddVideoInput({ currentUser }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const videoId = extractVideoId(url.trim())
    if (!videoId) {
      setError('Invalid YouTube URL')
      return
    }

    setLoading(true)
    try {
      const meta = await fetchVideoMetadata(videoId)
      await addDoc(collection(db, 'videos'), {
        videoLink: url.trim(),
        youtubeId: videoId,
        addedBy: currentUser,
        addedAt: serverTimestamp(),
        title: meta.title,
        channelTitle: meta.channelTitle,
        thumbnailUrl: meta.thumbnailUrl,
        duration: meta.duration,
        interactions: {},
      })
      setUrl('')
    } catch (err) {
      setError(err.message || 'Failed to add video')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="add-video-form" onSubmit={handleSubmit}>
      <div className="add-video-input-row">
        <input
          type="text"
          className="add-video-input"
          placeholder="Paste YouTube link here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="add-video-btn"
          disabled={loading || !url.trim()}
        >
          {loading ? '...' : 'Add'}
        </button>
      </div>
      {error && <p className="add-video-error">{error}</p>}
    </form>
  )
}
