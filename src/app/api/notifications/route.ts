import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20
    const offset = (page - 1) * limit

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: [
        { isRead: 'asc' },
        { updatedAt: 'desc' }
      ],
      take: limit + 1,
      skip: offset
    })

    // Obtener información de los actores
    const actorIds = [...new Set(notifications.flatMap(n => n.actorIds))]
    const actors = await prisma.user.findMany({
      where: { id: { in: actorIds } },
      select: {
        id: true,
        displayName: true,
        username: true,
        avatarUrl: true
      }
    })

    const actorMap = Object.fromEntries(actors.map(a => [a.id, a]))

    const hasMore = notifications.length > limit
    const notificationsToReturn = hasMore ? notifications.slice(0, -1) : notifications

    const enrichedNotifications = notificationsToReturn.map(n => ({
      ...n,
      actors: n.actorIds.map(id => actorMap[id]).filter(Boolean)
    }))

    return NextResponse.json({
      notifications: enrichedNotifications,
      hasMore,
      page
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Error al obtener notificaciones' }, { status: 500 })
  }
}
