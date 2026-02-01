import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from './header'
import { Footer } from './footer'
import { ThemeProvider } from 'next-themes'
import { WEBSITE_URL } from '@/lib/constants'
import { JsonLd } from './json-ld'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL(WEBSITE_URL),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Roselle Tabuena | Full Stack Developer',
    template: '%s | Roselle Tabuena',
  },
  description:
    'Roselle Tabuena - Full Stack Developer specializing in scalable components, modern web development, and building solutions to improve developer workflows.',
  keywords: [
    'Roselle Tabuena',
    'full stack developer',
    'React developer',
    'Next.js developer',
    'web developer',
    'software engineer',
    'TypeScript',
    'portfolio',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: WEBSITE_URL,
    siteName: 'Roselle Tabuena',
    title: 'Roselle Tabuena | Full Stack Developer',
    description:
      'Full Stack Developer specializing in scalable components, modern web development, and building solutions to improve developer workflows.',
    images: [
      {
        url: `${WEBSITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Roselle Tabuena - Full Stack Developer',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roselle Tabuena | Full Stack Developer',
    description:
      'Full Stack Developer specializing in scalable components, modern web development, and building solutions to improve developer workflows.',
    images: [`${WEBSITE_URL}/og-image.png`],
    creator: '@roselletabuena',
  },
  authors: [{ name: 'Roselle Tabuena' }],
}

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} bg-white tracking-tight antialiased dark:bg-zinc-950`}
      >
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
            <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
              <Header />
              {children}
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
