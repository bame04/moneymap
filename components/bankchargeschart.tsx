'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { BankStatement } from '@/types/statement'

// Define the props interface
type BankChargesChartProps = {
  statements: BankStatement[];
}

// Export component with properly typed props
export function BankChargesChart({ statements }: { statements: BankStatement[] }) {
  const data = statements.map(statement => {
    const month = new Date(statement.created_at).toLocaleString('default', { month: 'short' });
    return {
      month,
      'Service Fees': statement.bank_charges['Dr Bank Charges Service Fees'] || 0,
      'Other Fees': statement.bank_charges['Other Fees'] || 0,
      'VAT': statement.bank_charges['Total VAT'] || 0
    };
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `P${value}`} />
        <Tooltip formatter={(value) => `P${Number(value).toFixed(2)}`} />
        <Legend />
        <Bar dataKey="Service Fees" fill="#8884d8" />
        <Bar dataKey="Other Fees" fill="#82ca9d" />
        <Bar dataKey="VAT" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
}