import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId, reason, type } = await request.json()

    if (!postId || !reason) {
      return NextResponse.json({ error: 'postId and reason are required' }, { status: 400 })
    }

    // Verificar que el post existe
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, isNSFW: true, authorId: true }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // No permitir reportar propios posts
    if (post.authorId === user.id) {
      return NextResponse.json({ error: 'Cannot report your own post' }, { status: 400 })
    }

    // Crear el reporte (usando una tabla temporal o logs por ahora)
    // TODO: Crear tabla de reportes en la base de datos
    console.log(`NSFW Report: Post ${postId} reported by ${user.id} for reason: ${reason} (type: ${type})`)

    // Por ahora, solo loggear. En el futuro, guardar en BD
    // await prisma.nsfwReport.create({
    //   data: {
    //     postId,
    //     reporterId: user.id,
    //     reason,
    //     type: type || 'false_positive'
    //   }
    // })

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully'
    })
  } catch (error) {
    console.error('Error submitting NSFW report:', error)
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    )
  }
}
