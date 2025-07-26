'use client'

import { useState, useEffect } from 'react'

interface Questionnaire {
  id: string
  createdAt: string
  name: string
  ghlLink?: string
  appointmentBooked: boolean
  appointmentTime?: string
  closerName?: string
  status: string
}

interface FilterState {
  closer: string
  timeRange: string
  appointmentBooked: string
  status: string[]
}

export default function AnalyticsPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
  const [filteredData, setFilteredData] = useState<Questionnaire[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof Questionnaire>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState<FilterState>({
    closer: '',
    timeRange: 'all',
    appointmentBooked: 'all',
    status: []
  })

  const itemsPerPage = 25

  useEffect(() => {
    fetchQuestionnaires()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [questionnaires, filters, sortField, sortDirection])

  // Refresh data every 30 seconds to catch updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchQuestionnaires()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  const fetchQuestionnaires = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    }
    
    try {
      const response = await fetch('/api/analytics')
      const data = await response.json()
      setQuestionnaires(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching questionnaires:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...questionnaires]

    if (filters.closer) {
      filtered = filtered.filter(q => q.closerName === filters.closer)
    }

    if (filters.timeRange !== 'all') {
      const now = new Date()
      let startDate: Date
      
      switch (filters.timeRange) {
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case 'thisMonth':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        default:
          startDate = new Date(0)
      }
      
      filtered = filtered.filter(q => new Date(q.createdAt) >= startDate)
    }

    if (filters.appointmentBooked !== 'all') {
      const appointmentBooked = filters.appointmentBooked === 'yes'
      filtered = filtered.filter(q => q.appointmentBooked === appointmentBooked)
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter(q => filters.status.includes(q.status))
    }

    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]
      
      if (sortField === 'createdAt' || sortField === 'appointmentTime') {
        aValue = aValue ? new Date(aValue as string).getTime() : 0
        bValue = bValue ? new Date(bValue as string).getTime() : 0
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    setFilteredData(filtered)
    setCurrentPage(1)
  }

  const handleSort = (field: keyof Questionnaire) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getUniqueClosers = () => {
    const closers = questionnaires.map(q => q.closerName).filter(Boolean) as string[]
    return Array.from(new Set(closers))
  }

  const getStatusOptions = () => [
    'Untracked',
    'Qualified Show-Up',
    'No Show',
    'Disqualified'
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleRowClick = (id: string) => {
    window.open(`/review/${id}`, '_blank')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #121212 0%, #1e1e20 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            height: '4rem',
            width: '4rem',
            borderBottom: '2px solid #da70d6',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#9ca3af' }}>Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #121212 0%, #1e1e20 100%)',
      paddingBottom: '6rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'rgba(30, 30, 32, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(218, 112, 214, 0.2)'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '2rem 1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: 0,
                background: 'linear-gradient(135deg, #da70d6 0%, #9333ea 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Analytics Dashboard
              </h1>
              <p style={{
                marginTop: '0.5rem',
                color: '#9ca3af',
                fontSize: '1.125rem'
              }}>
                Master overview of all submitted questionnaires
              </p>
              {lastUpdated && (
                <p style={{
                  marginTop: '0.25rem',
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                fetchQuestionnaires(true)
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                border: '1px solid rgba(218, 112, 214, 0.3)',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: '0.5rem',
                color: '#da70d6',
                background: 'rgba(218, 112, 214, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(218, 112, 214, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(218, 112, 214, 0.1)'
              }}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                style={{
                  animation: refreshing ? 'spin 1s linear infinite' : 'none'
                }}
              >
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            padding: '1.5rem',
            background: 'rgba(30, 30, 32, 0.8)',
            borderRadius: '1rem',
            border: '1px solid rgba(218, 112, 214, 0.2)',
            boxShadow: '0 0 20px rgba(218, 112, 214, 0.1)'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'white'
            }}>{questionnaires.length}</div>
            <div style={{
              color: '#9ca3af'
            }}>Total Submissions</div>
          </div>
          <div style={{ 
            padding: '1.5rem',
            background: 'rgba(30, 30, 32, 0.8)',
            borderRadius: '1rem',
            border: '1px solid rgba(218, 112, 214, 0.2)',
            boxShadow: '0 0 20px rgba(218, 112, 214, 0.1)'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#22c55e'
            }}>
              {questionnaires.filter(q => q.appointmentBooked).length}
            </div>
            <div style={{
              color: '#9ca3af'
            }}>Appointments Booked</div>
          </div>
          <div style={{ 
            padding: '1.5rem',
            background: 'rgba(30, 30, 32, 0.8)',
            borderRadius: '1rem',
            border: '1px solid rgba(218, 112, 214, 0.2)',
            boxShadow: '0 0 20px rgba(218, 112, 214, 0.1)'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#3b82f6'
            }}>
              {questionnaires.filter(q => q.status === 'Qualified Show-Up').length}
            </div>
            <div style={{
              color: '#9ca3af'
            }}>Qualified Show-Ups</div>
          </div>
          <div style={{ 
            padding: '1.5rem',
            background: 'rgba(30, 30, 32, 0.8)',
            borderRadius: '1rem',
            border: '1px solid rgba(218, 112, 214, 0.2)',
            boxShadow: '0 0 20px rgba(218, 112, 214, 0.1)'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#ef4444'
            }}>
              {questionnaires.filter(q => q.status === 'No Show').length}
            </div>
            <div style={{
              color: '#9ca3af'
            }}>No Shows</div>
          </div>
        </div>

        <div style={{ 
          overflow: 'hidden',
          background: 'rgba(30, 30, 32, 0.8)',
          borderRadius: '1rem',
          border: '1px solid rgba(218, 112, 214, 0.2)',
          boxShadow: '0 0 20px rgba(218, 112, 214, 0.1)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead style={{
                background: 'rgba(18, 18, 18, 0.8)'
              }}>
                <tr>
                  <th 
                    style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => handleSort('createdAt')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>Date Created</span>
                      {sortField === 'createdAt' && (
                        <span style={{ color: '#da70d6' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => handleSort('name')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>Name</span>
                      {sortField === 'name' && (
                        <span style={{ color: '#da70d6' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    GHL Link
                  </th>
                  <th 
                    style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => handleSort('appointmentBooked')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>Appointment Booked</span>
                      {sortField === 'appointmentBooked' && (
                        <span style={{ color: '#da70d6' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => handleSort('appointmentTime')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>Appointment Date & Time</span>
                      {sortField === 'appointmentTime' && (
                        <span style={{ color: '#da70d6' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => handleSort('closerName')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>Closer Name</span>
                      {sortField === 'closerName' && (
                        <span style={{ color: '#da70d6' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => handleSort('status')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>Status</span>
                      {sortField === 'status' && (
                        <span style={{ color: '#da70d6' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((questionnaire) => (
                  <tr 
                    key={questionnaire.id}
                    style={{
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => handleRowClick(questionnaire.id)}
                  >
                    <td style={{
                      padding: '1rem 1.5rem',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem',
                      color: '#e5e7eb'
                    }}>
                      {formatDate(questionnaire.createdAt)}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'white'
                    }}>
                      {questionnaire.name}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem'
                    }}>
                      {questionnaire.ghlLink ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(questionnaire.ghlLink, '_blank')
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.75rem',
                            border: '1px solid #3b82f6',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            borderRadius: '0.5rem',
                            color: '#93c5fd',
                            background: 'rgba(59, 130, 246, 0.2)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'
                          }}
                        >
                          Open GHL
                        </button>
                      ) : (
                        <span style={{ color: '#6b7280' }}>-</span>
                      )}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '1rem',
                          height: '1rem',
                          borderRadius: '50%',
                          border: '2px solid',
                          borderColor: questionnaire.appointmentBooked ? '#22c55e' : '#6b7280',
                          backgroundColor: questionnaire.appointmentBooked ? '#22c55e' : 'transparent'
                        }}></div>
                      </div>
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem',
                      color: '#e5e7eb'
                    }}>
                      {questionnaire.appointmentTime 
                        ? formatDate(questionnaire.appointmentTime)
                        : '-'
                      }
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem',
                      color: '#e5e7eb'
                    }}>
                      {questionnaire.closerName || '-'}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      whiteSpace: 'nowrap'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        borderRadius: '9999px',
                        border: '1px solid',
                        ...(questionnaire.status === 'Qualified Show-Up' 
                          ? {
                              backgroundColor: 'rgba(34, 197, 94, 0.2)',
                              color: '#4ade80',
                              borderColor: 'rgba(34, 197, 94, 0.3)'
                            }
                          : questionnaire.status === 'No Show'
                          ? {
                              backgroundColor: 'rgba(239, 68, 68, 0.2)',
                              color: '#f87171',
                              borderColor: 'rgba(239, 68, 68, 0.3)'
                            }
                          : questionnaire.status === 'Disqualified'
                          ? {
                              backgroundColor: 'rgba(245, 158, 11, 0.2)',
                              color: '#fbbf24',
                              borderColor: 'rgba(245, 158, 11, 0.3)'
                            }
                          : {
                              backgroundColor: 'rgba(107, 114, 128, 0.2)',
                              color: '#9ca3af',
                              borderColor: 'rgba(107, 114, 128, 0.3)'
                            }
                        )
                      }}>
                        {questionnaire.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{
              background: 'rgba(18, 18, 18, 0.8)',
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ flex: '1', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.5rem 1rem',
                    border: '1px solid #4b5563',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    borderRadius: '0.5rem',
                    color: '#9ca3af',
                    background: 'rgba(18, 18, 18, 0.8)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                      e.currentTarget.style.background = 'rgba(18, 18, 18, 0.9)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(18, 18, 18, 0.8)'
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.5rem 1rem',
                    border: '1px solid #4b5563',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    borderRadius: '0.5rem',
                    color: '#9ca3af',
                    background: 'rgba(18, 18, 18, 0.8)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                      e.currentTarget.style.background = 'rgba(18, 18, 18, 0.9)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(18, 18, 18, 0.8)'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(18, 18, 18, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(75, 85, 99, 0.5)',
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '1rem'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#9ca3af'
              }}>Closer:</label>
              <select
                value={filters.closer}
                onChange={(e) => setFilters({ ...filters, closer: e.target.value })}
                style={{
                  background: 'rgba(18, 18, 18, 0.8)',
                  border: '1px solid #4b5563',
                  color: 'white',
                  fontSize: '0.875rem',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  transition: 'all 0.2s'
                }}
              >
                <option value="">All Closers</option>
                {getUniqueClosers().map((closer) => (
                  <option key={closer} value={closer}>{closer}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#9ca3af'
              }}>Time Range:</label>
              <select
                value={filters.timeRange}
                onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
                style={{
                  background: 'rgba(18, 18, 18, 0.8)',
                  border: '1px solid #4b5563',
                  color: 'white',
                  fontSize: '0.875rem',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  transition: 'all 0.2s'
                }}
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="thisMonth">This Month</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#9ca3af'
              }}>Appointment Booked:</label>
              <select
                value={filters.appointmentBooked}
                onChange={(e) => setFilters({ ...filters, appointmentBooked: e.target.value })}
                style={{
                  background: 'rgba(18, 18, 18, 0.8)',
                  border: '1px solid #4b5563',
                  color: 'white',
                  fontSize: '0.875rem',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  transition: 'all 0.2s'
                }}
              >
                <option value="all">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#9ca3af'
              }}>Status:</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {getStatusOptions().map((status) => (
                  <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({
                            ...filters,
                            status: [...filters.status, status]
                          })
                        } else {
                          setFilters({
                            ...filters,
                            status: filters.status.filter(s => s !== status)
                          })
                        }
                      }}
                      style={{
                        width: '1rem',
                        height: '1rem',
                        color: '#9333ea',
                        background: 'rgba(18, 18, 18, 0.8)',
                        border: '1px solid #4b5563',
                        borderRadius: '0.25rem'
                      }}
                    />
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#9ca3af'
                    }}>{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => setFilters({
                closer: '',
                timeRange: 'all',
                appointmentBooked: 'all',
                status: []
              })}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#9ca3af',
                border: '1px solid #4b5563',
                borderRadius: '0.5rem',
                background: 'rgba(18, 18, 18, 0.8)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.background = 'rgba(18, 18, 18, 0.9)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#9ca3af'
                e.currentTarget.style.background = 'rgba(18, 18, 18, 0.8)'
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 