import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { canUserEditComment, canUserDeleteComment } from '@/lib/commentRules'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: 'El comentario no puede estar vacío' }, { status: 400 })
    }

    const canEdit = await canUserEditComment(user.id, id)

    if (!canEdit) {
      return NextResponse.json({ error: 'No puedes editar este comentario' }, { status: 403 })
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { content: content.trim() },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json({ error: 'Error al actualizar comentario' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { post: { select: { authorId: true } } }
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 })
    }

    const canDelete = await canUserDeleteComment(user.id, id, comment.post.authorId)

    if (!canDelete) {
      return NextResponse.json({ error: 'No puedes eliminar este comentario' }, { status: 403 })
    }

    await prisma.comment.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Error al eliminar comentario' }, { status: 500 })
  }
}
