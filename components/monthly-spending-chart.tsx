"use client"

import { useTheme } from "next-themes"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Nov", amount: 1850 },
  { name: "Dec", amount: 2250 },
  { name: "Jan", amount: 1950 },
  { name: "Feb", amount: 2100 },
  { name: "Mar", amount: 1720 },
  { name: "Apr", amount: 1842 },
]

export function MonthlySpendingChart() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#3b82f6", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
