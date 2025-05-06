import { Bot, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AdvisorPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-950">AI Financial Advisor</h1>
        <p className="text-gray-500">Get personalized financial advice and answers to your questions</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader className="border-b bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 bg-blue-500">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">Financial Advisor</CardTitle>
                  <CardDescription className="text-xs">Powered by AI • Always available</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex h-[calc(100%-4rem)] flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 bg-blue-500">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg bg-gray-100 p-3">
                      <p>
                        Hello Bame! I'm your AI financial advisor. I can help you with budgeting, saving strategies, and
                        understanding your spending patterns as a student. What would you like to know today?
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 text-right">
                    <div className="ml-auto rounded-lg bg-blue-500 p-3 text-white">
                      <p>I'm trying to reduce my food expenses. Any tips?</p>
                    </div>
                    <Avatar className="h-8 w-8 bg-gray-300">
                      <AvatarFallback>BM</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 bg-blue-500">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg bg-gray-100 p-3">
                      <p>
                        I see that your food expenses are 45% higher than your monthly average. Here are some strategies
                        to reduce them:
                      </p>
                      <ul className="ml-4 mt-2 list-disc space-y-1">
                        <li>Set a weekly food budget and track it closely</li>
                        <li>Cook meals in your accommodation instead of eating out</li>
                        <li>Shop at Choppies or Shoprite instead of more expensive stores</li>
                        <li>Look for student discounts at campus cafeterias</li>
                        <li>Consider meal prep on weekends to avoid impulse food purchases</li>
                        <li>Share grocery costs with roommates for bulk purchases</li>
                      </ul>
                      <p className="mt-2">
                        Would you like me to analyze your specific food spending patterns to provide more personalized
                        recommendations?
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 text-right">
                    <div className="ml-auto rounded-lg bg-blue-500 p-3 text-white">
                      <p>Yes, please analyze my dining patterns and tell me where I could save the most.</p>
                    </div>
                    <Avatar className="h-8 w-8 bg-gray-300">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 bg-blue-500">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg bg-gray-100 p-3">
                      <p>Based on your transaction history, I've analyzed your dining patterns:</p>
                      <ul className="ml-4 mt-2 list-disc space-y-1">
                        <li>
                          <strong>Weekday lunches:</strong> You spend an average of P15-20 per workday on lunch
                          (P300-400/month)
                        </li>
                        <li>
                          <strong>Weekend dining:</strong> You average P85 per weekend on restaurant meals (P680/month)
                        </li>
                        <li>
                          <strong>Coffee shops:</strong> You spend about P25/week on coffee (P100/month)
                        </li>
                      </ul>
                      <p className="mt-2">
                        <strong>Biggest opportunity:</strong> Bringing lunch to campus 3 days a week could save you
                        approximately P180-240 per month. That's nearly P2,500 per year!
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input placeholder="Type your message..." className="flex-1" />
                  <Button size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suggested Questions</CardTitle>
              <CardDescription>Common financial questions you might want to ask</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left">
                How can I improve my credit score?
              </Button>
              <Button variant="outline" className="w-full justify-start text-left">
                What's the best way to pay off my credit card debt?
              </Button>
              <Button variant="outline" className="w-full justify-start text-left">
                How much should I be saving for retirement?
              </Button>
              <Button variant="outline" className="w-full justify-start text-left">
                Should I invest in stocks or ETFs?
              </Button>
              <Button variant="outline" className="w-full justify-start text-left">
                How can I reduce my monthly expenses?
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversation History</CardTitle>
              <CardDescription>Your recent conversations with the advisor</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="recent">
                <TabsList className="w-full">
                  <TabsTrigger value="recent" className="flex-1">
                    Recent
                  </TabsTrigger>
                  <TabsTrigger value="saved" className="flex-1">
                    Saved
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="recent" className="mt-4 space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="font-medium">Reducing dining expenses</div>
                      <div className="text-xs text-gray-500">Today, 10:42 AM</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="font-medium">Retirement planning</div>
                      <div className="text-xs text-gray-500">Yesterday, 3:15 PM</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="font-medium">Emergency fund advice</div>
                      <div className="text-xs text-gray-500">Apr 12, 9:30 AM</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="saved" className="mt-4">
                  <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
                    <Bot className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p>No saved conversations yet</p>
                    <p className="text-sm">Star important conversations to save them for later</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
