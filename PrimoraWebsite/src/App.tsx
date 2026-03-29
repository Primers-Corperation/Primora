
import './index.css';

const App = () => {
  return (
    <div className="container">
      <div className="hero-mesh"></div>
      
      <nav>
        <div className="logo-container">
          <img src="/primora_icon.png" alt="Primora Icon" />
          <span className="logo-text">Primora</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#optimization">Optimization</a>
          <a href="#credits">Credits</a>
        </div>
        <a href="https://github.com/Primers-Corperation/Primora/releases/tag/v1.1.0" className="btn-primary">Download v1.1.0</a>
      </nav>

      <section className="hero">
        <h1 className="glass-title">Liquid Glass UI.<br/>Neuro-Kinetic Precision.</h1>
        <p>Primora v1.1.0 is here. Re-engineered with ultra-low latency signal filtering and the premium Liquid Glass aesthetic for the ultimate competitive edge.</p>
        <div className="hero-buttons">
          <a href="#features" className="btn-primary explore-btn">Explore Features</a>
          <a href="https://github.com/Primers-Corperation/Primora/releases/tag/v1.1.0" className="btn-primary">Download v1.1.0</a>
        </div>
      </section>

      <section id="features" className="features">
        <div className="feature-card glass-panel">
          <h3>Neuro-Kinetic Filter</h3>
          <p>Adaptive signal smoothing via second-order EMA algorithm. Eliminates hardware variance for pinpoint accuracy in every frame.</p>
        </div>
        <div className="feature-card glass-panel">
          <h3>Liquid Glass UI</h3>
          <p>A premium, minimalist experience inspired by iOS 26. Ultra-thin glass borders, monochrome clarity, and dynamic background breathing.</p>
        </div>
        <div className="feature-card glass-panel">
          <h3>Hardware Integrity audit</h3>
          <p>Quantitative component health diagnostic. Detect mechanical wear and sensor fatigue before it impacts your performance.</p>
        </div>
        <div className="feature-card glass-panel">
          <h3>Universal peripheral Stack</h3>
          <p>Deep native support for DualSense, DS4, Switch Pro, and Joycon peripherals with advanced haptic and gyro mapping.</p>
        </div>
      </section>

      <section id="optimization" className="intel-section">
        <h2 className="intel-h2">Primers Corperation Intelligence</h2>
        <p className="intel-p">Our mission is to bridge the gap between human intent and digital execution. Primora is built on the foundations of the open-source community, with a focused evolution toward modern hardware synergy.</p>
      </section>

      <footer id="credits">
        <div className="footer-brand">
          <span className="footer-logo">Primora</span>
          <p className="footer-copyright">© 2026 Primers Corperation. All Rights Reserved.</p>
        </div>
        <p className="footer-credits">Built with respect for the original open-source visionaries including Ryochan7, Jays2Kings, and the global DS4Windows community.</p>
      </footer>
    </div>
  );
};

export default App;
