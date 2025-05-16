'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supautil"
import { BankStatement, Transaction } from "@/types/statement"
import { AlertTriangle, ArrowDownUp, Download, Filter, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

const normalizeTransaction = (tx: Transaction): Transaction => ({
  ...tx,
  type: tx.type === 'credit' ? 'debit' as const : 'credit' as const,
  amount: tx.type === 'credit' ? `-${tx.amount}` : tx.amount
})

const getTransactionIcon = (description: string): { icon: string; color: string } => {
  const d = description.toLowerCase()
  if (d.includes('fnb') || d.includes('transfer')) return { icon: 'FN', color: 'bg-blue-500' }
  if (d.includes('spar') || d.includes('choppies')) return { icon: 'GR', color: 'bg-green-500' }
  if (d.includes('airtime')) return { icon: 'AT', color: 'bg-orange-500' }
  if (d.includes('electricity')) return { icon: 'BP', color: 'bg-yellow-500' }
  if (d.includes('braai')) return { icon: 'RS', color: 'bg-red-500' }
  return { icon: 'TX', color: 'bg-gray-500' }
}

export default function TransactionsPage() {
  const [statements, setStatements] = useState<BankStatement[]>([])
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const fetchTransactions = async () => {
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
        console.error('Error fetching statements:', error)
        return
      }

      setStatements(data || [])
      const allTx = (data || []).flatMap(s => parseTransactions(s).map(normalizeTransaction))
      setTransactions(allTx)
      setLoading(false)
    }

    fetchTransactions()
  }, [])

  // Filter transactions by type
  const incomeTransactions = transactions.filter(tx => !tx.amount.startsWith('-'))
  const expenseTransactions = transactions.filter(tx => tx.amount.startsWith('-'))
  
  // Detect flagged transactions (unusual amounts)
  const averageAmount = expenseTransactions.reduce((sum, tx) => 
    sum + Math.abs(Number(tx.amount)), 0) / expenseTransactions.length
  const flaggedTransactions = expenseTransactions.filter(tx => 
    Math.abs(Number(tx.amount)) > averageAmount * 2)

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">Transactions</h1>
          <p className="text-gray-500">View and manage all your financial transactions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <ArrowDownUp className="mr-2 h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search transactions..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
            <SelectItem value="transport">Transport</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="education">Education</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="30">
          <SelectTrigger>
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="year">This year</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="flagged">Flagged</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>Showing {transactions.length} transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx, i) => {
                  const { icon, color } = getTransactionIcon(tx.description)
                  const isIncome = !tx.amount.startsWith('-')
                  return (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={color}>{icon}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{tx.description}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {tx.date}
                          </div>
                        </div>
                      </div>
                      <div className={isIncome ? "font-medium text-green-600" : "font-medium"}>
                        P{Math.abs(Number(tx.amount)).toFixed(2)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Income Transactions</CardTitle>
              <CardDescription>Showing {incomeTransactions.length} transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incomeTransactions.map((tx, i) => {
                  const { icon, color } = getTransactionIcon(tx.description)
                  return (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={color}>{icon}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{tx.description}</span>
                          </div>
                          <div className="text-sm text-gray-500">{tx.date}</div>
                        </div>
                      </div>
                      <div className="font-medium text-green-600">
                        P{Math.abs(Number(tx.amount)).toFixed(2)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Transactions</CardTitle>
              <CardDescription>Showing {expenseTransactions.length} transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseTransactions.map((tx, i) => {
                  const { icon, color } = getTransactionIcon(tx.description)
                  return (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={color}>{icon}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{tx.description}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {tx.date}
                          </div>
                        </div>
                      </div>
                      <div className="font-medium">
                        P{Math.abs(Number(tx.amount)).toFixed(2)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Transactions</CardTitle>
              <CardDescription>Transactions that require attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flaggedTransactions.map((tx, i) => {
                  const { icon, color } = getTransactionIcon(tx.description)
                  return (
                    <div key={i} className="flex flex-col rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className={color}>{icon}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{tx.description}</span>
                              <Badge variant="destructive" className="h-5 px-1">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Flagged
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500">
                              {tx.date}
                            </div>
                          </div>
                        </div>
                        <div className="font-medium">
                          P{Math.abs(Number(tx.amount)).toFixed(2)}
                        </div>
                      </div>
                      <div className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-700">
                        <AlertTriangle className="mr-1 inline-block h-3 w-3" />
                        Flag reason: Unusual amount
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
