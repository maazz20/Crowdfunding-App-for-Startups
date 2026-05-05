import { Link } from 'react-router-dom';
import './CampaignCard.css';

export default function CampaignCard({ campaign }) {
    const progressPercent = Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100);

    const currencySymbol = campaign.currency?.symbol || '$';

    return (
        <div className="campaign-card">
            <h3>{campaign.title}</h3>
            <p>{campaign.description?.substring(0, 100)}...</p>

            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>

            <div className="campaign-stats">
                <span className="current">{currencySymbol}{campaign.currentAmount}</span>
                <span className="target">of {currencySymbol}{campaign.targetAmount}</span>
            </div>

            <Link to={`/campaigns/${campaign.id}`} className="btn-details">
                View Details
            </Link>
        </div>
    );
}
