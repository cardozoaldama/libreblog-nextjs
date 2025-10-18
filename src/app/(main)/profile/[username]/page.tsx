import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import ProfileContent from '@/components/profile/ProfileContent'

type UserWithSocials = {
  id: string
  email: string
  displayName?: string | null
  username?: string | null
  bio?: string | null
  avatarUrl?: string | null
  createdAt: Date
  posts: any[]
  websiteUrl?: string | null
  githubUrl?: string | null
}

interface ProfilePageProps {
  user: UserWithSocials
  followersCount: number
  followingCount: number
  postsWithLikes: any[]
  isOwnProfile: boolean
  authUser: any
  isFollowing: boolean
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username },
        { email: { startsWith: username } },
      ],
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      username: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
      websiteUrl: true,
      githubUrl: true,
      publicEmail: true,
      facebookUrl: true,
      instagramUrl: true,
      linkedinUrl: true,
      profileTheme: true,
      profileDecoration: true,
      posts: {
        where: { isPublic: true },
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          category: true
        },
      },
    },
  }) as any

  if (!user) {
    notFound()
  }

  let followersCount = 0
  let followingCount = 0
  try {
    followersCount = await prisma.follow.count({ where: { followingId: user.id } })
    followingCount = await prisma.follow.count({ where: { followerId: user.id } })
  } catch {
    // Si la tabla follow no existe, usar 0
  }

  // Contar likes para los posts del usuario
  const postIds = user.posts.map((p: { id: string }) => p.id)
  const likeCounts = postIds.length > 0 ? await prisma.like.groupBy({
    by: ['postId'],
    where: { postId: { in: postIds } },
    _count: { postId: true }
  }) : []

  const likeMap = Object.fromEntries(
    likeCounts.map(l => [l.postId, l._count.postId])
  )

  const postsWithLikes = user.posts.map((post: any) => ({
    ...post,
    _count: { likes: likeMap[post.id] || 0 }
  }))

  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  const isOwnProfile = authUser?.id === user.id

  let isFollowing = false
  if (authUser && !isOwnProfile) {
    try {
      const followRelation = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: authUser.id,
            followingId: user.id,
          },
        },
      })
      isFollowing = !!followRelation
    } catch {
      // Si la tabla follow no existe, no está siguiendo
    }
  }

  return (
    <ProfileContent
      user={user}
      followersCount={followersCount}
      followingCount={followingCount}
      postsWithLikes={postsWithLikes}
      isOwnProfile={isOwnProfile}
      authUser={authUser}
      isFollowing={isFollowing}
    />
  )
}
