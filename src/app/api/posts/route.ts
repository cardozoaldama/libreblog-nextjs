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
    }
    const { title, content, imageUrl, videoUrl, categoryId, isPublic } = body

    // Generar slug único
    let slug = generateSlug(title)
    const existingPost = await prisma.post.findUnique({ where: { slug } })
    if (existingPost) {
      slug = makeSlugUnique(slug)
    }

    // Crear post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        imageUrl,
        videoUrl,
        isPublic,
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
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      skip: offset,
    })

    // Agregar conteo de likes manualmente
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        let likeCount = 0
        try {
          likeCount = await prisma.like.count({
            where: { postId: post.id },
          })
        } catch {
          // Si la tabla likes no existe, usar 0
        }
        return {
          ...post,
          _count: { likes: likeCount },
        }
      })
    )

    const hasMore = postsWithLikes.length > limit
    const postsToReturn = hasMore ? postsWithLikes.slice(0, -1) : postsWithLikes

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