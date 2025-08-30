import Link from 'next/link';

export default function Sidebar() {
  return (
    <div style={{ width: '250px', backgroundColor: '#1f2937', padding: '2rem 1rem', height: '100vh', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', paddingBottom: '1.5rem', borderBottom: '1px solid #374151', marginBottom: '2rem' }}>Admin Menu</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li><Link href="/dashboard"><div style={{ padding: '1rem', borderRadius: '8px', cursor: 'pointer', color: 'white' }}>Dashboard</div></Link></li>
        <li><Link href="/users"><div style={{ padding: '1rem', borderRadius: '8px', cursor: 'pointer', color: 'white' }}>Manage Users</div></Link></li>
        <li><Link href="/withdrawals"><div style={{ padding: '1rem', borderRadius: '8px', cursor: 'pointer', color: 'white' }}>Manage Withdrawals</div></Link></li>
        <li><Link href="/settings"><div style={{ padding: '1rem', borderRadius: '8px', cursor: 'pointer', color: 'white' }}>Site Settings</div></Link></li>
        <li><Link href="/plans"><div style={{ padding: '1rem', borderRadius: '8px', cursor: 'pointer', color: 'white' }}>Manage Plans</div></Link></li>
        <li><Link href="/wallets"><div style={{ padding: '1rem', borderRadius: '8px', cursor: 'pointer', color: 'white' }}>Manage Wallets</div></Link></li>
        <li><Link href="/chat"><div style={{ padding: '1rem', borderRadius: '8px', cursor: 'pointer', color: 'white' }}>Live Chat</div></Link></li>
      </ul>
    </div>
  );
}