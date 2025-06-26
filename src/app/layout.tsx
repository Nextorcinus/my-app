import './globals.css'
import { Russo_One, VT323 } from 'next/font/google'
import type { Metadata } from 'next'

// === Import Font Google ===
const russo = Russo_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-russo',
})

const vt323 = VT323({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-vt323',
})

// === Metadata (optional but good practice) ===
export const metadata: Metadata = {
  title: 'Whiteout Survival Showcase',
  description: 'Scroll card showcase with hero stats',
}

// === Root Layout ===
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${russo.variable} ${vt323.variable}`}>
      <body className="bg-zinc-900 text-white font-sans">{children}</body>
    </html>
  )
}
