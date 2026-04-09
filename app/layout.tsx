/**
 * Root Layout Component
 * Sets up the HTML structure and global providers
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rooted - Preserve Your Cultural Identity',
  description:
    'Find real cultural resources, communities, and events when moving to a new city. Connect with places of worship, cultural centers, restaurants, and communities that share your heritage.',
  keywords: [
    'cultural identity',
    'moving abroad',
    'cultural community',
    'diaspora',
    'international students',
    'cultural resources',
    'communities',
  ],
  authors: [{ name: 'Rooted Team' }],
  creator: 'Rooted',
  publisher: 'Rooted',
  openGraph: {
    title: 'Rooted',
    description: 'Preserve your cultural identity in new cities',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rooted',
    description: 'Find your cultural community in any city',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='color-scheme' content='light dark' />
      </head>
      <body className='antialiased'>
        {children}
      </body>
    </html>
  );
}
