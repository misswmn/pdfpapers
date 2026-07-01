import type { Metadata } from "next";
import { Header } from "@/components/header";
import { StudioWorkspace, type StudioTemplate } from "@/components/studio-workspace";

const validTemplates = new Set<StudioTemplate>(["daily", "weekly", "habit", "meal", "routine", "study", "budget", "adhd", "teacher", "student", "nurse", "coach"]);

export const metadata: Metadata = {
  title: "Personalized Printable Design Studio",
  description: "Personalize planners, habit trackers, family routines, meal planners, and study pages. Edit every detail and download a print-ready PDF.",
  alternates: { canonical: "/studio" },
  openGraph: { title: "Make a printable that's actually yours", description: "Choose a design, personalize it, and download a print-ready PDF.", url: "/studio", type: "website" },
};

export default async function StudioPage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  const { template } = await searchParams;
  const initialTemplate = validTemplates.has(template as StudioTemplate) ? template as StudioTemplate : "daily";
  return <main className="studio-page"><Header /><div className="studio-shell"><StudioWorkspace initialTemplate={initialTemplate} /></div></main>;
}
