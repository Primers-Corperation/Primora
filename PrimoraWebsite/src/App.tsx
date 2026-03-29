
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
        <a href="https://github.com/Primers-Corperation/Primora/releases/tag/v1.0.0" className="btn-primary">Download v1.0.0</a>
      </nav>

      <section className="hero">
        <img src="/primora_logo.png" alt="Primora Banner" className="hero-banner" />
        <h1>Beyond Emulation.<br/>Engineered Precision.</h1>
        <p>Primora is the premium successor to legacy gamepad mapping tools. Re-engineered for reliability, performance, and cutting-edge intelligence by the Primers Corperation.</p>
        <div className="hero-buttons">
          <a href="#features" className="btn-primary explore-btn">Explore Features</a>
          <a href="https://github.com/Primers-Corperation/Primora/releases/tag/v1.0.0" className="btn-primary">Get Primora</a>
        </div>
      </section>

      <section id="features" className="features">
        <div className="feature-card">
          <h3>Neural Stick Optimizer</h3>
          <p>Proprietary AI-driven baseline calibration eliminates hardware jitter and suggests the ideal deadzone for your specific controller sensor wear.</p>
        </div>
        <div className="feature-card">
          <h3>Hyper-Response Latency</h3>
          <p>Optimized polling and priority handling ensure every millisecond counts, providing the fastest response times for competitive gaming.</p>
        </div>
        <div className="feature-card">
          <h3>Smart Profile Logic</h3>
          <p>Advanced automatic profile switching that intelligently adapts to your active game, controller battery, and system resource state.</p>
        </div>
        <div className="feature-card">
          <h3>Universal peripheral Stack</h3>
          <p>Deep native support for DualSense, DualShock 4, Nintendo Switch, and Joycon peripherals with advanced gyro and haptic mapping.</p>
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
