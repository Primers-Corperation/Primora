const Pricing = () => {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      features: ['Neuro-Kinetic Profiles', 'Community Support', 'Standard Macros'],
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$4.99/mo',
      features: ['Cloud Sync', 'Neuro-Kinetic Profiles', 'Analytics Dashboard', 'Priority Support'],
      highlight: true,
    },
    {
      name: 'Elite',
      price: '$9.99/mo',
      features: ['Analytics Dashboard', 'Cloud Sync', 'Tournament Macros', 'Hardware Audit Certificate'],
      highlight: false,
    }
  ];

  return (
    <section id="pricing" className="pricing">
      <h2 className="section-title">Scale Your Performance</h2>
      <div className="pricing-grid">
        {tiers.map((tier) => (
          <div key={tier.name} className={`pricing-card glass-panel ${tier.highlight ? 'recommended' : ''}`}>
            {tier.highlight && <div className="badge">Recommended</div>}
            <h3 className="tier-name">{tier.name}</h3>
            <div className="price">{tier.price}</div>
            <ul className="tier-features">
              {tier.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <button className={`btn-primary ${!tier.highlight ? 'explore-btn' : ''}`}>
              Get Started
            </button>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          padding: 2rem 0;
        }
        .pricing-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          position: relative;
        }
        .recommended {
          border-color: var(--accent) !important;
          background: rgba(255, 255, 255, 0.08) !important;
          transform: scale(1.05);
        }
        .badge {
          position: absolute;
          top: -12px;
          background: var(--accent);
          color: var(--primary-bg);
          padding: 2px 12px;
          font-weight: 800;
          font-size: 0.7rem;
          text-transform: uppercase;
          border-radius: 20px;
        }
        .tier-name {
          font-size: 1.5rem;
          font-weight: 300;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .price {
          font-size: 2.5rem;
          font-weight: 800;
        }
        .tier-features {
          list-style: none;
          padding: 0;
          text-align: center;
          color: var(--text-dim);
          line-height: 2;
        }
        .section-title {
          text-align: center;
          font-size: 3rem;
          margin-bottom: 3rem;
        }
      `}} />
    </section>
  );
};

export default Pricing;
