'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  MapPin,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Store,
  CheckCircle2,
  TrendingUp,
  BadgePercent,
  Megaphone,
  Truck,
  Star,
  Leaf,
  Sparkles,
  BadgeCheck,
  Headset,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from './hooks/authStore';
import {
  fetchLoginStage,
  requestPasswordInvite,
  STAGE_MESSAGES,
} from './components/auth/authClient';

const PROMOS = [
  {
    icon: BadgePercent,
    tag: 'Target',
    title: 'Vendor Onboarding Drive',
    desc: 'Onboard 10 vendors this month · area bonus credited automatically.',
  },
  {
    icon: Megaphone,
    tag: 'Live',
    title: 'Campaign Blitz',
    desc: 'Push banners + offers to every vendor mapped to your area.',
  },
  {
    icon: Truck,
    tag: 'New',
    title: 'Delivery Sync',
    desc: 'Assign riders, track live trips and close the day clean.',
    mehndi: true,
  },
];

const STATS = [
  { value: '320+', label: 'Vendors mapped' },
  { value: '4.8', label: 'Ops score', star: true },
  { value: '45', label: 'Areas live' },
];

const AreaManagerLogin = () => {
  const router = useRouter();
  const identifier = useRef('');
  const password = useRef('');
  const [successMessage, setSuccessMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [promoIndex, setPromoIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPromoIndex((i) => (i + 1) % PROMOS.length), 4200);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');
    setNotice('');
    setSuccessMessage('');

    const identifierValue = identifier.current.trim();
    const passwordValue = password.current;

    if (!identifierValue) {
      setError('Enter your registered e-mail or mobile number.');
      setIsSubmitting(false);
      return;
    }
    if (!passwordValue) {
      setError('Enter your password.');
      setIsSubmitting(false);
      return;
    }

    try {
      // State-first: the identifier alone tells us which stage the manager is
      // at, so the right prompt appears before we check credentials.
      const state = await fetchLoginStage(identifierValue);

      if (state === 'email_not_verified' || state === 'not_approved' || state === 'inactive') {
        setError(STAGE_MESSAGES[state]);
        return;
      }

      if (state === 'password_not_set') {
        if (identifierValue.includes('@')) {
          await requestPasswordInvite(identifierValue);
          setNotice(
            "Your account is approved but has no password yet. We've just e-mailed you a secure link to create one — check your inbox, then sign in.",
          );
        } else {
          setNotice(
            'Your account is approved but has no password yet. Enter your registered e-mail above and tap “Forgot password?” to get the setup link.',
          );
        }
        return;
      }

      const res = await signIn('credentials', {
        redirect: false,
        email: identifierValue,
        mobile: identifierValue,
        password: passwordValue,
      });

      if (!res || res.error) {
        setError('Invalid credentials. Please check your e-mail / mobile and password.');
        return;
      }

      setSuccessMessage('Pranam! Welcome back to your console.');
      useAuthStore.setState({
        user: {
          id: '',
          name: identifierValue.includes('@')
            ? identifierValue.split('@')[0]
            : identifierValue,
          email: identifierValue,
          role: 'area_manager',
        },
        isAuthenticated: true,
        loginError: null,
      });
      setTimeout(() => router.push('/dashboard'), 900);
    } catch {
      setError('Sign-in failed. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgot = async () => {
    setError('');
    setNotice('');

    const value = identifier.current.trim();
    if (!value || !value.includes('@')) {
      setError('Enter your registered e-mail above to receive a password link.');
      return;
    }

    setNotice(await requestPasswordInvite(value));
  };

  const promo = PROMOS[promoIndex] ?? PROMOS[0];
  if (!promo) return null;

  return (
    <div className="min-h-screen bg-background font-body flex flex-col">
      {/* Top promo strip */}
      <div className="bg-secondary-900 border-b-2 border-accent-400 px-6 py-2.5 text-center">
        <p className="text-accent-300 text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-400" />
          Area Manager console · vendor onboarding, ops &amp; delivery sync
          <span className="hidden sm:inline-block bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
            Ops live
          </span>
        </p>
      </div>

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* LEFT: Promo / marketing showcase */}
        <div className="lg:w-[54%] bg-secondary-900 text-secondary-50 p-8 sm:p-12 lg:p-14 flex flex-col justify-center relative overflow-hidden">
          {/* glows — all centralized tokens */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary-600/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-28 -left-24 w-96 h-96 bg-mehndi-600/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-10 w-40 h-40 bg-accent-400/15 rounded-full blur-2xl" />

          <div className="relative z-10 space-y-8 max-w-xl w-full mx-auto">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent-400 border-2 border-secondary-950 rounded-2xl flex items-center justify-center shadow-lg">
                <Store className="w-6 h-6 text-secondary-900" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-black tracking-tight italic leading-none">
                  Apni <span className="text-accent-400 uppercase not-italic">Desi Dukaan</span>
                </h1>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-secondary-300 mt-1">
                  Area Manager console · Ground ops
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold leading-[1.05]">
                Apna Area, <br />
                <span className="text-accent-400 italic">Apni Command!</span>
              </h2>
              <p className="text-secondary-200 text-base sm:text-lg font-medium max-w-md">
                Vendors, orders aur delivery — sab kuch ek hi area console mein.
              </p>
            </div>

            {/* Rotating promo card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 sm:p-6 min-h-[148px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={promoIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-accent-400 flex items-center justify-center">
                    <promo.icon className="w-6 h-6 text-secondary-900" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={
                          promo.mehndi
                            ? 'bg-mehndi-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full'
                            : 'bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full'
                        }
                      >
                        {promo.tag}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-accent-300">
                        Promo {promoIndex + 1}/{PROMOS.length}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold mt-1.5">{promo.title}</h3>
                    <p className="text-secondary-200 text-sm font-medium mt-1">{promo.desc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="flex items-center gap-2 mt-4">
                {PROMOS.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Show promo ${i + 1}`}
                    onClick={() => setPromoIndex(i)}
                    className={
                      i === promoIndex
                        ? 'h-2 w-8 rounded-full bg-accent-400 transition-all'
                        : 'h-2 w-2 rounded-full bg-white/25 hover:bg-white/50 transition-all'
                    }
                  />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-center"
                >
                  <p className="font-display text-2xl font-black text-accent-300 flex items-center justify-center gap-1">
                    {s.value}
                    {s.star && <Star className="w-4 h-4 fill-accent-400 text-accent-400" />}
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-secondary-300 mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Testimonial + pills */}
            <div className="flex items-center gap-3 bg-mehndi-950/60 border border-mehndi-600/40 rounded-2xl p-4">
              <div className="w-10 h-10 rounded-full bg-mehndi-600 text-white font-display font-black flex items-center justify-center shrink-0">
                P
              </div>
              <p className="text-sm font-medium text-mehndi-100">
                “Mere area ke 60 vendors ek dashboard se manage ho jaate hain — leads,
                delivery, sab sync.”{' '}
                <span className="text-mehndi-300 font-bold">— Priya, Area Manager, Lucknow</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {[
                { icon: TrendingUp, label: 'Zyada Kamayi' },
                { icon: MapPin, label: 'Area Ops' },
                { icon: Leaf, label: 'Desi Network' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-2 rounded-full"
                >
                  <item.icon className="w-4 h-4 text-accent-400" />
                  <span className="text-sm font-bold tracking-wide">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Login */}
        <div className="lg:w-[46%] flex items-center justify-center p-6 sm:p-10 bg-background">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="bg-background-section rounded-3xl border-2 border-secondary-900 p-8 sm:p-10 shadow-[8px_8px_0px_var(--color-secondary-900)]">
              <div className="mb-8">
                <span className="inline-block bg-accent-100 text-accent-700 border border-accent-300 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Namaste manager
                </span>
                <h3 className="font-display text-3xl font-black text-secondary-900 mt-3">
                  Area Manager Login
                </h3>
                <p className="text-secondary-text mt-1.5 font-medium">
                  Welcome back! Apna area console mein login karo.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary-700 uppercase tracking-widest ml-1">
                    Mobile / Email
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary-600 transition-colors" />
                    <input
                      required
                      onChange={(e) => (identifier.current = e.target.value)}
                      type="text"
                      placeholder="Enter registered e-mail / number"
                      className="w-full pl-12 pr-4 py-3.5 bg-secondary-50 border-2 border-secondary-200 rounded-2xl text-primary-text outline-none focus:border-primary-600 focus:bg-background-section transition-all placeholder:text-text-muted font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-bold text-secondary-700 uppercase tracking-widest">
                      Security Pin
                    </label>
                    <button
                      type="button"
                      onClick={handleForgot}
                      className="text-xs text-primary-600 hover:text-primary-700 hover:underline font-bold"
                    >
                      Forgot Pin?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary-600 transition-colors" />
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      onChange={(e) => (password.current = e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3.5 bg-secondary-50 border-2 border-secondary-200 rounded-2xl text-primary-text outline-none focus:border-primary-600 focus:bg-background-section transition-all placeholder:text-text-muted font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-text-muted hover:text-primary-600 hover:bg-secondary-100 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-display font-bold rounded-2xl transition-all shadow-lg shadow-primary-600/25 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 text-lg"
                >
                  {isSubmitting ? (
                    'Verifying...'
                  ) : (
                    <>
                      Login to Console <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-5 p-4 bg-primary-50 border-2 border-primary-200 text-primary-700 rounded-2xl text-sm font-bold flex items-center gap-2 justify-center"
                  >
                    ⚠️ {error}
                  </motion.div>
                )}
                {notice && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-5 p-4 bg-accent-50 border-2 border-accent-300 text-accent-700 rounded-2xl text-sm font-bold flex items-center gap-2 justify-center text-center"
                  >
                    ✉️ {notice}
                  </motion.div>
                )}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-5 p-4 bg-mehndi-50 border-2 border-mehndi-300 text-mehndi-700 rounded-2xl text-sm font-bold flex items-center gap-2 justify-center"
                  >
                    <CheckCircle2 className="w-4 h-4" /> {successMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-7 pt-6 border-t-2 border-dashed border-secondary-200 text-center">
                <p className="text-secondary-text font-medium text-sm">
                  Access is issued by the super admin — confirm your e-mail to set a
                  password.
                </p>
                <div className="flex items-center justify-center gap-4 mt-4 text-[11px] font-bold uppercase tracking-widest text-secondary-600">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Secure
                  </span>
                  <span className="flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                  <span className="flex items-center gap-1">
                    <Headset className="w-3.5 h-3.5" /> Ground support
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="py-5 bg-secondary-950 border-t-2 border-secondary-800 text-center">
        <p className="text-[11px] font-bold text-secondary-400 uppercase tracking-[0.3em]">
          Powered by Appzeno Web Services · <span className="text-accent-400">Apni Desi Dukaan</span>
        </p>
      </footer>
    </div>
  );
};

export default AreaManagerLogin;
