import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.eventId || !body.status) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId and status' },
        { status: 400 }
      )
    }

    // Validate status values - Updated to include all disposition options
    const validStatuses = ['Qualified Show-Up', 'No Show', 'Disqualified', 'Closed', 'Untracked']
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: Qualified Show-Up, No Show, Disqualified, Closed, Untracked' },
        { status: 400 }
      )
    }

    // Dynamically import Prisma only when needed
    let prisma: any
    try {
      const { prisma: prismaClient } = await import('@/lib/prisma')
      prisma = prismaClient
    } catch (importError) {
      console.error('Failed to import Prisma:', importError)
      return NextResponse.json(
        { error: 'Database service unavailable' },
        { status: 503 }
      )
    }

    // Test database connection
    try {
      await prisma.$connect()
    } catch (dbError) {
      console.error('Database connection failed:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      )
    }

    // Update questionnaire status
    const updatedQuestionnaire = await prisma.questionnaire.update({
      where: {
        eventId: body.eventId
      },
      data: {
        status: body.status
      }
    })

    return NextResponse.json({
      success: true,
      id: updatedQuestionnaire.id,
      eventId: updatedQuestionnaire.eventId,
      status: updatedQuestionnaire.status,
      message: `Status updated to: ${body.status}`
    })

  } catch (error) {
    console.error('Error updating status:', error)
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Questionnaire not found with the provided event ID' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 