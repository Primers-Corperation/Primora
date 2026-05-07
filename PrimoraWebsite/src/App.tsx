import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GamepadSection from './components/GamepadSection';
import NeuralSection from './components/NeuralSection';
import Features from './components/Features';
import Stats from './components/Stats';
import Pricing from './components/Pricing';
import Marketplace from './components/Marketplace';
import Footer from './components/Footer';
import './index.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <div
        className="transition-opacity duration-700"
        style={{ opacity: isLoading ? 0 : 1 }}
      >
        <Navbar />
        <main>
          <Hero />
          <GamepadSection />
          <NeuralSection />
          <Features />
          <Stats />
          <Pricing />
          <Marketplace />
        </main>
        <Footer />
      </div>
    </>
  );
}
