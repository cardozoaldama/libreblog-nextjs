import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { theme, decoration } = await request.json()

    if (!['halloween', 'christmas', 'cyberpunk', 'aurora', 'minimal', 'vaporwave'].includes(theme)) {
      return NextResponse.json({ error: 'Tema inválido' }, { status: 400 })
    }

    if (!decoration || decoration < 1 || decoration > 16) {
      return NextResponse.json({ error: 'Decoración inválida' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        profileTheme: theme,
        profileDecoration: decoration
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating theme:', error)
    return NextResponse.json({ error: 'Error al actualizar tema' }, { status: 500 })
  }
}
