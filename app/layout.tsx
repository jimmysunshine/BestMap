import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import type { ReactNode } from 'react'
import { metadata } from './metadata'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  preload: true,
});

export { metadata };

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}