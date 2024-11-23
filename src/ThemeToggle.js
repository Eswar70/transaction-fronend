import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ theme, toggleTheme }) => {
    return (
        <div className="theme-toggle">
            <button onClick={toggleTheme}>{theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}</button>
        </div>
    );
};

export default ThemeToggle;
