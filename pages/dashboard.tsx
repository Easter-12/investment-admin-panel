import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import AdminLayout from '../components/AdminLayout';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function DashboardContent() {
  const [userCount, setUserCount] = useState(0); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  useEffect(() => { const fetchUserCount = async () => { try { const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true }); if (error) throw error; if (count !== null) setUserCount(count); } catch (err: any) { setError(err.message); } finally { setLoading(false); } }; fetchUserCount(); }, []);
  return ( <div style={{padding: '4rem', color: 'white'}}> <h1 style={{ color: 'white', borderBottom: '1px solid #374151', paddingBottom: '1rem' }}>Admin Dashboard</h1> <div className="stats-container" style={{ marginTop: '2rem' }}> <div className="stat-card"> <h2>TOTAL REGISTERED USERS</h2> {loading && <p>...</p>} {error && <p style={{ color: '#f87171', fontSize: '1.5rem' }}>Error</p>} {!loading && !error && ( <p>{userCount}</p> )} </div> </div> </div> );
}

export default function AdminDashboardPage() { return ( <AdminLayout> <DashboardContent /> </AdminLayout> ); }