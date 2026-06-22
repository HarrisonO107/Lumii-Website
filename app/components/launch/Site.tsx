"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Dark, Flighty-style palette.
const D = {
  bg: "#0B0910",
  bg2: "#0E0B14",
  card: "#16121E",
  cardLine: "rgba(255,255,255,0.08)",
  text: "#F6F1EA",
  dim: "rgba(246,241,234,0.60)",
  dim2: "rgba(246,241,234,0.40)",
  rose: "#D86A86",
  roseDeep: "#C2566F",
  rosePale: "#F0B9C6",
  glow: "rgba(216,106,134,0.55)",
};

const APP_STORE_URL = "https://apps.apple.com/app/id6769432089";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.hfjo.lumii";
const DISCORD_URL = "https://discord.com/invite/gyYzVKVSEP";
const PRO_CHECKOUT_URL = "/pro"; // RevenueCat Web Billing paywall

/* ─────────────────────────  PRIMITIVES  ───────────────────────── */

function Reveal({ children, delay = 0, y = 26, className }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.8, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

function AppleBadge({ light = true }: { light?: boolean }) {
  return (
    <motion.a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Download Lumii on the App Store"
      className="app-badge group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-5 py-3"
      style={light ? { background: D.text, color: "#000" } : { background: "#000", color: D.text }}
      whileHover={{ y: -3 }} whileTap={{ scale: 0.97, y: 0 }} transition={{ type: "spring", stiffness: 420, damping: 26 }}>
      <span aria-hidden className="badge-shine" />
      <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden className="relative">
        <path d="M17.05 12.04c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.82 0-2.07-.92-3.41-.9-1.75.03-3.37 1.02-4.27 2.59-1.82 3.16-.47 7.83 1.31 10.4.87 1.26 1.9 2.67 3.25 2.62 1.31-.05 1.8-.85 3.38-.85 1.57 0 2.01.85 3.39.82 1.4-.02 2.29-1.28 3.14-2.55.99-1.46 1.4-2.87 1.42-2.95-.03-.01-2.72-1.04-2.75-4.13M14.6 4.59c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.08 3.18 1.15.09 2.32-.58 3.03-1.45" />
      </svg>
      <span className="relative text-left leading-none">
        <span className="block text-[8px] tracking-[0.18em] uppercase opacity-60 font-mono">Download on the</span>
        <span className="block text-[14px] font-semibold mt-[3px]">App Store</span>
      </span>
    </motion.a>
  );
}

function GoogleBadge() {
  return (
    <motion.a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Get Lumii on Google Play"
      className="app-badge group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-5 py-3"
      style={{ background: "transparent", color: D.text, border: "1px solid rgba(246,241,234,0.3)" }}
      whileHover={{ y: -3 }} whileTap={{ scale: 0.97, y: 0 }} transition={{ type: "spring", stiffness: 420, damping: 26 }}>
      <span aria-hidden className="badge-shine" />
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden className="relative">
        <path d="M3 2.2v19.6a.6.6 0 0 0 .92.5l16.3-9.8a.6.6 0 0 0 0-1.03L3.92 1.7A.6.6 0 0 0 3 2.2Z" />
      </svg>
      <span className="relative text-left leading-none">
        <span className="block text-[8px] tracking-[0.18em] uppercase opacity-60 font-mono">Get it on</span>
        <span className="block text-[14px] font-semibold mt-[3px]">Google Play</span>
      </span>
    </motion.a>
  );
}

/* phone in a device frame, with an optional glowing callout floating on it */
function Phone({ src, width = 260, callout, calloutClass, children }: { src?: string; width?: number | string; callout?: React.ReactNode; calloutClass?: string; children?: React.ReactNode }) {
  return (
    <div className="device relative" style={{ width }}>
      <span className="device-btn action" />
      <span className="device-btn vol-up" />
      <span className="device-btn vol-dn" />
      <span className="device-btn power" />
      <div className="device-rail">
        <div className="device-bezel">
          <div className="device-screen">
            {children ?? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" draggable={false} />
            )}
          </div>
        </div>
      </div>
      {callout && (
        <div className={`absolute ${calloutClass ?? ""}`}>
          <div className="rounded-2xl px-4 py-3 text-left" style={{ background: "rgba(20,16,26,0.92)", border: `1px solid ${D.rosePale}`, boxShadow: `0 0 34px ${D.glow}, 0 0 0 1px rgba(216,106,134,0.25)`, backdropFilter: "blur(6px)" }}>
            {callout}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────  NAV (floating pill)  ───────────────────────── */

function Nav() {
  const links: [string, string][] = [
    ["The app", "#app"],
    ["Premium", "#premium"],
    ["Creators", "#creators"],
  ];
  return (
    <header className="fixed top-4 inset-x-0 z-[90] flex justify-center px-4">
      <div className="flex items-center gap-1 rounded-full py-2 pl-3 pr-2" style={{ background: "rgba(11,9,16,0.72)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(246,241,234,0.12)", boxShadow: "0 10px 30px -12px rgba(0,0,0,0.6)" }}>
        <a href="#top" className="block rounded-full overflow-hidden mr-1" style={{ width: 32, height: 32, border: "1px solid rgba(246,241,234,0.2)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="Lumii" className="w-full h-full object-cover" />
        </a>
        <nav className="hidden sm:flex items-center">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-colors hover:text-white" style={{ color: D.dim }}>{label}</a>
          ))}
        </nav>
        <motion.a href="#download" className="ml-1 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold" style={{ background: D.text, color: "#000" }} whileHover={{ y: -2 }} whileTap={{ scale: 0.96, y: 0 }} transition={{ type: "spring", stiffness: 420, damping: 26 }}>
          Get the app
        </motion.a>
      </div>
    </header>
  );
}

/* ─────────────────────────  HERO (Suki meadow video)  ───────────────────────── */

function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18 });
  const sy = useSpring(my, { stiffness: 70, damping: 18 });
  const vx = useTransform(sx, [-1, 1], [-22, 22]);
  const vy = useTransform(sy, [-1, 1], [-16, 16]);
  useEffect(() => {
    const onMove = (e: PointerEvent) => { mx.set((e.clientX / window.innerWidth) * 2 - 1); my.set((e.clientY / window.innerHeight) * 2 - 1); };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  // live user count from Supabase (rounded to nearest 5), falls back to 300
  const [users, setUsers] = useState(300);
  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then((d) => { if (typeof d?.users === "number") setUsers(d.users); }).catch(() => {});
  }, []);

  return (
    <section id="top" className="relative overflow-hidden" style={{ height: "100svh", background: "#000" }}>
      {/* push the cat to the right so the left stays clear for copy */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 md:[transform:translateX(13%)_scale(1.34)]" style={{ transform: "scale(1.12)" }}>
          <motion.video src="/video/suki-hero.mp4?v=2" poster="/video/suki-hero-poster.jpg?v=2" autoPlay loop muted playsInline preload="auto" aria-hidden className="absolute inset-0 w-full h-full object-cover" style={{ x: vx, y: vy }} />
        </div>
      </div>
      {/* left scrim for legibility + vertical fade into the dark sections */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg, rgba(8,6,10,0.85) 0%, rgba(8,6,10,0.45) 32%, transparent 62%)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(8,6,10,0.55) 0%, transparent 22%, transparent 42%, rgba(8,6,10,0.55) 66%, rgba(8,6,10,0.9) 88%, #0B0910 100%)" }} />
      <div className="relative h-full max-w-[1340px] mx-auto px-6 md:px-10 flex flex-col justify-end pb-[13vh]">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.15 }} className="max-w-[820px]">
          <h1 className="font-display leading-[0.86] tracking-[-0.04em]" style={{ color: D.text, fontSize: "clamp(3.4rem, 10vw, 8.5rem)" }}>
            <span className="block">Your glow,</span>
            <span className="block italic" style={{ color: D.rosePale }}>scored.</span>
          </h1>
          {/* App Store listing card — instant "this is an app" signal */}
          <motion.a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-4 rounded-3xl px-5 py-4"
            style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(22px) saturate(150%)", WebkitBackdropFilter: "blur(22px) saturate(150%)", border: "1px solid rgba(255,255,255,0.22)", boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.28)" }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.02 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.png" alt="Lumii app icon" className="rounded-2xl" style={{ width: 56, height: 56 }} />
            <div className="text-left">
              <div className="text-[16px] font-semibold leading-tight" style={{ color: D.text }}>Lumii</div>
              <div className="text-[12px] mb-1" style={{ color: D.dim }}>AI Face Analysis</div>
              <div className="flex items-center gap-1.5 text-[12px]" style={{ color: D.dim }}>
                <span style={{ color: D.rosePale, letterSpacing: "0.06em" }}>★★★★★</span>
                <span><strong style={{ color: D.text, fontWeight: 600 }}>5.0</strong> · {users}+</span>
              </div>
            </div>
            <span className="ml-2 rounded-full px-5 py-1.5 text-[13px] font-bold tracking-wide" style={{ background: "#0A84FF", color: "#fff" }}>GET</span>
          </motion.a>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2.5">
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-[13px] transition-opacity hover:opacity-80" style={{ color: D.dim }}>
              Also on Google Play →
            </a>
            <motion.a
              href="/pro"
              className="app-badge group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-3.5 py-1.5 text-[12px] font-semibold"
              style={{ border: `1px solid ${D.rosePale}`, color: D.rosePale, background: "rgba(216,106,134,0.08)" }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
            >
              <span aria-hidden className="badge-shine" />
              <span className="relative">✦ Go Pro on the web</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
      <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 pointer-events-none" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <span className="mono-label" style={{ color: "rgba(246,241,234,0.6)" }}>Scroll</span>
        <span style={{ color: "rgba(246,241,234,0.6)", fontSize: 18 }}>↓</span>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────  INTRO STATEMENT  ───────────────────────── */

function Intro() {
  return (
    <section id="app" className="pt-28 md:pt-40 pb-8" style={{ background: D.bg }}>
      <div className="max-w-[1340px] mx-auto px-6 md:px-10">
        <Reveal>
          <h2 className="font-display tracking-[-0.03em] leading-[1.02]" style={{ color: D.text, fontSize: "clamp(2.4rem,6vw,5rem)" }}>
            Everything your face has been trying to tell you, <span style={{ color: D.dim2 }}>finally measured.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-[640px] text-[17px] md:text-[19px] leading-[1.6]" style={{ color: D.dim }}>
            Lumii reads 584 landmarks across 75+ measurements in one scan, then turns it into a score, a routine, and a
            plan to raise it. The most precise beauty read ever put in a pocket.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────  SHOWCASE (device + description)  ───────────────────────── */

const SHOTS: { kicker: string; title: string; body: string; src: string }[] = [
  { kicker: "The read", title: "See your score. Finally.", body: "Eight categories scored against clinically-studied ideals, with the exact numbers behind every line.", src: "/screenshots/home.jpg" },
  { kicker: "The breakdown", title: "Every trait, ranked.", body: "Symmetry, jawline, eyes, skin and more, each measured on its own so you know exactly where you stand, and where to focus.", src: "/screenshots/breakdown.jpg" },
  { kicker: "The routine", title: "Tips from your numbers.", body: "Every tip traces back to a measurement on your report, with a one-tap add to your daily ritual.", src: "/screenshots/tips.jpg" },
  { kicker: "Suki", title: "Meet Suki.", body: "Your Lumii kitten reads your scan and talks you through it. Honest, never cold, and she grows with you.", src: "/screenshots/suki.jpg" },
  { kicker: "The circle", title: "Glow with your circle.", body: "Private 7-day glow sprints with your friends. Only the people you invite ever see it.", src: "/screenshots/circle.jpg" },
  { kicker: "Progress", title: "Watch the score move.", body: "Scan over time and Lumii tracks every metric against your baseline, with photos and a trend line.", src: "/screenshots/progress.jpg" },
];

function Showcase() {
  return (
    <section className="py-16 md:py-28" style={{ background: D.bg }}>
      <div className="max-w-[1340px] mx-auto px-6 md:px-10 flex flex-col gap-24 md:gap-40">
        {SHOTS.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <div key={s.title} className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
              <Reveal className={`flex justify-center ${flip ? "lg:order-2 lg:justify-start" : "lg:justify-end"}`}>
                <div className="relative">
                  <div className="absolute -inset-10 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 45%, rgba(216,106,134,0.16) 0%, transparent 60%)" }} />
                  <Phone src={s.src} width={300} />
                </div>
              </Reveal>
              <Reveal delay={0.1} className={flip ? "lg:order-1" : ""}>
                <div className="mono-label mb-5" style={{ color: D.rose }}>{s.kicker}</div>
                <h3 className="font-display leading-[1.0] tracking-[-0.02em]" style={{ color: D.text, fontSize: "clamp(2rem,4.4vw,3.4rem)" }}>{s.title}</h3>
                <p className="mt-5 max-w-[440px] text-[15px] md:text-[17px] leading-[1.6]" style={{ color: D.dim }}>{s.body}</p>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────  PREMIUM  ───────────────────────── */

/* One metric row — number counts up, bar fills with a lit leading edge, on scroll-in. */
function MetricRow({ label, value, delay, inView }: { label: string; value: number; delay: number; inView: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  useEffect(() => {
    if (!inView) return;
    const c = animate(count, value, { duration: 1.25, delay, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [inView, value, delay, count]);
  const top = value >= 90;
  return (
    <div>
      <div className="flex items-center justify-between mb-[7px]">
        <span style={{ fontSize: 12.5, fontWeight: 500, color: "rgba(246,241,234,0.72)", letterSpacing: "-0.005em" }}>{label}</span>
        <motion.span style={{ fontSize: 13.5, fontWeight: 700, color: top ? D.rosePale : D.text, fontVariantNumeric: "tabular-nums" }}>{rounded}</motion.span>
      </div>
      <div className="relative rounded-full" style={{ height: 6, background: "rgba(246,241,234,0.08)", boxShadow: "inset 0 1px 1px rgba(0,0,0,0.3)" }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: `linear-gradient(90deg, ${D.roseDeep} 0%, ${D.rose} 60%, ${D.rosePale} 100%)`, boxShadow: `0 0 10px ${D.glow}` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.25, delay, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* bright leading tip */}
          <span className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full" style={{ width: 6, height: 6, background: "#FFF1F4", boxShadow: `0 0 8px ${D.rosePale}` }} />
        </motion.div>
      </div>
    </div>
  );
}

/* Dark, app-style "your read" breakdown rendered inside the phone. */
function MetricsScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const overall = useMotionValue(0);
  const overallR = useTransform(overall, (v) => Math.round(v));
  useEffect(() => {
    if (!inView) return;
    const c = animate(overall, 86, { duration: 1.4, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [inView, overall]);

  const metrics: [string, number][] = [
    ["Symmetry", 92],
    ["Jawline", 88],
    ["Skin clarity", 90],
    ["Eyes", 85],
    ["Harmony", 91],
    ["Lips", 87],
  ];

  return (
    <div ref={ref} className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: "linear-gradient(180deg,#1A1524 0%,#0D0A12 100%)", color: D.text }}>
      {/* atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 38% at 50% 0%, rgba(216,106,134,0.22) 0%, transparent 70%)" }} />

      {/* header */}
      <div className="relative px-[9%] pt-[15%]">
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: D.rosePale, fontFamily: "var(--font-mono)" }}>Your read</span>
          <span style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(246,241,234,0.38)", fontFamily: "var(--font-mono)" }}>584 landmarks</span>
        </div>
        <div className="mt-2 flex items-end gap-1.5">
          <motion.span style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 0.92, fontVariantNumeric: "tabular-nums" }}>{overallR}</motion.span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(246,241,234,0.38)", marginBottom: 5 }}>/100</span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1" style={{ marginBottom: 5, background: "rgba(216,106,134,0.16)", border: "1px solid rgba(240,185,198,0.3)" }}>
            <span style={{ fontSize: 8, color: D.rosePale }}>▲</span>
            <span style={{ fontSize: 9.5, fontWeight: 600, color: D.rosePale, letterSpacing: "0.02em" }}>12 this week</span>
          </span>
        </div>
      </div>

      {/* divider */}
      <div className="relative mx-[9%] mt-5 mb-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(246,241,234,0.14), transparent)" }} />

      {/* metric bars */}
      <div className="relative flex-1 flex flex-col justify-center gap-[13px] px-[9%]">
        {metrics.map(([label, value], i) => (
          <MetricRow key={label} label={label} value={value} delay={0.3 + i * 0.11} inView={inView} />
        ))}
      </div>

      {/* footer */}
      <div className="relative px-[9%] pb-[14%]">
        <div className="flex items-center justify-center gap-2 rounded-2xl px-3.5 py-3" style={{ background: "rgba(246,241,234,0.045)", border: "1px solid rgba(246,241,234,0.08)" }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M6 0.5c.3 2.4 1.1 3.2 3.5 3.5C7.1 4.3 6.3 5.1 6 7.5 5.7 5.1 4.9 4.3 2.5 4 4.9 3.7 5.7 2.9 6 0.5Z" fill={D.rosePale} />
            <path d="M9.6 7c.15 1.2.55 1.6 1.75 1.75C10.15 8.9 9.75 9.3 9.6 10.5 9.45 9.3 9.05 8.9 7.85 8.75 9.05 8.6 9.45 8.2 9.6 7Z" fill={D.rose} />
          </svg>
          <span style={{ fontSize: 10, letterSpacing: "0.04em", color: "rgba(246,241,234,0.55)" }}>Analysed from one photo · 75+ metrics</span>
        </div>
      </div>
    </div>
  );
}

function Check() {
  return (
    <span className="mt-0.5 inline-flex shrink-0 items-center justify-center rounded-full" style={{ width: 18, height: 18, background: "rgba(216,106,134,0.16)", border: "1px solid rgba(240,185,198,0.35)" }}>
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M2.5 6.2 5 8.6l4.5-5" stroke={D.rosePale} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Premium() {
  const perks = ["Unlimited scans", "Full 8-category breakdown", "Suki coaching", "Your Circle", "Cycle insight", "Progress history"];
  const reasons = ["Same price as the app", "Bundles only sold here", "Unlocks on every device"];

  // live user count (rounded to nearest 5 by the API), falls back to 300
  const [users, setUsers] = useState(300);
  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then((d) => { if (typeof d?.users === "number") setUsers(d.users); }).catch(() => {});
  }, []);

  // gentle scroll parallax on the phone (Apple-style drift)
  const phoneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: phoneRef, offset: ["start end", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [46, -46]);

  return (
    <section id="premium" className="relative py-28 md:py-40 overflow-hidden" style={{ background: D.bg2 }}>
      {/* layered atmosphere so the section isn't floating on flat black */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 55% at 26% 42%, rgba(216,106,134,0.20) 0%, transparent 62%), radial-gradient(ellipse 46% 50% at 88% 18%, rgba(194,86,111,0.14) 0%, transparent 60%)" }} />
      <div className="absolute inset-x-0 top-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(240,185,198,0.25), transparent)" }} />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 grid lg:grid-cols-[0.92fr_1.08fr] gap-14 lg:gap-20 items-center">
        {/* LEFT — the real product, in a device, drifting on scroll, settling in on view */}
        <div ref={phoneRef} className="flex justify-center lg:justify-start">
          <motion.div className="relative" style={{ y: phoneY }}>
            <div className="absolute -inset-10 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 70% at 50% 45%, rgba(216,106,134,0.32) 0%, transparent 70%)" }} />
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.92, rotate: -7 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <Phone width={268}>
                <MetricsScreen />
              </Phone>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT — the pitch */}
        <div>
          <Reveal>
            <div className="mono-label mb-6" style={{ color: D.rosePale }}>Lumii Pro · web only</div>
            <h2 className="font-display leading-[0.94] tracking-[-0.03em]" style={{ color: D.text, fontSize: "clamp(2.6rem,6.4vw,5rem)" }}>
              Go Pro on the <span className="italic" style={{ color: D.rosePale }}>web.</span>
            </h2>
            <p className="mt-6 max-w-[500px] text-[16px] md:text-[17px] leading-[1.6]" style={{ color: D.dim }}>
              Same Pro, same price as the app. Buy direct here and you also unlock{" "}
              <span style={{ color: D.text, fontWeight: 600 }}>scan bundles you can’t get anywhere else.</span>
            </p>
          </Reveal>

          {/* reason chips — the why-buy-here */}
          <Reveal delay={0.08}>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {reasons.map((t) => (
                <span key={t} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${D.cardLine}`, color: D.text }}>
                  <span style={{ color: D.rosePale, fontSize: 11 }}>◆</span> {t}
                </span>
              ))}
            </div>
          </Reveal>

          {/* perks panel — refined glass, real checks, two columns */}
          <Reveal delay={0.14}>
            <div className="relative mt-8 rounded-[24px] overflow-hidden" style={{ background: "linear-gradient(168deg, rgba(36,28,46,0.85) 0%, rgba(20,16,28,0.85) 100%)", border: `1px solid ${D.cardLine}`, boxShadow: "0 34px 90px -46px rgba(0,0,0,0.85)" }}>
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(240,185,198,0.5), transparent)" }} />
              <div className="p-7 md:p-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="mono-label" style={{ color: D.dim2 }}>Everything in Pro</div>
                  <div className="mono-label" style={{ color: D.rosePale }}>8 categories</div>
                </div>
                <ul className="grid sm:grid-cols-2 gap-x-7 gap-y-3.5">
                  {perks.map((p) => (
                    <li key={p} className="flex gap-2.5 text-[14.5px]" style={{ color: D.text }}>
                      <Check />
                      <span style={{ fontWeight: 500 }}>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* CTA + live social proof */}
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <motion.a href={PRO_CHECKOUT_URL} className="app-badge group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-[15px] font-semibold" style={{ background: D.text, color: "#000" }} whileHover={{ y: -3 }} whileTap={{ scale: 0.97, y: 0 }} transition={{ type: "spring", stiffness: 420, damping: 26 }}>
                <span aria-hidden className="badge-shine" />
                <span className="relative">Go Pro on the web</span>
                <span className="relative" style={{ fontSize: 15 }}>→</span>
              </motion.a>
              <div className="flex items-center gap-2.5 text-[13px]" style={{ color: D.dim }}>
                <span style={{ color: D.rosePale, letterSpacing: "0.1em" }}>★★★★★</span>
                <span><strong style={{ color: D.text, fontWeight: 600 }}>5.0</strong> · loved by {users.toLocaleString()}+ · cancel anytime</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  CREATORS  ───────────────────────── */

function Creators() {
  const perks = [
    ["Get paid per post", "Earn for every edit that goes live."],
    ["Early everything", "First access to features and drops."],
    ["A direct line", "Pitch ideas straight to the team."],
  ];
  return (
    <section id="creators" className="py-28 md:py-40" style={{ background: D.bg }}>
      <div className="max-w-[1340px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-[1fr_0.85fr] gap-14 items-center">
          <div>
            <Reveal><div className="mono-label mb-6" style={{ color: D.rosePale }}>Creator program</div></Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display leading-[0.94] tracking-[-0.03em]" style={{ color: D.text, fontSize: "clamp(2.6rem,6.4vw,5rem)" }}>
                Make edits. <span className="italic" style={{ color: D.rosePale }}>Get paid.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}><p className="mt-6 max-w-[420px] text-[16px] leading-[1.6]" style={{ color: D.dim }}>Grab a brief. Post. Get paid.</p></Reveal>
            <Reveal delay={0.18}>
              <motion.a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="app-badge group relative mt-9 inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-[14px] font-semibold" style={{ background: "#5865F2", color: "#fff" }} whileHover={{ y: -3 }} whileTap={{ scale: 0.97, y: 0 }} transition={{ type: "spring", stiffness: 420, damping: 26 }}>
                <span aria-hidden className="badge-shine" />
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden className="relative">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
                <span className="relative">Join the Discord</span>
                <span className="relative" style={{ fontSize: 15 }}>→</span>
              </motion.a>
            </Reveal>
          </div>
          <div className="flex flex-col gap-px rounded-[24px] overflow-hidden" style={{ background: D.cardLine }}>
            {perks.map(([t, b], i) => (
              <Reveal key={t} delay={i * 0.1}>
                <div className="px-7 py-8" style={{ background: D.card }}>
                  <h3 className="font-display text-[22px]" style={{ color: D.text }}>{t}</h3>
                  <p className="mt-2 text-[14px] leading-[1.6]" style={{ color: D.dim }}>{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  DOWNLOAD  ───────────────────────── */

function Download() {
  return (
    <section id="download" className="relative py-28 md:py-40 overflow-hidden" style={{ background: D.bg2 }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(216,106,134,0.18) 0%, transparent 68%)" }} />
      <div className="relative max-w-[900px] mx-auto px-6 text-center">
        <Reveal><p className="mono-label mb-8" style={{ color: D.dim2 }}>Free · iOS &amp; Android</p></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.92] tracking-[-0.04em]" style={{ color: D.text, fontSize: "clamp(2.8rem,8vw,6rem)" }}>
            Read your <span className="italic" style={{ color: D.rosePale }}>face.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <AppleBadge />
            <GoogleBadge />
          </div>
        </Reveal>
        <Reveal delay={0.26}>
          <div className="mt-6 flex items-center justify-center gap-3 text-[13px]" style={{ color: D.dim }}>
            <span style={{ color: D.rosePale, letterSpacing: "0.1em" }}>★★★★★</span>
            <span><strong style={{ color: D.text, fontWeight: 600 }}>5.0</strong></span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span><strong style={{ color: D.text, fontWeight: 600 }}>300+</strong> glowing up</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────  FOOTER  ───────────────────────── */

function Footer() {
  return (
    <footer style={{ background: "#000", color: D.text }}>
      <div className="max-w-[1340px] mx-auto px-6 md:px-10 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div className="font-display text-[48px] leading-none">Lumii<span style={{ color: D.rosePale }}>.</span></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-4">
            {[
              ["The app", "#app"], ["Premium", "#premium"], ["Creators", "#creators"],
              ["FAQ", "/faq"], ["Privacy", "/legal/privacy-policy"], ["Terms", "/legal/terms-of-service"], ["Contact", "mailto:hello@lumiiapp.com"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="text-[13px] transition-opacity hover:opacity-100" style={{ color: D.dim }}>{l}</a>
            ))}
          </div>
        </div>
        <div className="mt-14 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderTop: "1px solid rgba(246,241,234,0.12)" }}>
          <p className="mono-label" style={{ color: D.dim2 }}>Built for girls · London</p>
          <p className="mono-label" style={{ color: D.dim2 }}>© {new Date().getFullYear()} HFJO&amp;CO Limited</p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────  CREATOR FAB  ─────────────────────────
   Always-on-screen button so creators can jump straight to the program. */
function CreatorFab() {
  return (
    <motion.a
      href="#creators"
      className="fixed right-3 md:right-6 bottom-4 md:bottom-7 z-[85] inline-flex items-center gap-2 md:gap-2.5 rounded-full pl-3 pr-4 py-2.5 md:pl-4 md:pr-5 md:py-3.5 text-[12px] md:text-[14px] font-semibold"
      style={{ background: "#5865F2", color: "#fff", boxShadow: "0 14px 40px -10px rgba(88,101,242,0.7), inset 0 1px 0 rgba(255,255,255,0.25)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6, ease: EASE }}
      whileHover={{ y: -3, scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.span className="absolute inset-0 rounded-full" style={{ border: "2px solid #5865F2" }} animate={{ scale: [1, 1.35], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} aria-hidden />
      <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden className="relative">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
      </svg>
      <span className="relative">Are you a creator?</span>
    </motion.a>
  );
}

/* ─────────────────────────  PAGE  ───────────────────────── */

export default function Site() {
  return (
    <main className="relative overflow-x-clip" style={{ background: D.bg }}>
      <Nav />
      <Hero />
      <Intro />
      <Showcase />
      <Premium />
      <Creators />
      <Download />
      <Footer />
      <CreatorFab />
    </main>
  );
}
