import { Link } from 'react-router-dom';
import './CampaignCard.css';

const formatAmount = (value) => Number(value || 0).toLocaleString();

export default function CampaignCard({ campaign }) {
    const currentAmount = Number(campaign.currentAmount || 0);
    const targetAmount = Number(campaign.targetAmount || 0);
    const progressPercent = targetAmount ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;
    const currencySymbol = campaign.currency?.symbol || '$';
    const shortDescription = campaign.description?.length > 120
        ? `${campaign.description.substring(0, 120)}...`
        : campaign.description;

    return (
        <article className="campaign-card">
            <div className="campaign-card-top">
                <span className="campaign-category">{campaign.category?.categoryName || 'Startup'}</span>
                {campaign.status && <span className="campaign-status">{campaign.status}</span>}
            </div>

            <h3>{campaign.title}</h3>
            <p>{shortDescription || 'This campaign is preparing its story.'}</p>

            <div className="progress-meta">
                <strong>{Math.round(progressPercent)}%</strong>
                <span>{currencySymbol}{formatAmount(currentAmount)} raised</span>
            </div>
            <div className="progress-bar" aria-label={`${Math.round(progressPercent)} percent funded`}>
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>

            <div className="campaign-stats">
                <span>
                    <strong>{currencySymbol}{formatAmount(currentAmount)}</strong>
                    raised
                </span>
                <span>
                    <strong>{currencySymbol}{formatAmount(targetAmount)}</strong>
                    goal
                </span>
            </div>

            <Link to={`/campaigns/${campaign.id}`} className="btn btn-primary btn-details">
                View Details
            </Link>
        </article>
    );
}
