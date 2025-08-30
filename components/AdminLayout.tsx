import { useState } from 'react';
import Sidebar from './Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#111827' }}>
      {/* --- Desktop Sidebar (hidden on mobile by CSS) --- */}
      <div className="desktop-sidebar">
        <Sidebar />
      </div>

      {/* --- Main Content Area --- */}
      <main className="main-content">
        {/* --- Mobile Menu Button (shown on mobile by CSS) --- */}
        <button 
          className="mobile-menu-button" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰ Menu
        </button>

        {/* --- Mobile Sidebar (only shown when button is clicked) --- */}
        {isSidebarOpen && (
          <div style={{marginBottom: '2rem'}}>
            <Sidebar />
          </div>
        )}

        {/* This is where the page content goes */}
        {children}
      </main>
    </div>
  );
}