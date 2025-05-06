import { AlertCircle, FileText, UploadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UploadPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-950">Upload Statements</h1>
        <p className="text-gray-500">Upload your bank statements to analyze your spending patterns</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="history">Upload History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Financial Documents</CardTitle>
              <CardDescription>
                We support CSV, PDF, and Excel files from most major banks and financial institutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Your data is encrypted and never shared with third parties. We only extract transaction data to help
                  you analyze your finances.
                </AlertDescription>
              </Alert>

              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <UploadIcon className="mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-medium">Drag and drop files here</h3>
                  <p className="mb-4 text-sm text-gray-500">or click to browse from your computer</p>
                  <Button>
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Select Files
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <div className="font-medium">bank_statement_march.pdf</div>
                        <div className="text-sm text-gray-500">2.4 MB • PDF</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      Remove
                    </Button>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span>Processing...</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <div className="font-medium">credit_card_transactions.csv</div>
                        <div className="text-sm text-gray-500">1.2 MB • CSV</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      Remove
                    </Button>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span>Completed</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button>Upload & Process</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Learn how we process your financial documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                    1
                  </div>
                  <h3 className="mb-2 font-medium">Upload Documents</h3>
                  <p className="text-sm text-gray-500">
                    Upload your bank statements, credit card bills, or financial exports
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                    2
                  </div>
                  <h3 className="mb-2 font-medium">Automatic Processing</h3>
                  <p className="text-sm text-gray-500">
                    Our system extracts and categorizes all transactions automatically
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                    3
                  </div>
                  <h3 className="mb-2 font-medium">View Insights</h3>
                  <p className="text-sm text-gray-500">
                    Get detailed reports and insights about your spending patterns
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Upload History</CardTitle>
              <CardDescription>View your previously uploaded documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "bank_statement_march.pdf",
                    date: "Apr 15, 2025",
                    status: "Processed",
                    size: "2.4 MB",
                  },
                  {
                    name: "credit_card_transactions.csv",
                    date: "Apr 15, 2025",
                    status: "Processed",
                    size: "1.2 MB",
                  },
                  {
                    name: "bank_statement_february.pdf",
                    date: "Mar 10, 2025",
                    status: "Processed",
                    size: "2.1 MB",
                  },
                  {
                    name: "investment_account.xlsx",
                    date: "Mar 5, 2025",
                    status: "Processed",
                    size: "3.5 MB",
                  },
                  {
                    name: "bank_statement_january.pdf",
                    date: "Feb 8, 2025",
                    status: "Processed",
                    size: "2.3 MB",
                  },
                ].map((file, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-gray-500">
                          {file.date} • {file.size}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                        {file.status}
                      </span>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
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
