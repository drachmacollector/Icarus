// src/pages/risk.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import RiskDashboard from '../components/RiskDashboard';
import useFlareData from '../hooks/useFlareData';
import { AlignCenter } from 'lucide-react';

export default function RiskPage() {
  const { flares, loading, error } = useFlareData();

  if (loading) return <div style={{ textAlign:'center' ,color: 'white', padding: '1rem' }}>Loading risk data...</div>;
  if (error) return <div style={{ color: 'red', padding: '1rem' }}>Error: {error}</div>;

  return (
    <div style={{ textAlign: 'center', padding: '1rem', background: '#000', minHeight: '100vh', color: 'white', position: 'relative' }}>
      <h1>Risk Dashboard</h1>
      <RiskDashboard flares={flares} />

{/* ✅ Glassmorphic Home Button (Floating Bottom-Left) */}
<Link to="/" style={{ position: 'fixed', bottom: '1rem', left: '1rem', zIndex: 1000 }}>
  <button
    style={{
      padding: '0.5rem 1.2rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#fff',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      cursor: 'pointer',
      transition: '0.3s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
    }}
  >
    🌞 Flares
  </button>
</Link>

    </div>
  );
}
