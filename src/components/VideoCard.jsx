import { useState } from 'react'
import { createPortal } from 'react-dom'
import { doc, updateDoc, deleteDoc, deleteField } from 'firebase/firestore'
import { db } from '../firebase'
import { STATUS } from '../constants'
import { parseDuration } from '../utils/parseDuration'
import { timeAgo } from '../utils/timeAgo'
import GoingToWatchModal from './GoingToWatchModal'

async function setInteraction(videoDocId, currentUser, status) {
  const videoRef = doc(db, 'videos', videoDocId)
  await updateDoc(videoRef, {
    [`interactions.${currentUser}`]: {
      status,
      updatedAt: new Date(),
    },
  })
}

export default function VideoCard({ video, currentUser, mode, isOwn, showRedDot }) {
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showHistoryOptions, setShowHistoryOptions] = useState(false)

  async function handleDelete() {
    await deleteDoc(doc(db, 'videos', video.id))
    setShowDeleteConfirm(false)
  }

  function handleWatched() {
    setInteraction(video.id, currentUser, STATUS.WATCHED)
  }

  function handleGoingToWatch() {
    setShowModal(true)
  }

  function handleGoingSelect(when) {
    const status = when === 'today' ? STATUS.GOING_TODAY : STATUS.GOING_FUTURE
    setInteraction(video.id, currentUser, status)
    setShowModal(false)
  }

  function handleNotInterested() {
    setInteraction(video.id, currentUser, STATUS.NOT_INTERESTED)
  }

  function handleWatchlistWatched() {
    setInteraction(video.id, currentUser, STATUS.WATCHED)
  }

  function handleHistoryDismiss() {
    setInteraction(video.id, currentUser, STATUS.HISTORY_DISMISSED)
    setShowHistoryOptions(false)
  }

  async function handleUndoWatched() {
    const videoRef = doc(db, 'videos', video.id)
    await updateDoc(videoRef, {
      [`interactions.${currentUser}`]: deleteField(),
    })
    setShowHistoryOptions(false)
  }

  return (
    <div className={`video-card ${isOwn ? 'video-card-own' : ''}`}>
      <div className="video-thumbnail-container">
        {showRedDot && <span className="red-dot" />}
        {isOwn && (
          <button
            className="delete-btn"
            onClick={() => setShowDeleteConfirm(true)}
            aria-label="Remove video"
          >
            &times;
          </button>
        )}
        {mode === 'history' && (
          <button
            className="delete-btn"
            onClick={() => setShowHistoryOptions(true)}
            aria-label="Remove from history"
          >
            &times;
          </button>
        )}
        <a href={video.videoLink} target="_blank" rel="noopener noreferrer">
          <img
            className="video-thumbnail"
            src={video.thumbnailUrl}
            alt={video.title}
          />
        </a>
        <span className="video-duration">{parseDuration(video.duration)}</span>
      </div>

      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-meta">
          {video.channelTitle}
        </p>
        <p className="video-meta">
          Added by {video.addedBy} · {timeAgo(video.addedAt)}
        </p>
      </div>

      {mode === 'add' && !isOwn && (
        <div className="video-actions">
          <button className="action-btn action-watched" onClick={handleWatched}>
            I watched
          </button>
          <button className="action-btn action-going" onClick={handleGoingToWatch}>
            Going to watch
          </button>
          <button className="action-btn action-not-interested" onClick={handleNotInterested}>
            Not interested
          </button>
        </div>
      )}

      {mode === 'watchlist' && (
        <div className="video-actions">
          <button className="action-btn action-watched" onClick={handleWatchlistWatched}>
            Watched
          </button>
        </div>
      )}

      {showModal && (
        <GoingToWatchModal
          onSelect={handleGoingSelect}
          onClose={() => setShowModal(false)}
        />
      )}

      {showHistoryOptions && createPortal(
        <div className="modal-overlay" onClick={() => setShowHistoryOptions(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Remove from history</h3>
            <div className="modal-options">
              <button className="modal-option-btn" onClick={handleHistoryDismiss}>
                Delete history
              </button>
              <button className="modal-option-btn modal-option-btn-secondary" onClick={handleUndoWatched}>
                I didn't actually watch
              </button>
            </div>
            <button className="modal-cancel-btn" onClick={() => setShowHistoryOptions(false)}>
              Cancel
            </button>
          </div>
        </div>,
        document.body
      )}

      {showDeleteConfirm && createPortal(
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Remove video?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              This will remove it for both users.
            </p>
            <div className="modal-options">
              <button className="modal-option-btn" onClick={handleDelete}>
                Yes, remove
              </button>
            </div>
            <button className="modal-cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
