import Link from "next/link"
import { Compass } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl bg-black rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 md:p-10">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-white text-xl font-bold">
                MoneyMap
              </Link>
              <div className="hidden md:flex space-x-6 text-sm text-gray-300">
                <Link href="#products" className="hover:text-white transition-colors">
                  About Us
                </Link>
                <Link href="#solutions" className="hover:text-white transition-colors">
                  Solutions
                </Link>
                <Link href="#blog" className="hover:text-white transition-colors">
                  Help
                </Link>
              </div>
            </div>
            <Link href="/login" className="text-sm text-white hover:text-gray-200 transition-colors">
              Log in
            </Link>
          </nav>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Manage your Finances for True <span className="italic">Financial Freedom</span>
              </h1>

              {/* Cards */}
              <div className="relative h-48 md:h-64 mt-8 md:mt-12">
                <div className="absolute top-0 left-0 w-40 h-24 md:w-48 md:h-28 bg-yellow-400 rounded-lg shadow-lg transform rotate-[-10deg] z-10"></div>
                <div className="absolute top-4 left-8 w-40 h-24 md:w-48 md:h-28 bg-white rounded-lg shadow-lg transform rotate-[-5deg] z-20"></div>
                <div className="absolute top-8 left-16 w-40 h-24 md:w-48 md:h-28 bg-blue-500 rounded-lg shadow-lg transform rotate-[0deg] z-30 flex items-center justify-center">
                  <div className="text-white text-xl font-bold">Save</div>
                </div>
              </div>
            </div>

            <div className="space-y-8 lg:pl-8">
              <div className="flex flex-col items-center lg:items-start">
                {/* Compass Circle */}
                <div className="relative w-32 h-32 mb-6">
                  <div className="absolute inset-0 rounded-full border border-gray-600 animate-[spin_20s_linear_infinite]"></div>
                  <div className="absolute inset-2 rounded-full border border-gray-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Compass className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-6">
                  <div className="text-4xl md:text-5xl font-bold text-white">
                    800<span className="text-xl align-top">+</span>
                  </div>
                  <div className="text-sm text-gray-400">Satisfied Users</div>
                </div>

                <div className="mb-8">
                  <div className="text-4xl md:text-5xl font-bold text-white">
                    0<span className="text-xl align-top"> %</span>
                  </div>
                  <div className="text-sm text-gray-400">Anyday Fees</div>
                </div>

                <div className="text-sm text-gray-300 max-w-xs text-center lg:text-left mb-8">
                  Open. Honest. with AI chatbot to help you talk to your money as we map it out.
                </div>

                <Link
                  href="#get-started"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {/* Partners */}
          <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="text-xs text-gray-500 mb-4">Trusted by hundreds of Users Banking At</div>
            <div className="flex flex-wrap justify-between items-center gap-6 opacity-70">
              <div className="text-white font-bold">FNB</div>
              <div className="text-white font-bold">ABSA</div>
              <div className="text-white font-bold">ACCESS BANK</div>
              <div className="text-white font-bold">STANBIC</div>
              <div className="text-white font-bold">BBS BANK</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

