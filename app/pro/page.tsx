"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Purchases, type Package } from "@revenuecat/purchases-js";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const D = {
  bg: "#0B0910",
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

const KEY = process.env.NEXT_PUBLIC_RC_WEB_KEY || "";

function priceOf(p?: Package): string {
  // webBillingProduct on newer SDKs, rcBillingProduct on older
  const prod = (p as unknown as { webBillingProduct?: { currentPrice?: { formattedPrice?: string } }; rcBillingProduct?: { currentPrice?: { formattedPrice?: string } } } | undefined);
  return prod?.webBillingProduct?.currentPrice?.formattedPrice || prod?.rcBillingProduct?.currentPrice?.formattedPrice || "";
}

export default function Pro() {
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pkgs, setPkgs] = useState<Package[]>([]);
  const [cycle, setCycle] = useState<"annual" | "monthly">("annual");
  const [busy, setBusy] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!KEY) throw new Error("Checkout key missing");
        const uid = new URLSearchParams(window.location.search).get("uid") || `web_${crypto.randomUUID()}`;
        try {
          Purchases.configure(KEY, uid);
        } catch {
          /* already configured (HMR / revisit) */
        }
        const offerings = await Purchases.getSharedInstance().getOfferings();
        const web = offerings.all["web"] ?? offerings.current;
        setPkgs(web?.availablePackages ?? []);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Failed to load checkout");
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const find = (id: string) => pkgs.find((p) => p.identifier === id);
  const monthly = find("$rc_monthly");
  const annual = find("$rc_annual");
  const scans = [
    { p: find("$rc_custom_scan_single"), n: "1 scan", per: "", best: false },
    { p: find("$rc_custom_scan_3pack"), n: "3 scans", per: "Save ~16%", best: false },
    { p: find("$rc_custom_scan_10pack"), n: "10 scans", per: "Save ~25%", best: true },
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
    <main className="relative min-h-screen overflow-x-clip" style={{ background: D.bg, color: D.text }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(216,106,134,0.18) 0%, transparent 60%)" }} />

      <header className="relative max-w-[1000px] mx-auto px-6 md:px-10 pt-8 flex items-center justify-between">
        <Link href="/" className="font-display text-[24px] leading-none">Lumii<span style={{ color: D.rose }}>.</span></Link>
        <Link href="/" className="mono-label hover:opacity-100 transition-opacity" style={{ opacity: 0.7 }}>← Back</Link>
      </header>

      <section className="relative max-w-[1000px] mx-auto px-6 md:px-10 pt-14 md:pt-20 pb-28">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
          <div className="mono-label mb-5" style={{ color: D.rosePale }}>Lumii Pro · on the web</div>
          <h1 className="font-display leading-[0.95] tracking-[-0.03em]" style={{ fontSize: "clamp(2.6rem,6vw,4.6rem)" }}>
            Go Pro. <span className="italic" style={{ color: D.rosePale }}>Straight from us.</span>
          </h1>
          <p className="mt-5 max-w-[460px] text-[16px] leading-[1.6]" style={{ color: D.dim }}>
            Same Pro, no app-store middleman. Unlocks instantly on iPhone and Android.
          </p>
        </motion.div>

        {/* PRO */}
        <div className="mt-12 rounded-[28px] p-6 md:p-9" style={{ background: "linear-gradient(160deg,#1b1424,#120f18)", border: `1px solid ${D.cardLine}` }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="font-display text-[24px]">Lumii Pro</h2>
            <div className="inline-flex rounded-full p-1" style={{ background: "rgba(255,255,255,0.06)" }}>
              {(["annual", "monthly"] as const).map((c) => (
                <button key={c} onClick={() => setCycle(c)} className="rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors" style={{ background: cycle === c ? D.text : "transparent", color: cycle === c ? "#000" : D.dim }}>
                  {c === "annual" ? "Annual" : "Monthly"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span className="font-display leading-none" style={{ fontSize: "clamp(2.4rem,6vw,3.4rem)" }}>{ready ? (priceOf(proPkg) || "—") : "…"}</span>
            <span className="mb-2 text-[14px]" style={{ color: D.dim }}>/ {cycle === "annual" ? "year" : "month"}</span>
            {cycle === "annual" && <span className="mb-2 ml-1 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: D.roseDeep, color: "#fff" }}>Best value</span>}
          </div>

          <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-[14px]" style={{ color: D.dim }}>
            {["Unlimited scans", "Full 8-category breakdown", "Suki coaching", "Your Circle", "Cycle insight", "Progress history"].map((f) => (
              <li key={f} className="flex gap-2"><span style={{ color: D.rosePale }}>✦</span><span style={{ color: D.text }}>{f}</span></li>
            ))}
          </ul>

          <motion.button
            onClick={() => buy(proPkg)}
            disabled={!ready || !proPkg || !!busy}
            className="app-badge group relative mt-8 inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-3.5 text-[15px] font-semibold w-full sm:w-auto disabled:opacity-60"
            style={{ background: D.text, color: "#000" }}
            whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
          >
            <span aria-hidden className="badge-shine" />
            <span className="relative">{busy === proPkg?.identifier ? "Opening checkout…" : "Go Pro"}</span>
            <span className="relative" style={{ fontSize: 15 }}>→</span>
          </motion.button>
          <p className="mono-label mt-4" style={{ color: D.dim2 }}>Cancel anytime · Secure checkout · Tax handled</p>
        </div>

        {/* SCANS */}
        <div className="mt-10">
          <h2 className="font-display text-[24px]">Just need scans?</h2>
          <p className="mt-2 text-[14px]" style={{ color: D.dim }}>Top up one-time scans. Buy in bulk, pay less per scan.</p>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {scans.map(({ p, n, per, best }) => (
              <div key={n} className="relative rounded-[22px] p-6 flex flex-col" style={{ background: D.card, border: `1px solid ${best ? D.rosePale : D.cardLine}`, boxShadow: best ? `0 0 36px ${D.glow}` : "none" }}>
                {best && <span className="absolute -top-2.5 left-6 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide" style={{ background: D.roseDeep, color: "#fff" }}>BEST VALUE</span>}
                <div className="font-display text-[22px]">{n}</div>
                <div className="mt-1 text-[12px]" style={{ color: D.rosePale, minHeight: 16 }}>{per}</div>
                <div className="mt-4 font-display text-[28px]">{ready ? (priceOf(p) || "—") : "…"}</div>
                <button onClick={() => buy(p)} disabled={!ready || !p || !!busy} className="mt-5 rounded-full px-5 py-2.5 text-[14px] font-semibold transition-transform active:scale-95 disabled:opacity-60" style={{ background: best ? D.rose : "rgba(255,255,255,0.08)", color: best ? "#fff" : D.text, border: best ? "none" : `1px solid ${D.cardLine}` }}>
                  {busy === p?.identifier ? "Opening…" : "Buy"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {err && <p className="mt-8 text-[14px]" style={{ color: D.rosePale }}>⚠ {err}</p>}
      </section>

      {/* success overlay */}
      {done && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6" style={{ background: "rgba(8,6,10,0.85)", backdropFilter: "blur(8px)" }}>
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[28px] p-10 text-center max-w-[420px]" style={{ background: D.card, border: `1px solid ${D.rosePale}`, boxShadow: `0 0 60px ${D.glow}` }}>
            <div className="font-display text-[28px]">You&apos;re in ✦</div>
            <p className="mt-3 text-[15px]" style={{ color: D.dim }}>
              {done.includes("scan") ? "Scans added to your account." : "Pro unlocked, everywhere."} Open the Lumii app and it&apos;ll be there.
            </p>
            <Link href="/" className="inline-flex mt-7 rounded-full px-6 py-3 text-[14px] font-semibold" style={{ background: D.text, color: "#000" }}>Done</Link>
          </motion.div>
        </div>
      )}
    </main>
  );
}
