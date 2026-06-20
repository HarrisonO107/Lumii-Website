"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform, useScroll, animate } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Live store listings, the real outbound links on the page.
const APP_STORE_URL = "https://apps.apple.com/app/id6769432089";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.hfjo.lumii";

// Design tokens as explicit values, Lightning CSS prunes :root vars only used
// in JSX inline styles, so we keep the palette here.
const C = {
  paper: "#F4EEE4",
  paperDeep: "#ECE3D3",
  paperCard: "#FBF7EF",
  ink: "#1C1815",
  ink80: "rgba(28,24,21,0.80)",
  ink60: "rgba(28,24,21,0.60)",
  ink45: "rgba(28,24,21,0.45)",
  ink30: "rgba(28,24,21,0.30)",
  line: "rgba(28,24,21,0.16)",
  rose: "#C2566F",
  roseDeep: "#A23E56",
  rosePale: "#E7B8C2",
  forest: "#3B5A3E",
};

/* ─────────────────────────  PRIMITIVES  ───────────────────────── */

function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
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

function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.5, ease: EASE, onUpdate: (x) => setV(x) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function AppleBadge({ primary = true }: { primary?: boolean }) {
  return (
    <motion.a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Lumii on the App Store"
      className="app-badge group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-5 py-3"
      style={
        primary
          ? { background: C.ink, color: C.paper }
          : { background: "transparent", color: C.ink, border: "1px solid rgba(28,24,21,0.16)" }
      }
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
    >
      {/* shine sweep */}
      <span aria-hidden className="badge-shine" />
      <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden className="relative">
        <path d="M17.05 12.04c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.82 0-2.07-.92-3.41-.9-1.75.03-3.37 1.02-4.27 2.59-1.82 3.16-.47 7.83 1.31 10.4.87 1.26 1.9 2.67 3.25 2.62 1.31-.05 1.8-.85 3.38-.85 1.57 0 2.01.85 3.39.82 1.4-.02 2.29-1.28 3.14-2.55.99-1.46 1.4-2.87 1.42-2.95-.03-.01-2.72-1.04-2.75-4.13M14.6 4.59c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.08 3.18 1.15.09 2.32-.58 3.03-1.45" />
      </svg>
      <span className="relative text-left leading-none">
        <span className="block text-[8px] tracking-[0.18em] uppercase opacity-60 font-mono">Download on the</span>
        <span className="block text-[14px] font-semibold mt-[3px]">App Store</span>
      </span>
      <span
        aria-hidden
        className="relative ml-0.5 max-w-0 overflow-hidden text-[14px] opacity-0 transition-all duration-300 group-hover:max-w-[18px] group-hover:opacity-70"
      >
        ↗
      </span>
    </motion.a>
  );
}

function GoogleBadge() {
  return (
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
      <span
        aria-hidden
        className="relative ml-0.5 max-w-0 overflow-hidden text-[14px] opacity-0 transition-all duration-300 group-hover:max-w-[18px] group-hover:opacity-70"
      >
        ↗
      </span>
    </motion.a>
  );
}

/* phone-screenshot "plate" with print crop marks */
function Plate({
  src,
  fig,
  caption,
  rotate = 0,
  float = false,
  width = 300,
}: {
  src: string;
  fig: string;
  caption: string;
  rotate?: number;
  float?: boolean;
  width?: number | string;
}) {
  return (
    <figure className="relative" style={{ width }}>
      <div style={{ transform: `rotate(${rotate}deg)` }}>
        <div className={float ? "atelier-float" : ""}>
          <div className="device relative">
            {/* corner crop marks */}
            {[
              "top-[-14px] left-[-14px] border-l border-t",
              "top-[-14px] right-[-14px] border-r border-t",
              "bottom-[-14px] left-[-14px] border-l border-b",
              "bottom-[-14px] right-[-14px] border-r border-b",
            ].map((c) => (
              <span key={c} className={`absolute z-10 w-3 h-3 ${c}`} style={{ borderColor: C.ink30 }} />
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
      </div>
      <figcaption className="mono-label mt-5 flex items-center gap-2">
        <span style={{ color: C.rose }}>{fig}</span>
        <span className="h-px flex-1" style={{ background: C.line }} />
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────  MASTHEAD  ───────────────────────── */

function Masthead() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
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
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-[26px] leading-none" style={{ color: C.ink }}>
            Lumii
          </span>
          <span className="font-display text-[26px] leading-none italic" style={{ color: C.rose }}>
            ·
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {[
            ["The read", "#read"],
            ["Suki", "#suki"],
            ["Circle", "#circle"],
            ["Tutorial", "/how-it-works"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="mono-label hover:opacity-100 transition-opacity" style={{ opacity: 0.7 }}>
              {label}
            </a>
          ))}
        </nav>

        <motion.a
          href="#get"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold"
          style={{ background: C.ink, color: C.paper }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95, y: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
        >
          Download
          <span style={{ fontSize: 14 }}>↗</span>
        </motion.a>
      </div>
    </header>
  );
}

/* ─────────────────────────  HERO, "THE COVER"  ───────────────────────── */
/* Static editorial cover, no pinning, no scroll scrubbing. The left column
   is the masthead copy; the right is one developed read plate, same visual
   language as every Plate below (crop marks, fig caption, mono labels). */

/* Suki video portal, she parallax-follows the cursor so she appears to watch you.
   The baked video can't move its own eyes, so the whole portal leans toward the
   pointer (3D tilt + counter-parallax on the footage) to read as "watching". */
function SukiPortal() {
  const mx = useMotionValue(0); // -1..1 across the viewport
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 16 });
  const sy = useSpring(my, { stiffness: 80, damping: 16 });

  const rotY = useTransform(sx, [-1, 1], [10, -10]);
  const rotX = useTransform(sy, [-1, 1], [-7, 7]);
  const vidX = useTransform(sx, [-1, 1], [16, -16]); // footage drifts opposite the tilt
  const vidY = useTransform(sy, [-1, 1], [12, -12]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <div className="relative flex justify-center lg:justify-end" style={{ perspective: 1100 }}>
      {/* soft rose halo */}
      <div
        className="absolute inset-0 -m-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(194,86,111,0.18) 0%, transparent 70%)" }}
      />
      <motion.div
        className="atelier-float relative"
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" } as never}
      >
        <div
          className="relative overflow-hidden"
          style={{
            width: "clamp(280px, 34vw, 420px)",
            aspectRatio: "4 / 5",
            borderRadius: "2.6rem",
            border: "1px solid rgba(28,24,21,0.14)",
            boxShadow: "0 50px 90px -40px rgba(120,40,60,0.45), 0 8px 24px rgba(120,40,60,0.14)",
          }}
        >
          {/* the looping footage, scaled up so parallax drift never reveals an edge */}
          <motion.video
            src="/video/suki-hero.mp4"
            poster="/video/suki-hero-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ x: vidX, y: vidY, scale: 1.18 }}
          />
          {/* paper-tone vignette + grain edge to seat it in the broadsheet */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: "inset 0 0 60px 12px rgba(244,238,228,0.55)", borderRadius: "2.6rem" }}
          />
          {/* score chip, ties the mascot to the app's read */}
          <div
            className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full px-3 py-2"
            style={{ background: "rgba(28,24,21,0.78)", color: C.paper, backdropFilter: "blur(6px)" }}
          >
            <span className="font-display text-[20px] leading-none">86</span>
            <span className="mono-label" style={{ color: "rgba(244,238,228,0.7)" }}>Radiant</span>
          </div>
        </div>

        {/* corner crop marks, same editorial motif as the plates */}
        {[
          "top-[-14px] left-[-14px] border-l border-t",
          "top-[-14px] right-[-14px] border-r border-t",
          "bottom-[-14px] left-[-14px] border-l border-b",
          "bottom-[-14px] right-[-14px] border-r border-b",
        ].map((c) => (
          <span key={c} className={`absolute w-3 h-3 ${c}`} style={{ borderColor: C.ink30 }} />
        ))}
      </motion.div>

      <figcaption className="mono-label absolute -bottom-9 right-0 flex items-center gap-2" style={{ width: "clamp(280px, 34vw, 420px)" }}>
        <span style={{ color: C.rose }}>Fig. 00</span>
        <span className="h-px flex-1" style={{ background: C.line }} />
        <span>Suki, your companion</span>
      </figcaption>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex items-center" style={{ background: C.paper, minHeight: "100svh" }}>
      <div className="ruler-y absolute left-0 top-0 bottom-0 w-[10px] hidden md:block" style={{ opacity: 0.5 }} />

      <div className="w-full max-w-[1320px] mx-auto px-6 md:px-10 pt-[108px] pb-16 md:pb-20 grid lg:grid-cols-[1fr_minmax(0,440px)] gap-14 lg:gap-16 items-center">
        {/* copy */}
        <div className="relative z-10">
          <div className="mono-label flex items-center gap-3 mb-6">
            <span style={{ color: C.rose }}>Vol. 01</span>
            <span className="w-8 h-px" style={{ background: C.line }} />
            <span>The science of your face</span>
          </div>

          <h1 className="font-display leading-[0.92] tracking-[-0.03em]" style={{ color: C.ink, fontSize: "clamp(2.6rem, 6.4vw, 5rem)" }}>
            <span className="block">Your face,</span>
            <span className="block">
              by the <span className="italic" style={{ color: C.rose }}>numbers.</span>
            </span>
          </h1>

          <p className="mt-6 max-w-[440px] text-[15px] md:text-[16px] leading-[1.7]" style={{ color: C.ink60 }}>
            584 landmarks. 75 measurements. The most precise beauty read ever put in a
            pocket, one number that finally means something.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <AppleBadge />
            <GoogleBadge />
          </div>

          <p className="mono-label mt-7">Free to download · Live now on iOS &amp; Android</p>
        </div>

        {/* Suki, the looping companion video that watches your cursor */}
        <SukiPortal />
      </div>
    </section>
  );
}

/* ─────────────────────────  BUILD SCENE  ───────────────────────── */
/* Scroll-scrubbed iPhone 17 assembly: titanium rail rises, the screen drops in,
   buttons and Dynamic Island lock on, then the Lumii app powers onto the glass
   and the claim lands. All driven by this section's scroll progress. */
function BuildScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const railY = useTransform(scrollYProgress, [0.05, 0.3], [180, 0]);
  const railRot = useTransform(scrollYProgress, [0.05, 0.3], [9, 0]);
  const railOp = useTransform(scrollYProgress, [0.05, 0.22], [0, 1]);

  const screenY = useTransform(scrollYProgress, [0.12, 0.4], [-200, 0]);
  const screenOp = useTransform(scrollYProgress, [0.12, 0.32], [0, 1]);

  const islandScale = useTransform(scrollYProgress, [0.3, 0.44], [0, 1]);
  const lBtnX = useTransform(scrollYProgress, [0.24, 0.46], [-90, 0]);
  const rBtnX = useTransform(scrollYProgress, [0.24, 0.46], [90, 0]);
  const btnOp = useTransform(scrollYProgress, [0.24, 0.42], [0, 1]);

  const flash = useTransform(scrollYProgress, [0.42, 0.5, 0.6], [0, 0.85, 0]);
  const appOp = useTransform(scrollYProgress, [0.48, 0.64], [0, 1]);
  const appScale = useTransform(scrollYProgress, [0.48, 0.64], [1.08, 1]);

  const k1o = useTransform(scrollYProgress, [0.58, 0.7], [0, 1]);
  const k1y = useTransform(scrollYProgress, [0.58, 0.7], [28, 0]);
  const k2o = useTransform(scrollYProgress, [0.7, 0.84], [0, 1]);
  const k2y = useTransform(scrollYProgress, [0.7, 0.84], [28, 0]);
  const k3o = useTransform(scrollYProgress, [0.8, 0.92], [0, 1]);
  const k3y = useTransform(scrollYProgress, [0.8, 0.92], [28, 0]);

  const PHW = "clamp(220px, 50vw, 286px)";

  return (
    <section ref={ref} className="relative" style={{ height: "360vh", background: C.paperDeep }}>
      <div className="ruler-x absolute top-0 inset-x-0 h-[10px] opacity-50" />
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="w-full max-w-[1320px] mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* phone */}
          <div className="flex justify-center order-2 lg:order-1" style={{ perspective: 1200 }}>
            <div className="device relative" style={{ width: PHW, aspectRatio: "1206 / 2622", transformStyle: "preserve-3d" }}>
              {/* side buttons */}
              <motion.span className="device-btn action" style={{ x: lBtnX, opacity: btnOp }} />
              <motion.span className="device-btn vol-up" style={{ x: lBtnX, opacity: btnOp }} />
              <motion.span className="device-btn vol-dn" style={{ x: lBtnX, opacity: btnOp }} />
              <motion.span className="device-btn power" style={{ x: rBtnX, opacity: btnOp }} />

              {/* titanium rail */}
              <motion.div className="device-rail absolute inset-0" style={{ y: railY, rotateZ: railRot, opacity: railOp }}>
                <div className="device-bezel">
                  {/* screen panel drops in */}
                  <motion.div className="device-screen" style={{ y: screenY, opacity: screenOp }}>
                    {/* Lumii app powers on */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <motion.img src="/screenshots/home.jpg" alt="Lumii on iPhone" style={{ opacity: appOp, scale: appScale }} />
                    {/* power-on flash */}
                    <motion.div className="absolute inset-0" style={{ background: "#FBF7EF", opacity: flash }} />
                    {/* Dynamic Island locks on */}
                    <motion.div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{ top: "2.6%", width: "32%", height: "3.4%", background: "#050506", borderRadius: "999px", scale: islandScale }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* claim */}
          <div className="order-1 lg:order-2">
            <div className="mono-label flex items-center gap-3 mb-6">
              <span style={{ color: C.rose }}>The build</span>
              <span className="w-10 h-px" style={{ background: C.line }} />
              <span>Scroll to assemble</span>
            </div>
            <motion.h2
              className="font-display leading-[0.98] tracking-[-0.02em]"
              style={{ color: C.ink, fontSize: "clamp(2.2rem,5vw,3.8rem)", opacity: k1o, y: k1y }}
            >
              Engineered like the <span className="italic" style={{ color: C.rose }}>phone</span> it runs on.
            </motion.h2>
            <motion.p className="mt-6 max-w-[440px] text-[15px] leading-[1.75]" style={{ color: C.ink60, opacity: k2o, y: k2y }}>
              584 landmarks. 75+ measurements. Lumii turns the iPhone in your pocket into the most precise mirror ever
              made, then builds you the routine to raise the number.
            </motion.p>
            <motion.p className="mono-label mt-7" style={{ opacity: k3o, y: k3y }}>
              Built for iPhone · Free on iOS &amp; Android
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  METRICS BAND  ───────────────────────── */

function MetricsBand() {
  const items = ["584 Landmarks", "75 Measurements", "8 Categories", "5 Skin Zones", "Cycle Aware", "Glow With Friends", "3 Photos", "Under 30 Seconds"];
  const row = [...items, ...items];
  return (
    <section className="py-5 overflow-hidden" style={{ background: C.ink, color: C.paper }}>
      <div className="flex whitespace-nowrap atelier-marquee">
        {row.map((t, i) => (
          <span key={i} className="flex items-center font-mono text-[12px] tracking-[0.16em] uppercase">
            <span className="px-7" style={{ opacity: 0.92 }}>{t}</span>
            <span style={{ color: C.rose }}>✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────  THE READ  ───────────────────────── */

function TheRead() {
  return (
    <section id="read" className="py-24 md:py-36">
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <Reveal>
          <div className="mono-label flex items-center gap-3 mb-10">
            <span style={{ color: C.rose }}>§ 01</span>
            <span className="w-10 h-px" style={{ background: C.line }} />
            <span>The read</span>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-14 lg:gap-10 items-center">
          <div>
            <Reveal>
              <h2 className="font-display leading-[0.98] tracking-[-0.02em]" style={{ color: C.ink, fontSize: "clamp(2.2rem,5vw,3.8rem)" }}>
                A score that finally <span className="italic" style={{ color: C.rose }}>means</span> something.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[460px] text-[15px] leading-[1.75]" style={{ color: C.ink60 }}>
                Eight categories, each scored on its own, symmetry, harmony, eyes, nose, lips, jaw, skin and
                proportions. Not a vibe. A measured read of your face against clinically-studied ideals, with the
                exact numbers behind every line.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-3 gap-5 max-w-[460px]">
              {[
                { n: 584, s: "", l: "Landmarks" },
                { n: 75, s: "+", l: "Metrics" },
                { n: 8, s: "", l: "Categories" },
              ].map((stat, i) => (
                <Reveal key={stat.l} delay={0.15 + i * 0.08}>
                  <div className="pt-4" style={{ borderTop: "1px solid rgba(28,24,21,0.16)" }}>
                    <div className="font-display text-[40px] leading-none" style={{ color: C.ink }}>
                      <Counter to={stat.n} suffix={stat.s} />
                    </div>
                    <div className="mono-label mt-2">{stat.l}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.15} className="flex justify-center lg:justify-end">
            <Plate src="/screenshots/breakdown.jpg" fig="Fig. 02" caption="The breakdown, every trait ranked" rotate={2} width={272} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  PULL QUOTE  ───────────────────────── */

function PullQuote() {
  return (
    <section className="py-20 md:py-28" style={{ background: C.paperDeep }}>
      <div className="max-w-[1000px] mx-auto px-6 text-center">
        <Reveal>
          <p className="mono-label mb-7" style={{ color: C.rose }}>From a sample report</p>
        </Reveal>
        <Reveal delay={0.08}>
          <blockquote className="font-display italic leading-[1.12] tracking-[-0.01em]" style={{ color: C.ink, fontSize: "clamp(1.8rem,4.6vw,3.4rem)" }}>
            “A defined lower third anchors the whole read, your intercanthal width is a strength.”
          </blockquote>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mono-label mt-8">Suki, on an 86 · Read: Radiant</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────  FEATURE PLATE  ───────────────────────── */

function FeaturePlate({
  index,
  src,
  fig,
  caption,
  kicker,
  title,
  body,
  flip = false,
}: {
  index: string;
  src: string;
  fig: string;
  caption: string;
  kicker: string;
  title: React.ReactNode;
  body: string;
  flip?: boolean;
}) {
  return (
    <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center`}>
      <Reveal className={`flex justify-center ${flip ? "lg:order-2 lg:justify-start" : "lg:justify-end"}`}>
        <Plate src={src} fig={fig} caption={caption} rotate={flip ? 2.5 : -2.5} width={264} />
      </Reveal>
      <Reveal delay={0.1} className={flip ? "lg:order-1" : ""}>
        <div className="mono-label flex items-center gap-3 mb-6">
          <span style={{ color: C.rose }}>{index}</span>
          <span className="w-8 h-px" style={{ background: C.line }} />
          <span>{kicker}</span>
        </div>
        <h3 className="font-display leading-[1.0] tracking-[-0.02em]" style={{ color: C.ink, fontSize: "clamp(2rem,4.4vw,3.2rem)" }}>
          {title}
        </h3>
        <p className="mt-5 max-w-[440px] text-[15px] leading-[1.75]" style={{ color: C.ink60 }}>
          {body}
        </p>
      </Reveal>
    </div>
  );
}

function Features() {
  return (
    <section className="py-24 md:py-36">
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 flex flex-col gap-28 md:gap-40">
        <FeaturePlate
          index="§ 02"
          src="/screenshots/tips.jpg"
          fig="Fig. 03"
          caption="Tips, built from your numbers"
          kicker="The routine"
          title={<>Advice tied to your <span className="italic" style={{ color: C.rose }}>actual</span> measurements.</>}
          body="Every tip traces back to a number on your report, skin, jaw, eye area, under-eyes. The why behind it, the steps to do it, and a one-tap add to your daily goals."
        />
        <FeaturePlate
          flip
          index="§ 03"
          src="/screenshots/progress.jpg"
          fig="Fig. 04"
          caption="Progress, your glow, trending"
          kicker="Progress"
          title={<>Watch the score <span className="italic" style={{ color: C.rose }}>move.</span></>}
          body="Scan again over time and Lumii tracks every metric against your baseline. Streaks, milestones, before-and-after photos, and a trend line that turns a glow-up from a guess into something you can measure."
        />
        <FeaturePlate
          index="§ 04"
          src="/screenshots/cycle.jpg"
          fig="Fig. 05"
          caption="Cycle, glow that knows your phase"
          kicker="Cycle aware"
          title={<>A glow that knows your <span className="italic" style={{ color: C.rose }}>cycle.</span></>}
          body="Lumii reads your skin against where you are in your cycle, follicular, luteal, the lot. It tells you what's coming, what to lean into, and why your face shifts week to week."
        />
      </div>
    </section>
  );
}

/* ─────────────────────────  HOW IT WORKS  ───────────────────────── */

function HowItWorks() {
  const steps = [
    { n: "I", t: "Scan", b: "Front, left, right. The guided camera lines you up, three photos in under thirty seconds." },
    { n: "II", t: "Measure", b: "584 landmarks mapped, 75+ metrics scored against clinically-studied ideals." },
    { n: "III", t: "Glow", b: "A precise breakdown, a routine tied to your numbers, and Suki to keep you at it." },
  ];
  return (
    <section id="how" className="py-24 md:py-32" style={{ background: C.ink, color: C.paper }}>
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <Reveal>
          <div className="mono-label flex items-center gap-3 mb-12" style={{ color: "rgba(244,238,228,0.5)" }}>
            <span style={{ color: C.rosePale }}>§ 05</span>
            <span className="w-10 h-px" style={{ background: "rgba(244,238,228,0.2)" }} />
            <span>The method</span>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-px" style={{ background: "rgba(244,238,228,0.14)" }}>
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12} className="h-full">
              <div className="h-full px-7 py-10 md:py-14" style={{ background: C.ink }}>
                <div className="font-display text-[clamp(3rem,6vw,5rem)] leading-none" style={{ color: C.rosePale }}>{s.n}</div>
                <h3 className="font-display text-[26px] mt-5" style={{ color: C.paper }}>{s.t}</h3>
                <p className="mt-3 text-[14px] leading-[1.7]" style={{ color: "rgba(244,238,228,0.6)" }}>{s.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  MOMO  ───────────────────────── */

function Suki() {
  return (
    <section id="suki" className="py-24 md:py-36">
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-14 items-center">
          <div>
            <Reveal>
              <div className="mono-label flex items-center gap-3 mb-6">
                <span style={{ color: C.rose }}>§ 06</span>
                <span className="w-8 h-px" style={{ background: C.line }} />
                <span>The companion</span>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display leading-[0.98] tracking-[-0.02em]" style={{ color: C.ink, fontSize: "clamp(2.2rem,5vw,3.8rem)" }}>
                Meet <span className="italic" style={{ color: C.rose }}>Suki.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-[420px] text-[15px] leading-[1.75]" style={{ color: C.ink60 }}>
                Your read is honest, but never cold. Suki, your Lumii kitten, turns your goals into a daily ritual,
                cheers every streak, and talks you through each score. Name her, level her up, and she grows with you.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex gap-8">
                <div>
                  <div className="font-display text-[34px] leading-none" style={{ color: C.ink }}>Lv 1</div>
                  <div className="mono-label mt-2">Grows with you</div>
                </div>
                <div>
                  <div className="font-display text-[34px] leading-none" style={{ color: C.ink }}>Daily</div>
                  <div className="mono-label mt-2">Ritual & streaks</div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="relative rounded-[28px] px-5 sm:px-6 py-12 md:py-16 flex justify-center gap-4 sm:gap-6 overflow-hidden" style={{ background: C.paperDeep }}>
            <Reveal className="mt-8">
              <Plate src="/screenshots/goals.jpg" fig="Fig. 06" caption="Today's ritual" rotate={-3} width="clamp(132px, 38vw, 210px)" />
            </Reveal>
            <Reveal delay={0.12} className="-mt-2">
              <Plate src="/screenshots/suki.jpg" fig="Fig. 07" caption="Chat with Suki" rotate={3} float width="clamp(132px, 38vw, 210px)" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  CIRCLE  ───────────────────────── */

function Circle() {
  return (
    <section id="circle" className="py-24 md:py-36" style={{ background: C.paperDeep }}>
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
          <div className="relative rounded-[28px] px-5 sm:px-6 py-12 md:py-16 flex justify-center gap-4 sm:gap-6 overflow-hidden" style={{ background: C.paperCard }}>
            <Reveal className="mt-8">
              <Plate src="/screenshots/circle.jpg" fig="Fig. 08" caption="Your circle" rotate={-3} width="clamp(132px, 38vw, 210px)" />
            </Reveal>
            <Reveal delay={0.12} className="-mt-2">
              <Plate src="/screenshots/proof.jpg" fig="Fig. 09" caption="Glow proof" rotate={3} float width="clamp(132px, 38vw, 210px)" />
            </Reveal>
          </div>

          <div className="lg:order-2">
            <Reveal>
              <div className="mono-label flex items-center gap-3 mb-6">
                <span style={{ color: C.rose }}>§ 07</span>
                <span className="w-8 h-px" style={{ background: C.line }} />
                <span>The circle</span>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display leading-[0.98] tracking-[-0.02em]" style={{ color: C.ink, fontSize: "clamp(2.2rem,5vw,3.8rem)" }}>
                Glow with your <span className="italic" style={{ color: C.rose }}>friends.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-[420px] text-[15px] leading-[1.75]" style={{ color: C.ink60 }}>
                Build your Circle, run a 7-day glow sprint together, and share the proof of a good day, skincare done,
                steps walked, water in. Private to the people you invite. Beauty maths is better with your girls.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex gap-8">
                <div>
                  <div className="font-display text-[34px] leading-none" style={{ color: C.ink }}>Sprints</div>
                  <div className="mono-label mt-2">7-day, together</div>
                </div>
                <div>
                  <div className="font-display text-[34px] leading-none" style={{ color: C.ink }}>Private</div>
                  <div className="mono-label mt-2">Only your circle</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  CLOSING CTA  ───────────────────────── */

function Closing() {
  return (
    <section id="get" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(194,86,111,0.14) 0%, transparent 68%)" }} />
      <div className="ruler-x absolute top-0 inset-x-0 h-[10px] opacity-60" />
      <div className="ruler-x absolute bottom-0 inset-x-0 h-[10px] opacity-60" />

      <div className="relative max-w-[900px] mx-auto px-6 text-center">
        <Reveal>
          <p className="mono-label mb-8">Free to download · iOS &amp; Android</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.92] tracking-[-0.03em]" style={{ color: C.ink, fontSize: "clamp(2.8rem,8vw,6rem)" }}>
            Read your <span className="italic" style={{ color: C.rose }}>face.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-[440px] mx-auto text-[15px] leading-[1.7]" style={{ color: C.ink60 }}>
            See what 584 landmarks reveal, and the routine to raise your score. Free to download.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <AppleBadge />
            <GoogleBadge />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────  COLOPHON  ───────────────────────── */

function Colophon() {
  return (
    <footer style={{ background: C.ink, color: C.paper }}>
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div>
            <div className="font-display text-[48px] leading-none">
              Lumii<span className="italic" style={{ color: C.rosePale }}>.</span>
            </div>
            <p className="mono-label mt-5" style={{ color: "rgba(244,238,228,0.5)" }}>Built for girls</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-4">
            {[
              ["The read", "#read"],
              ["Suki", "#suki"],
              ["Circle", "#circle"],
              ["Tutorial", "/how-it-works"],
              ["Privacy", "/legal/privacy-policy"],
              ["Terms", "/legal/terms-of-service"],
              ["Contact", "mailto:hello@lumiiapp.com"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="text-[13px] transition-opacity hover:opacity-100" style={{ color: "rgba(244,238,228,0.62)" }}>
                {l}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-14 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderTop: "1px solid rgba(244,238,228,0.14)" }}>
          <p className="mono-label" style={{ color: "rgba(244,238,228,0.4)" }}>Vol. 01 · The Face Issue · Designed in London</p>
          <p className="mono-label" style={{ color: "rgba(244,238,228,0.4)" }}>© {new Date().getFullYear()} HFJO&amp;CO Limited</p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────  PAGE  ───────────────────────── */

export default function Site() {
  return (
    // overflow-x-clip (NOT hidden): clips the rotated plates' horizontal
    // bleed without turning <main> into a scroll container.
    <main className="relative overflow-x-clip">
      <Masthead />
      <Hero />
      <BuildScene />
      <MetricsBand />
      <TheRead />
      <PullQuote />
      <Features />
      <HowItWorks />
      <Suki />
      <Circle />
      <Closing />
      <Colophon />
    </main>
  );
}
