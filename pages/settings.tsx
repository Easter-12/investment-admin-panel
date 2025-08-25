// Full corrected code for pages/settings.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // CORRECTED PATH
import AdminLayout from '../components/AdminLayout';

function SettingsContent() {
  const [settingsId, setSettingsId] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  useEffect(() => { const fetchSettings = async () => { setLoading(true); try { const { data, error } = await supabase.from('settings').select('*').limit(1).single(); if (error) throw error; if (data) { setAddress(data.company_address); setPhone(data.company_phone); setSettingsId(data.id); } } catch (err: any) { setMessage('Error fetching settings: ' + err.message); } finally { setLoading(false); } }; fetchSettings(); }, []);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsId) { setMessage("Error: Cannot save settings. No settings ID found."); return; }
    setLoading(true); setMessage('');
    try {
      const { data, error } = await supabase.from('settings').update({ company_address: address, company_phone: phone }).eq('id', settingsId).select();
      if (error) throw error;
      if (data && data.length > 0) { setMessage('Settings saved successfully!'); } else { setMessage('Notice: No changes were saved.'); }
    } catch (err: any) { setMessage('Error saving settings: ' + err.message); } finally { setLoading(false); }
  };
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', borderBottom: '1px solid #374151', paddingBottom: '1rem' }}>Site Settings</h1>
      <p style={{ color: '#9ca3af', marginTop: '1rem' }}>Update the information that appears in the public website's footer.</p>
      {loading ? (<p style={{ marginTop: '2rem' }}>Loading settings...</p>) : (
        <form onSubmit={handleSave} style={{ marginTop: '2rem', maxWidth: '600px' }}>
          <div style={{ marginBottom: '1.5rem' }}><label style={{ display: 'block', marginBottom: '0.5rem' }}>Company Address</label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '8px', color: 'white' }} /></div>
          <div style={{ marginBottom: '1.5rem' }}><label style={{ display: 'block', marginBottom: '0.5rem' }}>Company Phone Number</label><input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '8px', color: 'white' }} /></div>
          <button type="submit" disabled={loading} style={{ backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>{loading ? 'Saving...' : 'Save Changes'}</button>
        </form>
      )}
      {message && <p style={{ marginTop: '1rem', color: message.startsWith('Error') ? '#f87171' : '#34d399' }}>{message}</p>}
    </div>
  );
}
export default function SettingsPage() { return (<AdminLayout><SettingsContent /></AdminLayout>); }