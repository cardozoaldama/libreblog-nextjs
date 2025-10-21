import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { markAllAsRead } from '@/lib/notifications'

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    await markAllAsRead(user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return NextResponse.json({ error: 'Error al marcar notificaciones' }, { status: 500 })
  }
}
