import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CampaignList from './pages/CampaignList';
import CampaignDetail from './pages/CampaignDetail';
import CreateCampaign from './pages/CreateCampaign';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SubscriptionPlans from './pages/SubscriptionPlans';
import Checkout from './pages/Checkout';
import ErrorPage from './pages/ErrorPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaigns" element={<CampaignList />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/subscriptions" element={<SubscriptionPlans />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
