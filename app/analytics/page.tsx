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

  const fetchQuestionnaires = async () => {
    try {
      const response = await fetch('/api/analytics')
      const data = await response.json()
      setQuestionnaires(data)
    } catch (error) {
      console.error('Error fetching questionnaires:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...questionnaires]

    // Apply closer filter
    if (filters.closer) {
      filtered = filtered.filter(q => q.closerName === filters.closer)
    }

    // Apply time range filter
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

    // Apply appointment booked filter
    if (filters.appointmentBooked !== 'all') {
      const appointmentBooked = filters.appointmentBooked === 'yes'
      filtered = filtered.filter(q => q.appointmentBooked === appointmentBooked)
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(q => filters.status.includes(q.status))
    }

    // Apply sorting
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-24">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-gray-300 text-lg">
            Master overview of all submitted questionnaires
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
            <div className="text-3xl font-bold text-white">{questionnaires.length}</div>
            <div className="text-gray-300">Total Submissions</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
            <div className="text-3xl font-bold text-green-400">
              {questionnaires.filter(q => q.appointmentBooked).length}
            </div>
            <div className="text-gray-300">Appointments Booked</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
            <div className="text-3xl font-bold text-blue-400">
              {questionnaires.filter(q => q.status === 'Qualified Show-Up').length}
            </div>
            <div className="text-gray-300">Qualified Show-Ups</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
            <div className="text-3xl font-bold text-red-400">
              {questionnaires.filter(q => q.status === 'No Show').length}
            </div>
            <div className="text-gray-300">No Shows</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/20">
              <thead className="bg-black/20">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Date Created</span>
                      {sortField === 'createdAt' && (
                        <span className="text-blue-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Name</span>
                      {sortField === 'name' && (
                        <span className="text-blue-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    GHL Link
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleSort('appointmentBooked')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Appointment Booked</span>
                      {sortField === 'appointmentBooked' && (
                        <span className="text-blue-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleSort('appointmentTime')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Appointment Date & Time</span>
                      {sortField === 'appointmentTime' && (
                        <span className="text-blue-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleSort('closerName')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Closer Name</span>
                      {sortField === 'closerName' && (
                        <span className="text-blue-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Status</span>
                      {sortField === 'status' && (
                        <span className="text-blue-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {paginatedData.map((questionnaire) => (
                  <tr 
                    key={questionnaire.id}
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(questionnaire.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {formatDate(questionnaire.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {questionnaire.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {questionnaire.ghlLink ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(questionnaire.ghlLink, '_blank')
                          }}
                          className="inline-flex items-center px-3 py-1 border border-blue-500 text-xs font-medium rounded-lg text-blue-400 bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
                        >
                          Open GHL
                        </button>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          questionnaire.appointmentBooked 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-500'
                        }`}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {questionnaire.appointmentTime 
                        ? formatDate(questionnaire.appointmentTime)
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {questionnaire.closerName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        questionnaire.status === 'Qualified Show-Up' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : questionnaire.status === 'No Show'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : questionnaire.status === 'Disqualified'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {questionnaire.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-black/20 px-6 py-4 flex items-center justify-between border-t border-white/20">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-black/20 hover:bg-black/40 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-black/20 hover:bg-black/40 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-300">
                    Showing{' '}
                    <span className="font-medium text-white">{(currentPage - 1) * itemsPerPage + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium text-white">
                      {Math.min(currentPage * itemsPerPage, filteredData.length)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium text-white">{filteredData.length}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-600 bg-black/20 text-sm font-medium text-gray-300 hover:bg-black/40 disabled:opacity-50 transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                          page === currentPage
                            ? 'z-10 bg-blue-500/20 border-blue-500 text-blue-400'
                            : 'bg-black/20 border-gray-600 text-gray-300 hover:bg-black/40'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-600 bg-black/20 text-sm font-medium text-gray-300 hover:bg-black/40 disabled:opacity-50 transition-colors"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Filter Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Closer Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-300">Closer:</label>
              <select
                value={filters.closer}
                onChange={(e) => setFilters({ ...filters, closer: e.target.value })}
                className="bg-black/40 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2 transition-colors"
              >
                <option value="">All Closers</option>
                {getUniqueClosers().map((closer) => (
                  <option key={closer} value={closer}>{closer}</option>
                ))}
              </select>
            </div>

            {/* Time Range Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-300">Time Range:</label>
              <select
                value={filters.timeRange}
                onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
                className="bg-black/40 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2 transition-colors"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="thisMonth">This Month</option>
              </select>
            </div>

            {/* Appointment Booked Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-300">Appointment Booked:</label>
              <select
                value={filters.appointmentBooked}
                onChange={(e) => setFilters({ ...filters, appointmentBooked: e.target.value })}
                className="bg-black/40 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2 transition-colors"
              >
                <option value="all">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-300">Status:</label>
              <div className="flex flex-wrap gap-2">
                {getStatusOptions().map((status) => (
                  <label key={status} className="flex items-center space-x-2">
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
                      className="w-4 h-4 text-blue-600 bg-black/40 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({
                closer: '',
                timeRange: 'all',
                appointmentBooked: 'all',
                status: []
              })}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:bg-black/40 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 