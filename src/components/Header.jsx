export default function Header({ currentUser, onLogout }) {
  return (
    <header className="header">
      <h1 className="header-title">Video</h1>
      <div className="header-right">
        <span className="header-user">{currentUser}</span>
        <button className="header-logout" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  )
}
