import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Navbar() {
    const user = authAPI.getCurrentUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        authAPI.logout();
        navigate('/login');
    };

    return (
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link to="/">Home</Link>
                <Link to="/campaigns">Campaigns</Link>
                {user && (user.role === 'STARTUP' || user.role === 'ADMIN') && (
                    <Link to="/create-campaign">Start a Campaign</Link>
                )}
                {user && <Link to="/subscriptions" style={{ color: '#ff6b6b', fontWeight: 'bold' }}>Upgrade</Link>}
                {user && <Link to="/dashboard">Dashboard</Link>}
                
                {user ? (
                    <>
                        <span style={{ fontWeight: 'bold' }}>Hi, {user.name} ({user.role})</span>
                        <button 
                            onClick={handleLogout}
                            style={{ padding: '5px 10px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px' }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
