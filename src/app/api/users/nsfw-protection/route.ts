import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { nsfwProtection } = await request.json()

    // Validar el valor
    if (typeof nsfwProtection !== 'boolean') {
      return NextResponse.json({ error: 'Valor inválido' }, { status: 400 })
    }

    // Actualizar la preferencia en la base de datos
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { nsfwProtection },
      select: {
        id: true,
        username: true,
        nsfwProtection: true
      }
    })

    return NextResponse.json({
      message: 'Preferencia NSFW actualizada exitosamente',
      user: updatedUser
    })
  } catch (error) {
    console.error('Error actualizando preferencia NSFW:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener la preferencia actual
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        nsfwProtection: true
      }
    })

    if (!userData) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      nsfwProtection: userData.nsfwProtection
    })
  } catch (error) {
    console.error('Error obteniendo preferencia NSFW:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
