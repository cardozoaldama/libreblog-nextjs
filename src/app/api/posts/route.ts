import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { generateSlug, makeSlugUnique } from '@/lib/utils'
import type { Prisma } from '@prisma/client'

export async function POST(request: NextRequest) {
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
      isNSFW?: boolean
      nsfwCategories?: string[]
    }
    const { title, content, imageUrl, videoUrl, categoryId, isPublic, isNSFW, nsfwCategories } = body

    // Generar slug único
    let slug = generateSlug(title)
    const existingPost = await prisma.post.findUnique({ where: { slug } })
    if (existingPost) {
      slug = makeSlugUnique(slug)
    }

    // Moderar contenido NSFW automáticamente
    let moderationResult = null
    try {
      const moderationRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/moderate/nsfw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          images: imageUrl ? [imageUrl] : []
        })
      })

      if (moderationRes.ok) {
        moderationResult = await moderationRes.json()
      }
    } catch (error) {
      console.error('Error during NSFW moderation:', error)
      // Continuar con la creación sin moderación si falla
    }

    // Usar resultados de moderación o valores proporcionados por el cliente
    const finalIsNSFW = moderationResult ? moderationResult.isNSFW : (isNSFW || false)
    const finalNSFWCategories = moderationResult ? moderationResult.categories : (nsfwCategories || [])

    // Crear post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        imageUrl,
        videoUrl,
        isPublic,
        isNSFW: finalIsNSFW,
        nsfwCategories: finalNSFWCategories,
        authorId: user.id,
        categoryId: categoryId || null,
      },
      include: {
        author: true,
        category: true,
      },
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

// API para remoderar posts existentes (requiere admin/sudo)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar que sea admin (por ahora, permitir solo al usuario específico)
    // TODO: Implementar sistema de roles
    const adminEmail = process.env.ADMIN_EMAIL
    if (user.email !== adminEmail) {
      return NextResponse.json({ error: 'Forbidden - Admin required' }, { status: 403 })
    }

    // Remoderar todos los posts (para testing)
    const posts = await prisma.post.findMany({
    select: { id: true, title: true, content: true, imageUrl: true, isNSFW: true }
    })

    let moderatedCount = 0

    for (const post of posts) {
      // Solo moderar posts que no han sido moderados aún (isNSFW es false por defecto)
      if (post.isNSFW === false) {
        try {
          // Moderar el post
          const moderationRes = await fetch(`http://localhost:3000/api/moderate/nsfw`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: post.title,
              content: post.content,
              images: post.imageUrl ? [post.imageUrl] : []
            })
          })

          if (moderationRes.ok) {
            const moderationData = await moderationRes.json()
            const isNSFW = moderationData.isNSFW
            const nsfwCategories = moderationData.categories || []

            // Actualizar el post
            await prisma.post.update({
              where: { id: post.id },
              data: {
                isNSFW: isNSFW || false,
                nsfwCategories: nsfwCategories
              }
            })

            if (isNSFW) moderatedCount++
          }
        } catch (error) {
          console.error(`Error moderating post ${post.id}:`, error)
        }
      }
    }

    return NextResponse.json({
      message: `Moderated ${moderatedCount} posts`,
      moderatedCount
    })
  } catch (error) {
    console.error('Error in bulk moderation:', error)
    return NextResponse.json(
      { error: 'Failed to moderate posts' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')
    const authorId = searchParams.get('authorId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 50
    const offset = (page - 1) * limit

    const where: Prisma.PostWhereInput = { isPublic: true }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (authorId) {
      where.authorId = authorId
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        category: true,
        _count: {
          select: { likes: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      skip: offset,
    })

    // Los posts ya incluyen el conteo de likes

    const hasMore = posts.length > limit
    const postsToReturn = hasMore ? posts.slice(0, -1) : posts

    return NextResponse.json({
      posts: postsToReturn,
      hasMore,
      page,
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}