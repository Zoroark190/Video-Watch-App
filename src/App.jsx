import { useState } from 'react'
import './App.css'
import { getOtherUser, STATUS } from './constants'
import { useVideos } from './hooks/useVideos'
import UserSelect from './components/UserSelect'
import Header from './components/Header'
import TabBar from './components/TabBar'
import AddVideoTab from './components/AddVideoTab'
import WatchListTab from './components/WatchListTab'
import HistoryTab from './components/HistoryTab'
import { firebaseInitError } from './firebase'

function MainApp({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState(0)
  const { videos } = useVideos()
  const otherUser = getOtherUser(currentUser)

  // Check if there are unwatched videos in the watch list
  const hasUnwatchedInWatchList = videos.some((v) => {
    const otherStatus = v.interactions?.[otherUser]?.status
    const myStatus = v.interactions?.[currentUser]?.status
    return (
      (otherStatus === STATUS.WATCHED ||
        otherStatus === STATUS.GOING_TODAY ||
        otherStatus === STATUS.GOING_FUTURE) &&
      myStatus !== STATUS.WATCHED
    )
  })

  return (
    <div className="app">
      <Header currentUser={currentUser} onLogout={onLogout} />
      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showWatchListDot={hasUnwatchedInWatchList}
      />
      <main className="main-content">
        {activeTab === 0 && <AddVideoTab currentUser={currentUser} />}
        {activeTab === 1 && <WatchListTab currentUser={currentUser} />}
        {activeTab === 2 && <HistoryTab currentUser={currentUser} />}
      </main>
    </div>
  )
}

function App() {
  if (firebaseInitError) {
    return (
      <div className="user-select-screen">
        <div className="user-select-content">
          <h1 className="user-select-title">Video</h1>
          <p className="user-select-subtitle">
            App setup error. Check GitHub Actions repository secrets and redeploy.
          </p>
          <p className="video-meta">{firebaseInitError}</p>
        </div>
      </div>
    )
  }

  const [currentUser, setCurrentUser] = useState(
    () => localStorage.getItem('videoAppUser') || null
  )

  function handleSelectUser(user) {
    localStorage.setItem('videoAppUser', user)
    setCurrentUser(user)
  }

  function handleLogout() {
    localStorage.removeItem('videoAppUser')
    setCurrentUser(null)
  }

  if (!currentUser) {
    return <UserSelect onSelectUser={handleSelectUser} />
  }

  return <MainApp currentUser={currentUser} onLogout={handleLogout} />
}

export default App
