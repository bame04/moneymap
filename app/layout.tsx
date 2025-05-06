import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { DarkModeStyles } from "@/components/dark-mode-styles"
import { LayoutWrapper } from '@/components/layout-wrapper'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MoneyMap - Financial Management",
  description: "Manage your finances and reduce debt with MoneyMap",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          storageKey="moneymap-theme"
        >
          <DarkModeStyles />
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
