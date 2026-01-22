import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hundee - Track Your Journey to 100',
  description: 'A beautiful goal tracker app where you complete 100 of anything. Track progress, share achievements, and celebrate milestones.',
  keywords: 'goal tracker, habit tracker, progress tracker, 100 days, productivity, goals, habits',
  authors: [{ name: 'Enduro Tech Ventures LLC' }],
  creator: 'Enduro Tech Ventures LLC',
  publisher: 'Enduro Tech Ventures LLC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Hundee - Track Your Journey to 100',
    description: 'A beautiful goal tracker app where you complete 100 of anything.',
    url: 'https://hundee.app',
    siteName: 'Hundee',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hundee - Track Your Journey to 100',
    description: 'A beautiful goal tracker app where you complete 100 of anything.',
    creator: '@endurotech',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}