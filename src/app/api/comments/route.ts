import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { canUserComment } from '@/lib/commentRules'
import { createNotification } from '@/lib/notifications'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { postId, content, parentId } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: 'El comentario no puede estar vacío' }, { status: 400 })
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { allowComments: true, authorId: true }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 })
    }

    if (!post.allowComments) {
      return NextResponse.json({ error: 'Los comentarios están deshabilitados' }, { status: 403 })
    }

    const { canComment, reason } = await canUserComment(user.id, postId, post.authorId, parentId)

    if (!canComment) {
      return NextResponse.json({ error: reason }, { status: 403 })
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId,
        userId: user.id,
        parentId
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
            email: true
          }
        }
      }
    })

    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { userId: true }
      })

      if (parentComment) {
        await createNotification(
          parentComment.userId,
          'comment_reply',
          user.id,
          postId,
          parentId
        )
      }
    } else {
      await createNotification(
        post.authorId,
        'comment',
        user.id,
        postId
      )
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Error al crear comentario' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json({ error: 'postId requerido' }, { status: 400 })
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
            email: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                username: true,
                avatarUrl: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Error al obtener comentarios' }, { status: 500 })
  }
}
