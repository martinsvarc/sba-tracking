'use client'

import React, { useState } from 'react'

interface QuestionnaireData {
  name: string
  email: string
  phone: string
  event_id: string
  entrepreneurAtHeart: string
  goalWithLaunching: string
  interestInSolarBusiness: string
  desiredMonthlyRevenue: string
  helpNeededMost: string
  currentMonthlyIncome: string
  priorityReason: string
  investmentWillingness: string
  strategyCallCommitment: string
  status?: string | null
}

interface QuestionnaireCardProps {
  data: QuestionnaireData
}

const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleStatusUpdate = async (status: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/status-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: data.event_id,
          status: status
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setSuccessMessage(result.message)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      setSuccessMessage(error instanceof Error ? error.message : 'Error updating status. Please try again.')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Questionnaire Review
          </h1>
          <p className="text-gray-400 text-lg">Review applicant information and update status</p>
          {data.status && (
            <div className="mt-4">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-blue-500 text-white">
                Current Status: {data.status}
              </span>
            </div>
          )}
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {successMessage}
          </div>
        )}

        {/* Main Content - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Personal Information */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 shadow-lg">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-1">Name</label>
                  <p className="text-white font-semibold text-lg">{data.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-1">Email</label>
                  <p className="text-white font-semibold break-all">{data.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-1">Phone</label>
                  <p className="text-white font-semibold">{data.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-1">Event ID</label>
                  <p className="text-white font-semibold text-xs break-all leading-tight">{data.event_id}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 shadow-lg">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
                Business Goals
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-1">Entrepreneur at Heart</label>
                  <p className="text-white font-semibold">{data.entrepreneurAtHeart}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-1">Goal with Launching</label>
                  <p className="text-white leading-relaxed">{data.goalWithLaunching}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-1">Interest in Solar Business</label>
                  <p className="text-white leading-relaxed">{data.interestInSolarBusiness}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Financial & Commitment */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 shadow-lg">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
                Financial Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-1">Desired Monthly Revenue</label>
                  <p className="text-green-400 font-semibold text-xl">{data.desiredMonthlyRevenue}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-1">Current Monthly Income</label>
                  <p className="text-white font-semibold">{data.currentMonthlyIncome}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-1">Investment Willingness</label>
                  <p className="text-white leading-relaxed">{data.investmentWillingness}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 shadow-lg">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
                Commitment & Motivation
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-1">Strategy Call Commitment</label>
                  <p className="text-white leading-relaxed">{data.strategyCallCommitment}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-1">Priority Reason</label>
                  <p className="text-white leading-relaxed">{data.priorityReason}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Help Needed & Actions */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 shadow-lg">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
                Help Needed Most
              </h2>
              <p className="text-white leading-relaxed">{data.helpNeededMost}</p>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 shadow-lg">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-6 text-center">
                Update Status
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => handleStatusUpdate('Qualified Show-Up')}
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? 'Updating...' : 'Qualified Show-Up'}
                </button>
                
                <button
                  onClick={() => handleStatusUpdate('No Show')}
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? 'Updating...' : 'No Show'}
                </button>
                
                <button
                  onClick={() => handleStatusUpdate('Disqualified')}
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? 'Updating...' : 'Disqualified'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionnaireCard 