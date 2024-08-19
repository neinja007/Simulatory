import { Rubik } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';

const rubik = Rubik({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Simulatory',
  description: 'Mathematical Simulations for Creative Minds.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={rubik.className}>
      <body className='bg-gradient-to-b from-white to-slate-300'>
        <div className='container min-h-screen pt-5 antialiased md:pt-8 lg:pt-12'>{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
