"use client"

import { useTheme } from "next-themes"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Food", value: 645, color: "#3b82f6" },
  { name: "Transport", value: 442, color: "#93c5fd" },
  { name: "Books", value: 354, color: "#bfdbfe" },
  { name: "Other", value: 401, color: "#d1d5db" },
]

export function CategoryPieChart() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
