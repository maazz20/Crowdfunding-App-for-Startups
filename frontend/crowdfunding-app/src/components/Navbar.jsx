import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Navbar.css';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const user = authAPI.getCurrentUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        authAPI.logout();
        setMenuOpen(false);
        setAccountOpen(false);
        navigate('/login');
    };

    const closeMenu = () => {
        setMenuOpen(false);
        setAccountOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="brand" onClick={closeMenu}>
                    <span className="brand-mark">CF</span>
                    <span>CrowdFund</span>
                </Link>

                <button
                    className="menu-toggle"
                    type="button"
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    <NavLink to="/" onClick={closeMenu}>Home</NavLink>
                    <NavLink to="/campaigns" onClick={closeMenu}>Campaigns</NavLink>
                    {user && (user.role === 'STARTUP' || user.role === 'ADMIN') && (
                        <NavLink to="/create-campaign" onClick={closeMenu}>Start</NavLink>
                    )}
                    {user && <NavLink to="/subscriptions" className="upgrade-link" onClick={closeMenu}>Upgrade</NavLink>}
                    {user && <NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>}

                    <div className="nav-auth">
                        {user ? (
                            <>
                                <div className="account-menu">
                                    <button
                                        type="button"
                                        className="user-chip"
                                        title={`${user.name} (${user.role})`}
                                        aria-expanded={accountOpen}
                                        aria-haspopup="menu"
                                        onClick={() => setAccountOpen((open) => !open)}
                                    >
                                        <span className="user-initial">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                                        <span>{user.name}</span>
                                    </button>
                                    {accountOpen && (
                                        <div className="account-dropdown" role="menu">
                                            <Link to="/change-password" role="menuitem" onClick={closeMenu}>
                                                Change Password
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <button className="btn btn-muted nav-logout" onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
                                <Link to="/register" className="btn btn-primary nav-cta" onClick={closeMenu}>
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
