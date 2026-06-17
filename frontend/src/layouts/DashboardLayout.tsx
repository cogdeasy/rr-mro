import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  return (
    <>
      <Header />
      <div style={{ display: 'flex', height: 'calc(100vh - 52px)' }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: 'auto', background: '#F5F5F7' }}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
