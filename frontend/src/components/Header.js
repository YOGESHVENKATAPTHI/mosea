import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';

const Header = () => (
  <header className="header">
    <div className="logo"><i className="fas fa-film"/> MovieApp</div>
    <nav className="navigation">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
      </ul>
    </nav>
  </header>
);

export default Header;