'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const publicRoutes = ['/', '/login', '/signup', '/forgot-password']
  const pathname = usePathname()
  const isPublicRoute = publicRoutes.includes(pathname)

  if (isPublicRoute) {
    return <main className="h-screen bg-background">{children}</main>
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  )
}