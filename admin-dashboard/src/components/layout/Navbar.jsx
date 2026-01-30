import { Bell, Search, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-search">
                <Search size={20} />
                <input type="text" placeholder="Search..." />
            </div>

            <div className="navbar-actions">
                <button className="icon-btn">
                    <Bell size={20} />
                    <span className="badge-dot"></span>
                </button>

                <div className="user-menu">
                    <div className="user-avatar">
                        <User size={20} />
                    </div>
                    <div className="user-info">
                        <p className="user-name">Admin</p>
                        <p className="user-role">Administrator</p>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
