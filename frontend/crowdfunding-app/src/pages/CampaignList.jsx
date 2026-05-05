import { useEffect, useState } from 'react';
import { campaignAPI } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import { Link } from 'react-router-dom';

export default function CampaignList() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        campaignAPI.getAll()
            .then((res) => {
                setCampaigns(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading">Loading campaigns...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="campaigns-container" style={{ padding: '20px' }}>
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Active Campaigns</h1>
                <Link to="/create-campaign" className="btn-primary" style={{ padding: '10px 20px', backgroundColor: '#4caf50', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                    + Create Campaign
                </Link>
            </div>

            <div className="campaigns-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {campaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
            </div>
        </div>
    );
}
