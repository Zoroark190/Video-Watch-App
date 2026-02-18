export default function GoingToWatchModal({ onSelect, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">When?</h3>
        <div className="modal-options">
          <button
            className="modal-option-btn"
            onClick={() => onSelect('today')}
          >
            Today
          </button>
          <button
            className="modal-option-btn"
            onClick={() => onSelect('future')}
          >
            In the future
          </button>
        </div>
        <button className="modal-cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}
