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

    // Moderar contenido NSFW en CUALQUIER cambio del post
    // Esto incluye: cambios en contenido, imagen, video, estado público, etc.
    let nsfwResult = null
    const hasAnyChanges =
      title !== existingPost.title ||
      content !== existingPost.content ||
      imageUrl !== existingPost.imageUrl ||
      videoUrl !== existingPost.videoUrl ||
      isPublic !== existingPost.isPublic

    if (hasAnyChanges) {
      try {
        const moderationResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/moderate/nsfw`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            content,
            images: imageUrl ? [imageUrl] : []
          })
        })

        if (moderationResponse.ok) {
          nsfwResult = await moderationResponse.json()
        }
      } catch (error) {
        console.error('Error during NSFW moderation:', error)
        // Continuar con la actualización sin moderación si falla
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
        // Actualizar flags NSFW si se realizó moderación
        ...(nsfwResult && {
          isNSFW: nsfwResult.isNSFW,
          nsfwCategories: nsfwResult.categories
        })
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

// Endpoint para forzar re-moderación de un post (útil desde el editor)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obtener el post actual
    const post = await prisma.post.findUnique({
      where: { id },
    })

    if (!post || post.authorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Forzar re-moderación
    let nsfwResult = null
    try {
      const moderationResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/moderate/nsfw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          images: post.imageUrl ? [post.imageUrl] : []
        })
      })

      if (moderationResponse.ok) {
        nsfwResult = await moderationResponse.json()
      }
    } catch (error) {
      console.error('Error during forced NSFW moderation:', error)
    }

    // Actualizar con resultados de moderación si se obtuvo
    if (nsfwResult) {
      await prisma.post.update({
        where: { id },
        data: {
          isNSFW: nsfwResult.isNSFW,
          nsfwCategories: nsfwResult.categories
        }
      })

      return NextResponse.json({
        success: true,
        moderation: nsfwResult
      })
    }

    return NextResponse.json({ success: false, message: 'Moderation failed' })
  } catch (error) {
    console.error('Error forcing post moderation:', error)
    return NextResponse.json(
      { error: 'Failed to moderate post' },
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