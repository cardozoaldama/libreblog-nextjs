import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

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
      select: { censoredUsers: true }
    })

    const censoredUsers = userData?.censoredUsers || []
    
    if (censoredUsers.includes(userId)) {
      return NextResponse.json({ message: 'User already censored' })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { censoredUsers: [...censoredUsers, userId] }
    })

    return NextResponse.json({ message: 'User censored successfully', censored: true })
  } catch (error) {
    console.error('Error censoring user:', error)
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
      select: { censoredUsers: true }
    })

    const censoredUsers = userData?.censoredUsers || []
    const updatedCensoredUsers = censoredUsers.filter(id => id !== userId)

    await prisma.user.update({
      where: { id: user.id },
      data: { censoredUsers: updatedCensoredUsers }
    })

    return NextResponse.json({ message: 'User uncensored successfully', censored: false })
  } catch (error) {
    console.error('Error uncensoring user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
