// Full corrected code for pages/plans.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // CORRECTED PATH
import AdminLayout from '../components/AdminLayout';

// ... (rest of the file is the same, but replace all to be safe)
type Plan = { id: number; name: string; min_deposit: number; max_deposit: number; duration_days: number; roi_percentage: number; };
function PlansContent() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [name, setName] = useState(''); const [minDeposit, setMinDeposit] = useState(''); const [maxDeposit, setMaxDeposit] = useState(''); const [duration, setDuration] = useState(''); const [roi, setRoi] = useState('');
  const [loading, setLoading] = useState(true); const [message, setMessage] = useState('');
  const fetchPlans = async () => { setLoading(true); try { const { data, error } = await supabase.from('plans').select('*').order('created_at'); if (error) throw error; if (data) setPlans(data); } catch (err: any) { setMessage('Error: ' + err.message); } finally { setLoading(false); } };
  useEffect(() => { fetchPlans(); }, []);
  const handleCreatePlan = async (e: React.FormEvent) => { e.preventDefault(); setMessage(''); try { const { error } = await supabase.from('plans').insert({ name, min_deposit: parseFloat(minDeposit), max_deposit: parseFloat(maxDeposit), duration_days: parseInt(duration), roi_percentage: parseFloat(roi), }); if (error) throw error; setMessage('Plan created successfully!'); setName(''); setMinDeposit(''); setMaxDeposit(''); setDuration(''); setRoi(''); fetchPlans(); } catch (err: any) { setMessage('Error creating plan: ' + err.message); } };
  const handleDeletePlan = async (planId: number) => { if (window.confirm('Are you sure you want to delete this plan?')) { try { const { error } = await supabase.from('plans').delete().eq('id', planId); if (error) throw error; setMessage('Plan deleted successfully!'); fetchPlans(); } catch (err: any) { setMessage('Error deleting plan: ' + err.message); } } };
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', borderBottom: '1px solid #374151', paddingBottom: '1rem' }}>Manage Investment Plans</h1>
      <div style={{ backgroundColor: '#1f2937', padding: '2rem', borderRadius: '12px', marginTop: '2rem' }}>
        <h2 style={{marginTop: 0}}>Create New Plan</h2>
        <form onSubmit={handleCreatePlan} style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Plan Name (e.g., Gold)" required style={{padding: '0.75rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '8px', color: 'white'}}/>
          <input value={minDeposit} onChange={(e) => setMinDeposit(e.target.value)} type="number" placeholder="Min Deposit ($)" required style={{padding: '0.75rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '8px', color: 'white'}}/>
          <input value={maxDeposit} onChange={(e) => setMaxDeposit(e.target.value)} type="number" placeholder="Max Deposit ($)" required style={{padding: '0.75rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '8px', color: 'white'}}/>
          <input value={duration} onChange={(e) => setDuration(e.target.value)} type="number" placeholder="Duration (Days)" required style={{padding: '0.75rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '8px', color: 'white'}}/>
          <input value={roi} onChange={(e) => setRoi(e.target.value)} type="number" step="0.1" placeholder="ROI (%)" required style={{padding: '0.75rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '8px', color: 'white'}}/>
          <button type="submit" style={{backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer'}}>Create Plan</button>
        </form>
      </div>
      {message && <p style={{ marginTop: '1rem', color: message.startsWith('Error') ? '#f87171' : '#34d399' }}>{message}</p>}
      <div style={{ marginTop: '2rem', overflowX: 'auto' }}><h2 style={{marginTop: 0}}>Existing Plans</h2>{loading ? <p>Loading plans...</p> : (<table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}><thead><tr style={{ borderBottom: '1px solid #374151' }}><th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af' }}>Name</th><th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af' }}>Min-Max Deposit</th><th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af' }}>Duration</th><th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af' }}>ROI</th><th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af' }}>Actions</th></tr></thead><tbody>{plans.map((plan) => (<tr key={plan.id} style={{ borderBottom: '1px solid #374151' }}><td style={{ padding: '1rem' }}>{plan.name}</td><td style={{ padding: '1rem' }}>${plan.min_deposit} - ${plan.max_deposit}</td><td style={{ padding: '1rem' }}>{plan.duration_days} days</td><td style={{ padding: '1rem' }}>{plan.roi_percentage}%</td><td style={{ padding: '1rem' }}><button onClick={() => handleDeletePlan(plan.id)} style={{backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer'}}>Delete</button></td></tr>))}</tbody></table>)}</div>
    </div>
  );
}
export default function PlansPage() { return (<AdminLayout><PlansContent /></AdminLayout>); }