// The imports are now clean, with no duplicates.
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
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
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', borderBottom: '1px solid #374151', paddingBottom: '1rem' }}>
        Admin Dashboard
      </h1>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
        <div style={{ backgroundColor: '#1f2937', padding: '2rem', borderRadius: '12px', width: '300px' }}>
          <h2 style={{ color: '#9ca3af', fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>TOTAL REGISTERED USERS</h2>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: '#f87171' }}>Error: {error}</p>}
          {!loading && !error && (
            <p style={{ color: '#10b981', fontSize: '3rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>
              {userCount}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// This is the main export for the page
export default function AdminDashboardPage() {
    return (
        <AdminLayout>
            <DashboardContent />
        </AdminLayout>
    );
}