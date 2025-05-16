'use client'

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supautil"
import { BankStatement, Transaction } from "@/types/statement"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertTriangle, Calendar, ChevronLeft, ChevronRight, Download, Filter, UploadIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MonthlySpendingChart } from "@/components/monthly-spending-chart"
import { CategoryComparisonChart } from "@/components/category-comparison-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Helper functions
const parseTransactions = (statement: BankStatement): Transaction[] => {
  try {
    return typeof statement.transactions === 'string' 
      ? JSON.parse(statement.transactions) 
      : statement.transactions || []
  } catch (e) {
    console.error('Error parsing transactions:', e)
    return []
  }
}

const getAnomalies = (categoryTotals: CategoryTotal[]): Array<{
  category: string;
  currentAmount: number;
  averageAmount: number;
  percentage: number;
  priority: 'high' | 'medium' | 'positive';
}> => {
  return categoryTotals
    .map(cat => {
      const percentage = ((cat.currentAmount - cat.previousAmount) / cat.previousAmount) * 100;
      let priority: 'high' | 'medium' | 'positive';
      
      if (percentage > 30) priority = 'high';
      else if (percentage > 15) priority = 'medium';
      else if (percentage < -10) priority = 'positive';
      else return null;

      return {
        category: cat.category,
        currentAmount: cat.currentAmount,
        averageAmount: cat.previousAmount,
        percentage,
        priority
      };
    })
    .filter((item): item is { 
      category: string;
      currentAmount: number;
      averageAmount: number;
      percentage: number;
      priority: 'high' | 'medium' | 'positive';
    } => item !== null);
};

interface CategoryTotal {
  category: string
  currentAmount: number
  previousAmount: number
  percentage: number
  change: number
}

// Define specific categories that match your transactions
const CATEGORIES = {
  FOOD: ['spar', 'pick n pay', 'pnp', 'checkers', 'shoprite'],
  ENTERTAINMENT: ['movies', 'spotify', 'netflix', 'game'],
  TRANSFERS: ['transfer to', 'payment to', 'send money'],
  SHOPPING: ['pos purchase'],
  COMMUNICATION: ['fnb app prepaid', 'airtime', 'data'],
  UTILITIES: ['electricity', 'water', 'municipal'],
  DINING: ['braai', 'restaurant', 'kfc', 'nandos']
} as const

// Improved categorization helper
const categorize = (description: string): string => {
  const d = description.toLowerCase()
  
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(keyword => d.includes(keyword))) {
      return category
    }
  }
  return 'OTHER'
}

// Add spending summary interface
interface SpendingSummary {
  category: string
  total: number
  count: number
  transactions: Transaction[]
  averagePerTransaction: number
}

export default function ReportsPage() {
  const [statements, setStatements] = useState<BankStatement[]>([])
  const [spendingSummaries, setSpendingSummaries] = useState<SpendingSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([])
  const [monthlyTotal, setMonthlyTotal] = useState(0)
  const [averageDaily, setAverageDaily] = useState(0)
  const [topCategory, setTopCategory] = useState({ name: '', amount: 0, percentage: 0 })

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/login'
        return
      }

      const { data, error } = await supabase
        .from('statements')
        .select('*')
        .eq('user_id', session.user.id)

      if (error) {
        console.error('Error:', error)
        return
      }

      setStatements(data || [])
      processData(data || [])
      setLoading(false)
    }

    fetchData()
  }, [currentMonth])

  const processData = (statements: BankStatement[]) => {
    const allTransactions = statements.flatMap(s => parseTransactions(s))
    const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    const previousMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    const previousMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0)

    // Current month transactions
    const currentMonthTx = allTransactions.filter(tx => {
      const txDate = new Date(tx.date)
      return txDate >= currentMonthStart && txDate <= currentMonthEnd
    })

    // Previous month transactions
    const previousMonthTx = allTransactions.filter(tx => {
      const txDate = new Date(tx.date)
      return txDate >= previousMonthStart && txDate <= previousMonthEnd
    })

    // Calculate category totals
    const categories = new Map<string, { current: number; previous: number }>()
    
    currentMonthTx.forEach(tx => {
      const category = categorize(tx.description)
      const amount = Math.abs(Number(tx.amount))
      const current = categories.get(category)?.current || 0
      categories.set(category, { 
        current: current + amount,
        previous: categories.get(category)?.previous || 0 
      })
    })

    previousMonthTx.forEach(tx => {
      const category = categorize(tx.description)
      const amount = Math.abs(Number(tx.amount))
      const previous = categories.get(category)?.previous || 0
      categories.set(category, { 
        current: categories.get(category)?.current || 0,
        previous: previous + amount 
      })
    })

    // Calculate totals and percentages
    const monthTotal = currentMonthTx.reduce((sum, tx) => 
      sum + Math.abs(Number(tx.amount)), 0)
    
    const categoryData = Array.from(categories.entries()).map(([category, amounts]) => ({
      category,
      currentAmount: amounts.current,
      previousAmount: amounts.previous,
      percentage: (amounts.current / monthTotal) * 100,
      change: ((amounts.current - amounts.previous) / amounts.previous) * 100
    })).sort((a, b) => b.currentAmount - a.currentAmount)

    // Set state
    setCategoryTotals(categoryData)
    setMonthlyTotal(monthTotal)
    setAverageDaily(monthTotal / currentMonthEnd.getDate())
    setTopCategory({
      name: categoryData[0]?.category || '',
      amount: categoryData[0]?.currentAmount || 0,
      percentage: categoryData[0]?.percentage || 0
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/login'
        return
      }

      const { data, error } = await supabase
        .from('statements')
        .select('*')
        .eq('user_id', session.user.id)

      if (error) {
        console.error('Error:', error)
        return
      }

      setStatements(data || [])
      processTransactions(data || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  const processTransactions = (statements: BankStatement[]) => {
    const allTransactions = statements.flatMap(s => {
      const txs = parseTransactions(s)
      return txs.map(tx => ({
        ...tx,
        amount: tx.amount,
        category: categorize(tx.description)
      }))
    })

    // Group by category
    const summaries = Object.keys(CATEGORIES).reduce((acc, category) => {
      const categoryTxs = allTransactions.filter(tx => tx.category === category)
      const total = categoryTxs.reduce((sum, tx) => sum + Math.abs(Number(tx.amount)), 0)
      
      acc[category] = {
        category,
        total,
        count: categoryTxs.length,
        transactions: categoryTxs,
        averagePerTransaction: total / (categoryTxs.length || 1)
      }
      return acc
    }, {} as Record<string, SpendingSummary>)

    setSpendingSummaries(Object.values(summaries).sort((a, b) => b.total - a.total))
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
          <div className="mt-2 flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Total Overview Card */}
        <Card className="mb-8 bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-sm font-medium text-white">Total Spending</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  P{spendingSummaries.reduce((acc, sum) => acc + sum.total, 0).toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-sm font-medium text-white">Total Transactions</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {spendingSummaries.reduce((acc, sum) => acc + sum.count, 0)}
                </p>
              </div>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-sm font-medium text-white">Categories</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {spendingSummaries.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Cards Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {spendingSummaries.map((summary, index) => (
            <Card key={summary.category} className="overflow-hidden">
              <CardHeader className="border-b bg-gray-50 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{summary.category}</CardTitle>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center
                    ${index === 0 ? 'bg-red-100 text-red-600' :
                      index === 1 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'}`}>
                    {summary.count}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      P{summary.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      ~P{summary.averagePerTransaction.toFixed(2)} / transaction
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {((summary.total / spendingSummaries.reduce((acc, sum) => acc + sum.total, 0)) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pie Chart */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Spending Distribution</CardTitle>
              <CardDescription>Category breakdown</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingSummaries}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {spendingSummaries.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={[
                          '#3b82f6', '#ef4444', '#f97316', 
                          '#8b5cf6', '#ec4899', '#06b6d4',
                          '#10b981'
                        ][index % 7]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `P${Number(value).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest activity across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spendingSummaries.flatMap(s => s.transactions)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((tx, i) => (
                    <div key={i} 
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center
                          ${categorize(tx.description) === 'FOOD' ? 'bg-green-100 text-green-600' :
                            categorize(tx.description) === 'ENTERTAINMENT' ? 'bg-purple-100 text-purple-600' :
                            'bg-blue-100 text-blue-600'}`}>
                          {categorize(tx.description).charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{tx.description}</p>
                          <p className="text-sm text-gray-500">{tx.date}</p>
                        </div>
                      </div>
                      <p className="font-mono font-medium text-red-600">
                        P{Math.abs(Number(tx.amount)).toFixed(2)}
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
