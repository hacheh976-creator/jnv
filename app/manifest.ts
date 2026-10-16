import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "JNV Studio",
    short_name: "JNV Studio",
    description: "PM SHRI School JNV Serchhip, Thenzawl — naupangte siam game leh hla",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#0b0b12",
    theme_color: "#0b0b12",
    categories: ["games", "music", "education"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Game", url: "/games", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Hla", url: "/music", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
