import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Home.css';

const features = [
    {
        icon: '01',
        title: 'Launch with clarity',
        text: 'Build a campaign page, choose funding goals, and give backers a clear reason to believe.',
    },
    {
        icon: '02',
        title: 'Discover startups',
        text: 'Browse active campaigns, compare progress, and support founders building promising ideas.',
    },
    {
        icon: '03',
        title: 'Track momentum',
        text: 'Follow funding progress, contributions, approvals, and campaign performance from one place.',
    },
];

export default function Home() {
    const user = authAPI.getCurrentUser();

    return (
        <div className="home-page">
            <section className="home-hero">
                <div className="hero-content">
                    <p className="eyebrow">Startup funding, simplified</p>
                    <h1>Fund ideas that deserve a real first push.</h1>
                    <p>
                        CrowdFund connects founders and investors through transparent campaigns,
                        secure contributions, and practical dashboards built for daily use.
                    </p>
                    <div className="actions">
                        {user ? (
                            <Link to="/campaigns" className="btn btn-primary">Browse Campaigns</Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary">Get Started</Link>
                                <Link to="/login" className="btn btn-outline">Login</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="hero-board" aria-label="Campaign activity preview">
                    <div className="hero-card featured">
                        <span className="status-pill">Trending</span>
                        <h3>Solar cold chain for farms</h3>
                        <div className="hero-progress">
                            <span style={{ width: '72%' }} />
                        </div>
                        <div className="hero-card-row">
                            <strong>72% funded</strong>
                            <span>148 backers</span>
                        </div>
                    </div>
                    <div className="hero-mini-grid">
                        <div>
                            <strong>89</strong>
                            <span>Active campaigns</span>
                        </div>
                        <div>
                            <strong>24h</strong>
                            <span>Fast approvals</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-section">
                <div className="page-header">
                    <div>
                        <p className="eyebrow">How it works</p>
                        <h2>Everything has a next action.</h2>
                    </div>
                    <Link to="/campaigns" className="btn btn-muted">Explore</Link>
                </div>
                <div className="feature-grid">
                    {features.map((feature) => (
                        <article className="feature-card" key={feature.title}>
                            <span>{feature.icon}</span>
                            <h3>{feature.title}</h3>
                            <p>{feature.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="home-band">
                <div>
                    <p className="eyebrow">Why CrowdFund</p>
                    <h2>Clean workflows for founders, backers, and admins.</h2>
                </div>
                <p>
                    Role-based access keeps the platform focused: startups create and manage
                    campaigns, investors contribute, and admins review submissions before they go live.
                </p>
            </section>

            {!user && (
                <section className="home-cta">
                    <h2>Choose your starting point.</h2>
                    <div className="actions center">
                        <Link to="/register" className="btn btn-primary">Register as Startup</Link>
                        <Link to="/register" className="btn btn-success">Register as Investor</Link>
                    </div>
                </section>
            )}
        </div>
    );
}
