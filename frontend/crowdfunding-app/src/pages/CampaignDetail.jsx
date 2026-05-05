import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignAPI, contributionAPI } from '../services/api';
import ContributionForm from '../components/ContributionForm';

export default function CampaignDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            campaignAPI.getById(id),
            contributionAPI.getCampaignContributions(id),
        ])
            .then(([campaignRes, contributionsRes]) => {
                setCampaign(campaignRes.data);
                setContributions(contributionsRes.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!campaign) return <div>Campaign not found</div>;

    const progressPercent = Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100);

    const currencySymbol = campaign.currency?.symbol || '$';

    return (
        <div className="campaign-detail" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back
            </button>
            
            <h1>{campaign.title}</h1>
            <p style={{ lineHeight: '1.6', color: '#555' }}>{campaign.description}</p>

            <div className="progress-section" style={{ margin: '30px 0' }}>
                <div className="progress-bar-lg" style={{ height: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div className="progress-fill" style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: '#4caf50' }}></div>
                </div>
                <p style={{ marginTop: '10px', fontSize: '1.2rem' }}>
                    <strong style={{ color: '#4caf50' }}>{currencySymbol}{campaign.currentAmount}</strong> raised of {currencySymbol}{campaign.targetAmount}
                    <span style={{ color: '#888', marginLeft: '10px' }}>({contributions.length} backers)</span>
                </p>
            </div>

            <ContributionForm campaignId={campaign.id} campaign={campaign} currency={campaign.currency} onSuccess={() => window.location.reload()} />

            <div className="contributions-list" style={{ marginTop: '40px' }}>
                <h3>Recent Contributions</h3>
                {contributions.length === 0 ? <p>No contributions yet. Be the first!</p> : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {contributions.map((contrib) => (
                            <li key={contrib.id} className="contribution-item" style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 'bold' }}>{contrib.contributor.name}</span>
                                <span className="amount" style={{ color: '#4caf50' }}>{currencySymbol}{contrib.amount}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
