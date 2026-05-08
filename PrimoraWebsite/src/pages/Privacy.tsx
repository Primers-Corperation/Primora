import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LAST_UPDATED = 'May 8, 2026';

const sections = [
  {
    id: 'overview',
    title: '1. Overview',
    body: `Primora ("we", "our", or "us") is a free, open-source desktop application developed by Primers Corporation. This Privacy Statement explains what information Primora collects, how it is used, and the choices available to you. We are committed to handling any information with transparency and respect for your privacy.`,
  },
  {
    id: 'app-data',
    title: '2. Desktop Application — Data Handling',
    body: `Primora operates entirely on your local machine. The application does not transmit controller input data, button mappings, profiles, or any gameplay-related information to our servers or any third party.\n\nThe following data remains stored locally on your device only:\n• Controller input streams and calibration values\n• Custom profiles and button mapping configurations\n• Mechanical health scores and analytics (drift, chatter, latency metrics)\n• License tier information (Free / Pro / Elite)\n• Application preferences and settings\n\nNone of this data leaves your device unless you explicitly export it yourself.`,
  },
  {
    id: 'telemetry',
    title: '3. Telemetry & Crash Reports',
    body: `Primora does not collect telemetry, usage analytics, or crash reports automatically. No background data collection occurs. If a future version introduces optional diagnostic reporting, it will be strictly opt-in with a clear, prominent consent prompt before any data is sent.`,
  },
  {
    id: 'website',
    title: '4. This Website (primora-website.vercel.app)',
    body: `The Primora marketing website is hosted on Vercel. When you visit this site, Vercel's infrastructure may log standard server-access data such as IP addresses, browser type, operating system, referrer URLs, and page visit timestamps for the purpose of serving content and maintaining security. This data is governed by Vercel's own privacy policy (vercel.com/legal/privacy-policy).\n\nWe do not use third-party analytics scripts (e.g., Google Analytics), advertising trackers, or retargeting pixels on this site. No cookies are set by us beyond what is technically necessary to serve the page.`,
  },
  {
    id: 'github',
    title: '5. GitHub & Release Downloads',
    body: `Primora's source code and release binaries are hosted on GitHub (github.com/Primers-Corperation/Primora). When you download a release, GitHub may log your IP address and browser information in accordance with GitHub's Privacy Statement (docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement). We do not receive or store this information.`,
  },
  {
    id: 'third-party',
    title: '6. Third-Party Components',
    body: `Primora installs and integrates with the following third-party drivers and runtimes on your machine:\n• ViGEmBus (Nefarius Software Solutions) — virtual gamepad driver\n• Microsoft .NET 8 Desktop Runtime\n• Microsoft Visual C++ Redistributable\n\nThese components are governed by their respective licenses and privacy policies. Primora does not share your data with any of these providers.`,
  },
  {
    id: 'children',
    title: '7. Children\'s Privacy',
    body: `Primora is not directed at children under the age of 13. We do not knowingly collect any personal information from children. If you believe a child has submitted personal information to us, please contact us at the address below and we will promptly delete it.`,
  },
  {
    id: 'security',
    title: '8. Security',
    body: `Because Primora does not transmit or store personal data on our servers, the attack surface for data breaches is minimal. The desktop application operates with the permissions required to read from HID/Bluetooth controller devices and write to virtual gamepad drivers. We recommend downloading Primora only from the official GitHub release page or from this website to avoid tampered builds.`,
  },
  {
    id: 'changes',
    title: '9. Changes to This Statement',
    body: `We may update this Privacy Statement from time to time. When we do, we will revise the "Last Updated" date at the top of this page and, for material changes, note them in the release notes of the corresponding version. Continued use of Primora after changes are posted constitutes acceptance of the updated statement.`,
  },
  {
    id: 'contact',
    title: '10. Contact',
    body: `If you have any questions, concerns, or requests regarding this Privacy Statement, please contact us:\n\nEmail: primerscorperation@gmail.com\nProject: github.com/Primers-Corperation/Primora`,
  },
];

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Privacy Statement — Primora';
    return () => { document.title = 'Primora'; };
  }, []);

  return (
    <div className="min-h-screen bg-bg text-fg font-sans">

      {/* Minimal nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b border-stroke/40 bg-bg/80 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className="w-7 h-7 rounded-full p-[1.5px] flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #89AACC, #4E85BF)' }}
          >
            <div className="w-full h-full rounded-full bg-bg flex items-center justify-center overflow-hidden">
              <img src="/primora_icon.png" alt="Primora" className="w-4 h-4 object-contain" />
            </div>
          </div>
          <span className="font-display italic text-sm text-fg/80 group-hover:text-fg transition-colors tracking-tight">
            Primora
          </span>
        </Link>
        <Link
          to="/"
          className="text-xs text-dim hover:text-fg transition-colors border border-stroke hover:border-fg/20 rounded-full px-4 py-1.5"
        >
          ← Back to site
        </Link>
      </nav>

      {/* Content */}
      <main className="max-w-[760px] mx-auto px-6 md:px-10 pt-32 pb-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-14"
        >
          <p className="text-[10px] text-dim uppercase tracking-[0.4em] mb-4 font-sans">
            Legal · Primers Corporation
          </p>
          <h1 className="font-display italic text-4xl md:text-5xl leading-tight mb-4">
            Privacy Statement
          </h1>
          <p className="text-sm text-dim">
            Last updated: <span className="text-fg/70">{LAST_UPDATED}</span>
          </p>
          <div className="mt-6 h-px w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </motion.div>

        {/* Intro callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-xl border border-stroke/60 p-5 mb-12"
          style={{ background: 'rgba(78,133,191,0.05)' }}
        >
          <p className="text-sm text-fg/80 leading-relaxed">
            <span className="font-medium text-fg">Short version:</span>{' '}
            Primora is a local desktop app. Your controller data, profiles, and mappings
            never leave your machine. We don't run analytics, we don't sell data,
            and we don't have accounts. This page explains the full picture.
          </p>
        </motion.div>

        {/* Table of contents */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-12"
        >
          <p className="text-[10px] text-dim uppercase tracking-[0.35em] mb-3">Contents</p>
          <ul className="space-y-1">
            {sections.map(s => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-dim hover:text-fg transition-colors"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((s, i) => (
            <motion.section
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.03 }}
            >
              <h2 className="font-display italic text-xl md:text-2xl text-fg mb-4 leading-snug">
                {s.title}
              </h2>
              {s.body.split('\n').map((line, j) =>
                line.startsWith('•') ? (
                  <p key={j} className="text-sm text-dim/90 leading-relaxed pl-4 mb-1">
                    {line}
                  </p>
                ) : line.trim() === '' ? (
                  <div key={j} className="h-2" />
                ) : (
                  <p key={j} className="text-sm text-dim/90 leading-relaxed mb-2">
                    {line}
                  </p>
                )
              )}
            </motion.section>
          ))}
        </div>

        {/* Footer strip */}
        <div className="mt-16 pt-8 border-t border-stroke/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-display italic text-fg/70 text-sm">Primora</p>
            <p className="text-xs text-dim mt-0.5">© 2026 Primers Corporation. All Rights Reserved.</p>
          </div>
          <Link
            to="/"
            className="text-xs text-dim hover:text-fg transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </main>
    </div>
  );
}
