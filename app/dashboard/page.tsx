'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supautil'
import { BankStatement } from '@/types/statement'

import { AlertTriangle, ArrowUpRight, CreditCard, DollarSign, FileText, MoreHorizontal, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SpendingChart } from "@/components/spending-chart"
import { CategoryPieChart } from "@/components/category-pie-chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function DashboardPage() {
  const [statement, setStatement] = useState<BankStatement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  const formatCurrency = (amount: number) => {
    return `P${amount.toFixed(2)}`
  }

  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100
  }

  const getTransactionsByCategory = (transactions: any[]) => {
    return transactions.reduce((acc, transaction) => {
      // Extract category from transaction description
      let category = 'Other'
      if (transaction.description.toLowerCase().includes('food') || 
          transaction.description.toLowerCase().includes('spar') || 
          transaction.description.toLowerCase().includes('checkers')) {
        category = 'Food'
      } else if (transaction.description.toLowerCase().includes('electricity')) {
        category = 'Utilities'
      } else if (transaction.description.toLowerCase().includes('virgin')) {
        category = 'Health & Fitness'
      } else if (transaction.description.toLowerCase().includes('airtime')) {
        category = 'Communication'
      }

      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += Math.abs(parseFloat(transaction.amount))
      return acc
    }, {})
  }

  useEffect(() => {
    const fetchStatement = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // First check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          router.push('/login')
          return
        }

        // Get the user's latest statement
        const { data: statements, error: statementsError } = await supabase
          .from('statements')
          .select('*')
          .eq('user_id', session.user.id) // Filter by user_id
          .order('created_at', { ascending: false })
          .limit(1)

        console.log('Fetched statements:', statements) // For debugging

        if (statementsError) {
          console.error('Database error:', statementsError)
          throw new Error('Failed to fetch statement data')
        }

        if (!statements || statements.length === 0) {
          setStatement(null)
          return
        }

        setStatement(statements[0])
      } catch (err: any) {
        console.error('Error details:', err)
        setError(err.message || 'An error occurred while fetching your statement')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatement()
  }, [router]) // Add router to dependency array

  if (isLoading) {
    return <div className="container mx-auto p-6">Loading...</div>
  }

  if (error || !statement) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || 'No statement data available. Please upload your bank statement.'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Calculate metrics from statement data
  const totalBalance = statement.closingBalance
  const previousBalance = statement.openingBalance
  const balanceChange = calculateChange(totalBalance, previousBalance)

  const transactions = statement.transactions || []
  const debitTransactions = transactions.filter(t => t.type === 'debit')
  const monthlySpending = debitTransactions.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0)
  
  const categorySpending = getTransactionsByCategory(debitTransactions)
  const monthlyBudget = 2500 // You might want to make this configurable
  const spentPercentage = (monthlySpending / monthlyBudget) * 100

  // Get recent transactions
  const recentTransactions = transactions
    .slice(0, 5)
    .map(transaction => ({
      name: transaction.description,
      category: transaction.description.includes('Food') ? 'Food' : 'Other',
      amount: transaction.type === 'credit' ? 
        `+${formatCurrency(parseFloat(transaction.amount))}` : 
        `-${formatCurrency(parseFloat(transaction.amount))}`,
      date: new Date(transaction.date).toLocaleDateString(),
      icon: transaction.description.substring(0, 2).toUpperCase(),
      iconColor: transaction.type === 'credit' ? 'bg-green-500' : 'bg-blue-500',
      flag: false // Add flag property with a default value
    }))

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">Good morning, Bame!</h1>
          <p className="text-gray-500">Here's what's happening with your finances today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <div className={`flex items-center text-sm ${balanceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>{balanceChange.toFixed(1)}%</span>
              <span className="ml-1 text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Monthly Spending</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlySpending)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Monthly Budget</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${spentPercentage > 75 ? 'text-amber-500' : 'text-green-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyBudget)}</div>
            <div className="mt-2">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span>{formatCurrency(monthlySpending)} spent</span>
                <span>{spentPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={spentPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <AlertTitle className="text-red-500">Spending Alert</AlertTitle>
          <AlertDescription>
            Your food expenses are 45% higher than your monthly average. Consider adjusting your budget.
          </AlertDescription>
        </Alert>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
            <CardDescription>Your spending patterns for April 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="weekly">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <TabsContent value="weekly" className="pt-4">
                <SpendingChart />
              </TabsContent>
              <TabsContent value="monthly" className="pt-4">
                <SpendingChart />
              </TabsContent>
              <TabsContent value="yearly" className="pt-4">
                <SpendingChart />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Top spending categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 aspect-square">
              <CategoryPieChart />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Food</span>
                </div>
                <span className="text-sm font-medium">P645.00</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-300"></div>
                  <span className="text-sm">Transport</span>
                </div>
                <span className="text-sm font-medium">P442.00</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-200"></div>
                  <span className="text-sm">Books</span>
                </div>
                <span className="text-sm font-medium">P354.00</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                  <span className="text-sm">Other</span>
                </div>
                <span className="text-sm font-medium">P401.00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={transaction.iconColor}>{transaction.icon}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{transaction.name}</span>
                        {transaction.flag && (
                          <Badge variant="destructive" className="h-5 px-1">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Recurring
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.category} • {transaction.date}
                      </div>
                    </div>
                  </div>
                  <div className={transaction.amount.startsWith("+") ? "font-medium text-green-600" : "font-medium"}>
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/transactions">
                <Button variant="ghost" size="sm">
                  View All Transactions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
