export default function Header({ currentUser, onLogout }) {
  return (
    <header className="header">
      <div />
      <div className="header-right">
        <span className="header-user">{currentUser}</span>
        <button className="header-logout" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  )
}
