import type { Metadata } from "next";
import { Rubik } from 'next/font/google';
import "./globals.css";

const rubik = Rubik({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Simulatory",
  description: "Mathematical Simulations for Creative Minds designed to break the boundaries of traditional simulation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rubik.className}>{children}</body>
    </html>
  );
}
