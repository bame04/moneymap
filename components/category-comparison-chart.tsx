"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Food", current: 645, previous: 558 },
  { name: "Transport", current: 442, previous: 352 },
  { name: "Books", current: 354, previous: 488 },
  { name: "Entertain", current: 225, previous: 182 },
  { name: "Groceries", current: 185, previous: 253 },
  { name: "Utilities", current: 91, previous: 85 },
]

export function CategoryComparisonChart() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={0} barCategoryGap={20}>
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
            formatter={(value) => [`P${value}`, ""]}
            labelStyle={{ color: isDark ? "#f9fafb" : "#111827" }}
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "white",
              borderRadius: "0.5rem",
              border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              color: isDark ? "#f9fafb" : "#111827",
            }}
          />
          <Legend />
          <Bar name="Current Month" dataKey="current" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
          <Bar name="Previous Month" dataKey="previous" fill="#93c5fd" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
