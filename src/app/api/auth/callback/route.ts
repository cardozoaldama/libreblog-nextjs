import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { id, email, displayName } = await request.json()

    // Verificar que el usuario no exista
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 200 })
    }

    // Crear usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        id,
        email,
        displayName: displayName || email.split('@')[0],
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}