"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Mon", amount: 120 },
  { name: "Tue", amount: 80 },
  { name: "Wed", amount: 150 },
  { name: "Thu", amount: 110 },
  { name: "Fri", amount: 290 },
  { name: "Sat", amount: 220 },
  { name: "Sun", amount: 80 },
]

export function SpendingChart() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#374151" : "#e5e7eb"} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: isDark ? "#d1d5db" : "#111827" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: isDark ? "#d1d5db" : "#111827" }}
            tickFormatter={(value) => `P${value}`}
          />
          <Tooltip
            formatter={(value) => [`P${value}`, "Amount"]}
            labelStyle={{ color: isDark ? "#f9fafb" : "#111827" }}
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "white",
              borderRadius: "0.5rem",
              border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              color: isDark ? "#f9fafb" : "#111827",
            }}
          />
          <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
