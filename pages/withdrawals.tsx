import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // CORRECTED IMPORT
import AdminLayout from '../components/AdminLayout';
import emailjs from '@emailjs/browser';

// ... (The rest of the code is the same as the last correct version)
type WithdrawalRequest = { id: number; created_at: string; user_id: string; amount: number; wallet_address: string; status: 'pending' | 'approved' | 'rejected'; profiles: { username: string; email: string; } };

function WithdrawalsContent() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]); const [loading, setLoading] = useState(true); const [message, setMessage] = useState('');
  const fetchRequests = async () => { setLoading(true); try { const { data, error } = await supabase.from('withdrawals').select('*, profiles(username, email)').order('created_at', { ascending: false }); if (error) throw error; if (data) setRequests(data as WithdrawalRequest[]); } catch (err: any) { setMessage('Error: ' + err.message); } finally { setLoading(false); } };
  useEffect(() => { fetchRequests(); }, []);
  const handleUpdateRequest = async (requestId: number, newStatus: 'approved' | 'rejected') => {
    const request = requests.find(r => r.id === requestId); if (!request) return;
    if (newStatus === 'approved') {
      try {
        const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID; const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID; const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
        if (!serviceID || !templateID || !publicKey) { throw new Error("EmailJS keys are missing or not loaded. Check Vercel Environment Variables."); }
        await supabase.rpc('approve_withdrawal', { request_id: requestId, user_id_to_update: request.user_id, amount_to_subtract: request.amount });
        const templateParams = { username: request.profiles.username, amount: request.amount.toFixed(2), to_email: request.profiles.email, from_name: "QuantumLeap Support", };
        await emailjs.send(serviceID, templateID, templateParams, publicKey);
        setMessage('Withdrawal approved and confirmation email sent!'); fetchRequests();
      } catch (err: any) { console.error("DETAILED ERROR:", err); setMessage('Error: ' + (err.text || err.message)); }
    } else { try { await supabase.from('withdrawals').update({ status: 'rejected' }).eq('id', requestId); setMessage('Withdrawal rejected.'); fetchRequests(); } catch (err: any) { setMessage('Error rejecting withdrawal: ' + err.message); } }
  };
  return (
    <div style={{ color: 'white' }}>
      <h1>Manage Withdrawals</h1>
      {message && <p style={{ marginTop: '1rem', color: message.startsWith('Error') ? '#f87171' : '#34d399' }}>{message}</p>}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="table-container">
          {loading ? <p>Loading requests...</p> : (
            <table>
              <thead><tr><th>User</th><th>Amount</th><th>Wallet Address</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.profiles.username}</td><td>${req.amount.toFixed(2)}</td><td style={{fontFamily: 'monospace', fontSize: '0.8rem'}}>{req.wallet_address}</td><td>{new Date(req.created_at).toLocaleString()}</td>
                    <td><span style={{padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 'bold', color: 'white', backgroundColor: req.status === 'pending' ? '#ca8a04' : req.status === 'approved' ? '#16a34a' : '#dc2626'}}>{req.status}</span></td>
                    <td>{req.status === 'pending' && (<div style={{display: 'flex', gap: '0.5rem'}}><button onClick={() => handleUpdateRequest(req.id, 'approved')} style={{backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer'}}>Approve</button><button onClick={() => handleUpdateRequest(req.id, 'rejected')} style={{backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer'}}>Reject</button></div>)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
export default function WithdrawalsPage() { return (<AdminLayout><WithdrawalsContent /></AdminLayout>); }