
import './index.css';
import Pricing from './components/Pricing';
import Marketplace from './components/Marketplace';

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
          <a href="#pricing">Pricing</a>
          <a href="#optimization">Optimization</a>
          <a href="#credits">Credits</a>
        </div>
        <a href="https://github.com/Primers-Corperation/Primora/raw/main/Release_v2.0.0_LiquidGlass/Primora.exe" className="btn-primary" download>Download v2.0.0</a>
</nav>

      <section className="hero">
        <h1 className="glass-title">Absolute Precision.</h1>
        <p>Primora v2.0.0 is here. Re-engineered for peak performance and a premium experience, giving you the ultimate competitive edge.</p>
        <div className="hero-buttons">
          <a href="#features" className="btn-primary explore-btn">Explore Features</a>
          <a href="https://github.com/Primers-Corperation/Primora/raw/main/Release_v2.0.0_LiquidGlass/Primora.exe" className="btn-primary" download>Download v2.0.0</a>
        </div>
      </section>

      <section id="features" className="features">
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

      <Pricing />

      <Marketplace />

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
