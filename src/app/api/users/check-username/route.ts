import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { username, currentUserId } = await request.json()

    if (!username || username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { available: false, error: 'El username debe tener entre 3 y 30 caracteres' },
        { status: 400 }
      )
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return NextResponse.json(
        { available: false, error: 'Solo letras, números, guiones y guiones bajos' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    })

    if (existingUser && existingUser.id !== currentUserId) {
      return NextResponse.json({ available: false })
    }

    return NextResponse.json({ available: true })
  } catch (error) {
    console.error('Error checking username:', error)
    return NextResponse.json(
      { available: false, error: 'Error al verificar username' },
      { status: 500 }
    )
  }
}
