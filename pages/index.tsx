// Full corrected code for pages/index.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Corrected Path

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#111827', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', color: 'white', fontSize: '1.8rem', marginBottom: '2rem' }}>Admin Panel Login</h1>
        <form onSubmit={handleLogin}>
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', color: '#cbd5e1', marginBottom: '0.5rem'}}>Admin Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your admin email" style={{width: '100%', padding: '0.75rem 1rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '8px', color: 'white', fontSize: '1rem'}} required />
          </div>
          <div>
            <label style={{display: 'block', color: '#cbd5e1', marginBottom: '0.5rem'}}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" style={{width: '100%', padding: '0.75rem 1rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '8px', color: 'white', fontSize: '1rem'}} required />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '2rem', backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        {error && <p style={{ color: '#f87171', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
      </div>
    </div>
  );
}