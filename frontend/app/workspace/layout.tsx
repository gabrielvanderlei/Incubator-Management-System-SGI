'use client';

import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import StackedLayout from '@/components/template/StackedLayout';

const inter = Inter({ subsets: ['latin'] })

interface DashboardRootLayoutProps {
  moduleInformation?: any; // Substitua 'any' pelo tipo real se você tiver esse tipo
  children: React.ReactNode;
}

export const DashboardRootLayout: React.FC<DashboardRootLayoutProps> = ({ moduleInformation, children }) => (
  <html lang="en">
    <body className={inter.className}>
      <StackedLayout moduleInformation={moduleInformation ? moduleInformation : null}>
        {children}
      </StackedLayout>
    </body>
  </html>
);

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: any // Substitua 'any' pelo tipo real se você tiver esse tipo
}) {
  return (
    <DashboardRootLayout>
      {children}
    </DashboardRootLayout>
  )
}