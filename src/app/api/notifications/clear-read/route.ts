import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    await prisma.notification.deleteMany({
      where: {
        userId: user.id,
        isRead: true
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing read notifications:', error)
    return NextResponse.json({ error: 'Error al limpiar notificaciones' }, { status: 500 })
  }
}
