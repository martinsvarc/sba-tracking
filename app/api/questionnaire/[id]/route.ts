import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id } = params

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

    // Update questionnaire with allowed fields
    const allowedFields = [
      'status',
      'ghlLink',
      'appointmentTime',
      'closerName',
      'appointmentBooked'
    ]

    const updateData: any = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const questionnaire = await prisma.questionnaire.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        createdAt: true,
        name: true,
        ghlLink: true,
        appointmentBooked: true,
        appointmentTime: true,
        closerName: true,
        status: true,
      }
    })

    return NextResponse.json({
      success: true,
      questionnaire,
      message: 'Questionnaire updated successfully'
    })

  } catch (error) {
    console.error('Error updating questionnaire:', error)
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Questionnaire not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

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

    // Fetch questionnaire by ID
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        name: true,
        email: true,
        phone: true,
        eventId: true,
        entrepreneurAtHeart: true,
        goalWithLaunching: true,
        interestInSolarBusiness: true,
        desiredMonthlyRevenue: true,
        helpNeededMost: true,
        currentMonthlyIncome: true,
        priorityReason: true,
        investmentWillingness: true,
        strategyCallCommitment: true,
        ghlLink: true,
        appointmentBooked: true,
        appointmentTime: true,
        closerName: true,
        status: true,
      }
    })

    if (!questionnaire) {
      return NextResponse.json(
        { error: 'Questionnaire not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(questionnaire)

  } catch (error) {
    console.error('Error fetching questionnaire:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 