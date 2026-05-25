import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import axios from 'axios';
import './SubscriptionPlans.css';

export default function SubscriptionPlans() {
    const navigate = useNavigate();
    const user = authAPI.getCurrentUser();
    
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCurrency, setSelectedCurrency] = useState('INR');

    const fetchSubscriptionPlans = useCallback(async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            const token = userData?.token;
            
            if (!token) {
                alert('Authentication token not found');
                navigate('/login');
                return;
            }
            
            const userType = user.role === 'STARTUP' ? 'STARTUP' : 'INVESTOR';
            const response = await axios.get(
                `http://localhost:8080/api/subscriptions/plans?userType=${userType}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPlans(response.data);
        } catch (err) {
            console.error('Failed to fetch subscription plans', err);
            alert('Failed to load subscription plans');
        } finally {
            setLoading(false);
        }
    }, [navigate, user]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchSubscriptionPlans();
    }, [user, navigate, fetchSubscriptionPlans]);

    const getPriceForCurrency = (plan) => {
        switch (selectedCurrency) {
            case 'USD':
                return `$${plan.priceUSD}`;
            case 'EUR':
                return `€${plan.priceEUR}`;
            case 'INR':
            default:
                return `₹${plan.priceINR}`;
        }
    };

    const handleSubscribe = (plan) => {
        navigate('/checkout', { state: { subscriptionPlan: plan, currency: selectedCurrency } });
    };

    return (
        <div className="app-shell subscriptions-page">
            <button onClick={() => navigate(-1)} className="back-button" style={{ marginBottom: '20px' }}>
                ← Back
            </button>

            <div className="page-header">
                <div>
                    <p className="eyebrow">Premium access</p>
                    <h1 className="page-title">Upgrade Your Account</h1>
                </div>
            </div>
            
            {user.role === 'STARTUP' && (
                <div className="notice" style={{ marginBottom: '20px' }}>
                    <p style={{ margin: 0, color: '#333' }}>
                        <strong>Startup Plan:</strong> Create campaigns for free! Keep your campaign listed for 7 days free. 
                        Subscribe to keep it listed beyond 7 days.
                    </p>
                </div>
            )}

            {user.role === 'INVESTOR' && (
                <div className="notice" style={{ marginBottom: '20px' }}>
                    <p style={{ margin: 0, color: '#333' }}>
                        <strong>Investor Plan:</strong> Invest in your first campaign for free! 
                        Subscribe to invest in multiple campaigns.
                    </p>
                </div>
            )}

            <div className="currency-picker surface">
                <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Select Currency:</label>
                <select 
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}
                >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                </select>
            </div>

            {loading ? (
                <div className="loading surface">Loading subscription plans...</div>
            ) : plans.length === 0 ? (
                <div className="empty-state surface">No subscription plans available.</div>
            ) : (
                <div className="plans-grid">
                    {plans.map(plan => (
                        <div 
                            key={plan.id} 
                            className="plan-card"
                        >
                            <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>
                                {plan.durationMonths} Month Plan
                            </h3>
                            
                            <div style={{ 
                                fontSize: '28px', 
                                fontWeight: 'bold', 
                                color: '#333',
                                marginBottom: '15px'
                            }}>
                                {getPriceForCurrency(plan)}
                            </div>

                            <div style={{
                                backgroundColor: '#f9f9f9',
                                padding: '10px',
                                borderRadius: '4px',
                                marginBottom: '15px',
                                fontSize: '14px'
                            }}>
                                <p style={{ margin: '5px 0' }}>
                                    ✓ {plan.durationMonths} months of access
                                </p>
                                {user.role === 'STARTUP' && (
                                    <>
                                        <p style={{ margin: '5px 0' }}>
                                            ✓ Keep campaigns listed
                                        </p>
                                        <p style={{ margin: '5px 0' }}>
                                            ✓ Priority support
                                        </p>
                                    </>
                                )}
                                {user.role === 'INVESTOR' && (
                                    <>
                                        <p style={{ margin: '5px 0' }}>
                                            ✓ Invest in unlimited campaigns
                                        </p>
                                        <p style={{ margin: '5px 0' }}>
                                            ✓ Priority support
                                        </p>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => handleSubscribe(plan)}
                                className="btn btn-primary"
                                style={{ marginTop: 'auto' }}
                            >
                                Choose Plan
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
