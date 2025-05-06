import { AlertTriangle, ArrowDownUp, Download, Filter, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TransactionsPage() {
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
              <CardDescription>Showing 50 most recent transactions</CardDescription>
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
                  {
                    name: "Choppies Supermarket",
                    category: "Groceries",
                    amount: "-P178.35",
                    date: "Apr 8, 5:30 PM",
                    icon: "CS",
                    iconColor: "bg-green-600",
                  },
                  {
                    name: "UB Gym Membership",
                    category: "Health & Fitness",
                    amount: "-P75.00",
                    date: "Apr 5, 12:00 AM",
                    icon: "UG",
                    iconColor: "bg-purple-500",
                  },
                  {
                    name: "BPC Electricity",
                    category: "Utilities",
                    amount: "-P94.72",
                    date: "Apr 3, 9:00 AM",
                    icon: "BP",
                    iconColor: "bg-yellow-500",
                  },
                  {
                    name: "Textbook Purchase",
                    category: "Education",
                    amount: "-P356.83",
                    date: "Apr 2, 3:22 PM",
                    icon: "TB",
                    iconColor: "bg-red-600",
                  },
                  {
                    name: "Orange Money Transfer",
                    category: "Transfer",
                    amount: "+P175.00",
                    date: "Apr 1, 7:45 PM",
                    icon: "OM",
                    iconColor: "bg-blue-400",
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
              <div className="mt-6 flex items-center justify-between">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <div className="text-sm text-gray-500">Showing 1-10 of 156 transactions</div>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Income Transactions</CardTitle>
              <CardDescription>Showing income transactions only</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Student Allowance",
                    category: "Income",
                    amount: "+P1,450.00",
                    date: "Apr 10, 12:00 AM",
                    icon: "SA",
                    iconColor: "bg-blue-500",
                  },
                  {
                    name: "Orange Money Transfer",
                    category: "Transfer",
                    amount: "+P175.00",
                    date: "Apr 1, 7:45 PM",
                    icon: "OM",
                    iconColor: "bg-blue-400",
                  },
                  {
                    name: "Tutoring Payment",
                    category: "Income",
                    amount: "+P350.00",
                    date: "Mar 28, 2:15 PM",
                    icon: "TP",
                    iconColor: "bg-green-600",
                  },
                  {
                    name: "Scholarship Disbursement",
                    category: "Income",
                    amount: "+P2,843.21",
                    date: "Mar 15, 10:30 AM",
                    icon: "SD",
                    iconColor: "bg-blue-500",
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
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.category} • {transaction.date}
                        </div>
                      </div>
                    </div>
                    <div className="font-medium text-green-600">{transaction.amount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Transactions</CardTitle>
              <CardDescription>Showing expense transactions only</CardDescription>
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
                    name: "Showmax Subscription",
                    category: "Entertainment",
                    amount: "-P95.99",
                    date: "Apr 9, 3:45 AM",
                    icon: "SM",
                    iconColor: "bg-red-500",
                    flag: true,
                  },
                  {
                    name: "Choppies Supermarket",
                    category: "Groceries",
                    amount: "-P178.35",
                    date: "Apr 8, 5:30 PM",
                    icon: "CS",
                    iconColor: "bg-green-600",
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
                    <div className="font-medium">{transaction.amount}</div>
                  </div>
                ))}
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
                {[
                  {
                    name: "Showmax Subscription",
                    category: "Entertainment",
                    amount: "-P95.99",
                    date: "Apr 9, 3:45 AM",
                    icon: "SM",
                    iconColor: "bg-red-500",
                    flag: true,
                    flagReason: "Price increased from P85.99",
                  },
                  {
                    name: "Unknown Charge",
                    category: "Uncategorized",
                    amount: "-P149.99",
                    date: "Apr 7, 1:23 AM",
                    icon: "UC",
                    iconColor: "bg-gray-500",
                    flag: true,
                    flagReason: "Unrecognized merchant",
                  },
                  {
                    name: "UB Gym Membership",
                    category: "Health & Fitness",
                    amount: "-P75.00",
                    date: "Apr 5, 12:00 AM",
                    icon: "UG",
                    iconColor: "bg-purple-500",
                    flag: true,
                    flagReason: "Unused for 3+ months",
                  },
                ].map((transaction, i) => (
                  <div key={i} className="flex flex-col rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={transaction.iconColor}>{transaction.icon}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{transaction.name}</span>
                            <Badge variant="destructive" className="h-5 px-1">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Flagged
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.category} • {transaction.date}
                          </div>
                        </div>
                      </div>
                      <div className="font-medium">{transaction.amount}</div>
                    </div>
                    <div className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-700">
                      <AlertTriangle className="mr-1 inline-block h-3 w-3" />
                      Flag reason: {transaction.flagReason}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
