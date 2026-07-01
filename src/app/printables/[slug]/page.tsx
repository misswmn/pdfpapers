import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { GeneratorWorkspace, type PaperType } from "@/components/generator-workspace";
import { StudioWorkspace, type StudioTemplate } from "@/components/studio-workspace";

type PrintablePage =
  | { kind: "paper"; title: string; description: string; h1: string; guide: string; type: PaperType }
  | { kind: "studio"; title: string; description: string; h1: string; guide: string; template: StudioTemplate };

const pages: Record<string, PrintablePage> = {
  "free-printable-graph-paper-a4": {
    kind: "paper",
    title: "Free Printable Graph Paper A4 PDF",
    description: "Create free A4 graph paper with custom square spacing, line weight, and color.",
    h1: "Free printable A4 graph paper",
    type: "grid",
    guide: "A4 graph paper is ideal for mathematics, technical sketches, bullet journaling, and measured layouts. Start with 5 mm spacing for general-purpose work, or increase it to 7–10 mm for early learners and larger handwriting. Keep printer scaling at 100% to preserve exact measurements.",
  },
  "custom-cornell-notes-pdf-pink": {
    kind: "paper",
    title: "Custom Pink Cornell Notes PDF",
    description: "Make a soft pink Cornell notes page and download a print-ready PDF.",
    h1: "Custom pink Cornell notes paper",
    type: "cornell",
    guide: "Cornell paper divides each page into notes, cues, and a summary. Record ideas in the large notes field, add prompts or keywords in the narrow cue column, then compress the lesson into a few sentences at the bottom. Reviewing cues before rereading your notes turns a passive page into an active recall tool.",
  },
  "weekly-planner-template-minimalist": {
    kind: "paper",
    title: "Minimalist Weekly Planner Template PDF",
    description: "Build a clean weekly planner and download it as a free printable PDF.",
    h1: "Minimalist weekly planner template",
    type: "weekly",
    guide: "A single-page weekly plan works best when it stays selective. Give each day one important outcome before listing smaller tasks. Print at actual size for a crisp layout, or import the PDF into GoodNotes and duplicate the page at the start of every week.",
  },
  "printable-budget-planner-pdf": {
    kind: "studio",
    title: "Printable Budget Planner PDF",
    description: "A zero-based budget planner with debt, savings, and monthly money mapping.",
    h1: "Printable budget planner",
    template: "budget",
    guide: "This layout is built for zero-based budgeting and cash-flow clarity. Start with income, assign fixed bills, then use the remaining balance for debt and savings. Add one sinking-fund line for irregular expenses so the page stays realistic and reusable every month.",
  },
  "adhd-planner-printable-pdf": {
    kind: "studio",
    title: "ADHD Planner Printable PDF",
    description: "A low-friction printable planner for attention-friendly task planning and resets.",
    h1: "ADHD planner printable",
    template: "adhd",
    guide: "The best ADHD planners reduce the number of decisions on the page. Keep the top-three priority list small, leave room for a brain dump, and include a reward or reset cue so the page supports follow-through instead of adding pressure.",
  },
  "teacher-planner-printable-pdf": {
    kind: "studio",
    title: "Teacher Planner Printable PDF",
    description: "A weekly lesson planner for classes, materials, assessment notes, and prep.",
    h1: "Teacher planner printable",
    template: "teacher",
    guide: "Teacher planners should save prep time, not add another layer of organization. Keep the weekly teaching view simple, then pair it with a compact prep list and assessment area so each week can be planned and reviewed in one pass.",
  },
  "student-planner-printable-pdf": {
    kind: "studio",
    title: "Student Planner Printable PDF",
    description: "An academic planner with classes, deadlines, study blocks, and GPA focus.",
    h1: "Student planner printable",
    template: "student",
    guide: "This page works best when every class is connected to a concrete deadline or study block. Use it to track the week, keep assignments visible, and break one large term goal into smaller action steps.",
  },
  "nurse-shift-sheet-printable-pdf": {
    kind: "studio",
    title: "Nurse Shift Sheet Printable PDF",
    description: "A shift report sheet for patient notes, meds, tasks, and handoff cues.",
    h1: "Nurse shift sheet printable",
    template: "nurse",
    guide: "Clinical shift sheets need quick scanning and a dependable structure. Keep patient rows compact, use short reminders for meds and tasks, and leave a handoff area for the details that matter at change of shift.",
  },
  "coach-client-tracker-printable-pdf": {
    kind: "studio",
    title: "Coach Client Tracker Printable PDF",
    description: "A client progress tracker for sessions, follow-ups, homework, and payments.",
    h1: "Coach client tracker printable",
    template: "coach",
    guide: "This format is meant for recurring client work. Track the client goal, the next session step, and the follow-up items in one place so the page can support coaching, training, or consulting workflows without extra software.",
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug];

  return page
    ? {
        title: page.title,
        description: page.description,
        alternates: { canonical: `/printables/${slug}` },
        openGraph: { title: page.title, description: page.description, url: `/printables/${slug}`, type: "article" },
      }
    : { title: "Printable not found" };
}

export default async function PrintablePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];

  if (!page) notFound();

  return (
    <main className="generator-page">
      <Header />
      <div className="generator-shell">
        <div className="seo-intro">
          <p className="eyebrow">FREE PRINTABLE</p>
          <h1>{page.h1}</h1>
          <p>{page.description}</p>
        </div>

        {page.kind === "paper" ? <GeneratorWorkspace initialType={page.type} /> : <StudioWorkspace initialTemplate={page.template} />}

        <article className="seo-guide">
          <p className="eyebrow">PRINTING & USE GUIDE</p>
          <h2>Make this page work harder.</h2>
          <p>{page.guide}</p>
        </article>
      </div>
    </main>
  );
}
