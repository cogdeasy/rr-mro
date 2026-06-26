import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Overview from './pages/dashboard/overview/Overview';
import Requests from './pages/dashboard/requests/Requests';
import RequestDetail from './pages/dashboard/request-detail/RequestDetail';
import Submit from './pages/submit/Submit';
import Track from './pages/track/Track';
import AiAssist from './pages/dashboard/ai-assist/AiAssist';
import Documents from './pages/dashboard/documents/Documents';
import Triage from './pages/dashboard/triage/Triage';
import Settings from './pages/dashboard/settings/Settings';
import Landing from './pages/landing/Landing';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="requests" element={<Requests />} />
          <Route path="requests/:id" element={<RequestDetail />} />
          <Route path="submit" element={<Submit />} />
          <Route path="track" element={<Track />} />
          <Route path="ai-assist" element={<AiAssist />} />
          <Route path="documents" element={<Documents />} />
          <Route path="triage" element={<Triage />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/landing" element={<Landing />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
