import { Bell, CreditCard, Key, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-950">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="profile" className="flex-1">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="data" className="flex-1">
            <CreditCard className="mr-2 h-4 w-4" />
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-lg">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" size="sm">
                      Upload new photo
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      Remove photo
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" defaultValue="Bame" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" defaultValue="Monageng" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" defaultValue="bame.monageng@biust.ac.bw" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="africa_gaborone">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="africa_gaborone">Africa/Gaborone</SelectItem>
                      <SelectItem value="africa_johannesburg">Africa/Johannesburg</SelectItem>
                      <SelectItem value="africa_nairobi">Africa/Nairobi</SelectItem>
                      <SelectItem value="africa_lagos">Africa/Lagos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button>Save changes</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Preferences</CardTitle>
                <CardDescription>Customize your financial settings and goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bwp">BWP (P)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="cad">CAD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyBudget">Monthly budget</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">P</span>
                    <Input id="monthlyBudget" type="number" defaultValue="2500" className="pl-7" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="savingsGoal">Monthly savings goal</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">P</span>
                    <Input id="savingsGoal" type="number" defaultValue="500" className="pl-7" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startOfMonth">Financial month starts on</Label>
                  <Select defaultValue="1">
                    <SelectTrigger id="startOfMonth">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st of month</SelectItem>
                      <SelectItem value="15">15th of month</SelectItem>
                      <SelectItem value="custom">Custom date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="overdraftAlerts">Overdraft alerts</Label>
                    <Switch id="overdraftAlerts" defaultChecked />
                  </div>
                  <p className="text-sm text-gray-500">Receive alerts when your accounts are at risk of overdraft</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="budgetAlerts">Budget alerts</Label>
                    <Switch id="budgetAlerts" defaultChecked />
                  </div>
                  <p className="text-sm text-gray-500">Receive alerts when you're approaching your budget limits</p>
                </div>

                <div className="flex justify-end">
                  <Button>Save preferences</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailWeekly">Weekly summary</Label>
                      <p className="text-sm text-gray-500">Receive a weekly summary of your financial activity</p>
                    </div>
                    <Switch id="emailWeekly" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailAlerts">Spending alerts</Label>
                      <p className="text-sm text-gray-500">Receive alerts when unusual spending is detected</p>
                    </div>
                    <Switch id="emailAlerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailBudget">Budget notifications</Label>
                      <p className="text-sm text-gray-500">Receive alerts when you're approaching budget limits</p>
                    </div>
                    <Switch id="emailBudget" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailTips">Financial tips</Label>
                      <p className="text-sm text-gray-500">Receive personalized financial advice and tips</p>
                    </div>
                    <Switch id="emailTips" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushTransactions">Transaction alerts</Label>
                      <p className="text-sm text-gray-500">Receive alerts for new transactions</p>
                    </div>
                    <Switch id="pushTransactions" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushBudget">Budget alerts</Label>
                      <p className="text-sm text-gray-500">Receive alerts when you're approaching budget limits</p>
                    </div>
                    <Switch id="pushBudget" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushSecurity">Security alerts</Label>
                      <p className="text-sm text-gray-500">Receive alerts for suspicious account activity</p>
                    </div>
                    <Switch id="pushSecurity" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save notification settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Update your password and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <div className="flex justify-end">
                  <Button>Update password</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-100 p-2 text-blue-500">
                      <Key className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Two-factor authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch className="ml-auto" defaultChecked />
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-100 p-2 text-blue-500">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Recovery codes</h3>
                      <p className="text-sm text-gray-500">Generate backup codes to access your account</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      View codes
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-100 p-2 text-blue-500">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Trusted devices</h3>
                      <p className="text-sm text-gray-500">Manage devices that have access to your account</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your data and connected accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Connected Accounts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                        FN
                      </div>
                      <div>
                        <h4 className="font-medium">FNB Botswana</h4>
                        <p className="text-sm text-gray-500">Connected on Apr 12, 2025</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Disconnect
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                        SB
                      </div>
                      <div>
                        <h4 className="font-medium">Standard Bank</h4>
                        <p className="text-sm text-gray-500">Connected on Mar 28, 2025</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Disconnect
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                        BB
                      </div>
                      <div>
                        <h4 className="font-medium">Barclays Botswana</h4>
                        <p className="text-sm text-gray-500">Connected on Feb 15, 2025</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Disconnect
                    </Button>
                  </div>
                </div>
                <Button>Connect a new account</Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Export</h3>
                <p className="text-sm text-gray-500">Download your financial data in various formats</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">Export as CSV</Button>
                  <Button variant="outline">Export as PDF</Button>
                  <Button variant="outline">Export as Excel</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Retention</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="retainData">Retain transaction data</Label>
                      <p className="text-sm text-gray-500">Keep your transaction data for historical analysis</p>
                    </div>
                    <Select defaultValue="24">
                      <SelectTrigger id="retainData" className="w-[180px]">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <h3 className="mb-2 font-medium text-red-700">Danger Zone</h3>
                <p className="mb-4 text-sm text-gray-700">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
