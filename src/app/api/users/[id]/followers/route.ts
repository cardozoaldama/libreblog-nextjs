import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * API para obtener la lista de seguidores de un usuario
 * Solo permite al usuario ver sus propios seguidores por seguridad
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

    // Solo permitir ver los propios seguidores por privacidad
    if (user.id !== id) {
      return NextResponse.json({ error: 'No autorizado para ver estos seguidores' }, { status: 403 })
    }

    // Obtener seguidores con información del perfil
    // IMPORTANTE: Usar la tabla users directamente para evitar errores de relación
    const { data: followRelations, error: followError } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('following_id', id)

    if (followError) {
      console.error('Error fetching follow relations:', followError)
      // Si la tabla no existe, retornar lista vacía en lugar de error
      if (followError.message?.includes('relation "public.follows" does not exist')) {
        console.warn('Tabla follows no existe, retornando lista vacía')
        return NextResponse.json({ followers: [] })
      }
      return NextResponse.json({ error: 'Error al obtener relaciones de seguimiento' }, { status: 500 })
    }

    // Si no hay seguidores, retornar lista vacía
    if (!followRelations || followRelations.length === 0) {
      return NextResponse.json({ followers: [] })
    }

    // Obtener información de los usuarios seguidores
    const followerIds = followRelations.map(f => f.follower_id)
    const { data: followers, error: usersError } = await supabase
      .from('users')
      .select('id, email, display_name, avatar_url')
      .in('id', followerIds)

    if (usersError) {
      console.error('Error fetching followers data:', usersError)
      // Si hay error obteniendo usuarios, retornar lista vacía
      return NextResponse.json({ followers: [] })
    }

    // Filtrar usuarios que no existen en la tabla users
    const validFollowers = followers?.filter(user => user && user.email) || []

    // Formatear datos para el frontend
    const followersData = validFollowers.map(follower => ({
      id: follower.id,
      email: follower.email,
      displayName: follower.display_name,
      avatarUrl: follower.avatar_url
    }))

    return NextResponse.json({ followers: followersData })
  } catch (error) {
    console.error('Error interno en API de seguidores:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}