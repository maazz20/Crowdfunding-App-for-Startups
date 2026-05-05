import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignAPI, metaAPI, authAPI } from '../services/api';

export default function CreateCampaign() {
    const navigate = useNavigate();
    const user = authAPI.getCurrentUser();

    const today = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        targetAmount: '',
        startDate: today,
        endDate: today,
        categoryId: '1',
        currencyId: '1'
    });

    const [categories, setCategories] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [campaignCreated, setCampaignCreated] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Only STARTUP and ADMIN can create campaigns
        if (user.role !== 'STARTUP' && user.role !== 'ADMIN') {
            alert('Only startups can create campaigns');
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const [catsRes, currRes] = await Promise.all([
                    metaAPI.getCategories(),
                    metaAPI.getCurrencies()
                ]);
                setCategories(catsRes.data || []);
                setCurrencies(currRes.data || []);
            } catch (err) {
                console.error('Failed to fetch metadata', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Keep as string for select elements, convert to number only when needed
        if (name === 'startDate') {
            setFormData((prev) => ({
                ...prev,
                startDate: value,
                endDate: prev.endDate < value ? value : prev.endDate || value
            }));
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.startDate < today) {
            alert('Start date cannot be in the past.');
            return;
        }

        const minEndDate = formData.startDate && formData.startDate > today ? formData.startDate : today;
        if (formData.endDate < minEndDate) {
            alert('End date cannot be earlier than the selected start date or in the past.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                targetAmount: formData.targetAmount,
                startDate: formData.startDate,
                endDate: formData.endDate,
                category: { id: Number(formData.categoryId) },
                currency: { id: Number(formData.currencyId) },
                creator: { id: user.id }
            };
            await campaignAPI.create(payload);
            setCampaignCreated(true);
        } catch (err) {
            alert('Failed to create campaign');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    if (campaignCreated) {
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
                    Campaign Created Successfully!
                </h1>
                
                <p style={{ color: '#666', fontSize: '16px', marginBottom: '30px', lineHeight: '1.6' }}>
                    Your campaign has been created and is now <strong>waiting for admin approval</strong>.
                </p>
                
                <p style={{ color: '#999', fontSize: '14px', marginBottom: '30px' }}>
                    Once approved, your campaign will be visible to all users. You'll receive a notification when your campaign is approved or if there are any issues.
                </p>
                
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: '12px 30px',
                            backgroundColor: '#007bff',
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

    return (
        <div className="create-campaign-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back
            </button>
            
            <h1>Start a Campaign</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title</label>
                    <input
                        type="text" name="title" required
                        value={formData.title} onChange={handleChange}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
                    <textarea
                        name="description" required rows="5"
                        value={formData.description} onChange={handleChange}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Target Amount</label>
                        <input
                            type="number" name="targetAmount" required min="1"
                            value={formData.targetAmount} onChange={handleChange}
                            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Currency</label>
                        <select
                            name="currencyId"
                            value={formData.currencyId}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                        >
                            {currencies && currencies.length > 0 ? (
                                currencies.map(c => (
                                    <option key={c.id} value={String(c.id)}>{c.code} ({c.symbol})</option>
                                ))
                            ) : (
                                <option value="">Loading currencies...</option>
                            )}
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                    >
                        {categories && categories.length > 0 ? (
                            categories.map(cat => (
                                <option key={cat.id} value={String(cat.id)}>{cat.categoryName}</option>
                            ))
                        ) : (
                            <option value="">Loading categories...</option>
                        )}
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Start Date</label>
                        <input
                            type="date" name="startDate" required
                            min={today}
                            value={formData.startDate} onChange={handleChange}
                            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>End Date</label>
                        <input
                            type="date" name="endDate" required
                            min={formData.startDate || today}
                            value={formData.endDate} onChange={handleChange}
                            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>

                <button
                    type="submit" disabled={loading || !formData.categoryId || !formData.currencyId}
                    style={{ padding: '12px', backgroundColor: loading || !formData.categoryId || !formData.currencyId ? '#cccccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: loading || !formData.categoryId || !formData.currencyId ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                >
                    {loading ? 'Creating...' : 'Create Campaign'}
                </button>
            </form>
        </div>
    );
}
