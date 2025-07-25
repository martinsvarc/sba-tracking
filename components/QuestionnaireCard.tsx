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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)',
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            Questionnaire Review
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1.125rem' }}>
            Review applicant information and update status
          </p>
          {data.status && (
            <div style={{ marginTop: '1rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600',
                backgroundColor: '#3b82f6',
                color: 'white'
              }}>
                Current Status: {data.status}
              </span>
            </div>
          )}
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            backgroundColor: '#10b981',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 50
          }}>
            {successMessage}
          </div>
        )}

        {/* Main Content - 3 Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Column 1: Personal Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              backgroundColor: 'rgba(31, 41, 55, 0.5)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #374151',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
              }}>
                Personal Information
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500', display: 'block', marginBottom: '0.25rem' }}>Name</label>
                  <p style={{ color: 'white', fontWeight: '600', fontSize: '1.125rem' }}>{data.name}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500', display: 'block', marginBottom: '0.25rem' }}>Email</label>
                  <p style={{ color: 'white', fontWeight: '600', wordBreak: 'break-all' }}>{data.email}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500', display: 'block', marginBottom: '0.25rem' }}>Phone</label>
                  <p style={{ color: 'white', fontWeight: '600' }}>{data.phone}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500', display: 'block', marginBottom: '0.25rem' }}>Event ID</label>
                  <p style={{ color: 'white', fontWeight: '600', fontSize: '0.75rem', wordBreak: 'break-all', lineHeight: '1.2' }}>{data.event_id}</p>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(31, 41, 55, 0.5)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #374151',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
              }}>
                Business Goals
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500', display: 'block', marginBottom: '0.25rem' }}>Entrepreneur at Heart</label>
                  <p style={{ color: 'white', fontWeight: '600' }}>{data.entrepreneurAtHeart}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500', display: 'block', marginBottom: '0.25rem' }}>Goal with Launching</label>
                  <p style={{ color: 'white', lineHeight: '1.6' }}>{data.goalWithLaunching}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500', display: 'block', marginBottom: '0.25rem' }}>Interest in Solar Business</label>
                  <p style={{ color: 'white', lineHeight: '1.6' }}>{data.interestInSolarBusiness}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Financial & Commitment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              backgroundColor: 'rgba(31, 41, 55, 0.5)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #374151',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
              }}>
                Financial Information
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500', display: 'block', marginBottom: '0.25rem' }}>Desired Monthly Revenue</label>
                  <p style={{ color: '#4ade80', fontWeight: '600', fontSize: '1.25rem' }}>{data.desiredMonthlyRevenue}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500', display: 'block', marginBottom: '0.25rem' }}>Current Monthly Income</label>
                  <p style={{ color: 'white', fontWeight: '600' }}>{data.currentMonthlyIncome}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500', display: 'block', marginBottom: '0.25rem' }}>Investment Willingness</label>
                  <p style={{ color: 'white', lineHeight: '1.6' }}>{data.investmentWillingness}</p>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(31, 41, 55, 0.5)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #374151',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
              }}>
                Commitment & Motivation
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500', display: 'block', marginBottom: '0.25rem' }}>Strategy Call Commitment</label>
                  <p style={{ color: 'white', lineHeight: '1.6' }}>{data.strategyCallCommitment}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500', display: 'block', marginBottom: '0.25rem' }}>Priority Reason</label>
                  <p style={{ color: 'white', lineHeight: '1.6' }}>{data.priorityReason}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Help Needed & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              backgroundColor: 'rgba(31, 41, 55, 0.5)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #374151',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
              }}>
                Help Needed Most
              </h2>
              <p style={{ color: 'white', lineHeight: '1.6' }}>{data.helpNeededMost}</p>
            </div>

            {/* Action Buttons */}
            <div style={{
              backgroundColor: 'rgba(31, 41, 55, 0.5)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #374151',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                Update Status
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => handleStatusUpdate('Qualified Show-Up')}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {isLoading ? 'Updating...' : 'Qualified Show-Up'}
                </button>
                
                <button
                  onClick={() => handleStatusUpdate('No Show')}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {isLoading ? 'Updating...' : 'No Show'}
                </button>
                
                <button
                  onClick={() => handleStatusUpdate('Disqualified')}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
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