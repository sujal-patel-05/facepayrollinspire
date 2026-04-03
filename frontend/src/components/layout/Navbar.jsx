import { useState, useEffect } from 'react';
import { Bell, Search, Sun, Moon, Command } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ darkMode, onToggleDarkMode }) => {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', hour12: false
            }));
            setDate(now.toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
            }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                {/* Page title will be set by each page - this is just a spacer */}
            </div>

            <div className="navbar-center">
                <div className="search-pill">
                    <Search size={16} />
                    <span>Search...</span>
                    <div className="search-shortcut">
                        <Command size={12} />
                        <span>K</span>
                    </div>
                </div>
            </div>

            <div className="navbar-right">
                <button
                    className="theme-toggle"
                    onClick={onToggleDarkMode}
                    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <button className="icon-btn notification-btn">
                    <Bell size={18} />
                    <span className="notification-badge"></span>
                </button>

                <div className="datetime-pill">
                    <span className="nav-date">{date}</span>
                    <span className="nav-time">{time}</span>
                </div>

                <div className="nav-avatar">
                    <span>A</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
