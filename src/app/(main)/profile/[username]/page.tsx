import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Card, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import FollowButton from '@/components/ui/FollowButton'
import { Mail, Calendar, FileText, Settings, Pin, Heart, Globe, Facebook, Instagram, Linkedin, Github, Users } from 'lucide-react'
import { formatDate, getGravatarUrl, extractExcerpt } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import PinButton from '@/components/post/PinButton'
import ReactMarkdown from 'react-markdown'
import type { User } from '@prisma/client'

type UserWithSocials = User & {
  websiteUrl?: string | null
  githubUrl?: string | null
  facebookUrl?: string | null
  instagramUrl?: string | null
  xUrl?: string | null
  tiktokUrl?: string | null
  linkedinUrl?: string | null
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
    include: {
      posts: {
        where: { isPublic: true },
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          category: true,
        },
      },
    },
  })

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

  const postsWithLikes = await Promise.all(
    user.posts.map(async (post) => {
      const likeCount = await prisma.like.count({
        where: { postId: post.id },
      })
      return {
        ...post,
        _count: { likes: likeCount },
      }
    })
  )

  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  const isOwnProfile = authUser?.id === user.id
  const gravatarUrl = getGravatarUrl(user.email)
  const avatarUrl = user.avatarUrl || gravatarUrl

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card variant="hover" className="mb-8 overflow-hidden animate-in fade-in slide-in-from-top duration-500 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} />
          </div>
          
          <CardBody className="relative p-8">
            <div className="flex flex-col items-center md:items-start md:flex-row gap-6 md:gap-8">
              <div className="flex-shrink-0 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
                <Image
                  src={avatarUrl}
                  alt={`Foto de perfil de ${user.displayName || user.email}`}
                  width={120}
                  height={120}
                  className="relative rounded-full border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-300 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36"
                  priority
                  unoptimized
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-green-400 rounded-full border-2 md:border-4 border-white shadow-lg animate-pulse" />
              </div>

              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 mb-6">
                  <div className="space-y-3 text-center sm:text-left">
                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2 animate-in slide-in-from-left duration-700 break-words">
                        {user.displayName || user.email.split('@')[0]}
                      </h1>
                      <p className="text-base sm:text-lg text-gray-600 font-medium animate-in slide-in-from-left duration-700 delay-100 break-all">
                        @{user.username || user.email.split('@')[0]}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-in slide-in-from-bottom duration-700 delay-200 w-full">
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center gap-1 sm:gap-2 text-blue-600 mb-1">
                          <FileText className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-xs font-medium uppercase tracking-wide">Posts</span>
                        </div>
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{user.posts.length}</p>
                      </div>
                      
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center gap-1 sm:gap-2 text-purple-600 mb-1">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-xs font-medium uppercase tracking-wide">Seguidores</span>
                        </div>
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{followersCount}</p>
                      </div>
                      
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center gap-1 sm:gap-2 text-pink-600 mb-1">
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-xs font-medium uppercase tracking-wide">Siguiendo</span>
                        </div>
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{followingCount}</p>
                      </div>
                      
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300 group col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-1 sm:gap-2 text-green-600 mb-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-xs font-medium uppercase tracking-wide">Miembro desde</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-gray-900">{new Date(user.createdAt).toLocaleDateString('es-ES')}</p>
                      </div>
                    </div>
                    
                    {user.publicEmail && (
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 animate-in slide-in-from-left duration-700 delay-300">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm break-all">{user.publicEmail}</span>
                      </div>
                    )}
                  </div>

                  <div className="animate-in slide-in-from-right duration-700 delay-400 w-full sm:w-auto">
                    {isOwnProfile ? (
                      <Link href="/settings" className="w-full sm:w-auto">
                        <Button variant="outline" size="md" className="shadow-lg hover:shadow-xl w-full sm:w-auto">
                          <Settings className="w-4 h-4 mr-2" />
                          Editar Perfil
                        </Button>
                      </Link>
                    ) : authUser ? (
                      <div className="w-full sm:w-auto">
                        <FollowButton
                          userId={user.id}
                          initialIsFollowing={isFollowing}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                {user.bio && (
                  <div className="mt-6 p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50 prose prose-sm max-w-none animate-in slide-in-from-bottom duration-700 delay-500 break-words">
                    <div className="text-sm sm:text-base">
                      <ReactMarkdown>{user.bio}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {((user as UserWithSocials).websiteUrl || (user as UserWithSocials).githubUrl || (user as UserWithSocials).facebookUrl || (user as UserWithSocials).instagramUrl || (user as UserWithSocials).xUrl || (user as UserWithSocials).tiktokUrl || (user as UserWithSocials).linkedinUrl) && (
                  <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 animate-in slide-in-from-bottom duration-700 delay-600">
                    {(user as UserWithSocials).websiteUrl && (
                      <a href={(user as UserWithSocials).websiteUrl || ''} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200/50 hover:border-gray-300/50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                        <Globe className="w-4 h-4 text-gray-700 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-sm font-medium text-gray-700">Sitio Web</span>
                      </a>
                    )}
                    {(user as UserWithSocials).githubUrl && (
                      <a href={(user as UserWithSocials).githubUrl || ''} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200/50 hover:border-gray-300/50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                        <Github className="w-4 h-4 text-gray-700 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-sm font-medium text-gray-700">GitHub</span>
                      </a>
                    )}
                    {(user as UserWithSocials).facebookUrl && (
                      <a href={(user as UserWithSocials).facebookUrl || ''} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-blue-50/80 backdrop-blur-sm hover:bg-blue-100/80 border border-blue-200/50 hover:border-blue-300/50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                        <Facebook className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-sm font-medium text-blue-600">Facebook</span>
                      </a>
                    )}
                    {(user as UserWithSocials).instagramUrl && (
                      <a href={(user as UserWithSocials).instagramUrl || ''} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-pink-50/80 backdrop-blur-sm hover:bg-pink-100/80 border border-pink-200/50 hover:border-pink-300/50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                        <Instagram className="w-4 h-4 text-pink-600 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-sm font-medium text-pink-600">Instagram</span>
                      </a>
                    )}
                    {(user as UserWithSocials).linkedinUrl && (
                      <a href={(user as UserWithSocials).linkedinUrl || ''} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-blue-50/80 backdrop-blur-sm hover:bg-blue-100/80 border border-blue-200/50 hover:border-blue-300/50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                        <Linkedin className="w-4 h-4 text-blue-700 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-sm font-medium text-blue-700">LinkedIn</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="mb-8 animate-in slide-in-from-bottom duration-700 delay-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                {isOwnProfile ? 'Mis Publicaciones' : 'Publicaciones'}
              </h2>
              <p className="text-gray-600 mt-2 text-base sm:text-lg">
                {user.posts.length} posts públicos
              </p>
            </div>
            {isOwnProfile && (
              <Link href="/post/create" className="w-full sm:w-auto">
                <Button variant="primary" className="shadow-lg hover:shadow-xl w-full sm:w-auto">
                  <FileText className="w-4 h-4 mr-2" />
                  <span className="sm:inline">Nuevo Post</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {postsWithLikes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {postsWithLikes.map((post) => {
              const excerpt = extractExcerpt(post.content, 100)

              return (
                <Card
                  key={post.id}
                  variant="hover"
                  className="group animate-in fade-in slide-in-from-bottom duration-500 flex flex-col"
                  style={{animationDelay: `${postsWithLikes.indexOf(post) * 100}ms`}}
                >
                  {post.imageUrl && (
                    <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <CardBody className="p-6 flex-1">
                    {/* Author Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500">
                        {user.avatarUrl ? (
                          <Image
                            src={user.avatarUrl}
                            alt={user.displayName || user.email}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                            {(user.displayName || user.email).charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user.displayName || user.email.split('@')[0]}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      {post.category && (
                        <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 transition-all duration-300 group-hover:from-blue-200 group-hover:to-purple-200">
                          {post.category.icon} {post.category.name}
                        </span>
                      )}
                      {post.isPinned && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                          <Pin className="w-3 h-3" /> Pineado
                        </span>
                      )}
                    </div>

                    <Link href={`/post/${post.slug}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-all duration-300 line-clamp-2 group-hover:scale-[1.02]">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-gray-500">
                          {formatDate(post.createdAt)}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Heart className="w-3 h-3" />
                          <span>{post._count.likes}</span>
                        </div>
                      </div>
                      {isOwnProfile && (
                        <PinButton postId={post.id} initialIsPinned={post.isPinned} />
                      )}
                    </div>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card variant="elevated">
            <CardBody className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isOwnProfile
                  ? 'Aún no tienes publicaciones públicas'
                  : 'Este usuario no tiene publicaciones públicas'}
              </h3>
              {isOwnProfile && (
                <>
                  <p className="text-gray-600 mb-6">
                    Comienza a compartir tus ideas con el mundo
                  </p>
                  <Link href="/post/create">
                    <Button variant="primary">Crear mi primer post</Button>
                  </Link>
                </>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}
