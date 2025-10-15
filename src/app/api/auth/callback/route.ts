import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const type = requestUrl.searchParams.get('type')
    
    // Intercambiar código por sesión
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Si es recovery (reset password), redirigir a reset-password
      if (type === 'recovery') {
        return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
      }

      // Solo crear usuario si el email está confirmado
      if (data.user.email_confirmed_at) {
        // Si es confirmación de email, verificar/crear usuario
        const existingUser = await prisma.user.findUnique({
          where: { id: data.user.id },
        })

        // Si no existe, crearlo
        if (!existingUser) {
          try {
            const username = data.user.user_metadata?.username || data.user.email!.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '')
            
            await prisma.user.create({
              data: {
                id: data.user.id,
                email: data.user.email!,
                username: username,
                displayName: data.user.user_metadata?.display_name || username,
                usernameLastChanged: new Date(),
              },
            })
          } catch (err) {
            console.error('Error creating user in database:', err)
          }
        }

        // Redirigir al login con mensaje de éxito
        return NextResponse.redirect(new URL('/login?message=confirmed', requestUrl.origin))
      } else {
        // Email no confirmado, redirigir con error
        return NextResponse.redirect(new URL('/register?error=email-not-confirmed', requestUrl.origin))
      }
    }
  }

  // Si hay error, redirigir al registro
  return NextResponse.redirect(new URL('/register?error=confirmation-failed', requestUrl.origin))
}

// Mantener POST para compatibilidad
export async function POST(request: Request) {
  try {
    const { id, email, displayName } = await request.json()

    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 200 })
    }

    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '')
    
    const user = await prisma.user.create({
      data: {
        id,
        email,
        username,
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
