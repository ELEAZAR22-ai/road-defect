import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Road Defect Collector - Ga Central',
  description: 'Civic defect monitoring and maintenance tracking system',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#020617" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}