'use client'

import { useState, useEffect } from "react"
import { AlertTriangle, Calendar, ChevronLeft, ChevronRight, Download, Filter, UploadIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { supabase } from "@/lib/supautil"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MonthlySpendingChart } from "@/components/monthly-spending-chart"
import { CategoryComparisonChart } from "@/components/category-comparison-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReportsPage() {
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    const checkForStatements = async () => {
      // Here you would check your database for uploaded statements
      const { data: statements } = await supabase
        .from('statements')
        .select('id')
        .limit(1)
      
      setHasData((statements ?? []).length > 0)
    }

    checkForStatements()
  }, [])

  if (!hasData) {
    return (
      <div className="container mx-auto p-6">
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">No Financial Data Available</CardTitle>
            <CardDescription className="mt-2 text-base text-gray-600">
              Upload your bank statements to access detailed financial analytics and insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/upload">
              <Button className="mt-4 font-medium">
                <UploadIcon className="mr-2 h-4 w-4" />
                Import Bank Statement
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Financial Analytics</h1>
          <p className="text-base text-gray-600">Comprehensive analysis of your financial activities</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="font-medium">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" size="sm" className="font-medium">
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between rounded-lg border bg-white p-4">
        <Button variant="ghost" size="icon">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          <span className="text-lg font-medium">April 2025</span>
        </div>
        <Button variant="ghost" size="icon">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Expenditure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-gray-900">P3,842.00</div>
            <div className="flex items-center text-sm">
              <span className="text-red-600">+12.3%</span>
              <span className="ml-1 text-gray-600">compared to previous month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Daily Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">P128.07</div>
            <div className="flex items-center text-sm text-red-500">
              <span>+8.5%</span>
              <span className="ml-1 text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Top Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Food</div>
            <div className="flex items-center text-sm text-red-500">
              <span>P645.00</span>
              <span className="ml-1 text-gray-500">(35.0% of total)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Expenditure Analysis</CardTitle>
            <CardDescription className="text-base text-gray-600">
              Six-month historical spending patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <MonthlySpendingChart />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Category Comparison</CardTitle>
              <CardDescription>Current month vs previous month</CardDescription>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="top5">Top 5 Categories</SelectItem>
                <SelectItem value="increasing">Increasing Only</SelectItem>
                <SelectItem value="decreasing">Decreasing Only</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <CategoryComparisonChart />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending Anomalies</CardTitle>
            <CardDescription>Unusual spending patterns detected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-gray-900">Expenditure Alert</h3>
                  <Badge variant="destructive" className="ml-auto">
                    High Priority
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">
                  Your food expenses (P645) are 45% higher than your monthly average (P458). This is the highest monthly
                  food spend in the past 12 months.
                </p>
                <Button variant="link" className="mt-2 h-auto p-0 text-sm font-medium text-red-700">
                  Review Details
                </Button>
              </div>

              <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h3 className="font-medium text-amber-700">Entertainment Expenses</h3>
                  <Badge variant="outline" className="ml-auto border-amber-200 text-amber-700">
                    Medium Risk
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">
                  Your entertainment expenses (P425) are 28% higher than your monthly average (P332). Consider reviewing
                  your subscriptions.
                </p>
                <Button variant="link" className="mt-2 h-auto p-0 text-sm text-amber-700">
                  View Details
                </Button>
              </div>

              <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium text-green-700">Grocery Expenses</h3>
                  <Badge variant="outline" className="ml-auto border-green-200 text-green-700">
                    Positive
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">
                  Your grocery expenses (P385) are 15% lower than your monthly average (P453). Great job on reducing
                  this category!
                </p>
                <Button variant="link" className="mt-2 h-auto p-0 text-sm text-green-700">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Breakdown</CardTitle>
            <CardDescription>Detailed spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="font-medium">
                <TabsTrigger value="all">Complete Overview</TabsTrigger>
                <TabsTrigger value="essentials">Essential Expenses</TabsTrigger>
                <TabsTrigger value="discretionary">Discretionary Spending</TabsTrigger>
                <TabsTrigger value="savings">Investment & Savings</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <div className="rounded-lg border">
                  <div className="grid grid-cols-12 border-b bg-gray-50 p-3 text-sm font-medium text-gray-500">
                    <div className="col-span-4">Category</div>
                    <div className="col-span-2 text-right">Amount</div>
                    <div className="col-span-2 text-right">% of Total</div>
                    <div className="col-span-2 text-right">vs Last Month</div>
                    <div className="col-span-2 text-right">Trend</div>
                  </div>
                  {[
                    {
                      category: "Food",
                      amount: "P645.00",
                      percentage: "35.0%",
                      change: "+45%",
                      trend: "increasing",
                      alert: true,
                    },
                    {
                      category: "Shopping",
                      amount: "P442.00",
                      percentage: "21.9%",
                      change: "+12%",
                      trend: "increasing",
                    },
                    {
                      category: "Transportation",
                      amount: "P354.00",
                      percentage: "17.0%",
                      change: "-5%",
                      trend: "decreasing",
                    },
                    {
                      category: "Entertainment",
                      amount: "P425.00",
                      percentage: "11.1%",
                      change: "+28%",
                      trend: "increasing",
                      alert: true,
                    },
                    {
                      category: "Groceries",
                      amount: "P385.00",
                      percentage: "10.0%",
                      change: "-15%",
                      trend: "decreasing",
                    },
                    {
                      category: "Utilities",
                      amount: "P291.00",
                      percentage: "7.6%",
                      change: "+2%",
                      trend: "stable",
                    },
                  ].map((item, i) => (
                    <div key={i} className="grid grid-cols-12 border-b p-3 text-sm last:border-0">
                      <div className="col-span-4 flex items-center gap-2">
                        {item.alert && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {item.category}
                      </div>
                      <div className="col-span-2 text-right font-medium">{item.amount}</div>
                      <div className="col-span-2 text-right">{item.percentage}</div>
                      <div
                        className={`col-span-2 text-right ${
                          item.trend === "increasing"
                            ? "text-red-500"
                            : item.trend === "decreasing"
                              ? "text-green-500"
                              : ""
                        }`}
                      >
                        {item.change}
                      </div>
                      <div className="col-span-2 text-right">
                        {item.trend === "increasing" ? (
                          <span className="inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                            ↑ Increasing
                          </span>
                        ) : item.trend === "decreasing" ? (
                          <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            ↓ Decreasing
                          </span>
                        ) : (
                          <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            → Stable
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="essentials" className="mt-4">
                <div className="rounded-lg border">
                  {/* Similar structure for essentials tab */}
                  <div className="p-8 text-center text-gray-500">Essentials categories breakdown would appear here</div>
                </div>
              </TabsContent>
              <TabsContent value="discretionary" className="mt-4">
                <div className="rounded-lg border">
                  {/* Similar structure for discretionary tab */}
                  <div className="p-8 text-center text-gray-500">
                    Discretionary spending breakdown would appear here
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="savings" className="mt-4">
                <div className="rounded-lg border">
                  {/* Similar structure for savings tab */}
                  <div className="p-8 text-center text-gray-500">
                    Savings and investments breakdown would appear here
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
