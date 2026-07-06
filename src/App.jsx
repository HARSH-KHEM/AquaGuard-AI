import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficialDashboard from './pages/OfficialDashboard';
import ThreatMapPage from './pages/ThreatMapPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CreateProfile from './pages/CreateProfile';
import ReportIssue from './pages/ReportIssue';
import MyComplaints from './pages/MyComplaints';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route 
            path="/official" 
            element={
              <ProtectedRoute>
                <OfficialDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-profile" 
            element={
              <ProtectedRoute>
                <CreateProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/report-issue" 
            element={
              <ProtectedRoute>
                <ReportIssue />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-complaints" 
            element={
              <ProtectedRoute>
                <MyComplaints />
              </ProtectedRoute>
            } 
          />
          <Route path="/threat-map" element={<ThreatMapPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
