import { useState, useEffect } from 'react';
import './Layout.css';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('faceai-theme') !== 'light';
    });

    useEffect(() => {
        const handleResize = () => {
            setCollapsed(window.innerWidth < 1024);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.remove('light-mode');
            localStorage.setItem('faceai-theme', 'dark');
        } else {
            document.body.classList.add('light-mode');
            localStorage.setItem('faceai-theme', 'light');
        }
    }, [darkMode]);

    return (
        <div className={`layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div className="main-content">
                <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
                <main className="content-area">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
