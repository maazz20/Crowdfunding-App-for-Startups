import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api, { authAPI } from '../services/api';

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authAPI.getCurrentUser();
    
    const { subscriptionPlan, currency } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const getPriceForCurrency = () => {
        switch (currency) {
            case 'USD':
                return subscriptionPlan?.priceUSD;
            case 'EUR':
                return subscriptionPlan?.priceEUR;
            case 'INR':
            default:
                return subscriptionPlan?.priceINR;
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

    if (!user) {
        return (
            <div className="app-shell auth-shell">
                <h2>Session Expired</h2>
                <p>Your session has expired. Please log in again to complete your purchase.</p>
                <button 
                    onClick={() => navigate('/login')}
                    className="btn btn-primary"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    if (!subscriptionPlan) {
        return (
            <div className="app-shell">
                Invalid subscription plan. 
                <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginLeft: '10px' }}>
                    Go Home
                </button>
            </div>
        );
    }

    if (paymentSuccess) {
        return (
            <div className="app-shell">
            <div className="surface success-card">
                <div className="success-mark">✓</div>
                <h1>
                    Payment Successful!
                </h1>
                <p className="muted-text">
                    Your subscription has been activated successfully.
                </p>

                <div className="notice success">
                    <p style={{ margin: '5px 0', color: '#333', fontWeight: 'bold' }}>
                        {subscriptionPlan.durationMonths} Month Subscription
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                        {getCurrencySymbol()}{getPriceForCurrency()}
                    </p>
                </div>
                
                <p className="muted-text">
                    You now have access to all premium features. Enjoy exploring the platform!
                </p>
                
                <div className="actions center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-success"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-muted"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
            </div>
        );
    }

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
                        await api.post(
                            '/subscriptions/create',
                            {
                                subscriptionPlanId: subscriptionPlan.id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                amount: amount,
                                currency: currency
                            }
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
        <div className="app-shell auth-shell">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back
            </button>

            <h1 className="page-title">Checkout</h1>

            <div className="surface panel" style={{ marginTop: '20px', marginBottom: '20px' }}>
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

            <div className="notice" style={{ marginBottom: '20px' }}>
                <p style={{ margin: 0, color: '#333' }}>
                    <strong>Note:</strong> You will be redirected to Razorpay payment gateway to complete the transaction securely.
                </p>
            </div>

            <button
                onClick={handlePayment}
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%' }}
            >
                {loading ? 'Processing...' : `Pay ${getCurrencySymbol()}${getPriceForCurrency()}`}
            </button>

            <button
                onClick={() => navigate(-1)}
                className="btn btn-muted"
                style={{ width: '100%', marginTop: '10px' }}
            >
                Cancel
            </button>
        </div>
    );
}
