'use client'

import React, { useState } from 'react'

interface QuestionnaireData {
  id?: string
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
  ghlLink?: string | null
  appointmentTime?: string | null
  closerName?: string | null
  appointmentBooked?: boolean
}

interface QuestionnaireCardProps {
  data: QuestionnaireData
}

const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [analyticsData, setAnalyticsData] = useState({
    ghlLink: data.ghlLink || '',
    appointmentBooked: data.appointmentBooked || false,
    appointmentTime: data.appointmentTime || '',
    closerName: data.closerName || '',
    status: data.status || 'Untracked'
  })
  const [isEditing, setIsEditing] = useState(false)

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

  const handleAnalyticsUpdate = async () => {
    if (!data.id) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/questionnaire/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analyticsData),
      })

      if (response.ok) {
        const result = await response.json()
        setSuccessMessage('Analytics data updated successfully')
        setShowSuccess(true)
        setIsEditing(false)
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update analytics data')
      }
    } catch (error) {
      console.error('Error updating analytics data:', error)
      setSuccessMessage(error instanceof Error ? error.message : 'Error updating analytics data. Please try again.')
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
      fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
            fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
          }}>
            Questionnaire Review
          </h1>
          <p style={{ 
            color: '#9ca3af', 
            fontSize: '1.125rem',
            fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
          }}>
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
                color: 'white',
                fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
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
            zIndex: 50,
            fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
          }}>
            {successMessage}
          </div>
        )}

        {/* Main Content - 4 Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
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
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem',
                fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
              }}>
                Personal Information
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Name</label>
                  <p style={{ 
                    color: 'white', 
                    fontWeight: '600', 
                    fontSize: '1.125rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>{data.name}</p>
                </div>
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Email</label>
                  <p style={{ 
                    color: 'white', 
                    fontWeight: '600', 
                    wordBreak: 'break-all',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>{data.email}</p>
                </div>
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Phone</label>
                  <p style={{ 
                    color: 'white', 
                    fontWeight: '600',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>{data.phone}</p>
                </div>
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Event ID</label>
                  <p style={{ 
                    color: 'white', 
                    fontWeight: '600', 
                    fontSize: '0.75rem', 
                    wordBreak: 'break-all', 
                    lineHeight: '1.2',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>{data.event_id}</p>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(31, 41, 55, 0.5)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #374151',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem',
                fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
              }}>
                Business Goals
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Entrepreneur at Heart</label>
                  <p style={{ 
                    color: 'white', 
                    fontWeight: '600',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>{data.entrepreneurAtHeart}</p>
                </div>
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Goal with Launching</label>
                  <p style={{ 
                    color: 'white', 
                    lineHeight: '1.6',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>{data.goalWithLaunching}</p>
                </div>
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Interest in Solar Business</label>
                  <p style={{ 
                    color: 'white', 
                    lineHeight: '1.6',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>{data.interestInSolarBusiness}</p>
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
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem',
                fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
              }}>
                Financial Information
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Desired Monthly Revenue</label>
                  <p style={{ 
                    color: '#4ade80', 
                    fontWeight: '600', 
                    fontSize: '1.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>{data.desiredMonthlyRevenue}</p>
                </div>
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Current Monthly Income</label>
                  <p style={{ 
                    color: 'white', 
                    fontWeight: '600',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>{data.currentMonthlyIncome}</p>
                </div>
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Investment Willingness</label>
                  <p style={{ 
                    color: 'white', 
                    lineHeight: '1.6',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>{data.investmentWillingness}</p>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(31, 41, 55, 0.5)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #374151',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem',
                fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
              }}>
                Commitment & Motivation
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Strategy Call Commitment</label>
                  <p style={{ 
                    color: 'white', 
                    lineHeight: '1.6',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>{data.strategyCallCommitment}</p>
                </div>
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Priority Reason</label>
                  <p style={{ 
                    color: 'white', 
                    lineHeight: '1.6',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>{data.priorityReason}</p>
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
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem',
                fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
              }}>
                Help Needed Most
              </h2>
              <p style={{ 
                color: 'white', 
                lineHeight: '1.6',
                fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
              }}>{data.helpNeededMost}</p>
            </div>

            {/* Appointment Tracking */}
            <div style={{
              backgroundColor: 'rgba(31, 41, 55, 0.5)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #374151',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem',
                fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
              }}>
                Appointment Tracking
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* GHL Link */}
                {data.ghlLink && (
                  <div>
                    <label style={{ 
                      fontSize: '0.875rem', 
                      color: '#9ca3af', 
                      fontWeight: '500', 
                      display: 'block', 
                      marginBottom: '0.25rem',
                      fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                    }}>GHL Link</label>
                    <button
                      onClick={() => window.open(data.ghlLink!, '_blank')}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        fontWeight: '600',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontFamily: '"Outfit", system-ui, -apple-system, sans-serif',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      Open GHL Link
                    </button>
                  </div>
                )}

                {/* Appointment Time */}
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Appointment Time</label>
                  <p style={{ 
                    color: 'white', 
                    fontWeight: '600',
                    fontSize: '1rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>
                    {data.appointmentTime ? new Date(data.appointmentTime).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    }) : 'No appointment scheduled'}
                  </p>
                </div>

                {/* Closer Name */}
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Closer Name</label>
                  <p style={{ 
                    color: 'white', 
                    fontWeight: '600',
                    fontSize: '1rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>
                    {data.closerName || 'Not assigned'}
                  </p>
                </div>

                {/* Appointment Booked Status */}
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Appointment Booked</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '50%',
                      backgroundColor: data.appointmentBooked ? '#10b981' : 'transparent',
                      border: '2px solid #6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {data.appointmentBooked && (
                        <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>✓</span>
                      )}
                    </div>
                    <span style={{ 
                      color: 'white', 
                      fontSize: '1rem',
                      fontWeight: '600',
                      fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                    }}>
                      {data.appointmentBooked ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              backgroundColor: 'rgba(31, 41, 55, 0.5)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #374151',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1.5rem',
                textAlign: 'center',
                fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
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
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif',
                    fontSize: '1rem'
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
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif',
                    fontSize: '1rem'
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
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif',
                    fontSize: '1rem'
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

          {/* Column 4: Analytics & Tracking */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              backgroundColor: 'rgba(31, 41, 55, 0.5)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #374151',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                }}>
                  Analytics & Tracking
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: isEditing ? '#ef4444' : '#3b82f6',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>GHL Link</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={analyticsData.ghlLink}
                      onChange={(e) => setAnalyticsData({...analyticsData, ghlLink: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: 'rgba(55, 65, 81, 0.5)',
                        border: '1px solid #6b7280',
                        borderRadius: '0.375rem',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                      }}
                      placeholder="Enter GHL link..."
                    />
                  ) : (
                    <p style={{ 
                      color: 'white', 
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      wordBreak: 'break-all',
                      fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                    }}>
                      {analyticsData.ghlLink || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Call Booked</label>
                  {isEditing ? (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={analyticsData.appointmentBooked}
                        onChange={(e) => setAnalyticsData({...analyticsData, appointmentBooked: e.target.checked})}
                        style={{
                          width: '1rem',
                          height: '1rem',
                          accentColor: '#3b82f6'
                        }}
                      />
                      <span style={{ 
                        color: 'white', 
                        fontSize: '0.875rem',
                        fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                      }}>
                        Call has been booked
                      </span>
                    </label>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                             <div style={{
                         width: '1rem',
                         height: '1rem',
                         borderRadius: '50%',
                         backgroundColor: analyticsData.appointmentBooked ? '#10b981' : 'transparent',
                         border: '2px solid #6b7280'
                       }}></div>
                       <span style={{ 
                         color: 'white', 
                         fontSize: '0.875rem',
                         fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                       }}>
                         {analyticsData.appointmentBooked ? 'Yes' : 'No'}
                       </span>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Appointment Date & Time</label>
                  {isEditing ? (
                                         <input
                       type="datetime-local"
                       value={analyticsData.appointmentTime ? analyticsData.appointmentTime.slice(0, 16) : ''}
                       onChange={(e) => setAnalyticsData({...analyticsData, appointmentTime: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: 'rgba(55, 65, 81, 0.5)',
                        border: '1px solid #6b7280',
                        borderRadius: '0.375rem',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                      }}
                    />
                  ) : (
                                         <p style={{ 
                       color: 'white', 
                       fontWeight: '600',
                       fontSize: '0.875rem',
                       fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                     }}>
                       {analyticsData.appointmentTime ? new Date(analyticsData.appointmentTime).toLocaleString() : '-'}
                     </p>
                  )}
                </div>

                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Closer Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={analyticsData.closerName}
                      onChange={(e) => setAnalyticsData({...analyticsData, closerName: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: 'rgba(55, 65, 81, 0.5)',
                        border: '1px solid #6b7280',
                        borderRadius: '0.375rem',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                      }}
                      placeholder="Enter closer name..."
                    />
                  ) : (
                    <p style={{ 
                      color: 'white', 
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                    }}>
                      {analyticsData.closerName || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    color: '#9ca3af', 
                    fontWeight: '500', 
                    display: 'block', 
                    marginBottom: '0.25rem',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                  }}>Status</label>
                  {isEditing ? (
                    <select
                      value={analyticsData.status}
                      onChange={(e) => setAnalyticsData({...analyticsData, status: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: 'rgba(55, 65, 81, 0.5)',
                        border: '1px solid #6b7280',
                        borderRadius: '0.375rem',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                      }}
                    >
                      <option value="Untracked">Untracked</option>
                      <option value="Qualified Show-Up">Qualified Show-Up</option>
                      <option value="No Show">No Show</option>
                      <option value="Disqualified">Disqualified</option>
                    </select>
                  ) : (
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: analyticsData.status === 'Qualified Show-Up' ? '#10b981' : 
                                   analyticsData.status === 'No Show' ? '#ef4444' :
                                   analyticsData.status === 'Disqualified' ? '#f59e0b' : '#6b7280',
                      color: 'white',
                      fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                    }}>
                      {analyticsData.status}
                    </span>
                  )}
                </div>

                {isEditing && (
                  <button
                    onClick={handleAnalyticsUpdate}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      fontWeight: '600',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.5 : 1,
                      transition: 'all 0.3s ease',
                      fontSize: '0.875rem',
                      fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
                    }}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionnaireCard 