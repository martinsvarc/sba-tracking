import { notFound } from 'next/navigation'
import QuestionnaireCard from '@/components/QuestionnaireCard'

interface ReviewPageProps {
  params: {
    id: string
  }
}

async function getQuestionnaire(id: string) {
  try {
    // Dynamically import Prisma only when needed
    let prisma: any
    try {
      const { prisma: prismaClient } = await import('@/lib/prisma')
      prisma = prismaClient
    } catch (importError) {
      console.error('Failed to import Prisma:', importError)
      return null
    }

    // Test database connection
    await prisma.$connect()
    
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id }
    })
    return questionnaire
  } catch (error) {
    console.error('Error fetching questionnaire:', error)
    return null
  }
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const questionnaire = await getQuestionnaire(params.id)

  if (!questionnaire) {
    notFound()
  }

  // Transform the data to match the expected format
  const data = {
    name: questionnaire.name,
    email: questionnaire.email,
    phone: questionnaire.phone,
    event_id: questionnaire.eventId,
    entrepreneurAtHeart: questionnaire.entrepreneurAtHeart,
    goalWithLaunching: questionnaire.goalWithLaunching,
    interestInSolarBusiness: questionnaire.interestInSolarBusiness,
    desiredMonthlyRevenue: questionnaire.desiredMonthlyRevenue,
    helpNeededMost: questionnaire.helpNeededMost,
    currentMonthlyIncome: questionnaire.currentMonthlyIncome,
    priorityReason: questionnaire.priorityReason,
    investmentWillingness: questionnaire.investmentWillingness,
    strategyCallCommitment: questionnaire.strategyCallCommitment,
    status: questionnaire.status
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <QuestionnaireCard data={data} />
    </div>
  )
} 