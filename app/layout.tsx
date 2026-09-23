import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "Ghana Road Defect Monitoring",
    template: "%s | Ghana Road Defect Monitoring",
  },
  description:
    "A data collection and monitoring platform for identifying road defects across Ghana.",
  applicationName: "Ghana Road Defect Collector",
  icons: {
    apple: "/icons/apple-touch-icon.png",
    icon: [
      { url: "/icons/road-collector-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/road-collector-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#082f2b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
