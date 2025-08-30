import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import AdminLayout from '../components/AdminLayout';

function DashboardContent() {
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        if (error) throw error;
        if (count !== null) setUserCount(count);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserCount();
  }, []);

  return (
    // We remove the outer padding here because AdminLayout now handles it
    <div>
      <h1 style={{ color: 'white', borderBottom: '1px solid #374151', paddingBottom: '1rem' }}>
        Admin Dashboard
      </h1>

      {/* Use the new responsive container for the cards */}
      <div className="stats-container" style={{ marginTop: '2rem' }}>
        <div className="stat-card">
          <h2>TOTAL REGISTERED USERS</h2>
          {loading && <p>...</p>}
          {error && <p style={{ color: '#f87171', fontSize: '1.5rem' }}>Error</p>}
          {!loading && !error && (
            <p>{userCount}</p>
          )}
        </div>

        {/* You can easily add more stat cards here in the future */}
        {/* <div className="stat-card">
          <h2>PENDING WITHDRAWALS</h2>
          <p>3</p>
        </div> */}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
    return (
        <AdminLayout>
            <DashboardContent />
        </AdminLayout>
    );
}