import React, {useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TopBar.css'; // Создадим стили
import { FaMoon, FaSun } from 'react-icons/fa';
import store from "../../ts/store";

export const TopBar = () => {
    const location = useLocation();
    const [darkTheme, setDarkTheme] = useState(true)
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
                    <Link to='#' onClick={()=> {
                            const newTheme = store.state.theme === 'light' ? 'dark' : 'light';
                            setDarkTheme(!darkTheme)
                            store.setTheme(newTheme);
                        }} className={`nav-link ${darkTheme? 'active' : ''}`}>
                        {
                            darkTheme? FaMoon({size: 20})  : FaSun({size:20})
                        }
                    </Link>
                </div>
            </div>
        </nav>
    );
}

