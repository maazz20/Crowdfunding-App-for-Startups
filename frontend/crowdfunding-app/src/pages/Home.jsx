import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Home() {
    const user = authAPI.getCurrentUser();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#1a1a1a' }}>
                    Welcome to CrowdFund
                </h1>
                <p style={{ fontSize: '1.3rem', color: '#555555', marginBottom: '30px', lineHeight: '1.6' }}>
                    Empowering startups and connecting them with investors worldwide
                </p>
                
                {!user && (
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
                        <Link 
                            to="/register" 
                            style={{ 
                                padding: '15px 40px', 
                                backgroundColor: '#007bff', 
                                color: 'white', 
                                textDecoration: 'none', 
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Get Started
                        </Link>
                        <Link 
                            to="/login" 
                            style={{ 
                                padding: '15px 40px', 
                                backgroundColor: '#6c757d', 
                                color: 'white', 
                                textDecoration: 'none', 
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Login
                        </Link>
                    </div>
                )}
                
                {user && (
                    <div style={{ marginTop: '30px' }}>
                        <Link 
                            to="/campaigns" 
                            style={{ 
                                padding: '15px 40px', 
                                backgroundColor: '#28a745', 
                                color: 'white', 
                                textDecoration: 'none', 
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Browse Campaigns
                        </Link>
                    </div>
                )}
            </div>

            {/* Features Section */}
            <div style={{ marginBottom: '60px' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '40px', color: '#1a1a1a' }}>
                    How It Works
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {/* For Startups */}
                    <div style={{ 
                        padding: '30px', 
                        border: '2px solid #007bff', 
                        borderRadius: '12px',
                        backgroundColor: '#f8f9fa'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚀</div>
                        <h3 style={{ color: '#007bff', marginBottom: '15px' }}>For Startups</h3>
                        <ul style={{ lineHeight: '1.8', color: '#555' }}>
                            <li>Create compelling campaign pages</li>
                            <li>Set funding goals and timelines</li>
                            <li>Track contributions in real-time</li>
                            <li>Manage your campaign dashboard</li>
                            <li>Connect with potential investors</li>
                        </ul>
                    </div>

                    {/* For Investors */}
                    <div style={{ 
                        padding: '30px', 
                        border: '2px solid #28a745', 
                        borderRadius: '12px',
                        backgroundColor: '#f8f9fa'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💰</div>
                        <h3 style={{ color: '#28a745', marginBottom: '15px' }}>For Investors</h3>
                        <ul style={{ lineHeight: '1.8', color: '#555' }}>
                            <li>Discover innovative startups</li>
                            <li>Browse campaigns by category</li>
                            <li>Make secure contributions</li>
                            <li>Track your investment portfolio</li>
                            <li>Support entrepreneurs you believe in</li>
                        </ul>
                    </div>

                    {/* Platform Features */}
                    <div style={{ 
                        padding: '30px', 
                        border: '2px solid #ffc107', 
                        borderRadius: '12px',
                        backgroundColor: '#f8f9fa'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚡</div>
                        <h3 style={{ color: '#ffc107', marginBottom: '15px' }}>Platform Features</h3>
                        <ul style={{ lineHeight: '1.8', color: '#555' }}>
                            <li>Secure authentication system</li>
                            <li>Admin campaign approval</li>
                            <li>Multiple currency support</li>
                            <li>Real-time progress tracking</li>
                            <li>Transparent contribution history</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div style={{ 
                backgroundColor: '#007bff', 
                color: 'white', 
                padding: '50px 30px', 
                borderRadius: '12px',
                textAlign: 'center',
                marginBottom: '60px'
            }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Why Choose CrowdFund?</h2>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto' }}>
                    We provide a secure, transparent, and user-friendly platform that connects innovative startups 
                    with passionate investors. Our role-based system ensures that startups can focus on creating 
                    great campaigns while investors can easily discover and support promising ventures.
                </p>
            </div>

            {/* Call to Action */}
            {!user && (
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#1a1a1a' }}>
                        Ready to Get Started?
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: '#555555', marginBottom: '30px' }}>
                        Join our community of entrepreneurs and investors today!
                    </p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <Link 
                            to="/register" 
                            style={{ 
                                padding: '15px 40px', 
                                backgroundColor: '#007bff', 
                                color: 'white', 
                                textDecoration: 'none', 
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Register as Startup
                        </Link>
                        <Link 
                            to="/register" 
                            style={{ 
                                padding: '15px 40px', 
                                backgroundColor: '#28a745', 
                                color: 'white', 
                                textDecoration: 'none', 
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Register as Investor
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
