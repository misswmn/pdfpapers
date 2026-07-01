import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pdfpapers.com";

const routes = [
  "/",
  "/studio",
  "/generator",
  "/printables/free-printable-graph-paper-a4",
  "/printables/custom-cornell-notes-pdf-pink",
  "/printables/weekly-planner-template-minimalist",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route, index) => ({
    url: new URL(route, siteUrl).toString(),
    lastModified,
    changeFrequency: "weekly",
    priority: index === 0 ? 1 : 0.8,
  }));
}
