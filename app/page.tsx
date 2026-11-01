'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  MapPin, 
  Camera, 
  LogIn, 
  Download, 
  Activity, 
  Radio, 
  AlertTriangle,
  X
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function LandingPage() {
  const router = useRouter();
  
  // Login Modal State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Web PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        throw new Error('Invalid administration password');
      }

      router.push('/admin');
    } catch (error: unknown) {
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Global Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <span className="font-bold text-lg tracking-tight">Road Defect Collector</span>
              <span className="ml-2 text-xs text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded">
                Ga Central Municipal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install Web App</span>
              </button>
            )}

            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition border border-slate-700"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Officer Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-400 text-xs px-3 py-1 rounded-full mb-4 font-medium border border-amber-500/20">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>Civic Infrastructure Pilot Project</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Monitoring Road Infrastructure in Ga Central Municipality
          </h1>
          <p className="text-base md:text-lg text-slate-400 leading-relaxed mb-6">
            An automated, privacy-first platform connecting citizens and municipal engineers to document, verify, and resolve road defects across Sowutuom, Santa Maria, Anyaa, and surrounding areas.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/collect"
              className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-amber-500/20 transition"
            >
              <Camera className="w-5 h-5" />
              <span>Report a Road Defect</span>
            </Link>

            <Link
              href="/reports"
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-6 py-3 rounded-lg transition"
            >
              <MapPin className="w-5 h-5" />
              <span>Public Tracking Map</span>
            </Link>

            <Link
              href="/drone"
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-6 py-3 rounded-lg transition"
            >
              <Activity className="w-5 h-5" />
              <span>Drone AI Pilot</span>
            </Link>
          </div>
        </div>

        {/* Operational Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-bold text-white mb-1">On-Device Privacy Blurring</h3>
            <p className="text-sm text-slate-400">
              Complies with Ghana Data Protection Act (Act 843). Automatically obscures faces and vehicle license plates before images leave your device.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
            <MapPin className="w-6 h-6 text-amber-400 mb-3" />
            <h3 className="font-bold text-white mb-1">Precise GPS & Digital Address</h3>
            <p className="text-sm text-slate-400">
              Captures high-accuracy coordinates and supports GhanaPostGPS digital addresses for rapid assembly engineer dispatch.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
            <Activity className="w-6 h-6 text-sky-400 mb-3" />
            <h3 className="font-bold text-white mb-1">Transparent Maintenance Tracking</h3>
            <p className="text-sm text-slate-400">
              Tracks the full repair lifecycle with before, in-progress, and after inspection photo timelines.
            </p>
          </div>
        </div>
      </main>

      {/* Integrated Municipal Administrator Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button
              onClick={() => {
                setShowLoginModal(false);
                setLoginError('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">GCMA Officer Sign-in</h2>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Enter your municipal supervisor key to access triage queues, reviews, and maintenance tracking.
            </p>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Access Key / Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              {loginError && (
                <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800 px-3 py-2 rounded-md">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying...' : 'Sign In to Review Portal'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        Pentecost University — Dept. of Industrial Software Engineering &bull; Ga Central Municipal Assembly Partnership
      </footer>
    </div>
  );
}