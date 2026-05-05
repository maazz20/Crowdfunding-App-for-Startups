import { useState } from 'react';
import { contributionAPI, authAPI } from '../services/api';

export default function ContributionForm({ campaignId, currency, onSuccess }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [contributionAmount, setContributionAmount] = useState(0);
    const user = authAPI.getCurrentUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Please login to contribute');
            return;
        }

        // Check if user is INVESTOR or ADMIN
        if (user.role !== 'INVESTOR' && user.role !== 'ADMIN') {
            setError('Only investors can contribute to campaigns');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Create Contribution (Get Order ID)
            const response = await contributionAPI.create({
                campaign: { id: campaignId },
                contributor: { id: user.id },
                amount: Number.parseFloat(amount),
                currency: currency // Pass the currency from the campaign
            });

            const contribution = response.data;
            const orderId = contribution.razorpayOrderId;
            setContributionAmount(contribution.amount);

            // 2. Open Razorpay Checkout
            const options = {
                key: "rzp_test_S6yryIHXivHYHm", // Replace with your generated key
                amount: contribution.amount * 100, // Amount in paise
                currency: "INR",
                name: "Crowdfunding Platform",
                description: "Test Transaction",
                order_id: orderId,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        await contributionAPI.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        setAmount('');
                        setPaymentSuccess(true);
                    } catch (verifyErr) {
                        setError('Payment verification failed: ' + verifyErr.message);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                setError('Payment failed: ' + response.error.description);
            });
            rzp1.open();

        } catch (err) {
            setError('Failed to initiate contribution. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
                <p>Please <a href="/login">login</a> to back this project.</p>
            </div>
        );
    }

    // STARTUP users cannot contribute to ANY campaigns (including their own)
    if (user.role === 'STARTUP') {
        return (
            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ffa500', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fff3cd' }}>
                <p><strong>Note:</strong> Startups cannot invest in campaigns. As a startup, you can create and manage your own campaigns to receive funding from investors.</p>
            </div>
        );
    }

    // Only INVESTOR and ADMIN can contribute
    if (user.role !== 'INVESTOR' && user.role !== 'ADMIN') {
        return (
            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ffa500', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fff3cd' }}>
                <p><strong>Note:</strong> Only investors can contribute to campaigns. Startups can create and manage campaigns.</p>
            </div>
        );
    }

    const symbol = currency?.symbol || '$';

    if (paymentSuccess) {
        return (
            <div className="success-container" style={{ 
                marginTop: '20px',
                padding: '30px', 
                textAlign: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '2px solid #28a745'
            }}>
                <div style={{
                    fontSize: '50px',
                    color: '#28a745',
                    marginBottom: '15px'
                }}>✓</div>
                
                <h3 style={{ color: '#333', marginBottom: '10px', fontSize: '22px' }}>
                    Contribution Successful!
                </h3>
                
                <p style={{ color: '#666', fontSize: '15px', marginBottom: '15px', lineHeight: '1.6' }}>
                    Thank you for backing this campaign!
                </p>

                <div style={{
                    backgroundColor: '#e8f5e9',
                    padding: '15px',
                    borderRadius: '6px',
                    marginBottom: '20px',
                    borderLeft: '4px solid #28a745'
                }}>
                    <p style={{ margin: '5px 0', color: '#333', fontWeight: 'bold', fontSize: '14px' }}>
                        Contribution Amount
                    </p>
                    <p style={{ margin: '5px 0', color: '#666', fontSize: '18px', fontWeight: 'bold' }}>
                        {symbol}{contributionAmount.toFixed(2)}
                    </p>
                </div>
                
                <p style={{ color: '#999', fontSize: '13px', marginBottom: '20px' }}>
                    Your contribution has been recorded. You will receive updates about this campaign's progress.
                </p>
                
                <button
                    onClick={() => {
                        setPaymentSuccess(false);
                        if (onSuccess) onSuccess();
                    }}
                    style={{
                        padding: '10px 25px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}
                >
                    Continue
                </button>
            </div>
        );
    }

    return (
        <div className="contribution-form" style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Back this project</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Amount ({symbol})</label>
                    <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: '10px 20px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {loading ? 'Processing...' : 'Contribute'}
                </button>
            </form>
        </div>
    );
}
