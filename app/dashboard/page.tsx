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
            <div className="text-2xl font-bold">P4,563.00</div>
            <div className="flex items-center text-sm text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>+2.5%</span>
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
            <div className="text-2xl font-bold">P1,842.00</div>
            <div className="flex items-center text-sm text-red-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>+12.3%</span>
              <span className="ml-1 text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Monthly Budget</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">P2,500.00</div>
            <div className="mt-2">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span>P1,842 spent</span>
                <span>73.7%</span>
              </div>
              <Progress value={73.7} className="h-2" />
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
              {[
                {
                  name: "Vida e Caffè",
                  category: "Food",
                  amount: "-P42.50",
                  date: "Today, 9:15 AM",
                  icon: "VC",
                  iconColor: "bg-green-500",
                },
                {
                  name: "Game City Mall",
                  category: "Shopping",
                  amount: "-P184.29",
                  date: "Yesterday, 2:34 PM",
                  icon: "GC",
                  iconColor: "bg-orange-500",
                },
                {
                  name: "inDrive Ride",
                  category: "Transport",
                  amount: "-P54.75",
                  date: "Apr 12, 8:12 PM",
                  icon: "ID",
                  iconColor: "bg-black",
                },
                {
                  name: "Student Allowance",
                  category: "Income",
                  amount: "+P1,450.00",
                  date: "Apr 10, 12:00 AM",
                  icon: "SA",
                  iconColor: "bg-blue-500",
                },
                {
                  name: "Showmax Subscription",
                  category: "Entertainment",
                  amount: "-P95.99",
                  date: "Apr 9, 3:45 AM",
                  icon: "SM",
                  iconColor: "bg-red-500",
                  flag: true,
                },
              ].map((transaction, i) => (
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
