const TABS = ['Select/add videos', 'What to watch', 'History']

export default function TabBar({ activeTab, onTabChange, showWatchListDot }) {
  return (
    <nav className="tab-bar">
      {TABS.map((tab, index) => (
        <button
          key={tab}
          className={`tab-btn ${activeTab === index ? 'tab-btn-active' : ''}`}
          onClick={() => onTabChange(index)}
        >
          {tab}
          {index === 1 && showWatchListDot && <span className="tab-dot" />}
        </button>
      ))}
    </nav>
  )
}
