import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, campaignAPI, contributionAPI } from '../services/api';

export default function Dashboard() {
    const navigate = useNavigate();
    const user = authAPI.getCurrentUser();
    const [campaigns, setCampaigns] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [pendingCampaigns, setPendingCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                if (user.role === 'STARTUP') {
                    const response = await campaignAPI.getByCreator(user.id);
                    setCampaigns(response.data);
                } else if (user.role === 'INVESTOR') {
                    const response = await contributionAPI.getUserContributions(user.id);
                    setContributions(response.data);
                } else if (user.role === 'ADMIN') {
                    const [allCampaigns, pending] = await Promise.all([
                        campaignAPI.getAll(),
                        campaignAPI.getPendingCampaigns()
                    ]);
                    setCampaigns(allCampaigns.data);
                    setPendingCampaigns(pending.data);
                }
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const handleApproveCampaign = async (id) => {
        try {
            await campaignAPI.approveCampaign(id);
            setPendingCampaigns(prev => prev.filter(c => c.id !== id));
            alert('Campaign approved successfully!');
        } catch (err) {
            alert('Failed to approve campaign');
            console.error(err);
        }
    };

    const handleDeleteCampaign = async (id) => {
        if (!window.confirm('Are you sure you want to delete this campaign?')) return;
        
        try {
            await campaignAPI.delete(id);
            setCampaigns(prev => prev.filter(c => c.id !== id));
            alert('Campaign deleted successfully!');
        } catch (err) {
            alert('Failed to delete campaign');
            console.error(err);
        }
    };

    if (!user) return null;
    if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back
            </button>
            
            <h1>Dashboard - {user.role}</h1>

            {user.role === 'STARTUP' && (
                <div>
                    <h2>My Campaigns</h2>
                    {campaigns.length === 0 ? (
                        <p>You haven't created any campaigns yet. <Link to="/create-campaign">Create one now!</Link></p>
                    ) : (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {campaigns.map(campaign => (
                                <div key={campaign.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                                    <h3>{campaign.title}</h3>
                                    <p><strong>Status:</strong> {campaign.status}</p>
                                    <p><strong>Target:</strong> {campaign.currency.symbol}{campaign.targetAmount}</p>
                                    <p><strong>Current:</strong> {campaign.currency.symbol}{campaign.currentAmount}</p>
                                    <Link to={`/campaigns/${campaign.id}`}>View Details</Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {user.role === 'INVESTOR' && (
                <div>
                    <h2>My Contributions</h2>
                    {contributions.length === 0 ? (
                        <p>You haven't made any contributions yet. <Link to="/">Browse campaigns</Link></p>
                    ) : (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {contributions.map(contribution => (
                                <div key={contribution.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                                    <h3>{contribution.campaign.title}</h3>
                                    <p><strong>Amount:</strong> {contribution.campaign.currency.symbol}{contribution.amount}</p>
                                    <p><strong>Date:</strong> {new Date(contribution.contributedAt).toLocaleDateString()}</p>
                                    <Link to={`/campaigns/${contribution.campaign.id}`}>View Campaign</Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {user.role === 'ADMIN' && (
                <div>
                    <h2>Pending Campaigns (Awaiting Approval)</h2>
                    {pendingCampaigns.length === 0 ? (
                        <p>No pending campaigns to review.</p>
                    ) : (
                        <div style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
                            {pendingCampaigns.map(campaign => (
                                <div key={campaign.id} style={{ border: '2px solid #ffa500', padding: '15px', borderRadius: '8px' }}>
                                    <h3>{campaign.title}</h3>
                                    <p>{campaign.description.substring(0, 100)}...</p>
                                    <p><strong>Creator:</strong> {campaign.creator.name}</p>
                                    <p><strong>Target:</strong> {campaign.currency.symbol}{campaign.targetAmount}</p>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button 
                                            onClick={() => handleApproveCampaign(campaign.id)}
                                            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Approve
                                        </button>
                                        <Link to={`/campaigns/${campaign.id}`}>View Details</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <h2>All Campaigns</h2>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {campaigns.map(campaign => (
                            <div key={campaign.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                                <h3>{campaign.title}</h3>
                                <p><strong>Status:</strong> {campaign.status}</p>
                                <p><strong>Creator:</strong> {campaign.creator.name}</p>
                                <p><strong>Target:</strong> {campaign.currency.symbol}{campaign.targetAmount}</p>
                                <p><strong>Current:</strong> {campaign.currency.symbol}{campaign.currentAmount}</p>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <Link to={`/campaigns/${campaign.id}`}>View Details</Link>
                                    {campaign.currentAmount >= campaign.targetAmount && (
                                        <button 
                                            onClick={() => handleDeleteCampaign(campaign.id)}
                                            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
