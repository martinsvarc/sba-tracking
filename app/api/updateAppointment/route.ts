import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
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

    // Prepare update data - only appointment-related fields allowed
    // Status field is explicitly excluded from this API
    const updateData: any = {}
    
    if (body.appointmentTime !== undefined) {
      updateData.appointmentTime = body.appointmentTime
    }
    
    if (body.closerName !== undefined) {
      updateData.closerName = body.closerName
    }
    
    if (body.appointmentBooked !== undefined) {
      updateData.appointmentBooked = body.appointmentBooked
    }

    if (body.ghlLink !== undefined) {
      updateData.ghlLink = body.ghlLink
    }

    // Update questionnaire
    const questionnaire = await prisma.questionnaire.update({
      where: { id: body.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        appointmentTime: true,
        closerName: true,
        appointmentBooked: true,
        ghlLink: true,
        status: true
      }
    })

    return NextResponse.json({
      success: true,
      questionnaire,
      message: 'Appointment information updated successfully'
    })

  } catch (error) {
    console.error('Error updating appointment:', error)
    
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