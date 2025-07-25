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

  const getStatusButtonClass = (status: string) => {
    const baseClasses = "px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
    
    switch (status) {
      case 'Qualified Show-Up':
        return `${baseClasses} bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white focus:ring-green-500 shadow-lg hover:shadow-xl`
      case 'No Show':
        return `${baseClasses} bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white focus:ring-yellow-500 shadow-lg hover:shadow-xl`
      case 'Disqualified':
        return `${baseClasses} bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl`
      default:
        return baseClasses
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 overflow-hidden">
      <div className="glow-card w-full max-w-7xl h-full max-h-screen p-6 flex flex-col">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gradient-primary mb-1">
            Questionnaire Review
          </h1>
          <p className="text-gray-400 text-sm">Review applicant information and update status</p>
          {data.status && (
            <div className="mt-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white">
                Current Status: {data.status}
              </span>
            </div>
          )}
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            {successMessage}
          </div>
        )}

        {/* Main Content - Horizontal Layout */}
        <div className="flex-1 flex gap-4 mb-4 overflow-hidden">
          {/* Left Column - Personal & Business Info */}
          <div className="flex-1 space-y-4">
            {/* Personal Information */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <h2 className="text-lg font-semibold text-gradient-gold mb-3">Personal Information</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <label className="text-xs text-gray-400 font-medium">Name</label>
                  <p className="text-white font-semibold text-xs">{data.name}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">Email</label>
                  <p className="text-white font-semibold text-xs truncate">{data.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">Phone</label>
                  <p className="text-white font-semibold text-xs">{data.phone}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">Event ID</label>
                  <p className="text-white font-semibold text-xs break-all leading-tight">{data.event_id}</p>
                </div>
              </div>
            </div>

            {/* Business Goals */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <h2 className="text-lg font-semibold text-gradient-gold mb-3">Business Goals</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <label className="text-xs text-gray-400 font-medium">Entrepreneur at Heart</label>
                  <p className="text-white font-semibold text-xs">{data.entrepreneurAtHeart}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">Goal with Launching</label>
                  <p className="text-white text-xs leading-tight">{data.goalWithLaunching}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">Interest in Solar Business</label>
                  <p className="text-white text-xs leading-tight">{data.interestInSolarBusiness}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Financial & Commitment */}
          <div className="flex-1 space-y-4">
            {/* Financial Information */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <h2 className="text-lg font-semibold text-gradient-gold mb-3">Financial Information</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <label className="text-xs text-gray-400 font-medium">Desired Monthly Revenue</label>
                  <p className="text-white font-semibold text-green-400 text-xs">{data.desiredMonthlyRevenue}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">Current Monthly Income</label>
                  <p className="text-white font-semibold text-xs">{data.currentMonthlyIncome}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">Investment Willingness</label>
                  <p className="text-white font-semibold text-xs leading-tight">{data.investmentWillingness}</p>
                </div>
              </div>
            </div>

            {/* Commitment & Motivation */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <h2 className="text-lg font-semibold text-gradient-gold mb-3">Commitment & Motivation</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <label className="text-xs text-gray-400 font-medium">Strategy Call Commitment</label>
                  <p className="text-white font-semibold text-xs leading-tight">{data.strategyCallCommitment}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium">Priority Reason</label>
                  <p className="text-white text-xs leading-tight">{data.priorityReason}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Help Needed & Actions */}
          <div className="flex-1 space-y-4">
            {/* Help Needed Section */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <h2 className="text-lg font-semibold text-gradient-gold mb-3">Help Needed Most</h2>
              <p className="text-white text-xs leading-tight">{data.helpNeededMost}</p>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 flex flex-col justify-center">
              <h2 className="text-lg font-semibold text-gradient-gold mb-4 text-center">Update Status</h2>
              <div className="space-y-2">
                <button
                  onClick={() => handleStatusUpdate('Qualified Show-Up')}
                  disabled={isLoading}
                  className={getStatusButtonClass('Qualified Show-Up') + " w-full text-xs py-2"}
                >
                  {isLoading ? 'Updating...' : 'Qualified Show-Up'}
                </button>
                
                <button
                  onClick={() => handleStatusUpdate('No Show')}
                  disabled={isLoading}
                  className={getStatusButtonClass('No Show') + " w-full text-xs py-2"}
                >
                  {isLoading ? 'Updating...' : 'No Show'}
                </button>
                
                <button
                  onClick={() => handleStatusUpdate('Disqualified')}
                  disabled={isLoading}
                  className={getStatusButtonClass('Disqualified') + " w-full text-xs py-2"}
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