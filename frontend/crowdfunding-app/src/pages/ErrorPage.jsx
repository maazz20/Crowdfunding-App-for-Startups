import { Link } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <h1>Oops! Something went wrong.</h1>
      <p>The page you are looking for might have been moved or doesn't exist.</p>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
        Return to Home
      </Link>
    </div>
  );
}
