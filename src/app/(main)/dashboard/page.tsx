import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Button from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import PostsList from '@/components/dashboard/PostsList'
import { PenSquare, FileText, Eye, Edit, Plus, TrendingUp, Heart, Star, Calendar, BarChart3 } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login')
  }

  // Obtener usuario de la base de datos
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      posts: {
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          category: true
        },
      },
    },
  })

  if (!user) {
    // Si el usuario no existe en la BD, crearlo
    const baseUsername = authUser.email!.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '')
    const displayName = authUser.user_metadata?.display_name || authUser.email!.split('@')[0]
    await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email!,
        username: baseUsername,
        displayName: displayName,
        nsfwProtection: true,
      } as any,
    })
    redirect('/dashboard')
  }

  // Contar likes para los posts del usuario
  const postIds = user.posts.map(p => p.id)
  const likeCounts = postIds.length > 0 ? await prisma.like.groupBy({
    by: ['postId'],
    where: { postId: { in: postIds } },
    _count: { postId: true }
  }) : []

  const likeMap = Object.fromEntries(
    likeCounts.map(l => [l.postId, l._count.postId])
  )

  const postsWithLikes = user.posts.map(post => ({
    ...post,
    _count: { likes: likeMap[post.id] || 0 }
  }))

  const totalPosts = user.posts.length
  const publicPosts = user.posts.filter((p) => p.isPublic).length
  const draftPosts = user.posts.filter((p) => !p.isPublic).length
  const totalLikes = postsWithLikes.reduce((sum, post) => sum + post._count.likes, 0)
  const averageLikes = totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0
  const mostLikedPost = postsWithLikes.reduce((max, post) =>
    post._count.likes > max._count.likes ? post : max,
    postsWithLikes[0] || { _count: { likes: 0 } }
  )
  const nsfwPosts = user.posts.filter((p) => p.isNSFW).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dedff1] via-[#dedff1] to-[#5f638f]/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center animate-in fade-in slide-in-from-top duration-500">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#0c2b4d] via-[#36234e] to-[#5f638f] bg-clip-text text-transparent mb-4">
            ¡Hola, {user.displayName || user.email.split('@')[0]}! 👋
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#000022]/70">Gestiona tus publicaciones desde aquí</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card variant="hover" className="animate-in fade-in slide-in-from-left duration-500 delay-200">
        <CardBody className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-medium text-[#5f638f] uppercase tracking-wide truncate">Total Posts</p>
        <p className="text-3xl sm:text-4xl font-bold text-[#000022] mt-2">{totalPosts}</p>
          <p className="text-xs text-[#5f638f]/70 mt-1 truncate">Publicaciones creadas</p>
        </div>
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#0c2b4d] to-[#36234e] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0c2b4d]/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
          <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-[#dedff1]" />
          </div>
          </div>
          </CardBody>
          </Card>

        <Card variant="hover" className="animate-in fade-in slide-in-from-bottom duration-500 delay-300">
        <CardBody className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-medium text-[#5f638f] uppercase tracking-wide truncate">Publicados</p>
          <p className="text-3xl sm:text-4xl font-bold text-green-600 mt-2">{publicPosts}</p>
          <p className="text-xs text-[#5f638f]/70 mt-1 truncate">Visibles para todos</p>
        </div>
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
            <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-[#dedff1]" />
            </div>
            </div>
            </CardBody>
        </Card>

        <Card variant="hover" className="animate-in fade-in slide-in-from-right duration-500 delay-400">
        <CardBody className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-[#5f638f] uppercase tracking-wide truncate">Total Likes</p>
          <p className="text-3xl sm:text-4xl font-bold text-pink-600 mt-2">{totalLikes}</p>
        <p className="text-xs text-[#5f638f]/70 mt-1 truncate">❤️ Promedio: {averageLikes}/post</p>
        </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-[#dedff1]" />
              </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="hover" className="animate-in fade-in slide-in-from-left duration-500 delay-500">
            <CardBody className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-[#5f638f] uppercase tracking-wide truncate">Contenido NSFW</p>
                  <p className="text-3xl sm:text-4xl font-bold text-orange-600 mt-2">{nsfwPosts}</p>
                  <p className="text-xs text-[#5f638f]/70 mt-1 truncate">Posts moderados</p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-[#dedff1]" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Additional Stats */}
        {totalPosts > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card variant="elevated" className="animate-in fade-in slide-in-from-left duration-500 delay-600">
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-[#000022]">Post Más Popular</h3>
                </div>
                {mostLikedPost && mostLikedPost._count.likes > 0 ? (
                  <div>
                    <p className="font-medium text-[#000022] mb-1 line-clamp-1">{mostLikedPost.title}</p>
                    <p className="text-sm text-[#5f638f] mb-2">{mostLikedPost._count.likes} ❤️ likes</p>
                    <Link href={`/post/${mostLikedPost.slug}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        Ver post
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-[#5f638f]">Aún no tienes likes en tus posts</p>
                )}
              </CardBody>
            </Card>

            <Card variant="elevated" className="animate-in fade-in slide-in-from-right duration-500 delay-700">
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-[#0c2b4d]" />
                  <h3 className="text-lg font-semibold text-[#000022]">Resumen de Actividad</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#5f638f]">Posts públicos:</span>
                    <span className="font-medium text-green-600">{publicPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5f638f]">Borradores:</span>
                    <span className="font-medium text-yellow-600">{draftPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5f638f]">Likes totales:</span>
                    <span className="font-medium text-pink-600">{totalLikes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5f638f]">Posts NSFW:</span>
                    <span className="font-medium text-orange-600">{nsfwPosts}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        

        {/* Posts Section */}
        <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#0c2b4d] to-[#5f638f] bg-clip-text text-transparent">
        Mis Publicaciones
        </h2>
        <p className="text-sm sm:text-base text-[#5f638f] mt-1">
        {user.posts.length === 0
        ? "Aún no tienes publicaciones"
          : `${user.posts.length} publicación${user.posts.length !== 1 ? 'es' : ''} en total`
        }
        </p>
        </div>
        {user.posts.length > 0 && (
        <Link href="/post/create" className="w-full sm:w-auto">
        <Button variant="outline" className="hover:scale-105 transition-transform duration-200 w-full sm:w-auto">
        <Plus className="w-4 h-4 mr-2" />
          Nuevo Post
          </Button>
          </Link>
          )}
        </div>

        {user.posts.length === 0 ? (
        <Card variant="hover" className="border-2 border-dashed border-[#5f638f]/30">
          <CardBody className="p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#0c2b4d] to-[#36234e] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
              <PenSquare className="w-12 h-12 text-[#dedff1]" />
            </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#0c2b4d] to-[#5f638f] bg-clip-text text-transparent mb-4">
                  ¡Es hora de crear tu primer post!
              </h3>
                <p className="text-[#5f638f] mb-8 text-lg max-w-md mx-auto">
                  Comparte tus ideas, experiencias y conocimientos con la comunidad de LibreBlog
                </p>
                <Link href="/post/create">
                  <Button variant="primary" size="lg" className="shadow-xl hover:shadow-2xl transform hover:scale-105">
                    <Plus className="w-5 h-5 mr-2" />
                    Crear mi primer post
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Quick Stats Bar */}
              <Card variant="elevated" className="bg-gradient-to-r from-[#dedff1] to-[#5f638f]/10 border-[#5f638f]/20">
                <CardBody className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Eye className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="font-medium text-green-700">{publicPosts} publicados</span>
                      </span>
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Edit className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                        <span className="font-medium text-yellow-700">{draftPosts} borradores</span>
                      </span>
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Heart className="w-4 h-4 text-pink-600 flex-shrink-0" />
                        <span className="font-medium text-pink-700">{totalLikes} likes totales</span>
                      </span>
                    </div>
                    <Link href="/settings" className="text-[#0c2b4d] hover:text-[#36234e] font-medium text-xs underline whitespace-nowrap">
                      Gestionar preferencias →
                    </Link>
                  </div>
                </CardBody>
              </Card>

              {/* Posts List */}
              <PostsList
                posts={postsWithLikes}
                currentUser={{
                  id: user.id,
                  email: user.email,
                  displayName: user.displayName,
                  avatarUrl: user.avatarUrl,
                  nsfwProtection: user.nsfwProtection
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}