"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Purchases, PackageType, type Package } from "@revenuecat/purchases-js";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Light, warm, glassmorphic palette
const L = {
  ink: "#27191F",
  dim: "rgba(39,25,31,0.62)",
  dim2: "rgba(39,25,31,0.42)",
  rose: "#C2566F",
  roseDeep: "#A23E56",
  rosePale: "#E7B8C2",
  glass: "rgba(255,255,255,0.55)",
  glassStrong: "rgba(255,255,255,0.72)",
  line: "rgba(255,255,255,0.85)",
  glow: "rgba(194,86,111,0.35)",
};

const KEY = process.env.NEXT_PUBLIC_RC_WEB_KEY || "";
const APP_STORE_URL = "https://apps.apple.com/app/id6769432089";

function priceOf(p?: Package): string {
  const prod = p as unknown as { webBillingProduct?: { currentPrice?: { formattedPrice?: string } }; rcBillingProduct?: { currentPrice?: { formattedPrice?: string } } } | undefined;
  return prod?.webBillingProduct?.currentPrice?.formattedPrice || prod?.rcBillingProduct?.currentPrice?.formattedPrice || "";
}

function glassStyle(strong = false): React.CSSProperties {
  return {
    background: strong ? L.glassStrong : L.glass,
    backdropFilter: "blur(22px) saturate(150%)",
    WebkitBackdropFilter: "blur(22px) saturate(150%)",
    border: `1px solid ${L.line}`,
    boxShadow: "0 20px 50px -24px rgba(120,40,60,0.30), inset 0 1px 0 rgba(255,255,255,0.7)",
  };
}

export default function Pro() {
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pkgs, setPkgs] = useState<Package[]>([]);
  const [cycle, setCycle] = useState<"annual" | "monthly">("annual");
  const [busy, setBusy] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  // temporary diagnostics — visit /pro?debug=1 to inspect what RevenueCat returns
  const [showDebug, setShowDebug] = useState(false);
  const [dbg, setDbg] = useState<{ offerings: string[]; current: string | null; used: string | null; packages: { id: string; type: string; price: string }[] } | null>(null);

  useEffect(() => {
    setShowDebug(new URLSearchParams(window.location.search).has("debug"));
    (async () => {
      try {
        if (!KEY) throw new Error("Checkout key missing");
        const uid = new URLSearchParams(window.location.search).get("uid") || `web_${crypto.randomUUID()}`;
        try {
          Purchases.configure(KEY, uid);
        } catch {
          /* already configured */
        }
        const offerings = await Purchases.getSharedInstance().getOfferings();
        const web = offerings.all["web"] ?? offerings.current;
        const list = web?.availablePackages ?? [];
        setPkgs(list);
        setDbg({
          offerings: Object.keys(offerings.all),
          current: offerings.current?.identifier ?? null,
          used: web?.identifier ?? null,
          packages: list.map((p) => ({ id: p.identifier, type: p.packageType, price: priceOf(p) })),
        });
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Couldn't load checkout");
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // match by package TYPE first (reliable), fall back to predefined identifier
  const find = (id: string) => pkgs.find((p) => p.identifier === id);
  const byType = (t: PackageType, id: string) => pkgs.find((p) => p.packageType === t) ?? find(id);
  const monthly = byType(PackageType.Monthly, "$rc_monthly");
  const annual = byType(PackageType.Annual, "$rc_annual");
  const scans = [
    { p: find("$rc_custom_scan_single"), n: "1 scan", tag: "", best: false },
    { p: find("$rc_custom_scan_3pack"), n: "3 scans", tag: "Save ~16%", best: false },
    { p: find("$rc_custom_scan_10pack"), n: "10 scans", tag: "Save ~25%", best: true },
  ];
  const proPkg = cycle === "annual" ? annual : monthly;

  async function buy(p?: Package) {
    if (!p || busy) return;
    setBusy(p.identifier);
    setErr(null);
    try {
      await Purchases.getSharedInstance().purchase({ rcPackage: p });
      setDone(p.identifier);
    } catch (e) {
      const m = e instanceof Error ? e.message : "Purchase failed";
      if (!/cancel|closed|dismiss/i.test(m)) setErr(m);
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-clip" style={{ color: L.ink, background: "linear-gradient(180deg, #FDF5F3 0%, #F8EAE7 50%, #F3E0E2 100%)" }}>
      {/* TEMP diagnostics — /pro?debug=1 */}
      {showDebug && (
        <pre className="fixed bottom-3 left-3 z-[200] max-w-[92vw] max-h-[60vh] overflow-auto rounded-lg p-3 text-[11px] leading-snug" style={{ background: "rgba(0,0,0,0.88)", color: "#7CFF9B", border: "1px solid #333" }}>
          {`ready: ${ready}\nerr: ${err ?? "none"}\nkey: ${KEY ? KEY.slice(0, 8) + "…" : "MISSING"}\n` + JSON.stringify(dbg, null, 2)}
        </pre>
      )}

      {/* soft rose blooms */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 45% at 50% -5%, rgba(231,184,194,0.55) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 30%, rgba(194,86,111,0.18) 0%, transparent 60%)" }} />

      {/* nav */}
      <header className="fixed top-4 inset-x-0 z-[90] flex justify-center px-4">
        <div className="flex items-center gap-1 rounded-full py-2 pl-3 pr-2" style={glassStyle(true)}>
          <Link href="/" className="block rounded-full overflow-hidden mr-1" style={{ width: 30, height: 30, border: "1px solid rgba(0,0,0,0.06)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.png" alt="Lumii" className="w-full h-full object-cover" />
          </Link>
          <nav className="hidden sm:flex items-center">
            {([["The app", "/#app"], ["Premium", "/#premium"], ["Creators", "/#creators"]] as [string, string][]).map(([l, h]) => (
              <Link key={h} href={h} className="px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-colors hover:opacity-100" style={{ color: L.dim }}>{l}</Link>
            ))}
          </nav>
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center rounded-full px-4 py-2 text-[13px] font-semibold" style={{ background: L.ink, color: "#fff" }}>Get the app</a>
        </div>
      </header>

      <section className="relative max-w-[1040px] mx-auto px-6 md:px-10 pt-32 md:pt-36 pb-28">
        {/* Suki + headline */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="text-center max-w-[720px] mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="rounded-full overflow-hidden" style={{ width: 92, height: 92, border: `2px solid ${L.line}`, boxShadow: `0 14px 40px -12px ${L.glow}` }}>
                <video src="/video/suki-avatar.mp4" autoPlay loop muted playsInline aria-hidden className="w-full h-full object-cover" style={{ objectPosition: "center 32%", transform: "scale(1.15)" }} />
              </div>
              <div className="absolute -right-3 -top-2 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide" style={{ background: L.rose, color: "#fff", boxShadow: `0 6px 18px -6px ${L.glow}` }}>web only 🤍</div>
            </div>
          </div>
          <div className="mono-label mb-4" style={{ color: L.rose }}>Lumii Pro · web-only deals</div>
          <h1 className="font-display leading-[0.96] tracking-[-0.03em]" style={{ fontSize: "clamp(2.5rem,6.5vw,4.6rem)" }}>
            Go Pro, plus deals you <span style={{ color: L.rose }}>only get here.</span>
          </h1>
          <p className="mt-6 text-[16px] md:text-[18px] leading-[1.6]" style={{ color: L.dim }}>
            Same Pro, same price as the app, unlocks instantly on every device. Buy direct and you also unlock scan bundles you can&apos;t get anywhere else.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-[13px]" style={{ color: L.dim }}>
            <span style={{ color: L.rose, letterSpacing: "0.1em" }}>★★★★★</span>
            <span><strong style={{ color: L.ink, fontWeight: 600 }}>5.0</strong> · loved by 300+</span>
          </div>
        </motion.div>

        {/* reason chips */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
          {["Same price as the app", "Bundles only sold here", "Unlocks on all your devices", "Cancel anytime"].map((t) => (
            <span key={t} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium" style={{ ...glassStyle(), color: L.ink }}>
              <span style={{ color: L.rose }}>✓</span> {t}
            </span>
          ))}
        </div>

        {/* SCANS — web-exclusive deals lead, so it's the first thing they see */}
        <div className="mt-12 mx-auto max-w-[820px]">
          <div className="text-center">
            <span className="inline-block rounded-full px-3 py-1 text-[11px] font-bold tracking-wide mb-4" style={{ background: L.rose, color: "#fff" }}>WEB EXCLUSIVE</span>
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] tracking-[-0.02em]">Scan bundles you can <span style={{ color: L.rose }}>only get here.</span></h2>
            <p className="mt-3 text-[15px]" style={{ color: L.dim }}>Stock up and pay less per scan. Bundles aren&apos;t sold in the app, only on the web.</p>
          </div>
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {scans.map(({ p, n, tag, best }) => (
              <div key={n} className="relative rounded-[22px] p-6 flex flex-col text-center" style={{ ...glassStyle(best), border: `1px solid ${best ? L.rosePale : L.line}`, boxShadow: best ? `0 22px 50px -18px ${L.glow}` : glassStyle().boxShadow }}>
                {best && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide whitespace-nowrap" style={{ background: L.rose, color: "#fff" }}>BEST VALUE</span>}
                <div className="font-display text-[22px]">{n}</div>
                <div className="mt-1 text-[12px]" style={{ color: L.rose, minHeight: 16 }}>{tag}</div>
                <div className="mt-3 font-display text-[30px]">{ready ? priceOf(p) || "—" : "…"}</div>
                <button onClick={() => buy(p)} disabled={!ready || !p || !!busy} className="mt-5 rounded-full px-5 py-2.5 text-[14px] font-semibold transition-transform active:scale-95 disabled:opacity-60" style={{ background: best ? L.rose : "rgba(39,25,31,0.06)", color: best ? "#fff" : L.ink }}>
                  {busy === p?.identifier ? "Opening…" : "Buy"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* PRO */}
        <div className="mt-16 rounded-[28px] p-6 md:p-9 mx-auto max-w-[760px]" style={glassStyle(true)}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="font-display text-[24px]">Lumii Pro</h2>
            <div className="inline-flex rounded-full p-1" style={{ background: "rgba(39,25,31,0.06)" }}>
              {(["annual", "monthly"] as const).map((c) => (
                <button key={c} onClick={() => setCycle(c)} className="rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors" style={{ background: cycle === c ? L.ink : "transparent", color: cycle === c ? "#fff" : L.dim }}>
                  {c === "annual" ? "Annual" : "Monthly"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-end gap-3 flex-wrap">
            <span className="font-display leading-none" style={{ fontSize: "clamp(2.6rem,7vw,3.6rem)" }}>{ready ? priceOf(proPkg) || "—" : "…"}</span>
            <span className="mb-2 text-[14px]" style={{ color: L.dim }}>/ {cycle === "annual" ? "year" : "month"}</span>
            {cycle === "annual" && <span className="mb-2 ml-1 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: L.rose, color: "#fff" }}>Best value</span>}
          </div>

          <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-[14px]">
            {["Unlimited scans", "Full 8-category breakdown", "Suki coaching", "Your Circle", "Cycle insight", "Progress history"].map((f) => (
              <li key={f} className="flex gap-2"><span style={{ color: L.rose }}>✦</span><span>{f}</span></li>
            ))}
          </ul>

          <motion.button
            onClick={() => buy(proPkg)}
            disabled={!ready || !proPkg || !!busy}
            className="app-badge group relative mt-8 inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-[16px] font-bold w-full disabled:opacity-60"
            style={{ background: `linear-gradient(120deg, ${L.rose}, ${L.roseDeep})`, color: "#fff", boxShadow: `0 16px 44px -12px ${L.glow}` }}
            whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
          >
            <span aria-hidden className="badge-shine" />
            <span className="relative">{busy === proPkg?.identifier ? "Opening checkout…" : "Go Pro"}</span>
            <span className="relative" style={{ fontSize: 16 }}>→</span>
          </motion.button>
          <p className="mono-label mt-4 text-center" style={{ color: L.dim2 }}>Apple&nbsp;Pay · cards · secure checkout · tax handled</p>
        </div>

        {/* warm sign-off */}
        <div className="mt-16 text-center max-w-[560px] mx-auto">
          <p className="text-[15px] leading-[1.7]" style={{ color: L.dim }}>
            We&apos;re a small team building Lumii. Buying direct means more of what you pay goes straight into making the app better. 🤍
          </p>
          <p className="mono-label mt-4" style={{ color: L.dim2 }}>— The Lumii team</p>
        </div>

        {err && <p className="mt-8 text-center text-[14px]" style={{ color: L.roseDeep }}>⚠ {err}</p>}
      </section>

      {done && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6" style={{ background: "rgba(247,234,231,0.7)", backdropFilter: "blur(8px)" }}>
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[28px] p-10 text-center max-w-[420px]" style={glassStyle(true)}>
            <div className="font-display text-[28px]">You&apos;re in 🤍</div>
            <p className="mt-3 text-[15px]" style={{ color: L.dim }}>
              {done.includes("scan") ? "Your scans are added." : "Pro is unlocked, everywhere."} Open the Lumii app and it&apos;ll be waiting.
            </p>
            <Link href="/" className="inline-flex mt-7 rounded-full px-6 py-3 text-[14px] font-semibold" style={{ background: L.ink, color: "#fff" }}>Done</Link>
          </motion.div>
        </div>
      )}
    </main>
  );
}
