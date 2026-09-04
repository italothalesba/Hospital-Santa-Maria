import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BlogPage from './pages/BlogPage';
import ArticlePage from './pages/ArticlePage';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminArticles from './admin/AdminArticles';
import AdminSpecialists from './admin/AdminSpecialists';
import AdminInsurances from './admin/AdminInsurances';
import AdminSettings from './admin/AdminSettings';
import LoginPage from './admin/LoginPage';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Header /><LandingPage /><Footer /><WhatsAppButton /></>} />
          <Route path="/blog" element={<><Header /><BlogPage /><Footer /><WhatsAppButton /></>} />
          <Route path="/blog/:slug" element={<><Header /><ArticlePage /><Footer /><WhatsAppButton /></>} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="specialists" element={<AdminSpecialists />} />
            <Route path="insurances" element={<AdminInsurances />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
