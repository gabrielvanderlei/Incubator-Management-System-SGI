import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema de Gestão de Incubadoras',
  description: 'Sistema para permitir a gestão de incubadoras',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): any {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
