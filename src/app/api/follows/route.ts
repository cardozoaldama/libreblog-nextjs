import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { followingId } = await request.json()

    if (!followingId || followingId === user.id) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId,
      },
    })

    // Crear notificación de follow
    const { createNotification } = await import('@/lib/notifications')
    await createNotification(
      followingId,
      'follow',
      user.id
    )

    return NextResponse.json({ follow })
  } catch (error) {
    console.error('Error following user:', error)
    return NextResponse.json({ error: 'Failed to follow user' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { followingId } = await request.json()

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId,
        },
      },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unfollowing user:', error)
    return NextResponse.json({ error: 'Failed to unfollow user' }, { status: 500 })
  }
}