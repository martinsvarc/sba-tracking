import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = [
      'name', 'email', 'phone', 'eventId', 'entrepreneurAtHeart',
      'goalWithLaunching', 'interestInSolarBusiness', 'desiredMonthlyRevenue',
      'helpNeededMost', 'currentMonthlyIncome', 'priorityReason',
      'investmentWillingness', 'strategyCallCommitment'
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
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

    // Create questionnaire in database
    // Always set status to "Untracked" for new questionnaires
    const questionnaire = await prisma.questionnaire.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        eventId: body.eventId,
        entrepreneurAtHeart: body.entrepreneurAtHeart,
        goalWithLaunching: body.goalWithLaunching,
        interestInSolarBusiness: body.interestInSolarBusiness,
        desiredMonthlyRevenue: body.desiredMonthlyRevenue,
        helpNeededMost: body.helpNeededMost,
        currentMonthlyIncome: body.currentMonthlyIncome,
        priorityReason: body.priorityReason,
        investmentWillingness: body.investmentWillingness,
        strategyCallCommitment: body.strategyCallCommitment,
        // Optional appointment tracking fields
        ghlLink: body.ghlLink || null,
        appointmentTime: body.appointmentTime || null,
        closerName: body.closerName || null,
        appointmentBooked: body.appointmentBooked || false,
        // Always set status to "Untracked" for new questionnaires
        status: 'Untracked'
      }
    })

    // Return the review URL
    const reviewUrl = `/review/${questionnaire.id}`
    
    return NextResponse.json({
      success: true,
      id: questionnaire.id,
      reviewUrl,
      message: 'Questionnaire created successfully'
    })

  } catch (error) {
    console.error('Error creating questionnaire:', error)
    
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'A questionnaire with this event ID already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 