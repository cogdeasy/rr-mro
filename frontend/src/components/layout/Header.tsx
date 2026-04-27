import './Header.scss';

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <span className="logo-rr">ROLLS-ROYCE</span>
        <span className="logo-divider" />
        <span className="logo-text">MRO Variance Platform</span>
      </div>
      <div className="header-center">
        <div className="search-box">
          <span className="search-icon">&#x1F50D;</span>
          <input
            type="text"
            placeholder="Search requests, documents, engines..."
            className="search-input"
          />
        </div>
      </div>
      <div className="header-right">
        <span className="env-badge">PROD</span>
        <div className="notif-icon" title="Notifications">
          <span>&#x1F514;</span>
          <span className="notif-dot" />
        </div>
        <div className="user-avatar" title="Dr. J. Richardson">
          JR
        </div>
      </div>
    </header>
  );
}
