'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supautil'
import Link from 'next/link'
import { BankStatement, Transaction } from '@/types/statement'

import {
  AlertTriangle,
  CreditCard,
  DollarSign,
  FileText,
  Plus,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SpendingChart } from '@/components/spending-chart'
import { CategoryPieChart } from '@/components/category-pie-chart'
import { BankChargesChart } from '@/components/bankchargeschart'

// categorize helper
const categorize = (desc: string): string => {
  const d = desc.toLowerCase()
  if (d.includes('spar') || d.includes('pick n pay') || d.includes('pnp')) return 'Food'
  if (d.includes('fnb app prepaid') || d.includes('airtime')) return 'Communication'
  if (d.includes('pos purchase')) return 'Shopping'
  if (d.includes('electricity')) return 'Utilities'
  if (d.includes('braai')) return 'Dining'
  return 'Other'
}

// Fix transaction type handling - in your case, credit means money going out
const normalizeTransaction = (tx: Transaction): Transaction => ({
  ...tx,
  type: tx.type === 'credit' ? 'debit' : 'credit', // Flip the type
  amount: tx.type === 'credit' ? `-${tx.amount}` : tx.amount // Make credits negative
})

// detect recurring transactions by description count
const detectRecurring = (txs: Transaction[]): (Transaction & { recurring: boolean })[] => {
  const countMap: Record<string, number> = {}
  txs.forEach(t => {
    if (t.description) {
      countMap[t.description] = (countMap[t.description] || 0) + 1
    }
  })
  return txs.map(t => ({ ...t, recurring: t.description ? countMap[t.description] > 1 : false }))
}

// Add a helper function to parse transactions
const parseTransactions = (statement: BankStatement): Transaction[] => {
  try {
    // If transactions is a string, parse it
    if (typeof statement.transactions === 'string') {
      return JSON.parse(statement.transactions)
    }
    // If it's already an array, return it
    if (Array.isArray(statement.transactions)) {
      return statement.transactions
    }
    return []
  } catch (e) {
    console.error('Error parsing transactions:', e)
    return []
  }
}

// Add this helper function at the top with other helpers
const parseDate = (dateString: string): string => {
  try {
    // Convert "11 Dec 2025" to "2025-12-11"
    const [day, month, year] = dateString.split(' ')
    const months: Record<string, string> = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    }
    return `${year}-${months[month]}-${day.padStart(2, '0')}`
  } catch (e) {
    console.error('Error parsing date:', dateString)
    return new Date().toISOString().split('T')[0] // fallback to today
  }
}

// Add this helper function with your other helpers
const getMostRecentClosingBalance = (statements: BankStatement[]): number => {
  if (!statements.length) return 0;
  
  // Sort statements by uploaded_at date if available
  const sortedStatements = [...statements].sort((a, b) => {
    const dateA = a.uploaded_at ? new Date(a.uploaded_at) : new Date(0);
    const dateB = b.uploaded_at ? new Date(b.uploaded_at) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  return sortedStatements[0].closing_balance || 0;
}

export default function Page() {
  const [statements, setStatements] = useState<BankStatement[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchStatements = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      const { data, error } = await supabase
        .from('statements')
        .select('*')
        .eq('user_id', session.user.id)

      if (error) {
        console.error('Error fetching statements:', error)
        setLoading(false)
        return
      }
      setStatements(data || [])
      setLoading(false)
    }
    fetchStatements()
  }, [router])

  // flatten and sort
  const allTx = statements.flatMap(s => parseTransactions(s).map(normalizeTransaction))
  const validTx = allTx.filter(t => t?.date)
  const sortedTx = [...validTx].sort((a, b) => {
    const dateA = parseDate(a.date)
    const dateB = parseDate(b.date)
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })
  const withRecurring = detectRecurring(sortedTx)

  // monthly stats
  const months = Array.from(new Set(sortedTx.map(t => {
    const isoDate = parseDate(t.date)
    return isoDate.slice(0, 7) // Get YYYY-MM
  })))

  const monthlyStats = months.map(m => {
    const debits = sortedTx.filter(t => {
      const isoDate = parseDate(t.date)
      return isoDate.startsWith(m) && t.type === 'debit'
    })
    const total = debits.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
    return { month: m, total }
  })

  // flags
  const flags = withRecurring.filter(t => {
    if (t.type !== 'debit') return false
    const isoDate = parseDate(t.date)
    const monthKey = isoDate.slice(0, 7)
    const stat = monthlyStats.find(ms => monthKey === ms.month)
    if (!stat) return false
    const monthTransactions = sortedTx.filter(x => {
      const txDate = parseDate(x.date)
      return txDate.startsWith(stat.month) && x.type === 'debit'
    })
    const avg = stat.total / (monthTransactions.length || 1)
    return Math.abs(Number(t.amount || 0)) > avg * 2
  })

  // category data
  const categoryData = sortedTx.reduce((acc, t) => {
    const cat = categorize(t.description || '')
    acc[cat] = (acc[cat] || 0) + Math.abs(Number(t.amount || 0))
    return acc
  }, {} as Record<string, number>)

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
        <Button asChild>
          <Link href="/upload">
            <Plus className="mr-2 h-4 w-4" /> Upload Statement
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              P{getMostRecentClosingBalance(statements).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">P{monthlyStats[0]?.total.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Statements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statements.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bank Charges</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              P{statements.reduce((sum, s) => {
                const charges = s.bank_charges || {};
                return sum + 
                  (charges['Dr Bank Charges Service Fees'] || 0) +
                  (charges['Other Fees'] || 0) +
                  (charges['Total VAT'] || 0);
              }, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {flags.length > 0 && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Attention needed</AlertTitle>
          <AlertDescription>
            You have {flags.length} unusually large transactions this month.
          </AlertDescription>
        </Alert>
      )}

      {/* Transactions Tabs */}
      <Tabs defaultValue="recent" className="mb-8">
        <TabsList>
          <TabsTrigger value="recent">Recent Transactions</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Payments</TabsTrigger>
          <TabsTrigger value="flagged">Flagged Items</TabsTrigger>
        </TabsList>

        {/* Recent */}
        <TabsContent value="recent">
          <Card>
            <CardContent className="pt-6">
              {withRecurring.slice(0, 5).map((tx, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}>
                        {tx.type === 'credit' ? '+' : '-'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{tx.description || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={tx.type === 'credit' ? 'outline' : 'secondary'}>
                      {categorize(tx.description || '')}
                    </Badge>
                    <span className={tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                      {tx.type === 'credit' ? '+' : '-'}P{Math.abs(Number(tx.amount || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recurring */}
        <TabsContent value="recurring">
          <Card>
            <CardContent className="pt-6 space-y-4">
              {withRecurring.filter(tx => tx.recurring).slice(0, 5).map((tx, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-blue-100">R</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{tx.description || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <span className="text-red-600">-P{Math.abs(Number(tx.amount || 0)).toFixed(2)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flagged */}
        <TabsContent value="flagged">
          <Card>
            <CardContent className="pt-6 space-y-4">
              {flags.slice(0, 5).map((tx, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-amber-100">!</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{tx.description || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <span className="text-red-600">-P{Math.abs(Number(tx.amount || 0)).toFixed(2)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader><CardTitle>4-Month Trend</CardTitle></CardHeader>
          <CardContent><SpendingChart stats={monthlyStats} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader>
          <CardContent><CategoryPieChart categories={categoryData} /></CardContent>
        </Card>
      </div>

      {/* Bank Charges Chart */}
      <div className="mt-8">
        <Card>
          <CardHeader><CardTitle>Bank Charges Breakdown</CardTitle></CardHeader>
          <CardContent>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
