import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * API para crear un nuevo usuario en la base de datos
 * Se ejecuta después del registro exitoso en Supabase Auth
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener datos del cuerpo de la petición
    const body = await request.json()
    const { email, displayName } = body

    // Validar datos requeridos
    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'Usuario ya existe' }, { status: 409 })
    }

    // Crear nuevo usuario en la base de datos
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: email,
        display_name: displayName || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creando usuario:', createError)
      return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Usuario creado exitosamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.display_name
      }
    })
  } catch (error) {
    console.error('Error interno en API de creación de usuario:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}