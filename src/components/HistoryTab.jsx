import { getOtherUser, STATUS } from '../constants'
import { useVideos } from '../hooks/useVideos'
import VideoCard from './VideoCard'

export default function HistoryTab({ currentUser }) {
  const { videos, loading } = useVideos()
  const otherUser = getOtherUser(currentUser)

  // Videos where I have watched, excluding dismissed ones
  const history = videos.filter((v) => {
    const myStatus = v.interactions?.[currentUser]?.status
    if (myStatus === STATUS.HISTORY_DISMISSED) return false
    return myStatus === STATUS.WATCHED
  })

  // Sort by most recently watched (use current user's updatedAt)
  const sorted = [...history].sort((a, b) => {
    const aTime = a.interactions?.[currentUser]?.updatedAt
    const bTime = b.interactions?.[currentUser]?.updatedAt
    const aMs = aTime?.toDate ? aTime.toDate().getTime() : aTime ? new Date(aTime).getTime() : 0
    const bMs = bTime?.toDate ? bTime.toDate().getTime() : bTime ? new Date(bTime).getTime() : 0
    return bMs - aMs
  })

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="history-tab">
      {sorted.length === 0 ? (
        <div className="empty-state">
          No watch history yet. Videos appear here once both users have watched them.
        </div>
      ) : (
        <div className="video-section">
          {sorted.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              currentUser={currentUser}
              mode="history"
              isOwn={false}
              showRedDot={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}
