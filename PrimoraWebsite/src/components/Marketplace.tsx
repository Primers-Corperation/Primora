import React, { useState } from 'react';

const CONTROLLERS = ['All', 'DualSense', 'DualShock 4', 'Xbox Elite', 'Xbox One', '8BitDo'];

const PLACEHOLDER_PROFILES = [
  { id: '1', creatorName: 'ProPlayer_KZ', profileName: 'Warzone Zero Recoil', controllerType: 'DualSense', price: 2.99, downloadCount: 1420 },
  { id: '2', creatorName: 'AimLab_Ghost', profileName: 'Apex Legends Precision', controllerType: 'Xbox Elite', price: 1.99, downloadCount: 987 },
  { id: '3', creatorName: 'NeuralDrifter', profileName: 'Elden Ring Liquid Motion', controllerType: 'DualShock 4', price: 0, downloadCount: 3201 },
  { id: '4', creatorName: 'TacticalEdge', profileName: 'Ranked Ranked Grind v3', controllerType: 'DualSense', price: 3.99, downloadCount: 654 },
  { id: '5', creatorName: 'SilkStick', profileName: 'FPS Universal Response', controllerType: 'Xbox One', price: 0, downloadCount: 2108 },
  { id: '6', creatorName: 'ProPlayer_KZ', profileName: 'Warzone Sniper Tune', controllerType: 'DualSense', price: 1.99, downloadCount: 876 },
];

const Marketplace = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = PLACEHOLDER_PROFILES.filter(p => {
    const matchSearch = p.profileName.toLowerCase().includes(search.toLowerCase()) ||
                        p.creatorName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.controllerType === filter;
    return matchSearch && matchFilter;
  });

  return (
    <section id="marketplace" style={{ padding: '6rem 2rem' }}>
      <h2 style={{
        textAlign: 'center', fontSize: '3.5rem', fontWeight: 800,
        background: 'linear-gradient(180deg, #fff 0%, #94a3b8 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: '1rem'
      }}>
        Profile Marketplace
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginBottom: '3rem', fontSize: '1.1rem' }}>
        Download pro-tuned configs. Publish your own. Earn from your edge.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Search profiles or creators..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '0.75rem 1.25rem', color: '#fff',
            fontSize: '0.95rem', width: '320px', outline: 'none'
          }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {CONTROLLERS.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer',
              border: filter === c ? '1px solid #fff' : '1px solid rgba(255,255,255,0.15)',
              background: filter === c ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: filter === c ? '#fff' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.2s ease'
            }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        {filtered.map(profile => (
          <div key={profile.id} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '1.5rem',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
            transition: 'border-color 0.3s ease, transform 0.3s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{
                fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)'
              }}>{profile.controllerType}</span>
              <span style={{
                fontSize: '1rem', fontWeight: 700,
                color: profile.price === 0 ? '#4ade80' : '#fff'
              }}>
                {profile.price === 0 ? 'Free' : `$${profile.price.toFixed(2)}`}
              </span>
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '1rem', margin: 0, color: '#fff' }}>{profile.profileName}</p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>by {profile.creatorName}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>↓ {profile.downloadCount.toLocaleString()}</span>
              <button style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px', padding: '0.4rem 1rem', color: '#fff',
                fontSize: '0.85rem', cursor: 'pointer'
              }}>
                {profile.price === 0 ? 'Download' : 'Buy'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Marketplace;
