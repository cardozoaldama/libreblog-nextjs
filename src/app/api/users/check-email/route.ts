import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ available: false, error: 'Email requerido' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const supabase = await createClient()

    // Verificar en Supabase Auth si el email existe
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('Error checking email:', error)
      // Si falla la verificación, asumimos que está disponible para no bloquear el registro
      return NextResponse.json({ available: true })
    }

    const emailExists = users?.some(user => user.email?.toLowerCase() === normalizedEmail)

    return NextResponse.json({ 
      available: !emailExists,
      message: emailExists ? 'Email ya registrado' : 'Email disponible'
    })
  } catch (error) {
    console.error('Error in check-email:', error)
    return NextResponse.json({ available: true }, { status: 500 })
  }
}
