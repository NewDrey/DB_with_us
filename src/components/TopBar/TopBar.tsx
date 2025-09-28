import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TopBar.css'; // Создадим стили
import { FaMoon, FaSun } from 'react-icons/fa';
import {useTheme } from '../../ts/ThemeContext/ThemeContext'

export const TopBar = () => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    return (
        <nav className="top-bar">
            <div className="top-bar-content">
                <Link to="/" className="logo">DBWithUs</Link>
                <div className="nav-links">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                        Главная
                    </Link>
                    <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
                        О нас
                    </Link>
                    <Link to='#' onClick={toggleTheme} className='nav-link'>
                        {theme === 'light' ?  FaMoon({size: 20})  : FaSun({size:20})}
                    </Link>

                </div>
            </div>
        </nav>
    );
}

