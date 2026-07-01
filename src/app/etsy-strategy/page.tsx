import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { EtsyStrategyWorkspace } from "@/components/etsy-strategy-workspace";

export const metadata: Metadata = {
  title: "Etsy Niche Strategy Board",
  description: "Compare Etsy category feasibility, competitor pressure, and product direction for printable and template businesses.",
  alternates: {
    canonical: "/etsy-strategy",
  },
  openGraph: {
    title: "Etsy Niche Strategy Board",
    description: "Pick a category, review its market pressure, and plan the first product bundle.",
    url: "/etsy-strategy",
    type: "website",
  },
};

export default function EtsyStrategyPage() {
  return (
    <main className="etsy-page">
      <Header />
      <div className="etsy-shell">
        <EtsyStrategyWorkspace />
      </div>
      <section className="etsy-note">
        <div className="shell">
          <p>
            This board is designed as a working launch plan, not a static report. Use it to pick one niche,
            then move into production with the studio and generator tools.
          </p>
          <Link href="/studio">Open the studio ↗</Link>
        </div>
      </section>
    </main>
  );
}
