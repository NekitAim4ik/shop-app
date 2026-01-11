import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-text">Конструктор</div>
      </div>

      <nav className="header-nav">
        <button
          className={`nav-link ${location.pathname === '/protected' ? 'active' : ''}`}
          onClick={() => navigate('/protected')}
        >
          Новый сайт
        </button>
        <button
          className={`nav-link ${location.pathname === '/protected/my-sites' ? 'active' : ''}`}
          onClick={() => navigate('/protected/my-sites')}
        >
          Мои сайты
        </button>
      </nav>

      <div className="header-right">
        <button className="logout-btn" onClick={handleLogout}>
          Выход
        </button>
      </div>
    </header>
  );
};

export default Header;