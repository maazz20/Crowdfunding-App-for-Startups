import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignAPI, contributionAPI } from '../services/api';
import ContributionForm from '../components/ContributionForm';
import './CampaignDetail.css';

const formatAmount = (value) => Number(value || 0).toLocaleString();
const formatDate = (value) => value ? new Date(value).toLocaleDateString() : 'Not set';

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
                setContributions(contributionsRes.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="loading surface">Loading campaign...</div>;
    if (!campaign) return <div className="empty-state surface">Campaign not found</div>;

    const currentAmount = Number(campaign.currentAmount || 0);
    const targetAmount = Number(campaign.targetAmount || 0);
    const progressPercent = targetAmount ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;
    const currencySymbol = campaign.currency?.symbol || '$';
    const creator = campaign.creator || {};
    const creatorInitial = (creator.name || creator.email || 'U').charAt(0).toUpperCase();
    const creatorType = creator.userType?.typeName || 'Startup';

    return (
        <div className="app-shell campaign-detail">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back
            </button>

            <section className="detail-hero surface">
                <div>
                    <span className="status-pill">{campaign.status || 'Active'}</span>
                    <h1>{campaign.title}</h1>
                    <p>{campaign.description}</p>
                </div>
                <div className="detail-summary">
                    <strong>{currencySymbol}{formatAmount(currentAmount)}</strong>
                    <span>raised of {currencySymbol}{formatAmount(targetAmount)}</span>
                    <div className="progress-bar-lg">
                        <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <div className="detail-summary-row">
                        <span>{Math.round(progressPercent)}% funded</span>
                        <span>{contributions.length} backers</span>
                    </div>
                </div>
            </section>

            <div className="detail-grid">
                <ContributionForm campaignId={campaign.id} campaign={campaign} currency={campaign.currency} onSuccess={() => window.location.reload()} />

                <aside className="detail-sidebar">
                    <section className="surface panel creator-panel">
                        <h2>Posted by</h2>
                        <div className="creator-profile">
                            <div className="creator-avatar" aria-hidden="true">{creatorInitial}</div>
                            <div>
                                <strong>{creator.name || 'Campaign creator'}</strong>
                                <span>{creatorType}</span>
                            </div>
                        </div>
                        <dl className="creator-meta">
                            {creator.email && (
                                <>
                                    <dt>Email</dt>
                                    <dd>{creator.email}</dd>
                                </>
                            )}
                            <dt>Category</dt>
                            <dd>{campaign.category?.categoryName || 'Startup'}</dd>
                            <dt>Campaign posted</dt>
                            <dd>{formatDate(campaign.createdAt)}</dd>
                        </dl>
                    </section>

                    <section className="surface panel">
                        <h2>Recent Contributions</h2>
                        {contributions.length === 0 ? (
                            <p className="muted-text">No contributions yet. Be the first to back it.</p>
                        ) : (
                            <ul className="contributions-list">
                                {contributions.map((contrib) => (
                                    <li key={contrib.id}>
                                        <span>{contrib.contributor?.name || 'Backer'}</span>
                                        <strong>{currencySymbol}{formatAmount(contrib.amount)}</strong>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </aside>
            </div>
        </div>
    );
}
