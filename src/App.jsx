import { useState } from 'react'
import './App.css'
import UserSelect from './components/UserSelect'
import Header from './components/Header'
import TabBar from './components/TabBar'
import AddVideoTab from './components/AddVideoTab'
import WatchListTab from './components/WatchListTab'

function App() {
  const [currentUser, setCurrentUser] = useState(
    () => localStorage.getItem('videoAppUser') || null
  )
  const [activeTab, setActiveTab] = useState(0)

  function handleSelectUser(user) {
    localStorage.setItem('videoAppUser', user)
    setCurrentUser(user)
  }

  function handleLogout() {
    localStorage.removeItem('videoAppUser')
    setCurrentUser(null)
    setActiveTab(0)
  }

  if (!currentUser) {
    return <UserSelect onSelectUser={handleSelectUser} />
  }

  return (
    <div className="app">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {activeTab === 0 ? (
          <AddVideoTab currentUser={currentUser} />
        ) : (
          <WatchListTab currentUser={currentUser} />
        )}
      </main>
    </div>
  )
}

export default App
