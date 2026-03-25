import React from 'react';
import { HeaderProps } from '../types';

const Header: React.FC<HeaderProps> = ({ title = 'GenAI' }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <h1>{title}</h1>
        </div>
        <nav className="main-nav">
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
