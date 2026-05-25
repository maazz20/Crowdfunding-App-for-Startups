import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaignAPI } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import './CampaignList.css';

export default function CampaignList() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState('progress');

    useEffect(() => {
        campaignAPI.getAll()
            .then((res) => {
                setCampaigns(res.data || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const visibleCampaigns = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return [...campaigns]
            .filter((campaign) => {
                if (!normalizedQuery) return true;
                return `${campaign.title} ${campaign.description} ${campaign.category?.categoryName}`
                    .toLowerCase()
                    .includes(normalizedQuery);
            })
            .sort((a, b) => {
                const aProgress = Number(a.currentAmount || 0) / Number(a.targetAmount || 1);
                const bProgress = Number(b.currentAmount || 0) / Number(b.targetAmount || 1);
                if (sortBy === 'target') return Number(b.targetAmount || 0) - Number(a.targetAmount || 0);
                if (sortBy === 'newest') return Number(b.id || 0) - Number(a.id || 0);
                return bProgress - aProgress;
            });
    }, [campaigns, query, sortBy]);

    if (loading) return <div className="loading surface">Loading campaigns...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="app-shell campaigns-page">
            <div className="page-header">
                <div>
                    <p className="eyebrow">Explore opportunities</p>
                    <h1 className="page-title">Active Campaigns</h1>
                    <p className="page-subtitle">
                        Search live startup campaigns, compare their traction, and open the ones worth backing.
                    </p>
                </div>
                <Link to="/create-campaign" className="btn btn-success">+ Create Campaign</Link>
            </div>

            <div className="campaign-toolbar surface">
                <label>
                    <span>Search</span>
                    <input
                        type="search"
                        placeholder="Search by title, category, or description"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </label>
                <label>
                    <span>Sort by</span>
                    <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                        <option value="progress">Funding progress</option>
                        <option value="target">Largest target</option>
                        <option value="newest">Newest first</option>
                    </select>
                </label>
            </div>

            {visibleCampaigns.length === 0 ? (
                <div className="empty-state surface">
                    <h2>No campaigns found</h2>
                    <p>Try a different search term or clear the search field.</p>
                </div>
            ) : (
                <div className="campaigns-grid">
                    {visibleCampaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                </div>
            )}
        </div>
    );
}
