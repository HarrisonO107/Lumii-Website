"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useMotionValueEvent,
  animate,
} from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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

// Real outbound links.
const APP_STORE_URL = "https://apps.apple.com/app/id6769432089";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.hfjo.lumii";
// TODO: replace with the real Discord invite once created.
const DISCORD_URL = "https://discord.gg/lumii";
// TODO: point at the web Pro checkout (RevenueCat Web Billing) once it exists.
// Until then it routes to the App Store so the CTA is never dead.
const PRO_CHECKOUT_URL = APP_STORE_URL;

// Set this to the number of exported Grok frames in /public/build-frames
// (named frame_0001.jpg .. frame_NNNN.jpg). While 0, the iPhone build falls
// back to the code-built assembly so the section always looks finished.
const BUILD_FRAME_COUNT = 0;

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

/* iPhone 17 Pro device frame holding a screenshot. */
function Plate({
  src,
  fig,
  caption,
  rotate = 0,
  float = false,
  width = 264,
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
      style={{
        background: "transparent",
        color: light ? C.paper : C.ink,
        border: light ? "1px solid rgba(244,238,228,0.35)" : "1px solid rgba(28,24,21,0.16)",
      }}
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
    ["The build", "#build"],
    ["Premium", "#premium"],
    ["Creators", "#creators"],
    ["Tutorial", "/how-it-works"],
  ];
  // Over the dark hero video the bar is light; once scrolled onto paper it inverts.
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
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-[26px] leading-none" style={{ color: fg }}>Lumii</span>
          <span className="font-display text-[26px] leading-none italic" style={{ color: C.rose }}>·</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="mono-label hover:opacity-100 transition-opacity" style={{ opacity: 0.78, color: fg }}>
              {label}
            </a>
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

/* ─────────────────────────  HERO (full-bleed Suki video)  ───────────────────────── */

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
      {/* full-bleed looping Suki, drifts toward the cursor */}
      <motion.video
        src="/video/suki-hero.mp4"
        poster="/video/suki-hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ x: vx, y: vy, scale: 1.12 }}
      />
      {/* legibility scrims: darken top for nav, paper-fade bottom for copy */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(20,12,14,0.45) 0%, transparent 22%, transparent 45%, rgba(20,12,14,0.30) 78%, rgba(20,12,14,0.72) 100%)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 38%, transparent 40%, rgba(20,12,14,0.35) 100%)" }} />

      <div className="relative h-full max-w-[1320px] mx-auto px-6 md:px-10 flex flex-col justify-end pb-[12vh]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          className="max-w-[760px]"
        >
          <h1 className="font-display leading-[0.9] tracking-[-0.03em]" style={{ color: C.paper, fontSize: "clamp(3rem, 9vw, 7.5rem)" }}>
            <span className="block">Your face,</span>
            <span className="block">by the <span className="italic" style={{ color: C.rosePale }}>numbers.</span></span>
          </h1>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <AppleBadge light />
            <GoogleBadge light />
          </div>
          <div className="mt-6 flex items-center gap-3 text-[13px]" style={{ color: "rgba(244,238,228,0.78)" }}>
            <span style={{ color: C.rosePale, letterSpacing: "0.1em" }}>★★★★★</span>
            <span><strong style={{ color: C.paper, fontWeight: 600 }}>5.0</strong> on the App Store</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span><strong style={{ color: C.paper, fontWeight: 600 }}>300+</strong> glowing up</span>
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="mono-label" style={{ color: "rgba(244,238,228,0.7)" }}>Scroll to build</span>
        <span style={{ color: "rgba(244,238,228,0.7)", fontSize: 18 }}>↓</span>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────  THE BUILD  ─────────────────────────
   Grok frame-sequence scrubber (when frames exist) or a code-built
   iPhone 17 Pro assembly fallback. Both pin and scrub on scroll. */

function FrameScrubber({ count }: { count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useEffect(() => {
    imgs.current = [];
    for (let i = 1; i <= count; i++) {
      const im = new Image();
      im.src = `/build-frames/frame_${String(i).padStart(4, "0")}.jpg`;
      imgs.current[i - 1] = im;
    }
  }, [count]);

  const draw = (p: number) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const idx = Math.min(count - 1, Math.max(0, Math.round(p * (count - 1))));
    const im = imgs.current[idx];
    ctx.clearRect(0, 0, c.width, c.height);
    if (!im || !im.complete || !im.naturalWidth) return;
    const r = Math.min(c.width / im.naturalWidth, c.height / im.naturalHeight);
    const w = im.naturalWidth * r;
    const h = im.naturalHeight * r;
    ctx.drawImage(im, (c.width - w) / 2, (c.height - h) / 2, w, h);
  };

  useMotionValueEvent(scrollYProgress, "change", draw);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
      draw(scrollYProgress.get());
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="build" ref={ref} className="relative" style={{ height: "420vh", background: C.paperDeep }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className="absolute top-[12vh] left-1/2 -translate-x-1/2 text-center px-6">
          <div className="mono-label flex items-center justify-center gap-3" style={{ color: C.ink45 }}>
            <span style={{ color: C.rose }}>The build</span>
            <span className="w-10 h-px" style={{ background: C.line }} />
            <span>Engineered for your face</span>
          </div>
          <h2 className="font-display mt-4 leading-[0.96] tracking-[-0.02em]" style={{ color: C.ink, fontSize: "clamp(2rem,5vw,3.4rem)" }}>
            Built like the <span className="italic" style={{ color: C.rose }}>hardware</span> it runs on.
          </h2>
        </div>
      </div>
    </section>
  );
}

function NativeBuild() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // body assembles, camera pops onto the back, phone spins to front, screen boots.
  const bodyOp = useTransform(scrollYProgress, [0.03, 0.16], [0, 1]);
  const bodyY = useTransform(scrollYProgress, [0.03, 0.18], [90, 0]);
  const camScale = useTransform(scrollYProgress, [0.14, 0.3], [0.4, 1]);
  const camOp = useTransform(scrollYProgress, [0.14, 0.28], [0, 1]);
  const spin = useTransform(scrollYProgress, [0.34, 0.62], [180, 360]); // back -> front
  const islandScale = useTransform(scrollYProgress, [0.6, 0.72], [0, 1]);
  const flash = useTransform(scrollYProgress, [0.6, 0.7, 0.82], [0, 0.9, 0]);
  const appOp = useTransform(scrollYProgress, [0.64, 0.8], [0, 1]);
  const k1o = useTransform(scrollYProgress, [0.6, 0.72], [0, 1]);
  const k1y = useTransform(scrollYProgress, [0.6, 0.72], [28, 0]);
  const k2o = useTransform(scrollYProgress, [0.72, 0.86], [0, 1]);
  const k2y = useTransform(scrollYProgress, [0.72, 0.86], [28, 0]);

  const PHW = "clamp(220px, 50vw, 286px)";
  const titanium = "linear-gradient(150deg,#dad6d0 0%,#a8a49d 22%,#cfcbc4 47%,#8f8b84 73%,#c3bfb8 100%)";
  const lens =
    "radial-gradient(circle at 38% 32%, #4a4e57 0%, #20222a 42%, #0a0b0e 72%)";

  // one camera lens: dark glass + metallic ring + specular dot
  const Lens = ({ top, left }: { top: string; left: string }) => (
    <div
      className="absolute rounded-full"
      style={{ top, left, width: "14cqw", height: "14cqw", background: lens, border: "0.8cqw solid #2b2d33", boxShadow: "inset 0 0 1.5cqw rgba(0,0,0,0.8), 0 0.4cqw 1cqw rgba(0,0,0,0.4)" }}
    >
      <span className="absolute rounded-full" style={{ top: "20%", left: "24%", width: "26%", height: "26%", background: "radial-gradient(circle, rgba(255,255,255,0.7), transparent 70%)" }} />
    </div>
  );

  return (
    <section id="build" ref={ref} className="relative" style={{ height: "400vh", background: C.paperDeep }}>
      <div className="ruler-x absolute top-0 inset-x-0 h-[10px] opacity-50" />
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="w-full max-w-[1320px] mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center order-2 lg:order-1" style={{ perspective: 1400 }}>
            <div className="relative">
              {/* ground shadow */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 pointer-events-none" style={{ width: "62%", height: "26px", background: "radial-gradient(ellipse, rgba(60,30,40,0.28), transparent 70%)", filter: "blur(4px)" }} />
              <div className="atelier-float">
                <motion.div
                  className="device relative"
                  style={{ width: PHW, aspectRatio: "1206 / 2622", transformStyle: "preserve-3d", rotateY: spin, opacity: bodyOp, y: bodyY }}
                >
                  {/* BACK FACE: titanium body + camera plateau */}
                  <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: "16cqw", background: titanium, border: "0.6cqw solid rgba(255,255,255,0.35)", boxShadow: "inset 0 0 4cqw rgba(255,255,255,0.4), inset 0 0 8cqw rgba(0,0,0,0.18), 0 50px 90px -40px rgba(60,40,50,0.5)" }}>
                    <motion.div className="absolute" style={{ top: "5%", left: "7%", width: "42cqw", height: "42cqw", borderRadius: "12cqw", background: "linear-gradient(150deg,#3a3a40,#141417)", border: "0.5cqw solid rgba(255,255,255,0.12)", boxShadow: "inset 0 0 3cqw rgba(0,0,0,0.7), 0 1cqw 3cqw rgba(0,0,0,0.35)", scale: camScale, opacity: camOp }}>
                      <Lens top="6%" left="6%" />
                      <Lens top="6%" left="52%" />
                      <Lens top="52%" left="6%" />
                      {/* flash */}
                      <span className="absolute rounded-full" style={{ top: "60%", left: "60%", width: "8cqw", height: "8cqw", background: "radial-gradient(circle,#fff8e6,#c9a24a 70%)", boxShadow: "0 0 1cqw rgba(255,240,200,0.6)" }} />
                      {/* lidar */}
                      <span className="absolute rounded-full" style={{ top: "30%", left: "70%", width: "5cqw", height: "5cqw", background: "radial-gradient(circle,#2a2c33,#0a0b0e)" }} />
                    </motion.div>
                    {/* etched wordmark */}
                    <span className="absolute left-1/2 -translate-x-1/2 font-display italic" style={{ top: "46%", color: "rgba(60,55,52,0.45)", fontSize: "9cqw" }}>L</span>
                  </div>

                  {/* FRONT FACE: screen powers on */}
                  <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                    <div className="device-rail absolute inset-0">
                      <div className="device-bezel">
                        <div className="device-screen">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <motion.img src="/screenshots/home.jpg" alt="Lumii on iPhone" style={{ opacity: appOp }} />
                          <motion.div className="absolute inset-0" style={{ background: "#FBF7EF", opacity: flash }} />
                          <motion.div className="absolute left-1/2 -translate-x-1/2" style={{ top: "2.6%", width: "32%", height: "3.4%", background: "#050506", borderRadius: "999px", scale: islandScale }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="mono-label flex items-center gap-3 mb-6">
              <span style={{ color: C.rose }}>The build</span>
              <span className="w-10 h-px" style={{ background: C.line }} />
              <span>Scroll to assemble</span>
            </div>
            <motion.h2 className="font-display leading-[0.98] tracking-[-0.02em]" style={{ color: C.ink, fontSize: "clamp(2.2rem,5vw,3.8rem)", opacity: k1o, y: k1y }}>
              Engineered like the <span className="italic" style={{ color: C.rose }}>phone</span> it runs on.
            </motion.h2>
            <motion.p className="mono-label mt-7" style={{ opacity: k2o, y: k2y }}>
              Built for iPhone · Free on iOS &amp; Android
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BuildSection() {
  return BUILD_FRAME_COUNT > 0 ? <FrameScrubber count={BUILD_FRAME_COUNT} /> : <NativeBuild />;
}

/* ─────────────────────────  METRICS MARQUEE  ───────────────────────── */

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

/* ─────────────────────────  THE APP (showcase)  ───────────────────────── */

const SHOWCASE: { src: string; fig: string; cap: string; kick: string; title: React.ReactNode; body: string; flip?: boolean }[] = [
  {
    src: "/screenshots/breakdown.jpg", fig: "Fig. 01", cap: "Every trait, ranked", kick: "The read",
    title: <>A score that finally <span className="italic" style={{ color: C.rose }}>means</span> something.</>,
    body: "Eight categories, each measured against clinically-studied ideals, with the exact numbers behind every line.",
  },
  {
    src: "/screenshots/tips.jpg", fig: "Fig. 02", cap: "Quick wins, from your numbers", kick: "The routine", flip: true,
    title: <>Advice tied to your <span className="italic" style={{ color: C.rose }}>actual</span> measurements.</>,
    body: "Every tip traces back to a number on your report. One tap adds it to your daily ritual.",
  },
  {
    src: "/screenshots/suki.jpg", fig: "Fig. 03", cap: "Your Lumii kitten", kick: "Suki",
    title: <>Meet <span className="italic" style={{ color: C.rose }}>Suki.</span></>,
    body: "Honest, never cold. Suki reads your scan, talks you through it, and grows with you.",
  },
  {
    src: "/screenshots/circle.jpg", fig: "Fig. 04", cap: "Glow with your friends", kick: "The circle", flip: true,
    title: <>Better with your <span className="italic" style={{ color: C.rose }}>girls.</span></>,
    body: "Build a private Circle, run a 7-day glow sprint, share the proof. Only your people ever see it.",
  },
];

function Showcase() {
  return (
    <section id="app" className="py-24 md:py-36" style={{ background: C.paper }}>
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <Reveal>
          <div className="mono-label flex items-center gap-3 mb-10">
            <span style={{ color: C.rose }}>§ The app</span>
            <span className="w-10 h-px" style={{ background: C.line }} />
            <span>Show, don&apos;t tell</span>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.96] tracking-[-0.02em] max-w-[16ch] mb-16 md:mb-24" style={{ color: C.ink, fontSize: "clamp(2.4rem,6vw,4.6rem)" }}>
            Everything your face has been <span className="italic" style={{ color: C.rose }}>trying to tell you.</span>
          </h2>
        </Reveal>

        <div className="flex flex-col gap-28 md:gap-40">
          {SHOWCASE.map((s, i) => (
            <div key={s.fig} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <Reveal className={`flex justify-center ${s.flip ? "lg:order-2 lg:justify-start" : "lg:justify-end"}`}>
                <Plate src={s.src} fig={s.fig} caption={s.cap} rotate={s.flip ? 2.5 : -2.5} float={i % 2 === 0} width={272} />
              </Reveal>
              <Reveal delay={0.1} className={s.flip ? "lg:order-1" : ""}>
                <div className="mono-label flex items-center gap-3 mb-6">
                  <span style={{ color: C.rose }}>{s.kick}</span>
                  <span className="w-8 h-px" style={{ background: C.line }} />
                </div>
                <h3 className="font-display leading-[1.0] tracking-[-0.02em]" style={{ color: C.ink, fontSize: "clamp(2rem,4.4vw,3.2rem)" }}>{s.title}</h3>
                <p className="mt-5 max-w-[440px] text-[15px] leading-[1.75]" style={{ color: C.ink60 }}>{s.body}</p>
              </Reveal>
            </div>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-3 gap-5 max-w-[560px]">
          {[
            { n: 584, s: "", l: "Landmarks" },
            { n: 75, s: "+", l: "Metrics" },
            { n: 8, s: "", l: "Categories" },
          ].map((stat, i) => (
            <Reveal key={stat.l} delay={0.1 + i * 0.08}>
              <div className="pt-4" style={{ borderTop: "1px solid rgba(28,24,21,0.16)" }}>
                <div className="font-display text-[clamp(2.2rem,5vw,3rem)] leading-none" style={{ color: C.ink }}>
                  <Counter to={stat.n} suffix={stat.s} />
                </div>
                <div className="mono-label mt-2">{stat.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  PREMIUM (web push)  ───────────────────────── */

function Premium() {
  const perks = [
    "Unlimited scans, scan as often as you glow",
    "The full 8-category breakdown, every number unlocked",
    "Suki coaching, real talk on every result",
    "Your Circle, sprints and glow proof with friends",
    "Cycle insight, skin read against your phase",
    "Progress history, every photo and trend kept",
  ];
  return (
    <section id="premium" className="relative py-28 md:py-40 overflow-hidden" style={{ background: C.ink, color: C.paper }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 55% 60% at 78% 30%, rgba(194,86,111,0.22) 0%, transparent 65%)" }} />
      <div className="ruler-x absolute top-0 inset-x-0 h-[10px] opacity-30" />
      <div className="relative max-w-[1320px] mx-auto px-5 md:px-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <div>
          <div className="mono-label flex items-center gap-3 mb-6" style={{ color: "rgba(244,238,228,0.55)" }}>
            <span style={{ color: C.rosePale }}>Lumii Pro</span>
            <span className="w-10 h-px" style={{ background: "rgba(244,238,228,0.2)" }} />
            <span>Straight from us</span>
          </div>
          <h2 className="font-display leading-[0.94] tracking-[-0.02em]" style={{ fontSize: "clamp(2.6rem,6.4vw,5rem)" }}>
            Go Pro on the <span className="italic" style={{ color: C.rosePale }}>web.</span>
          </h2>
          <p className="mt-6 max-w-[420px] text-[15px] md:text-[16px] leading-[1.7]" style={{ color: "rgba(244,238,228,0.75)" }}>
            Same Pro, straight from us. Unlocks instantly on iPhone and Android.
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
            <span className="mono-label" style={{ color: "rgba(244,238,228,0.5)" }}>Cancel anytime · Secure checkout</span>
          </div>
        </div>

        <div className="rounded-[28px] p-8 md:p-10" style={{ background: "rgba(244,238,228,0.05)", border: "1px solid rgba(244,238,228,0.12)" }}>
          <div className="mono-label mb-6" style={{ color: "rgba(244,238,228,0.5)" }}>What unlocks</div>
          <ul className="flex flex-col gap-4">
            {perks.map((p) => {
              const [head, ...rest] = p.split(", ");
              return (
                <li key={p} className="flex gap-3 text-[14px] leading-[1.5]" style={{ color: "rgba(244,238,228,0.82)" }}>
                  <span style={{ color: C.rosePale }}>✦</span>
                  <span><strong style={{ color: C.paper, fontWeight: 600 }}>{head}</strong>{rest.length ? `, ${rest.join(", ")}` : ""}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  CREATORS (Discord funnel)  ───────────────────────── */

function Creators() {
  const perks = [
    ["Get paid per post", "Earn for every Lumii edit that goes live. The more it performs, the more you make."],
    ["Early everything", "First access to new features, drops and assets, straight from the team."],
    ["A direct line", "Pitch ideas, request edits, and shape the app in our creator channels."],
  ];
  return (
    <section id="creators" className="py-28 md:py-40" style={{ background: C.paperDeep }}>
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <div className="grid lg:grid-cols-[1fr_0.85fr] gap-14 items-center">
          <div>
            <Reveal>
              <div className="mono-label flex items-center gap-3 mb-6">
                <span style={{ color: C.rose }}>Creator program</span>
                <span className="w-10 h-px" style={{ background: C.line }} />
                <span>Built by girls, for girls</span>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display leading-[0.94] tracking-[-0.02em]" style={{ color: C.ink, fontSize: "clamp(2.6rem,6.4vw,5rem)" }}>
                Make edits. <span className="italic" style={{ color: C.rose }}>Get paid.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-[420px] text-[15px] md:text-[16px] leading-[1.7]" style={{ color: C.ink60 }}>
                We pay creators to make Lumii edits. Grab a brief, post, get paid.
              </p>
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

/* ─────────────────────────  DOWNLOAD CTA  ───────────────────────── */

function Download() {
  return (
    <section id="download" className="relative py-28 md:py-40 overflow-hidden" style={{ background: C.paper }}>
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
        <Reveal delay={0.3}>
          <div className="mt-6 flex items-center justify-center gap-3 text-[13px]" style={{ color: C.ink60 }}>
            <span style={{ color: C.rose, letterSpacing: "0.1em" }}>★★★★★</span>
            <span><strong style={{ color: C.ink, fontWeight: 600 }}>5.0</strong> rating</span>
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
          <div>
            <div className="font-display text-[48px] leading-none">
              Lumii<span className="italic" style={{ color: C.rosePale }}>.</span>
            </div>
            <p className="mono-label mt-5" style={{ color: "rgba(244,238,228,0.5)" }}>Built for girls</p>
          </div>
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
    <main className="relative overflow-x-clip">
      <Nav />
      <Hero />
      <BuildSection />
      <MetricsBand />
      <Showcase />
      <Premium />
      <Creators />
      <Download />
      <Footer />
    </main>
  );
}
