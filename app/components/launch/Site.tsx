"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

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
const DISCORD_URL = "https://discord.gg/lumii"; // TODO: real invite
const PRO_CHECKOUT_URL = APP_STORE_URL; // TODO: web checkout

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
function Phone({ src, width = 260, callout, calloutClass }: { src: string; width?: number | string; callout?: React.ReactNode; calloutClass?: string }) {
  return (
    <div className="device relative" style={{ width }}>
      <span className="device-btn action" />
      <span className="device-btn vol-up" />
      <span className="device-btn vol-dn" />
      <span className="device-btn power" />
      <div className="device-rail">
        <div className="device-bezel">
          <div className="device-screen">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" draggable={false} />
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
    ["Tutorial", "/how-it-works"],
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
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(8,6,10,0.5) 0%, transparent 26%, transparent 52%, rgba(8,6,10,0.45) 80%, #0B0910 100%)" }} />
      <div className="relative h-full max-w-[1320px] mx-auto px-6 md:px-10 flex flex-col justify-end pb-[13vh]">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.15 }} className="max-w-[820px]">
          <h1 className="font-display leading-[0.88] tracking-[-0.04em]" style={{ color: D.text, fontSize: "clamp(3.2rem, 9.5vw, 8rem)" }}>
            <span className="block">Your face,</span>
            <span className="block">by the <span className="italic" style={{ color: D.rosePale }}>numbers.</span></span>
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
                <span><strong style={{ color: D.text, fontWeight: 600 }}>5.0</strong> · 300+ users</span>
              </div>
            </div>
            <span className="ml-2 rounded-full px-5 py-1.5 text-[13px] font-bold tracking-wide" style={{ background: "#0A84FF", color: "#fff" }}>GET</span>
          </motion.a>

          <div className="mt-5 text-[13px]" style={{ color: D.dim }}>
            Free on iOS ·{" "}
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition-opacity hover:opacity-80" style={{ color: D.text }}>
              Get it on Google Play →
            </a>
          </div>
        </motion.div>
      </div>
      <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
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
      <div className="max-w-[1180px] mx-auto px-6 md:px-10">
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

/* ─────────────────────────  BIG FEATURE CARD  ───────────────────────── */

function BigCard() {
  return (
    <section className="py-8" style={{ background: D.bg }}>
      <div className="max-w-[1180px] mx-auto px-6 md:px-10">
        <Reveal>
          <div className="relative rounded-[32px] overflow-hidden" style={{ background: "linear-gradient(160deg, #1b1424 0%, #120f18 60%)", border: `1px solid ${D.cardLine}` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 60% at 80% 30%, rgba(216,106,134,0.20) 0%, transparent 65%)" }} />
            <div className="relative grid lg:grid-cols-2 gap-8 items-center p-8 md:p-14">
              <div>
                <h3 className="font-display leading-[1.02] tracking-[-0.02em]" style={{ color: D.text, fontSize: "clamp(2rem,4vw,3.2rem)" }}>
                  See your score.<br />Finally.
                </h3>
                <p className="mt-5 max-w-[420px] text-[15px] md:text-[16px] leading-[1.6]" style={{ color: D.dim }}>
                  Eight categories scored against clinically-studied ideals, with the exact numbers behind every line.
                </p>
              </div>
              <div className="relative flex justify-center lg:justify-end pt-4">
                <Phone
                  src="/screenshots/home.jpg"
                  width={272}
                  calloutClass="top-[34%] -left-2 md:-left-8"
                  callout={<>
                    <div className="text-[13px] font-semibold" style={{ color: D.rosePale }}>86 · Radiant</div>
                    <div className="text-[12px]" style={{ color: D.dim }}>↑ 2 this week</div>
                  </>}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────  PRESS GRID (placeholders)  ───────────────────────── */

// TODO: PLACEHOLDER press — fake logos + fake quotes until real coverage exists.
// Do not ship live as a truthful "as seen in" claim.
const PRESS: { name: string; serif: boolean; quote: string }[] = [
  { name: "VOGUE", serif: true, quote: "“The beauty read every it-girl is quietly obsessed with.”" },
  { name: "ELLE", serif: true, quote: "“Finally, a glow-up you can actually measure.”" },
  { name: "Cosmopolitan", serif: true, quote: "“The most precise face scan we’ve put in a pocket.”" },
  { name: "Harper’s BAZAAR", serif: true, quote: "“Skincare science, minus the guesswork.”" },
  { name: "TechCrunch", serif: false, quote: "“584 landmarks, one score. Lumii nails the read.”" },
  { name: "The Verge", serif: false, quote: "“The rare beauty app that feels genuinely smart.”" },
  { name: "Refinery29", serif: false, quote: "“My whole group chat is on it now.”" },
  { name: "Forbes", serif: true, quote: "“A standout in the AI-beauty wave.”" },
];

function Press() {
  return (
    <section className="py-16 md:py-24" style={{ background: D.bg }}>
      <div className="max-w-[1180px] mx-auto px-6 md:px-10">
        <Reveal><p className="mono-label text-center mb-10" style={{ color: D.dim2 }}>As seen in</p></Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {PRESS.map((p, i) => (
            <Reveal key={p.name} delay={(i % 4) * 0.06}>
              <div className="group relative flex items-center justify-center overflow-hidden rounded-2xl h-[100px] md:h-[120px] px-4" style={{ background: D.card, border: `1px solid ${D.cardLine}` }}>
                <span
                  className="transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-1 text-[19px] md:text-[23px] font-semibold"
                  style={{ color: "rgba(246,241,234,0.5)", letterSpacing: p.serif ? "0.04em" : "-0.01em", fontFamily: p.serif ? "Georgia, 'Times New Roman', serif" : "inherit" }}
                >
                  {p.name}
                </span>
                <span className="absolute inset-0 flex items-center justify-center px-5 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-[13px] md:text-[14px] leading-[1.45] italic" style={{ color: D.dim }}>
                  {p.quote}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal><p className="mono-label text-center mt-6" style={{ color: "rgba(246,241,234,0.22)" }}>Hover for the word on the street</p></Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────  FEATURE CARDS GRID  ───────────────────────── */

const FEATURES: { title: string; sub: string; src: string; tint: string; callout: React.ReactNode; calloutClass: string }[] = [
  {
    title: "Tips from your numbers.", sub: "Every tip traces back to a measurement, with a one-tap add to your daily ritual.",
    src: "/screenshots/tips.jpg", tint: "radial-gradient(ellipse 60% 50% at 70% 20%, rgba(216,106,134,0.22), transparent 65%)",
    calloutClass: "top-[40%] -right-2 md:-right-6", callout: <><div className="text-[12px] font-semibold" style={{ color: D.rosePale }}>Quick win</div><div className="text-[12px]" style={{ color: D.dim }}>Sleep 7–9h → brighter under-eyes</div></>,
  },
  {
    title: "Meet Suki.", sub: "Your Lumii kitten reads your scan and talks you through it. Honest, never cold.",
    src: "/screenshots/suki.jpg", tint: "radial-gradient(ellipse 60% 50% at 30% 20%, rgba(140,110,220,0.2), transparent 65%)",
    calloutClass: "top-[30%] -left-2 md:-left-6", callout: <><div className="text-[12px]" style={{ color: D.text }}>Your jawline is carrying.</div></>,
  },
  {
    title: "Glow with your circle.", sub: "Private 7-day glow sprints with your friends. Only your people ever see it.",
    src: "/screenshots/circle.jpg", tint: "radial-gradient(ellipse 60% 50% at 70% 20%, rgba(216,106,134,0.2), transparent 65%)",
    calloutClass: "bottom-[26%] -right-2 md:-right-6", callout: <><div className="text-[12px] font-semibold" style={{ color: D.rosePale }}>7-day sprint</div><div className="text-[12px]" style={{ color: D.dim }}>5 checked in today</div></>,
  },
  {
    title: "Watch the score move.", sub: "Scan over time and Lumii tracks every metric against your baseline.",
    src: "/screenshots/progress.jpg", tint: "radial-gradient(ellipse 60% 50% at 30% 20%, rgba(120,180,140,0.16), transparent 65%)",
    calloutClass: "top-[34%] -left-2 md:-left-6", callout: <><div className="text-[12px] font-semibold" style={{ color: D.rosePale }}>↑ +2</div><div className="text-[12px]" style={{ color: D.dim }}>this week</div></>,
  },
];

function Features() {
  return (
    <section className="py-8 pb-24 md:pb-32" style={{ background: D.bg }}>
      <div className="max-w-[1180px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-4 md:gap-6">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={(i % 2) * 0.08}>
            <div className="relative rounded-[28px] overflow-hidden h-full p-7 md:p-10" style={{ background: D.card, border: `1px solid ${D.cardLine}` }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: f.tint }} />
              <div className="relative">
                <h3 className="font-display leading-[1.05] tracking-[-0.02em]" style={{ color: D.text, fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>{f.title}</h3>
                <p className="mt-3 max-w-[360px] text-[14px] md:text-[15px] leading-[1.55]" style={{ color: D.dim }}>{f.sub}</p>
                <div className="relative mt-10 flex justify-center">
                  <Phone src={f.src} width={220} callout={f.callout} calloutClass={f.calloutClass} />
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────  PREMIUM  ───────────────────────── */

function Premium() {
  const perks = ["Unlimited scans", "Full 8-category breakdown", "Suki coaching", "Your Circle", "Cycle insight", "Progress history"];
  return (
    <section id="premium" className="relative py-28 md:py-40 overflow-hidden" style={{ background: D.bg2 }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 55% 60% at 78% 30%, rgba(216,106,134,0.22) 0%, transparent 65%)" }} />
      <div className="relative max-w-[1180px] mx-auto px-6 md:px-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <div>
          <div className="mono-label mb-6" style={{ color: D.rosePale }}>Lumii Pro</div>
          <h2 className="font-display leading-[0.94] tracking-[-0.03em]" style={{ color: D.text, fontSize: "clamp(2.6rem,6.4vw,5rem)" }}>
            Go Pro on the <span className="italic" style={{ color: D.rosePale }}>web.</span>
          </h2>
          <p className="mt-6 max-w-[420px] text-[16px] leading-[1.6]" style={{ color: D.dim }}>Same Pro. No app-store middleman.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <motion.a href={PRO_CHECKOUT_URL} className="app-badge group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-[14px] font-semibold" style={{ background: D.text, color: "#000" }} whileHover={{ y: -3 }} whileTap={{ scale: 0.97, y: 0 }} transition={{ type: "spring", stiffness: 420, damping: 26 }}>
              <span aria-hidden className="badge-shine" />
              <span className="relative">Go Pro on the web</span>
              <span className="relative" style={{ fontSize: 15 }}>→</span>
            </motion.a>
            <span className="mono-label" style={{ color: D.dim2 }}>Cancel anytime</span>
          </div>
        </div>
        <div className="rounded-[28px] p-8 md:p-10" style={{ background: D.card, border: `1px solid ${D.cardLine}` }}>
          <div className="mono-label mb-6" style={{ color: D.dim2 }}>What unlocks</div>
          <ul className="flex flex-col gap-4">
            {perks.map((p) => (
              <li key={p} className="flex gap-3 text-[15px]" style={{ color: D.text }}>
                <span style={{ color: D.rosePale }}>✦</span>
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
    <section id="creators" className="py-28 md:py-40" style={{ background: D.bg }}>
      <div className="max-w-[1180px] mx-auto px-6 md:px-10">
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
                  <path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.3.5c1.7.4 2.5.9 3.4 1.6a13.3 13.3 0 0 0-10.9 0c.9-.6 1.8-1.2 3.4-1.6L10.6 3a19.8 19.8 0 0 0-4.9 1.4C2.5 9.1 1.6 13.6 2 18.1a19.9 19.9 0 0 0 6 3l.8-1.3c-.7-.2-1.3-.5-1.9-.9l.5-.3a14.2 14.2 0 0 0 12.2 0l.5.3c-.6.4-1.2.7-1.9.9l.8 1.3a19.9 19.9 0 0 0 6-3c.5-5.2-.8-9.7-3.5-13.7M9.3 15.2c-1 0-1.7-.9-1.7-2s.8-2 1.7-2 1.7.9 1.7 2-.7 2-1.7 2m5.4 0c-1 0-1.7-.9-1.7-2s.8-2 1.7-2 1.7.9 1.7 2-.7 2-1.7 2" />
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
      <div className="max-w-[1180px] mx-auto px-6 md:px-10 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div className="font-display text-[48px] leading-none">Lumii<span style={{ color: D.rosePale }}>.</span></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-4">
            {[
              ["The app", "#app"], ["Premium", "#premium"], ["Creators", "#creators"], ["Tutorial", "/how-it-works"],
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

/* ─────────────────────────  PAGE  ───────────────────────── */

export default function Site() {
  return (
    <main className="relative overflow-x-clip" style={{ background: D.bg }}>
      <Nav />
      <Hero />
      <Intro />
      <Press />
      <BigCard />
      <Features />
      <Premium />
      <Creators />
      <Download />
      <Footer />
    </main>
  );
}
