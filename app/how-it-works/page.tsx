"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const C = {
  paper: "#F4EEE4",
  paperDeep: "#ECE3D3",
  paperCard: "#FBF7EF",
  ink: "#1C1815",
  ink60: "rgba(28,24,21,0.60)",
  line: "rgba(28,24,21,0.16)",
  rose: "#C2566F",
  rosePale: "#E7B8C2",
};

const APP_STORE_URL = "https://apps.apple.com/app/id6769432089";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.hfjo.lumii";

/* ── primitives ── */

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

function Plate({ src, fig, caption, rotate = 0, width = 252 }: { src: string; fig: string; caption: string; rotate?: number; width?: number | string }) {
  return (
    <figure className="relative" style={{ width }}>
      <div style={{ transform: `rotate(${rotate}deg)` }}>
        <div className="device relative">
          {[
            "top-[-14px] left-[-14px] border-l border-t",
            "top-[-14px] right-[-14px] border-r border-t",
            "bottom-[-14px] left-[-14px] border-l border-b",
            "bottom-[-14px] right-[-14px] border-r border-b",
          ].map((c) => (
            <span key={c} className={`absolute z-10 w-3 h-3 ${c}`} style={{ borderColor: "rgba(28,24,21,0.30)" }} />
          ))}
          <span className="device-btn action" />
          <span className="device-btn vol-up" />
          <span className="device-btn vol-dn" />
          <span className="device-btn power" />
          <div className="device-rail">
            <div className="device-bezel">
              <div className="device-screen">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={caption} draggable={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mono-label mt-5 flex items-center gap-2">
        <span style={{ color: C.rose }}>{fig}</span>
        <span className="h-px flex-1" style={{ background: C.line }} />
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}

function StoreBadges({ center = false }: { center?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${center ? "justify-center" : ""}`}>
      <motion.a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download Lumii on the App Store"
        className="app-badge group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-5 py-3"
        style={{ background: C.ink, color: C.paper }}
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
      <motion.a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get Lumii on Google Play"
        className="app-badge group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-5 py-3"
        style={{ background: "transparent", color: C.ink, border: "1px solid rgba(28,24,21,0.16)" }}
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
    </div>
  );
}

/* ── chapters ── */

type Chapter = {
  index: string;
  kicker: string;
  src: string;
  fig: string;
  caption: string;
  title: React.ReactNode;
  body: string;
};

const CHAPTERS: Chapter[] = [
  {
    index: "01",
    kicker: "The scan",
    src: "/screenshots/home.jpg",
    fig: "Fig. 01",
    caption: "Home, your daily score",
    title: <>Three photos. One <span className="italic" style={{ color: C.rose }}>number.</span></>,
    body: "Front, left, right, the guided camera lines you up in under thirty seconds. Lumii maps 584 landmarks and 75+ measurements, then hands back a single score out of 100. That's your read for the day.",
  },
  {
    index: "02",
    kicker: "The breakdown",
    src: "/screenshots/breakdown.jpg",
    fig: "Fig. 02",
    caption: "Every trait, ranked",
    title: <>See exactly <span className="italic" style={{ color: C.rose }}>why.</span></>,
    body: "Eight categories scored on their own, symmetry, harmony, eyes, nose, lips, jaw, skin and proportions. Lumii calls out your standout trait, ranks everything against clinically-studied ideals, and shows the numbers behind each line.",
  },
  {
    index: "03",
    kicker: "The tips",
    src: "/screenshots/tips.jpg",
    fig: "Fig. 03",
    caption: "Quick wins, tied to your read",
    title: <>Advice from your <span className="italic" style={{ color: C.rose }}>own</span> numbers.</>,
    body: "Every tip traces back to a measurement, under-eyes, skin, jaw, posture. The why behind it, the steps to do it, and a one-tap add straight to your daily goals. No generic listicles.",
  },
  {
    index: "04",
    kicker: "Suki",
    src: "/screenshots/suki.jpg",
    fig: "Fig. 04",
    caption: "Your Lumii kitten",
    title: <>Meet <span className="italic" style={{ color: C.rose }}>Suki.</span></>,
    body: "Suki reads your scan and talks you through it, honest, never cold. Ask for your quick win, your worst area first, or just real talk. Name her, level her up, and she grows with every scan.",
  },
  {
    index: "05",
    kicker: "The ritual",
    src: "/screenshots/goals.jpg",
    fig: "Fig. 05",
    caption: "Today's missions",
    title: <>One ritual a <span className="italic" style={{ color: C.rose }}>day.</span></>,
    body: "Your tips become a short daily ritual and a set of missions. Mark them done to build a streak, earn XP, and keep Suki levelling. Small, repeatable, and built from what your face actually needs.",
  },
  {
    index: "06",
    kicker: "Progress",
    src: "/screenshots/progress.jpg",
    fig: "Fig. 06",
    caption: "Your glow, trending",
    title: <>Watch the score <span className="italic" style={{ color: C.rose }}>move.</span></>,
    body: "Scan again over time and Lumii tracks every metric against your baseline. A trend line, before-and-after photos, best and average, streaks and milestones, a glow-up you can measure instead of guess.",
  },
  {
    index: "07",
    kicker: "Cycle aware",
    src: "/screenshots/cycle.jpg",
    fig: "Fig. 07",
    caption: "Glow that knows your phase",
    title: <>A glow that knows your <span className="italic" style={{ color: C.rose }}>cycle.</span></>,
    body: "Log your cycle and Lumii reads your skin against the phase you're in, follicular, luteal, the lot. It tells you what's coming, what to lean into, and why your face shifts week to week.",
  },
  {
    index: "08",
    kicker: "Your circle",
    src: "/screenshots/circle.jpg",
    fig: "Fig. 08",
    caption: "Glow with your friends",
    title: <>Better with your <span className="italic" style={{ color: C.rose }}>girls.</span></>,
    body: "Build a private Circle, run a 7-day glow sprint together, and keep each other moving. Only the people you invite ever see it, no public feed, no strangers, just your people.",
  },
  {
    index: "09",
    kicker: "Glow proof",
    src: "/screenshots/proof.jpg",
    fig: "Fig. 09",
    caption: "Share the proof of a good day",
    title: <>Show your circle the <span className="italic" style={{ color: C.rose }}>proof.</span></>,
    body: "Skincare done, ten thousand steps, water in, no sugar, check off your day and share it with your Circle. Totally optional, and only your circle sees it. Accountability that feels like a group chat.",
  },
  {
    index: "10",
    kicker: "Invite & Pro",
    src: "/screenshots/invite.jpg",
    fig: "Fig. 10",
    caption: "Give 7 days, get 7 days",
    title: <>Invite friends, unlock <span className="italic" style={{ color: C.rose }}>Pro.</span></>,
    body: "Every friend who joins with your code unlocks 7 days of Lumii Pro, for them and for you. Climb the reward ladder for bonus weeks, a bonus month, and the Founding Inviter badge.",
  },
];

/* ── page ── */

export default function HowItWorksPage() {
  return (
    <main className="relative overflow-x-clip" style={{ background: C.paper, color: C.ink }}>
      {/* header */}
      <header className="max-w-[1320px] mx-auto px-6 md:px-10 pt-8 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-[24px] leading-none" style={{ color: C.ink }}>Lumii</span>
          <span className="font-display text-[24px] leading-none italic" style={{ color: C.rose }}>·</span>
        </Link>
        <Link href="/" className="mono-label hover:opacity-100 transition-opacity" style={{ opacity: 0.7 }}>
          ← Back home
        </Link>
      </header>

      {/* hero */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-16">
        <Reveal>
          <div className="mono-label flex items-center gap-3 mb-6">
            <span style={{ color: C.rose }}>The tutorial</span>
            <span className="w-8 h-px" style={{ background: C.line }} />
            <span>Everything Lumii does</span>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="font-display leading-[0.94] tracking-[-0.03em] max-w-[14ch]" style={{ fontSize: "clamp(2.6rem,7vw,5.4rem)" }}>
            How it all <span className="italic" style={{ color: C.rose }}>works.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-[460px] text-[15px] md:text-[16px] leading-[1.7]" style={{ color: C.ink60 }}>
            Scan to score, score to routine, routine to glow, and your circle along for the ride. Ten steps, start to finish.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-9">
            <StoreBadges />
          </div>
        </Reveal>
      </section>

      {/* chapters */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-10 pb-8 flex flex-col gap-24 md:gap-36">
        {CHAPTERS.map((ch, i) => {
          const flip = i % 2 === 1;
          return (
            <div key={ch.index} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <Reveal className={`flex justify-center ${flip ? "lg:order-2 lg:justify-start" : "lg:justify-end"}`}>
                <Plate src={ch.src} fig={ch.fig} caption={ch.caption} rotate={flip ? 2.5 : -2.5} width={248} />
              </Reveal>
              <Reveal delay={0.1} className={flip ? "lg:order-1" : ""}>
                <div className="flex items-baseline gap-4 mb-5">
                  <span className="font-display leading-none" style={{ color: C.rosePale, fontSize: "clamp(2.4rem,5vw,3.6rem)" }}>{ch.index}</span>
                  <span className="mono-label">{ch.kicker}</span>
                </div>
                <h2 className="font-display leading-[1.02] tracking-[-0.02em]" style={{ fontSize: "clamp(1.9rem,4.2vw,3rem)" }}>
                  {ch.title}
                </h2>
                <p className="mt-5 max-w-[440px] text-[15px] leading-[1.75]" style={{ color: C.ink60 }}>
                  {ch.body}
                </p>
              </Reveal>
            </div>
          );
        })}
      </section>

      {/* closing CTA */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(194,86,111,0.14) 0%, transparent 68%)" }} />
        <div className="relative max-w-[900px] mx-auto px-6 text-center">
          <Reveal>
            <p className="mono-label mb-8">Free to download · iOS &amp; Android</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display leading-[0.94] tracking-[-0.03em]" style={{ fontSize: "clamp(2.6rem,7vw,5rem)" }}>
              Now read your <span className="italic" style={{ color: C.rose }}>face.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-10 flex justify-center">
              <StoreBadges center />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
