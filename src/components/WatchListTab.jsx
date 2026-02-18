import { getOtherUser, STATUS } from '../constants'
import { useVideos } from '../hooks/useVideos'
import VideoCard from './VideoCard'

export default function WatchListTab({ currentUser }) {
  const { videos, loading } = useVideos()
  const otherUser = getOtherUser(currentUser)

  // Videos where the OTHER user has clicked "I watched" or "Going to watch"
  const watchedByOther = videos.filter((v) => {
    const otherStatus = v.interactions?.[otherUser]?.status
    return (
      otherStatus === STATUS.WATCHED ||
      otherStatus === STATUS.GOING_TODAY ||
      otherStatus === STATUS.GOING_FUTURE
    )
  })

  // Exclude ones where I've already marked as "Watched"
  const visible = watchedByOther.filter((v) => {
    return v.interactions?.[currentUser]?.status !== STATUS.WATCHED
  })

  // Sort: "watched" (by other user) first, then "going" variants
  const sorted = [...visible].sort((a, b) => {
    const aStatus = a.interactions?.[otherUser]?.status
    const bStatus = b.interactions?.[otherUser]?.status
    const rank = (s) => (s === STATUS.WATCHED ? 0 : 1)
    return rank(aStatus) - rank(bStatus)
  })

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="watch-list-tab">
      {sorted.length === 0 ? (
        <div className="empty-state">
          Nothing here yet. Wait for {otherUser} to watch or pick some videos!
        </div>
      ) : (
        <div className="video-section">
          {sorted.map((video) => {
            const otherStatus = video.interactions?.[otherUser]?.status
            return (
              <div key={video.id}>
                <div className="watchlist-status-label">
                  {otherUser}{' '}
                  {otherStatus === STATUS.WATCHED
                    ? 'watched this'
                    : otherStatus === STATUS.GOING_TODAY
                      ? 'is going to watch today'
                      : 'is going to watch'}
                </div>
                <VideoCard
                  video={video}
                  currentUser={currentUser}
                  mode="watchlist"
                  isOwn={false}
                  showRedDot={false}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
