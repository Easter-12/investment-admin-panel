import { useState } from 'react';
import Sidebar from './Sidebar';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="desktop-sidebar"><Sidebar /></div>
      <main className="main-content">
        <button className="mobile-menu-button" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰ Menu</button>
        {isSidebarOpen && (<div style={{marginBottom: '2rem'}}><Sidebar /></div>)}
        {children}
      </main>
    </div>
  );
}