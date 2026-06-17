import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/Overview';
import Requests from './pages/Requests';
import RequestDetail from './pages/RequestDetail';
import Submit from './pages/Submit';
import Track from './pages/Track';
import AiAssist from './pages/AiAssist';
import Documents from './pages/Documents';
import Triage from './pages/Triage';
import Settings from './pages/Settings';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Overview /> },
      { path: 'requests', element: <Requests /> },
      { path: 'requests/:id', element: <RequestDetail /> },
      { path: 'submit', element: <Submit /> },
      { path: 'track', element: <Track /> },
      { path: 'ai-assist', element: <AiAssist /> },
      { path: 'documents', element: <Documents /> },
      { path: 'triage', element: <Triage /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);
