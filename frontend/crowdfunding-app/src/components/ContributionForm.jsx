import { useState } from 'react';
import { Link } from 'react-router-dom';
import { contributionAPI, authAPI } from '../services/api';

export default function ContributionForm({ campaignId, currency, onSuccess }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [contributionAmount, setContributionAmount] = useState(0);
    const user = authAPI.getCurrentUser();
    const symbol = currency?.symbol || '$';

    const quickAmounts = [100, 500, 1000, 2500];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Please login to contribute');
            return;
        }

        if (user.role !== 'INVESTOR' && user.role !== 'ADMIN') {
            setError('Only investors can contribute to campaigns');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await contributionAPI.create({
                campaign: { id: campaignId },
                contributor: { id: user.id },
                amount: Number.parseFloat(amount),
                currency,
            });

            const contribution = response.data;
            setContributionAmount(contribution.amount);

            const options = {
                key: 'rzp_test_S6yryIHXivHYHm',
                amount: contribution.amount * 100,
                currency: 'INR',
                name: 'Crowdfunding Platform',
                description: 'Campaign contribution',
                order_id: contribution.razorpayOrderId,
                handler: async function (response) {
                    try {
                        await contributionAPI.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        setAmount('');
                        setPaymentSuccess(true);
                    } catch (verifyErr) {
                        setError(`Payment verification failed: ${verifyErr.message}`);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#3366ff',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function (response) {
                setError(`Payment failed: ${response.error.description}`);
            });
            razorpay.open();
        } catch (err) {
            setError(`Failed to initiate contribution. ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="surface panel contribution-form">
                <h2>Back this project</h2>
                <p className="muted-text">Please login to contribute to this campaign.</p>
                <Link className="btn btn-primary" to="/login">Login to Contribute</Link>
            </div>
        );
    }

    if (user.role === 'STARTUP') {
        return (
            <div className="notice warning">
                <strong>Startup account:</strong> Startups can create and manage campaigns, but cannot invest in campaigns.
            </div>
        );
    }

    if (user.role !== 'INVESTOR' && user.role !== 'ADMIN') {
        return (
            <div className="notice warning">
                <strong>Investor access required:</strong> Only investor accounts can contribute to campaigns.
            </div>
        );
    }

    if (paymentSuccess) {
        return (
            <div className="surface success-card">
                <div className="success-mark">✓</div>
                <h2>Contribution Successful</h2>
                <p className="muted-text">Thank you for backing this campaign.</p>
                <div className="notice success">
                    <strong>Contribution Amount:</strong> {symbol}{Number(contributionAmount).toFixed(2)}
                </div>
                <button
                    className="btn btn-success"
                    onClick={() => {
                        setPaymentSuccess(false);
                        if (onSuccess) onSuccess();
                    }}
                >
                    Continue
                </button>
            </div>
        );
    }

    return (
        <div className="surface panel contribution-form">
            <h2>Back this project</h2>
            <form onSubmit={handleSubmit} className="form-grid">
                <div className="quick-amounts">
                    {quickAmounts.map((quickAmount) => (
                        <button
                            type="button"
                            className={Number(amount) === quickAmount ? 'active' : ''}
                            key={quickAmount}
                            onClick={() => setAmount(String(quickAmount))}
                        >
                            {symbol}{quickAmount}
                        </button>
                    ))}
                </div>
                <div className="field">
                    <label>Custom amount ({symbol})</label>
                    <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-text">{error}</p>}
                <button className="btn btn-success" type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Contribute'}
                </button>
            </form>
        </div>
    );
}
