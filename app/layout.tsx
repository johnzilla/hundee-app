import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hundee - Track Your Journey to 100',
  description: 'A beautiful goal tracker app where you complete 100 of anything. Track progress, share achievements, and celebrate milestones.',
  keywords: 'goal tracker, habit tracker, progress tracker, 100 days, productivity, goals, habits',
  authors: [{ name: 'Hundee Team' }],
  creator: 'Hundee',
  publisher: 'Hundee',
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
    creator: '@hundeeapp',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
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