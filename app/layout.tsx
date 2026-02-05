import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rate My CPP Major',
  description: 'Student reviews and ratings for CPP majors.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    console.warn(
      'Failed to load session, continuing without authentication:',
      error,
    );
    session = null;
  }

  return (
    <html lang="en" className={inter.className}>
      <SessionProvider session={session}>
        <body suppressHydrationWarning>{children}</body>
      </SessionProvider>
    </html>
  );
}
