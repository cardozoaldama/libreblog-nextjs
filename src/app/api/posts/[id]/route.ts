import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { generateSlug, makeSlugUnique } from '@/lib/utils'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as {
      title: string
      content: string
      imageUrl?: string | null
      videoUrl?: string | null
      categoryId?: string | null
      isPublic?: boolean
    }
    const { title, content, imageUrl, videoUrl, categoryId, isPublic } = body

    // Verificar que el post pertenece al usuario
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost || existingPost.authorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Generar nuevo slug si cambió el título
    let slug = existingPost.slug
    if (title !== existingPost.title) {
      slug = generateSlug(title)
      const slugExists = await prisma.post.findFirst({
        where: { slug, id: { not: id } },
      })
      if (slugExists) {
        slug = makeSlugUnique(slug)
      }
    }

    // Actualizar post
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        slug,
        imageUrl,
        videoUrl,
        isPublic,
        categoryId: categoryId || null,
      },
      include: {
        author: true,
        category: true,
      },
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar que el post pertenece al usuario
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost || existingPost.authorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Eliminar post
    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}