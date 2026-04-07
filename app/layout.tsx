import type { Metadata, Viewport } from 'next'
import { Toaster } from "sonner"
import { Inter, Oswald } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import React from "react";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })

export const metadata: Metadata = {
  title: 'BoxPredict AI - Boxing Match Outcome Prediction',
  description:
    'AI-powered boxing match outcome prediction system using weighted fighter attributes and probabilistic analysis.',
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${oswald.variable} font-sans antialiased`}
      >
        {children}
        <Toaster
            position="top-right"
            richColors
            closeButton
        />

        <Analytics />
      </body>
    </html>
  )
}
