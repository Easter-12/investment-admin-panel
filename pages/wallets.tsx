// Full corrected code for pages/wallets.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // CORRECTED PATH
import AdminLayout from '../components/AdminLayout';

// ... (rest of the file is the same, but replace all to be safe)
type Wallet = { id: number; crypto_name: string; crypto_symbol: string; wallet_address: string; };
function WalletsContent() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [cryptoName, setCryptoName] = useState(''); const [cryptoSymbol, setCryptoSymbol] = useState(''); const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(true); const [message, setMessage] = useState('');
  const fetchWallets = async () => { setLoading(true); try { const { data, error } = await supabase.from('wallets').select('*').order('created_at'); if (error) throw error; if (data) setWallets(data); } catch (err: any) { setMessage('Error: ' + err.message); } finally { setLoading(false); } };
  useEffect(() => { fetchWallets(); }, []);
  const handleCreateWallet = async (e: React.FormEvent) => { e.preventDefault(); setMessage(''); try { const { error } = await supabase.from('wallets').insert({ crypto_name: cryptoName, crypto_symbol: cryptoSymbol, wallet_address: walletAddress, }); if (error) throw error; setMessage('Wallet created successfully!'); setCryptoName(''); setCryptoSymbol(''); setWalletAddress(''); fetchWallets(); } catch (err: any) { setMessage('Error creating wallet: ' + err.message); } };
  const handleDeleteWallet = async (walletId: number) => { if (window.confirm('Are you sure you want to delete this wallet?')) { try { const { error } = await supabase.from('wallets').delete().eq('id', walletId); if (error) throw error; setMessage('Wallet deleted successfully!'); fetchWallets(); } catch (err: any) { setMessage('Error deleting wallet: ' + err.message); } } };
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', borderBottom: '1px solid #374151', paddingBottom: '1rem' }}>Manage Deposit Wallets</h1>
      <div style={{ backgroundColor: '#1f2937', padding: '2rem', borderRadius: '12px', marginTop: '2rem' }}>
        <h2 style={{marginTop: 0}}>Add New Wallet</h2>
        <form onSubmit={handleCreateWallet} style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <input value={cryptoName} onChange={(e) => setCryptoName(e.target.value)} placeholder="Crypto Name (e.g., Bitcoin)" required style={{padding: '0.75rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '8px', color: 'white'}}/>
          <input value={cryptoSymbol} onChange={(e) => setCryptoSymbol(e.target.value)} placeholder="Symbol (e.g., BTC)" required style={{padding: '0.75rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '8px', color: 'white'}}/>
          <input value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder="Wallet Address" required style={{padding: '0.75rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '8px', color: 'white', gridColumn: 'span 2'}}/>
          <button type="submit" style={{backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer'}}>Add Wallet</button>
        </form>
      </div>
      {message && <p style={{ marginTop: '1rem', color: message.startsWith('Error') ? '#f87171' : '#34d399' }}>{message}</p>}
      <div style={{ marginTop: '2rem', overflowX: 'auto' }}><h2 style={{marginTop: 0}}>Existing Wallets</h2>{loading ? <p>Loading wallets...</p> : (<table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}><thead><tr style={{ borderBottom: '1px solid #374151' }}><th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af' }}>Name</th><th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af' }}>Symbol</th><th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af' }}>Address</th><th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af' }}>Actions</th></tr></thead><tbody>{wallets.map((wallet) => (<tr key={wallet.id} style={{ borderBottom: '1px solid #374151' }}><td style={{ padding: '1rem' }}>{wallet.crypto_name}</td><td style={{ padding: '1rem' }}>{wallet.crypto_symbol}</td><td style={{ padding: '1rem', fontFamily: 'monospace' }}>{wallet.wallet_address}</td><td style={{ padding: '1rem' }}><button onClick={() => handleDeleteWallet(wallet.id)} style={{backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer'}}>Delete</button></td></tr>))}</tbody></table>)}</div>
    </div>
  );
}
export default function WalletsPage() { return (<AdminLayout><WalletsContent /></AdminLayout>); }