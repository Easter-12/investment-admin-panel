import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import AdminLayout from '../components/AdminLayout';

// Supabase client is now created directly in this file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type UserProfile = { id: string; created_at: string; username: string; referred_by: string | null; balance: number; withdrawal_wallet_address: string | null; };

function UsersContent() {
  const [users, setUsers] = useState<UserProfile[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); const [editingUser, setEditingUser] = useState<UserProfile | null>(null); const [newBalance, setNewBalance] = useState('');
  const fetchUsers = async () => { try { const { data, error } = await supabase.from('profiles').select('*'); if (error) throw error; if (data) setUsers(data); } catch (err: any) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => { fetchUsers(); }, []);
  const handleOpenEditModal = (user: UserProfile) => { setEditingUser(user); setNewBalance(user.balance.toString()); };
  const handleCloseEditModal = () => { setEditingUser(null); setNewBalance(''); };
  const handleUpdateBalance = async () => { if (!editingUser) return; try { const { error } = await supabase.from('profiles').update({ balance: parseFloat(newBalance) }).eq('id', editingUser.id); if (error) throw error; handleCloseEditModal(); fetchUsers(); } catch (err: any) { alert("Error updating balance: " + err.message); } };

  return (
    <div style={{ padding: '4rem', color: 'white' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', borderBottom: '1px solid #374151', paddingBottom: '1rem' }}>Manage Users</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{color: '#f87171'}}>{error}</p>}
      {!loading && !error && (<div style={{ marginTop: '2rem', overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}><thead><tr style={{ borderBottom: '1px solid #374151' }}><th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af' }}>Username</th><th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af' }}>Balance</th><th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af' }}>Referred By</th><th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af' }}>Registration Date</th><th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af' }}>Actions</th></tr></thead><tbody>{users.map((user) => (<tr key={user.id} style={{ borderBottom: '1px solid #374151' }}><td style={{ padding: '1rem', fontWeight: 'bold' }}>{user.username}</td><td style={{ padding: '1rem' }}>${user.balance.toFixed(2)}</td><td style={{ padding: '1rem' }}>{user.referred_by ? user.referred_by : '---'}</td><td style={{ padding: '1rem' }}>{new Date(user.created_at).toLocaleDateString()}</td><td style={{ padding: '1rem' }}><button onClick={() => handleOpenEditModal(user)} style={{backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer'}}>Edit</button></td></tr>))}</tbody></table></div>)}
      {editingUser && (<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ backgroundColor: '#1f2937', padding: '2rem', borderRadius: '12px', width: '400px' }}><h2>Edit User: {editingUser.username}</h2><div style={{margin: '1rem 0'}}><label>Update Balance ($)</label><input type="number" step="0.01" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} style={{width: '100%', padding: '0.75rem', marginTop: '0.5rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '8px', color: 'white'}} /></div><div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}><button onClick={handleUpdateBalance} style={{flex: 1, backgroundColor: '#10b981', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer'}}>Save Changes</button><button onClick={handleCloseEditModal} style={{flex: 1, backgroundColor: '#6b7280', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer'}}>Cancel</button></div></div></div>)}
    </div>
  );
}

export default function UsersPage() { return (<AdminLayout><UsersContent /></AdminLayout>); }