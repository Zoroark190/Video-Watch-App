import { getOtherUser, STATUS } from '../constants'
import { useVideos } from '../hooks/useVideos'
import AddVideoInput from './AddVideoInput'
import VideoCard from './VideoCard'

function isInHistory(video, currentUser) {
  const myStatus = video.interactions?.[currentUser]?.status
  if (myStatus === STATUS.HISTORY_DISMISSED) return true
  return myStatus === STATUS.WATCHED
}

export default function AddVideoTab({ currentUser }) {
  const { videos, loading } = useVideos()
  const otherUser = getOtherUser(currentUser)

  // Exclude videos that are in history (both users watched)
  const activeVideos = videos.filter((v) => !isInHistory(v, currentUser))
  const otherVideos = activeVideos.filter((v) => v.addedBy === otherUser)
  const myVideos = activeVideos.filter((v) => v.addedBy === currentUser)

  function hasNoInteraction(video) {
    return !video.interactions?.[currentUser]?.status
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="add-video-tab">
      <AddVideoInput currentUser={currentUser} />

      {otherVideos.length > 0 && (
        <div className="video-section">
          {otherVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              currentUser={currentUser}
              mode="add"
              isOwn={false}
              showRedDot={hasNoInteraction(video)}
            />
          ))}
        </div>
      )}

      {myVideos.length > 0 && (
        <div className="video-section">
          {otherVideos.length > 0 && (
            <div className="section-divider">Your videos</div>
          )}
          {myVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              currentUser={currentUser}
              mode="add"
              isOwn={true}
              showRedDot={false}
            />
          ))}
        </div>
      )}

      {otherVideos.length === 0 && myVideos.length === 0 && (
        <div className="empty-state">
          No videos yet. Add one above!
        </div>
      )}
    </div>
  )
}
