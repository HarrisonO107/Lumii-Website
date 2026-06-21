import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Go Pro on the web — Lumii" },
  description: "Subscribe to Lumii Pro or top up scans on the web. Same Pro, straight from us.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
