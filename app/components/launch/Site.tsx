"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll, type MotionValue } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const C = {
  paper: "#F4EEE4",
  paperDeep: "#ECE3D3",
  paperCard: "#FBF7EF",
  ink: "#1C1815",
  ink60: "rgba(28,24,21,0.60)",
  ink45: "rgba(28,24,21,0.45)",
  ink30: "rgba(28,24,21,0.30)",
  line: "rgba(28,24,21,0.16)",
  rose: "#C2566F",
  roseDeep: "#A23E56",
  rosePale: "#E7B8C2",
};

const APP_STORE_URL = "https://apps.apple.com/app/id6769432089";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.hfjo.lumii";
// TODO: real Discord invite.
const DISCORD_URL = "https://discord.gg/lumii";
// TODO: web Pro checkout (RevenueCat Web Billing). Routes to App Store for now.
const PRO_CHECKOUT_URL = APP_STORE_URL;

/* ─────────────────────────  PRIMITIVES  ───────────────────────── */

function Reveal({ children, delay = 0, y = 26, className }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function AppleBadge({ light = false }: { light?: boolean }) {
  return (
    <motion.a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Lumii on the App Store"
      className="app-badge group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-5 py-3"
      style={light ? { background: C.paper, color: C.ink } : { background: C.ink, color: C.paper }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
    >
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

function GoogleBadge({ light = false }: { light?: boolean }) {
  return (
    <motion.a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get Lumii on Google Play"
      className="app-badge group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-5 py-3"
      style={{ background: "transparent", color: light ? C.paper : C.ink, border: light ? "1px solid rgba(244,238,228,0.35)" : "1px solid rgba(28,24,21,0.16)" }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
    >
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

/* ─────────────────────────  NAV  ───────────────────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const links: [string, string][] = [
    ["The app", "#app"],
    ["Premium", "#premium"],
    ["Creators", "#creators"],
    ["Tutorial", "/how-it-works"],
  ];
  const fg = scrolled ? C.ink : C.paper;
  return (
    <header
      className="fixed top-0 inset-x-0 z-[80] transition-colors duration-500"
      style={{
        background: scrolled ? "rgba(244,238,228,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: `1px solid ${scrolled ? C.line : "transparent"}`,
      }}
    >
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 h-[64px] flex items-center justify-between">
        <a href="#top" className="font-display text-[26px] leading-none" style={{ color: fg }}>Lumii<span style={{ color: C.rose }}>.</span></a>
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="mono-label hover:opacity-100 transition-opacity" style={{ opacity: 0.78, color: fg }}>{label}</a>
          ))}
        </nav>
        <motion.a
          href="#download"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold"
          style={{ background: scrolled ? C.ink : C.paper, color: scrolled ? C.paper : C.ink }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95, y: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
        >
          Download <span style={{ fontSize: 14 }}>↗</span>
        </motion.a>
      </div>
    </header>
  );
}

/* ─────────────────────────  HERO (Suki wandering)  ───────────────────────── */

function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18 });
  const sy = useSpring(my, { stiffness: 70, damping: 18 });
  const vx = useTransform(sx, [-1, 1], [-22, 22]);
  const vy = useTransform(sy, [-1, 1], [-16, 16]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <section id="top" className="relative overflow-hidden" style={{ height: "100svh", background: C.ink }}>
      <motion.video
        src="/video/suki-hero.mp4?v=2"
        poster="/video/suki-hero-poster.jpg?v=2"
        autoPlay loop muted playsInline preload="auto" aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ x: vx, y: vy, scale: 1.12 }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(20,12,14,0.45) 0%, transparent 22%, transparent 45%, rgba(20,12,14,0.30) 78%, rgba(20,12,14,0.72) 100%)" }} />

      <div className="relative h-full max-w-[1320px] mx-auto px-6 md:px-10 flex flex-col justify-end pb-[12vh]">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.15 }} className="max-w-[760px]">
          <h1 className="font-display leading-[0.9] tracking-[-0.04em]" style={{ color: C.paper, fontSize: "clamp(3rem, 9vw, 7.5rem)" }}>
            <span className="block">Your face,</span>
            <span className="block">by the <span className="italic" style={{ color: C.rosePale }}>numbers.</span></span>
          </h1>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <AppleBadge light />
            <GoogleBadge light />
          </div>
          <div className="mt-6 flex items-center gap-3 text-[13px]" style={{ color: "rgba(244,238,228,0.78)" }}>
            <span style={{ color: C.rosePale, letterSpacing: "0.1em" }}>★★★★★</span>
            <span><strong style={{ color: C.paper, fontWeight: 600 }}>5.0</strong></span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span><strong style={{ color: C.paper, fontWeight: 600 }}>300+</strong> glowing up</span>
          </div>
        </motion.div>
      </div>

      <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <span className="mono-label" style={{ color: "rgba(244,238,228,0.7)" }}>Scroll</span>
        <span style={{ color: "rgba(244,238,228,0.7)", fontSize: 18 }}>↓</span>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────  PHONE JOURNEY  ─────────────────────────
   Suki whips out the phone, the camera flies into the blank screen, then a
   tour of live UI panels plays inside. The screen rectangle is measured as a
   % of the square stage — tweak SCREEN if the overlay drifts off the phone. */

const SCREEN = { left: 43.4, top: 41.6, w: 20.4, h: 43.6 };
const SCx = SCREEN.left + SCREEN.w / 2; // 53.6
const SCy = SCREEN.top + SCREEN.h / 2; // 63.4

// faux phone status bar
function StatusBar() {
  return (
    <div className="absolute top-0 inset-x-0 flex items-center justify-between px-[7%] pt-[3.5%] z-10">
      <span className="font-semibold" style={{ color: C.ink, fontSize: "clamp(8px,2.6cqw,16px)" }}>9:41</span>
      <span className="rounded-full" style={{ width: "26%", height: "clamp(10px,3cqw,20px)", background: "#080809" }} />
      <span style={{ color: C.ink, fontSize: "clamp(8px,2.4cqw,14px)" }}>▮▮▮</span>
    </div>
  );
}

function ScorePanel({ o }: { o: MotionValue<number> }) {
  const R = 42;
  const circ = 2 * Math.PI * R;
  const dash = useTransform(o, [0, 1], [circ, circ * (1 - 0.86)]);
  const chipOp = useTransform(o, [0.5, 1], [0, 1]);
  const chipScale = useTransform(o, [0.5, 1], [0.7, 1]);
  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center" style={{ opacity: o, background: C.paperCard }}>
      <StatusBar />
      <span className="mono-label" style={{ color: C.rose, fontSize: "clamp(8px,2.4cqw,13px)" }}>Today&apos;s glow</span>
      <div className="relative mt-[4%]" style={{ width: "62%" }}>
        <svg viewBox="0 0 100 100" className="w-full">
          <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(28,24,21,0.10)" strokeWidth="5" />
          <motion.circle
            cx="50" cy="50" r={R} fill="none" stroke={C.rose} strokeWidth="5" strokeLinecap="round"
            transform="rotate(-90 50 50)" strokeDasharray={circ} style={{ strokeDashoffset: dash }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display" style={{ color: C.ink, fontSize: "clamp(28px,13cqw,80px)", lineHeight: 1 }}>86</span>
          <span className="mono-label" style={{ color: C.ink45, fontSize: "clamp(7px,2cqw,12px)" }}>/ 100 · Radiant</span>
        </div>
      </div>
      <motion.div className="mt-[6%] rounded-full px-[5%] py-[2%] font-semibold" style={{ background: C.rose, color: "#fff", fontSize: "clamp(9px,2.6cqw,15px)", opacity: chipOp, scale: chipScale }}>
        ↑ 2 this week
      </motion.div>
    </motion.div>
  );
}

function Bar({ o, name, val, i }: { o: MotionValue<number>; name: string; val: number; i: number }) {
  const w = useTransform(o, [0.2 + i * 0.05, 0.7 + i * 0.05], ["0%", `${val}%`]);
  return (
    <div className="mb-[5%]">
      <div className="flex justify-between mb-[2%]" style={{ color: C.ink, fontSize: "clamp(9px,2.6cqw,15px)" }}>
        <span>{name}</span>
        <span className="font-semibold">{val}</span>
      </div>
      <div className="rounded-full overflow-hidden" style={{ height: "clamp(5px,1.6cqw,12px)", background: "rgba(28,24,21,0.1)" }}>
        <motion.div className="h-full rounded-full" style={{ background: C.rose, width: w }} />
      </div>
    </div>
  );
}

function BreakdownPanel({ o }: { o: MotionValue<number> }) {
  const bars: [string, number][] = [["Symmetry", 95], ["Jawline", 88], ["Eyes", 84], ["Skin", 80], ["Harmony", 86]];
  return (
    <motion.div className="absolute inset-0 flex flex-col justify-center px-[10%]" style={{ opacity: o, background: C.paperCard }}>
      <StatusBar />
      <span className="mono-label mb-[6%]" style={{ color: C.rose, fontSize: "clamp(8px,2.4cqw,13px)" }}>The breakdown</span>
      {bars.map(([name, val], i) => <Bar key={name} o={o} name={name} val={val} i={i} />)}
    </motion.div>
  );
}

function Bubble({ o, text, i, mine }: { o: MotionValue<number>; text: string; i: number; mine: boolean }) {
  const op = useTransform(o, [0.3 + i * 0.18, 0.5 + i * 0.18], [0, 1]);
  const x = useTransform(o, [0.3 + i * 0.18, 0.5 + i * 0.18], [mine ? 30 : -30, 0]);
  return (
    <motion.div
      className="rounded-[18px] px-[5%] py-[3.5%] max-w-[82%]"
      style={{ background: mine ? C.rose : "#fff", color: mine ? "#fff" : C.ink, alignSelf: mine ? "flex-end" : "flex-start", fontSize: "clamp(9px,2.6cqw,15px)", lineHeight: 1.35, boxShadow: "0 6px 18px -10px rgba(120,40,60,0.4)", opacity: op, x }}
    >
      {text}
    </motion.div>
  );
}

function SukiPanel({ o }: { o: MotionValue<number> }) {
  const bubbles = ["You're sitting at 86, real talk?", "Your jawline is carrying.", "Want your quick win for today?"];
  return (
    <motion.div className="absolute inset-0 flex flex-col justify-center px-[9%] gap-[4%]" style={{ opacity: o, background: C.paperCard }}>
      <StatusBar />
      <span className="mono-label" style={{ color: C.rose, fontSize: "clamp(8px,2.4cqw,13px)" }}>Chat with Suki</span>
      {bubbles.map((b, i) => <Bubble key={b} o={o} text={b} i={i} mine={i === 1} />)}
    </motion.div>
  );
}

function PhoneJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // whip-out pop, then fly into the screen
  const scale = useTransform(scrollYProgress, [0, 0.07, 0.14, 0.46], [0.72, 1, 1, 2.8]);
  const rot = useTransform(scrollYProgress, [0, 0.07], [-7, 0]);
  const catOp = useTransform(scrollYProgress, [0.3, 0.44], [1, 0]); // cat + frame dissolve as we enter
  const radius = useTransform(scrollYProgress, [0.14, 0.46], [2.4, 0]); // screen corners square off at full zoom

  // panel sub-progress (0..1 each) across the tour
  const pScore = useTransform(scrollYProgress, [0.16, 0.46, 0.54, 0.6], [0, 1, 1, 0]);
  const pBreak = useTransform(scrollYProgress, [0.58, 0.66, 0.74, 0.8], [0, 1, 1, 0]);
  const pSuki = useTransform(scrollYProgress, [0.78, 0.86, 1, 1], [0, 1, 1, 1]);
  // each panel also needs an internal 0..1 to drive its element anims
  const scoreFill = useTransform(scrollYProgress, [0.16, 0.5], [0, 1]);
  const breakFill = useTransform(scrollYProgress, [0.58, 0.78], [0, 1]);
  const sukiFill = useTransform(scrollYProgress, [0.78, 0.98], [0, 1]);
  const screenRadius = useTransform(radius, (v) => `${v}rem`);
  const captionOp = useTransform(scrollYProgress, [0, 0.12, 0.2], [1, 1, 0]);

  const STAGE = "min(92vh, 94vw)";

  return (
    <section id="app" ref={ref} className="relative" style={{ height: "560vh", background: C.paper }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* recenter the screen rect to the viewport, then scale around it */}
        <div style={{ transform: `translate(${(50 - SCx).toFixed(2)}%, ${(50 - SCy).toFixed(2)}%)` }}>
          <motion.div
            className="relative"
            style={{ width: STAGE, height: STAGE, scale, rotate: rot, transformOrigin: `${SCx}% ${SCy}%` }}
          >
            {/* Suki holding the phone (white bg blended into paper via multiply) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img src="/suki-phone-raw.png" alt="Suki holding the Lumii app" className="absolute inset-0 w-full h-full object-contain" style={{ opacity: catOp, mixBlendMode: "multiply" }} draggable={false} />

            {/* live screen overlaid on the phone's blank screen */}
            <motion.div
              className="device absolute overflow-hidden"
              style={{ left: `${SCREEN.left}%`, top: `${SCREEN.top}%`, width: `${SCREEN.w}%`, height: `${SCREEN.h}%`, borderRadius: screenRadius }}
            >
              {/* panels stacked; opacity from p* crossfades, fill from *Fill animates content */}
              <motion.div className="absolute inset-0" style={{ opacity: pScore }}><ScorePanel o={scoreFill} /></motion.div>
              <motion.div className="absolute inset-0" style={{ opacity: pBreak }}><BreakdownPanel o={breakFill} /></motion.div>
              <motion.div className="absolute inset-0" style={{ opacity: pSuki }}><SukiPanel o={sukiFill} /></motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* caption that fades once we're inside */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none" style={{ opacity: captionOp }}>
          <span className="mono-label" style={{ color: C.ink45 }}>Scroll into the app</span>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────  PREMIUM  ───────────────────────── */

function Premium() {
  const perks = ["Unlimited scans", "Full 8-category breakdown", "Suki coaching", "Your Circle", "Cycle insight", "Progress history"];
  return (
    <section id="premium" className="relative py-28 md:py-40 overflow-hidden" style={{ background: C.ink, color: C.paper }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 55% 60% at 78% 30%, rgba(194,86,111,0.22) 0%, transparent 65%)" }} />
      <div className="relative max-w-[1320px] mx-auto px-5 md:px-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <div>
          <div className="mono-label mb-6" style={{ color: C.rosePale }}>Lumii Pro</div>
          <h2 className="font-display leading-[0.94] tracking-[-0.03em]" style={{ fontSize: "clamp(2.6rem,6.4vw,5rem)" }}>
            Go Pro on the <span className="italic" style={{ color: C.rosePale }}>web.</span>
          </h2>
          <p className="mt-6 max-w-[420px] text-[15px] md:text-[16px] leading-[1.7]" style={{ color: "rgba(244,238,228,0.75)" }}>
            Same Pro. No app-store middleman.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <motion.a
              href={PRO_CHECKOUT_URL}
              className="app-badge group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-[14px] font-semibold"
              style={{ background: C.paper, color: C.ink }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97, y: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
            >
              <span aria-hidden className="badge-shine" />
              <span className="relative">Go Pro on the web</span>
              <span className="relative" style={{ fontSize: 15 }}>→</span>
            </motion.a>
            <span className="mono-label" style={{ color: "rgba(244,238,228,0.5)" }}>Cancel anytime</span>
          </div>
        </div>
        <div className="rounded-[28px] p-8 md:p-10" style={{ background: "rgba(244,238,228,0.05)", border: "1px solid rgba(244,238,228,0.12)" }}>
          <div className="mono-label mb-6" style={{ color: "rgba(244,238,228,0.5)" }}>What unlocks</div>
          <ul className="flex flex-col gap-4">
            {perks.map((p) => (
              <li key={p} className="flex gap-3 text-[15px]" style={{ color: C.paper }}>
                <span style={{ color: C.rosePale }}>✦</span>
                <span style={{ fontWeight: 600 }}>{p}</span>
              </li>
            ))}
          </ul>
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
    <section id="creators" className="py-28 md:py-40" style={{ background: C.paperDeep }}>
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <div className="grid lg:grid-cols-[1fr_0.85fr] gap-14 items-center">
          <div>
            <Reveal><div className="mono-label mb-6" style={{ color: C.rose }}>Creator program</div></Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display leading-[0.94] tracking-[-0.03em]" style={{ color: C.ink, fontSize: "clamp(2.6rem,6.4vw,5rem)" }}>
                Make edits. <span className="italic" style={{ color: C.rose }}>Get paid.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-[420px] text-[15px] md:text-[16px] leading-[1.7]" style={{ color: C.ink60 }}>Grab a brief. Post. Get paid.</p>
            </Reveal>
            <Reveal delay={0.18}>
              <motion.a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="app-badge group relative mt-9 inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-[14px] font-semibold"
                style={{ background: "#5865F2", color: "#fff" }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97, y: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
              >
                <span aria-hidden className="badge-shine" />
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden className="relative">
                  <path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.3.5c1.7.4 2.5.9 3.4 1.6a13.3 13.3 0 0 0-10.9 0c.9-.6 1.8-1.2 3.4-1.6L10.6 3a19.8 19.8 0 0 0-4.9 1.4C2.5 9.1 1.6 13.6 2 18.1a19.9 19.9 0 0 0 6 3l.8-1.3c-.7-.2-1.3-.5-1.9-.9l.5-.3a14.2 14.2 0 0 0 12.2 0l.5.3c-.6.4-1.2.7-1.9.9l.8 1.3a19.9 19.9 0 0 0 6-3c.5-5.2-.8-9.7-3.5-13.7M9.3 15.2c-1 0-1.7-.9-1.7-2s.8-2 1.7-2 1.7.9 1.7 2-.7 2-1.7 2m5.4 0c-1 0-1.7-.9-1.7-2s.8-2 1.7-2 1.7.9 1.7 2-.7 2-1.7 2" />
                </svg>
                <span className="relative">Join the Discord</span>
                <span className="relative" style={{ fontSize: 15 }}>→</span>
              </motion.a>
            </Reveal>
          </div>
          <div className="flex flex-col gap-px rounded-[24px] overflow-hidden" style={{ background: C.line }}>
            {perks.map(([t, b], i) => (
              <Reveal key={t} delay={i * 0.1}>
                <div className="px-7 py-8" style={{ background: C.paperCard }}>
                  <h3 className="font-display text-[22px]" style={{ color: C.ink }}>{t}</h3>
                  <p className="mt-2 text-[14px] leading-[1.6]" style={{ color: C.ink60 }}>{b}</p>
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
    <section id="download" className="relative py-28 md:py-40 overflow-hidden" style={{ background: C.paper }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(194,86,111,0.14) 0%, transparent 68%)" }} />
      <div className="relative max-w-[900px] mx-auto px-6 text-center">
        <Reveal><p className="mono-label mb-8">Free · iOS &amp; Android</p></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.92] tracking-[-0.04em]" style={{ color: C.ink, fontSize: "clamp(2.8rem,8vw,6rem)" }}>
            Read your <span className="italic" style={{ color: C.rose }}>face.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <AppleBadge />
            <GoogleBadge />
          </div>
        </Reveal>
        <Reveal delay={0.26}>
          <div className="mt-6 flex items-center justify-center gap-3 text-[13px]" style={{ color: C.ink60 }}>
            <span style={{ color: C.rose, letterSpacing: "0.1em" }}>★★★★★</span>
            <span><strong style={{ color: C.ink, fontWeight: 600 }}>5.0</strong></span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span><strong style={{ color: C.ink, fontWeight: 600 }}>300+</strong> glowing up</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────  FOOTER  ───────────────────────── */

function Footer() {
  return (
    <footer style={{ background: C.ink, color: C.paper }}>
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div className="font-display text-[48px] leading-none">Lumii<span style={{ color: C.rosePale }}>.</span></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-4">
            {[
              ["The app", "#app"],
              ["Premium", "#premium"],
              ["Creators", "#creators"],
              ["Tutorial", "/how-it-works"],
              ["FAQ", "/faq"],
              ["Privacy", "/legal/privacy-policy"],
              ["Terms", "/legal/terms-of-service"],
              ["Contact", "mailto:hello@lumiiapp.com"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="text-[13px] transition-opacity hover:opacity-100" style={{ color: "rgba(244,238,228,0.62)" }}>{l}</a>
            ))}
          </div>
        </div>
        <div className="mt-14 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderTop: "1px solid rgba(244,238,228,0.14)" }}>
          <p className="mono-label" style={{ color: "rgba(244,238,228,0.4)" }}>Built for girls · London</p>
          <p className="mono-label" style={{ color: "rgba(244,238,228,0.4)" }}>© {new Date().getFullYear()} HFJO&amp;CO Limited</p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────  PAGE  ───────────────────────── */

export default function Site() {
  return (
    <main className="relative overflow-x-clip">
      <Nav />
      <Hero />
      <PhoneJourney />
      <Premium />
      <Creators />
      <Download />
      <Footer />
    </main>
  );
}
