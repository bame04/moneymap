'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

type CategoryPieChartProps = {
  categories: Record<string, number>
}

export function CategoryPieChart({ categories }: CategoryPieChartProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']
  const data = Object.entries(categories).map(([name, value]) => ({ name, value }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          label={({ name, value, percent }) => 
            `${name}: P${value.toFixed(2)} (${(percent * 100).toFixed(0)}%)`
          }
          outerRadius={100}
          fill="#8884d8"
        >
          {data.map((_, i) => (
            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `P${Number(value).toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
