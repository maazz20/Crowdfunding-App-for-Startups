import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import axios from 'axios';

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authAPI.getCurrentUser();
    
    const { subscriptionPlan, currency } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    if (!user) {
        return (
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <h2>Session Expired</h2>
                <p>Your session has expired. Please log in again to complete your purchase.</p>
                <button 
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    if (!subscriptionPlan) {
        return (
            <div style={{ padding: '20px' }}>
                Invalid subscription plan. 
                <button onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>
                    Go Home
                </button>
            </div>
        );
    }

    if (paymentSuccess) {
        return (
            <div className="success-container" style={{ 
                maxWidth: '500px', 
                margin: '100px auto', 
                padding: '40px', 
                textAlign: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    fontSize: '60px',
                    color: '#28a745',
                    marginBottom: '20px'
                }}>✓</div>
                
                <h1 style={{ color: '#333', marginBottom: '10px', fontSize: '28px' }}>
                    Payment Successful!
                </h1>
                
                <p style={{ color: '#666', fontSize: '16px', marginBottom: '10px', lineHeight: '1.6' }}>
                    Your subscription has been activated successfully.
                </p>

                <div style={{
                    backgroundColor: '#e8f5e9',
                    padding: '20px',
                    borderRadius: '6px',
                    marginBottom: '30px',
                    borderLeft: '4px solid #28a745'
                }}>
                    <p style={{ margin: '5px 0', color: '#333', fontWeight: 'bold' }}>
                        {subscriptionPlan.durationMonths} Month Subscription
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                        {getCurrencySymbol()}{getPriceForCurrency()}
                    </p>
                </div>
                
                <p style={{ color: '#999', fontSize: '14px', marginBottom: '30px' }}>
                    You now have access to all premium features. Enjoy exploring the platform!
                </p>
                
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: '12px 30px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '12px 30px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const getPriceForCurrency = () => {
        switch (currency) {
            case 'USD':
                return subscriptionPlan.priceUSD;
            case 'EUR':
                return subscriptionPlan.priceEUR;
            case 'INR':
            default:
                return subscriptionPlan.priceINR;
        }
    };

    const getCurrencySymbol = () => {
        switch (currency) {
            case 'USD':
                return '$';
            case 'EUR':
                return '€';
            case 'INR':
            default:
                return '₹';
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const amount = getPriceForCurrency();
            const userData = localStorage.getItem('user');
            
            console.log('User data from localStorage:', userData);
            
            if (!userData) {
                alert('Please login to continue');
                navigate('/login');
                setLoading(false);
                return;
            }

            const user = JSON.parse(userData);
            const token = user.token;
            
            console.log('Extracted token:', token ? 'Present' : 'Missing');
            
            if (!token) {
                alert('Authentication token not found. Please login again');
                navigate('/login');
                setLoading(false);
                return;
            }

            if (!window.Razorpay) {
                alert('Razorpay payment gateway is not loaded. Please refresh and try again.');
                setLoading(false);
                return;
            }

            const options = {
                key: 'rzp_test_S6yryIHXivHYHm', // Razorpay test key
                amount: Math.round(amount * 100), // Amount in paise
                currency: currency,
                name: 'Crowdfunding Platform',
                description: `${subscriptionPlan.durationMonths} Month Subscription`,
                handler: async (response) => {
                    try {
                        console.log('Payment successful, creating subscription...', response);
                        // Create subscription after successful payment
                        await axios.post(
                            'http://localhost:8080/api/subscriptions/create',
                            {
                                subscriptionPlanId: subscriptionPlan.id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                amount: amount,
                                currency: currency
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        setPaymentSuccess(true);
                    } catch (err) {
                        console.error('Error creating subscription', err);
                        alert('Payment successful but subscription creation failed. Please contact support.');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email
                },
                theme: {
                    color: '#007bff'
                }
            };

            console.log('Opening Razorpay with options:', options);
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error('Error processing payment', err);
            alert('Failed to process payment: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back
            </button>

            <h1>Checkout</h1>

            <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f9f9f9',
                marginBottom: '20px'
            }}>
                <h2>Order Summary</h2>
                
                <div style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>Plan:</span>
                        <strong>{subscriptionPlan.durationMonths} Month Subscription</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>Duration:</span>
                        <span>{subscriptionPlan.durationMonths} months</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Currency:</span>
                        <span>{currency}</span>
                    </div>
                </div>

                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#333'
                }}>
                    <span>Total:</span>
                    <span>{getCurrencySymbol()}{getPriceForCurrency()}</span>
                </div>
            </div>

            <div style={{
                backgroundColor: '#f0f7ff',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                borderLeft: '4px solid #007bff'
            }}>
                <p style={{ margin: 0, color: '#333' }}>
                    <strong>Note:</strong> You will be redirected to Razorpay payment gateway to complete the transaction securely.
                </p>
            </div>

            <button
                onClick={handlePayment}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: loading ? '#cccccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px'
                }}
            >
                {loading ? 'Processing...' : `Pay ${getCurrencySymbol()}${getPriceForCurrency()}`}
            </button>

            <button
                onClick={() => navigate(-1)}
                style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#f0f0f0',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    marginTop: '10px'
                }}
            >
                Cancel
            </button>
        </div>
    );
}
