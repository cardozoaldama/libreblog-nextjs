import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * API para obtener la lista de usuarios que sigue el usuario actual
 * Solo permite al usuario ver su propia lista de seguidos por seguridad
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Verificar autenticación del usuario
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Solo permitir ver la propia lista de seguidos por privacidad
    if (user.id !== id) {
      return NextResponse.json({ error: 'No autorizado para ver esta lista de seguidos' }, { status: 403 })
    }

    // Obtener lista de usuarios seguidos
    // IMPORTANTE: Usar la tabla users directamente para evitar errores de relación
    const { data: followRelations, error: followError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', id)

    if (followError) {
      console.error('Error fetching follow relations:', followError)
      // Si la tabla no existe, retornar lista vacía en lugar de error
      if (followError.message?.includes('relation "public.follows" does not exist')) {
        console.warn('Tabla follows no existe, retornando lista vacía')
        return NextResponse.json({ following: [] })
      }
      return NextResponse.json({ error: 'Error al obtener relaciones de seguimiento' }, { status: 500 })
    }

    // Si no sigue a nadie, retornar lista vacía
    if (!followRelations || followRelations.length === 0) {
      return NextResponse.json({ following: [] })
    }

    // Obtener información de los usuarios seguidos
    const followingIds = followRelations.map(f => f.following_id)
    const { data: following, error: usersError } = await supabase
      .from('users')
      .select('id, email, display_name, avatar_url')
      .in('id', followingIds)

    if (usersError) {
      console.error('Error fetching following users data:', usersError)
      // Si hay error obteniendo usuarios, retornar lista vacía
      return NextResponse.json({ following: [] })
    }

    // Filtrar usuarios que no existen en la tabla users
    const validFollowing = following?.filter(user => user && user.email) || []

    // Formatear datos para el frontend
    const followingData = validFollowing.map(followedUser => ({
      id: followedUser.id,
      email: followedUser.email,
      displayName: followedUser.display_name,
      avatarUrl: followedUser.avatar_url
    }))

    return NextResponse.json({ following: followingData })
  } catch (error) {
    console.error('Error interno en API de seguidos:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}