import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="glow-card w-full max-w-2xl p-8 text-center">
        <h1 className="text-4xl font-bold text-gradient-primary mb-4">
          SBA Tracking System
        </h1>
        <p className="text-gray-400 mb-8">
          Full-stack questionnaire system built with Next.js, Prisma, and Neon database
        </p>
        
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-gradient-gold mb-4">API Endpoints</h2>
            <div className="text-left space-y-2 text-sm">
              <div>
                <code className="bg-gray-700 px-2 py-1 rounded text-green-400">POST /api/questionnaire</code>
                <p className="text-gray-400 mt-1">Create a new questionnaire</p>
              </div>
              <div>
                <code className="bg-gray-700 px-2 py-1 rounded text-green-400">POST /api/status-update</code>
                <p className="text-gray-400 mt-1">Update questionnaire status</p>
              </div>
              <div>
                <code className="bg-gray-700 px-2 py-1 rounded text-green-400">GET /review/[id]</code>
                <p className="text-gray-400 mt-1">View questionnaire review page</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-gradient-gold mb-4">Sample Data</h2>
            <p className="text-gray-400 text-sm mb-4">
              Use this sample data to test the questionnaire creation:
            </p>
            <pre className="bg-gray-900 p-4 rounded-lg text-xs text-gray-300 overflow-x-auto">
{`{
  "name": "Don Jessop",
  "email": "donwayne220@gmail.com",
  "phone": "(385) 455-3967",
  "eventId": "grav-questionnaire-donwayne220@gmail.com-1753126492842",
  "entrepreneurAtHeart": "Yes",
  "goalWithLaunching": "I want to take my current solar business from side-gig to full time wealth generating machine",
  "interestInSolarBusiness": "I want experts to grind for me and build me a wildly successful solar biz from scratch",
  "desiredMonthlyRevenue": "$25,000",
  "helpNeededMost": "I have done door to door for 5 years and got screwed over by a sales company and installer...",
  "currentMonthlyIncome": "$2.5k - $5k/mo",
  "priorityReason": "Because I've been trying to do this on my own for five years!...",
  "investmentWillingness": "Yes - I have the cashflow to invest in myself",
  "strategyCallCommitment": "Yes - I have double checked my calendar and will commit 100% to the time I choose"
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
} 