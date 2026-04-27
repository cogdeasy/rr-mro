import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './pages/Overview';
import Requests from './pages/Requests';
import RequestDetail from './pages/RequestDetail';
import Submit from './pages/Submit';
import Track from './pages/Track';
import AiAssist from './pages/AiAssist';
import Documents from './pages/Documents';
import Triage from './pages/Triage';
import Settings from './pages/Settings';

export default function App() {
  return (
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
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
