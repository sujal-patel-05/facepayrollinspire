import './Layout.css';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <main className="content-area">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
