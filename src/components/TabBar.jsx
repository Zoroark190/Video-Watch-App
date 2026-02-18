const TABS = ['Select/add videos', 'What to watch']

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="tab-bar">
      {TABS.map((tab, index) => (
        <button
          key={tab}
          className={`tab-btn ${activeTab === index ? 'tab-btn-active' : ''}`}
          onClick={() => onTabChange(index)}
        >
          {tab}
        </button>
      ))}
    </nav>
  )
}
