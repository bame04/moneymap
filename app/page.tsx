import Link from "next/link"
import { ArrowRight, BarChart3, CreditCard, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-500 p-1">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">MoneyMap</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-blue-950">
              Take Control of Your <span className="text-blue-500">Financial Future</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
              MoneyMap helps you track spending, reduce debt, and achieve your financial goals with powerful insights
              and personalized recommendations.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </Link>
            </div>
            <div className="mt-16">
              <img
                src="/placeholder.svg?height=600&width=1000"
                alt="MoneyMap Dashboard Preview"
                className="mx-auto rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-blue-950">Why Choose MoneyMap?</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-blue-100 p-3">
                    <BarChart3 className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-medium">Visual Spending Insights</h3>
                  <p className="text-gray-600">
                    See where your money goes with intuitive charts and breakdowns that make financial tracking simple.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-blue-100 p-3">
                    <Shield className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-medium">Red Flag Alerts</h3>
                  <p className="text-gray-600">
                    Get notified about unusual spending patterns and potential issues before they become problems.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-blue-100 p-3">
                    <Zap className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-medium">AI-Powered Advice</h3>
                  <p className="text-gray-600">
                    Receive personalized financial recommendations from our intelligent AI assistant.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-500 p-1">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">MoneyMap</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-blue-500">
                About
              </a>
              <a href="#" className="hover:text-blue-500">
                Features
              </a>
              <a href="#" className="hover:text-blue-500">
                Pricing
              </a>
              <a href="#" className="hover:text-blue-500">
                Blog
              </a>
              <a href="#" className="hover:text-blue-500">
                Contact
              </a>
            </div>
            <div className="text-sm text-gray-500">© 2025 MoneyMap. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
