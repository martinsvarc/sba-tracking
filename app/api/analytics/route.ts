import { NextResponse } from 'next/server'

export async function GET() {
  try {
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

    // Fetch all questionnaires with the new fields
    const questionnaires = await prisma.questionnaire.findMany({
      select: {
        id: true,
        createdAt: true,
        name: true,
        ghlLink: true,
        appointmentBooked: true,
        appointmentTime: true,
        closerName: true,
        status: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Return response with cache-busting headers
    return new NextResponse(JSON.stringify(questionnaires), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Error fetching questionnaires:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 