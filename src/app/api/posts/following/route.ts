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
    const category = searchParams.get('category') || ''
    const author = searchParams.get('author') || ''
    const limit = 20
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
      ...(category && { categoryId: category }),
      ...(author && { authorId: author }),
      ...(search && {
      OR: [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      ],
      }),
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            displayName: true,
            avatarUrl: true,
        },
      },
      category: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      skip: offset,
      })

      // Contar likes para los posts
      const postIds = posts.map(p => p.id)
      const likeCounts = postIds.length > 0 ? await prisma.like.groupBy({
        by: ['postId'],
        where: { postId: { in: postIds } },
        _count: { postId: true }
      }) : []

      const likeMap = Object.fromEntries(
        likeCounts.map(l => [l.postId, l._count.postId])
      )

      posts = posts.map(post => ({
        ...post,
        _count: { likes: likeMap[post.id] || 0 }
      }))
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