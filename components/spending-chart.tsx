'use client'

import React from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

// Define the props interface
type SpendingChartProps = {
  stats: Array<{
    month: string;
    total: number;
  }>;
}

// Export component with properly typed props
export function SpendingChart({ stats }: SpendingChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={stats}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `P${value}`} />
        <Tooltip formatter={(value) => `P${Number(value).toFixed(2)}`} />
        <Bar dataKey="total" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}