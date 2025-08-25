import Sidebar from './Sidebar';

// This component takes the main page content as a 'child'
export default function AdminLayout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        {children} {/* The page content will be displayed here */}
      </main>
    </div>
  );
}