import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RegisterSW } from "@/components/site/RegisterSW";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "JNV Studio", template: "%s · JNV Studio" },
  description:
    "PM SHRI School JNV Serchhip, Thenzawl naupangte siam game leh hla — free-in khel la, ngaithla rawh.",
  applicationName: "JNV Studio",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, title: "JNV Studio", statusBarStyle: "black-translucent" },
  openGraph: { title: "JNV Studio", siteName: "JNV Studio", images: ["/icons/icon-512.png"] },
};

export const viewport: Viewport = {
  themeColor: "#0b0b12",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
