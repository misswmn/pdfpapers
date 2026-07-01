import type { Metadata } from "next";
import { Header } from "@/components/header";
import { GeneratorWorkspace, type PaperType } from "@/components/generator-workspace";

export const metadata: Metadata = {
  title: "Free Printable Paper Generator",
  description: "Customize and download graph, lined, dot grid, Cornell, weekly, and habit tracker paper as a print-ready PDF.",
  alternates: {
    canonical: "/generator",
  },
  openGraph: {
    title: "Free Printable Paper Generator",
    description: "Customize and download graph, lined, dot grid, Cornell, weekly, and habit tracker paper as a print-ready PDF.",
    url: "/generator",
    type: "website",
  },
};
const valid = new Set(["grid","lined","dots","cornell","weekly","habit"]);
export default async function GeneratorPage({searchParams}:{searchParams:Promise<{type?:string}>}) { const {type}=await searchParams; const initialType=valid.has(type||"")?type as PaperType:"grid"; return <main className="generator-page"><Header/><div className="generator-shell"><GeneratorWorkspace initialType={initialType}/></div></main>; }
