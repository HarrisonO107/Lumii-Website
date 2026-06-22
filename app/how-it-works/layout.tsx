// app/how-it-works/layout.tsx
// The page itself is "use client", so its <title>/description live here in a
// server-component wrapper. This adds page-specific SEO without touching the page.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "How Lumii Works, AI Face Scan to Glow-Up Plan" },
  description:
    "Scan your face in 30 seconds. Lumii maps 584 facial landmarks across 75+ metrics, scores your glow, then builds a routine, tracks progress, follows your cycle, and lets you glow with your Circle. Here's every step.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How Lumii Works, AI Face Scan to Glow-Up Plan",
    description:
      "See how Lumii turns a single selfie into a personalized glow-up and skincare plan.",
    url: "https://www.lumiiapp.com/how-it-works",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
