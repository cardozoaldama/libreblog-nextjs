import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const limit = 50
    const offset = (page - 1) * limit

    // Obtener IDs de usuarios seguidos
    let followingIds: string[] = []
    try {
      const follows = await prisma.follow.findMany({
        where: { followerId: user.id },
        select: { followingId: true },
      })
      followingIds = follows.map(f => f.followingId)
    } catch {
      // Si la tabla follow no existe, no hay seguidos
    }

    let posts: any[] = []
    if (followingIds.length > 0) {
      posts = await prisma.post.findMany({
      where: {
      isPublic: true,
      authorId: { in: followingIds },
      ...(search && {
      OR: [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      ],
      }),
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        createdAt: true,
        imageUrl: true,
        isNSFW: true,
        nsfwCategories: true,
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
    }

    const hasMore = posts.length > limit
    const postsToReturn = hasMore ? posts.slice(0, -1) : posts

    return NextResponse.json({
      posts: postsToReturn,
      hasMore,
      page,
    })
  } catch (error) {
    console.error('Error fetching following posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}