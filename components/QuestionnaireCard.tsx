'use client'

import React, { useState, useCallback } from 'react'

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
  const [currentStatus, setCurrentStatus] = useState(data.status || 'Untracked')

  // Debounced status update function
  const debouncedStatusUpdate = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout
      return (status: string) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => handleStatusUpdate(status), 300)
      }
    })(),
    []
  )

  const handleStatusUpdate = async (status: string) => {
    if (isLoading || status === currentStatus) return
    
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
        setCurrentStatus(status)
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

  const statusButtons = [
    { label: 'Qualified Show-Up', status: 'Qualified Show-Up', emoji: '✅', color: 'linear-gradient(135deg, #10b981, #059669)' },
    { label: 'No Show', status: 'No Show', emoji: '❌', color: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { label: 'Disqualified', status: 'Disqualified', emoji: '🟡', color: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    { label: 'Closed', status: 'Closed', emoji: '🟢', color: 'linear-gradient(135deg, #0f766e, #0d5a5a)' },
    { label: 'Untracked', status: 'Untracked', emoji: '⚫', color: 'linear-gradient(135deg, #6b7280, #4b5563)' }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)',
      padding: '1rem',
      paddingBottom: '120px', // Space for sticky footer
      fontFamily: '"Outfit", system-ui, -apple-system, sans-serif',
      position: 'relative'
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

        {/* Main Content - 3 Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
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
          </div>
        </div>
      </div>

      {/* Sticky Footer - Status Update */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(55, 65, 81, 0.5)',
        padding: '1rem',
        zIndex: 100,
        boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'white',
            textAlign: 'center',
            margin: 0,
            fontFamily: '"Outfit", system-ui, -apple-system, sans-serif'
          }}>
            Update Status
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {statusButtons.map((button) => {
              const isSelected = currentStatus === button.status
              const isDisabled = isLoading
              
              return (
                <button
                  key={button.status}
                  onClick={() => debouncedStatusUpdate(button.status)}
                  disabled={isDisabled}
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: isSelected ? button.color : 'rgba(55, 65, 81, 0.5)',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '0.75rem',
                    border: isSelected ? '2px solid rgba(255, 255, 255, 0.3)' : '2px solid transparent',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: isSelected 
                      ? '0 0 20px rgba(255, 255, 255, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontFamily: '"Outfit", system-ui, -apple-system, sans-serif',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    minWidth: 'fit-content'
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled && !isSelected) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 15px -3px rgba(0, 0, 0, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = isSelected 
                      ? '0 0 20px rgba(255, 255, 255, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{button.emoji}</span>
                  <span>{button.label}</span>
                  {isLoading && currentStatus === button.status && (
                    <span style={{ fontSize: '0.75rem' }}>...</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionnaireCard 