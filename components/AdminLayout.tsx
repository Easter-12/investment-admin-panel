import { useState } from 'react';
import Sidebar from './Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="desktop-sidebar">
        <Sidebar />
      </div>

      {/* --- THIS IS THE GUARANTEED FIX --- */}
      {/* We are adding the correct dark background color here */}
      <main className="main-content" style={{ backgroundColor: '#111827' }}>
        <button 
          className="mobile-menu-button" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰ Menu
        </button>

        {isSidebarOpen && (
          <div style={{marginBottom: '2rem'}}>
            <Sidebar />
          </div>
        )}

        {children}
      </main>
    </div>
  );
}