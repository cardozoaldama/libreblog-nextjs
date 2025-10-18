import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { blockedUsers: true }
    })

    return NextResponse.json({ blockedUsers: userData?.blockedUsers || [] })
  } catch (error) {
    console.error('Error fetching blocked users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await request.json()

    if (!userId || userId === user.id) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { blockedUsers: true }
    })

    const blockedUsers = userData?.blockedUsers || []
    
    if (blockedUsers.includes(userId)) {
      return NextResponse.json({ message: 'User already blocked' })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { blockedUsers: [...blockedUsers, userId] }
    })

    return NextResponse.json({ message: 'User blocked successfully' })
  } catch (error) {
    console.error('Error blocking user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { blockedUsers: true }
    })

    const blockedUsers = userData?.blockedUsers || []
    const updatedBlockedUsers = blockedUsers.filter(id => id !== userId)

    await prisma.user.update({
      where: { id: user.id },
      data: { blockedUsers: updatedBlockedUsers }
    })

    return NextResponse.json({ message: 'User unblocked successfully' })
  } catch (error) {
    console.error('Error unblocking user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
