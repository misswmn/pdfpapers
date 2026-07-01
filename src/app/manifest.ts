import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "pdfpapers",
    short_name: "pdfpapers",
    description: "Free custom printable paper generators and printable PDF templates.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8faf7",
    theme_color: "#12233f",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
