"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart3, Upload, MessageSquare, Settings, LogOut, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      color: "text-blue-500",
    },
    {
      label: "Transactions",
      icon: CreditCard,
      href: "/transactions",
      color: "text-blue-500",
    },
    {
      label: "Upload",
      icon: Upload,
      href: "/upload",
      color: "text-blue-500",
    },
    {
      label: "Reports",
      icon: BarChart3,
      href: "/reports",
      color: "text-blue-500",
    },
    {
      label: "AI Advisor",
      icon: MessageSquare,
      href: "/advisor",
      color: "text-blue-500",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      color: "text-blue-500",
    },
  ]

  return (
    <div
      className={cn(
        "relative h-full bg-blue-950 dark:bg-gray-900 text-white transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between px-3">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="rounded-full bg-blue-500 p-1">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">MoneyMap</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto rounded-full bg-blue-500 p-1">
            <CreditCard className="h-6 w-6 text-white" />
          </Link>
        )}
        {!collapsed && (
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        )}
      </div>

      <div className="space-y-1 px-3 py-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-blue-900",
              pathname === route.href ? "bg-blue-900 dark:bg-gray-800 text-white" : "text-gray-300 dark:text-gray-400",
            )}
          >
            <route.icon className={cn("h-5 w-5", route.color)} />
            {!collapsed && <span>{route.label}</span>}
          </Link>
        ))}
      </div>

      <div className="absolute bottom-0 w-full border-t border-blue-900 dark:border-gray-800 p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" />
            <AvatarFallback className="bg-blue-500">BM</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="text-sm font-medium">Bame Monageng</span>
              <span className="truncate text-xs text-gray-300 dark:text-gray-400">bame.monageng@biust.ac.bw</span>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Link href="/" className="flex-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-300 dark:text-gray-400 hover:bg-blue-900 hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span>Log out</span>}
            </Button>
          </Link>
          {collapsed && <ThemeToggle />}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full bg-blue-500 p-0 text-white shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "→" : "←"}
      </Button>
    </div>
  )
}
