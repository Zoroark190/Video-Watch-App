import { USERS } from '../constants'

export default function UserSelect({ onSelectUser }) {
  return (
    <div className="user-select-screen">
      <div className="user-select-content">
        <h1 className="user-select-title">Video</h1>
        <p className="user-select-subtitle">Who are you?</p>
        <div className="user-select-buttons">
          {USERS.map((user) => (
            <button
              key={user}
              className="user-select-btn"
              onClick={() => onSelectUser(user)}
            >
              {user}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
