import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import '../../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/game':
        return 'MasterFruit';
      case '/weather':
        return 'Weather Report';
      case '/notes':
        return 'NotePal';
      default:
        return '';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo" />
        </Link>
        <Link 
          to="/" 
          className="navbar-title"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Cursor Koetelma
        </Link>
      </div>
      <div className="navbar-center">
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>
      <div className="navbar-links">
        <Link to="/game" className={location.pathname === '/game' ? 'active' : ''}>
          Game
        </Link>
        <Link to="/weather" className={location.pathname === '/weather' ? 'active' : ''}>
          Weather
        </Link>
        <Link to="/notes" className={location.pathname === '/notes' ? 'active' : ''}>
          Notes
        </Link>
      </div>
    </nav>
  );
};

export default Navbar; 