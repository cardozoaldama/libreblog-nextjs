import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    // Obtener el post para saber quién es el autor
    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true, slug: true }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 })
    }

    await prisma.like.create({
      data: {
        userId: user.id,
        postId: id,
      },
    })

    // Crear notificación solo si no es el propio autor
    if (post.authorId !== user.id) {
      const { createNotification } = await import('@/lib/notifications')
      await createNotification(
        post.authorId,
        'like',
        user.id,
        id
      )
    }

    const likeCount = await prisma.like.count({ where: { postId: id } })
    return NextResponse.json({ liked: true, likeCount })
  } catch (error) {
    console.error('Error al dar like:', error)
    return NextResponse.json({ error: 'Error al dar like' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    await prisma.like.deleteMany({
      where: {
        userId: user.id,
        postId: id,
      },
    })

    const likeCount = await prisma.like.count({ where: { postId: id } })
    return NextResponse.json({ liked: false, likeCount })
  } catch {
    return NextResponse.json({ error: 'Error al quitar like' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  try {
    const likeCount = await prisma.like.count({ where: { postId: id } })
    let isLiked = false

    if (user) {
      const like = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: user.id,
            postId: id,
          },
        },
      })
      isLiked = !!like
    }

    return NextResponse.json({ likeCount, isLiked })
  } catch {
    return NextResponse.json({ error: 'Error al obtener likes' }, { status: 500 })
  }
}
