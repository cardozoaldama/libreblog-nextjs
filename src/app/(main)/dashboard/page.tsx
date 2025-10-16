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
          category: true,
          _count: {
            select: { likes: true }
          }
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

  // Los posts ya incluyen el conteo de likes
  const postsWithLikes = user.posts.map(post => ({
    ...post,
    _count: { likes: post._count.likes }
  }))

  const totalPosts = user.posts.length
  const publicPosts = user.posts.filter((p) => p.isPublic).length
  const draftPosts = user.posts.filter((p) => !p.isPublic).length
  const totalLikes = user.posts.reduce((sum, post) => sum + post._count.likes, 0)
  const averageLikes = totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0
  const mostLikedPost = user.posts.reduce((max, post) =>
    post._count.likes > max._count.likes ? post : max,
    user.posts[0] || { _count: { likes: 0 } }
  )
  const nsfwPosts = user.posts.filter((p) => p.isNSFW).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center animate-in fade-in slide-in-from-top duration-500">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            ¡Hola, {user.displayName || user.email.split('@')[0]}! 👋
          </h1>
          <p className="text-xl text-gray-600">Gestiona tus publicaciones desde aquí</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card variant="hover" className="animate-in fade-in slide-in-from-left duration-500 delay-200">
        <CardBody className="p-6">
        <div className="flex items-center justify-between">
        <div>
        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Posts</p>
        <p className="text-4xl font-bold text-gray-900 mt-2">{totalPosts}</p>
          <p className="text-xs text-gray-500 mt-1">Publicaciones creadas</p>
        </div>
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
          <FileText className="w-7 h-7 text-white" />
          </div>
          </div>
          </CardBody>
          </Card>

        <Card variant="hover" className="animate-in fade-in slide-in-from-bottom duration-500 delay-300">
        <CardBody className="p-6">
        <div className="flex items-center justify-between">
        <div>
        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Publicados</p>
          <p className="text-4xl font-bold text-green-600 mt-2">{publicPosts}</p>
          <p className="text-xs text-gray-500 mt-1">Visibles para todos</p>
        </div>
        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
            <Eye className="w-7 h-7 text-white" />
            </div>
            </div>
            </CardBody>
        </Card>

        <Card variant="hover" className="animate-in fade-in slide-in-from-right duration-500 delay-400">
        <CardBody className="p-6">
        <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Likes</p>
          <p className="text-4xl font-bold text-pink-600 mt-2">{totalLikes}</p>
        <p className="text-xs text-gray-500 mt-1">❤️ Promedio: {averageLikes}/post</p>
        </div>
          <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-7 h-7 text-white" />
              </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="hover" className="animate-in fade-in slide-in-from-left duration-500 delay-500">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Contenido NSFW</p>
                  <p className="text-4xl font-bold text-orange-600 mt-2">{nsfwPosts}</p>
                  <p className="text-xs text-gray-500 mt-1">Posts moderados</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-7 h-7 text-white" />
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
                  <h3 className="text-lg font-semibold text-gray-900">Post Más Popular</h3>
                </div>
                {mostLikedPost && mostLikedPost._count.likes > 0 ? (
                  <div>
                    <p className="font-medium text-gray-900 mb-1 line-clamp-1">{mostLikedPost.title}</p>
                    <p className="text-sm text-gray-600 mb-2">{mostLikedPost._count.likes} ❤️ likes</p>
                    <Link href={`/post/${mostLikedPost.slug}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        Ver post
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Aún no tienes likes en tus posts</p>
                )}
              </CardBody>
            </Card>

            <Card variant="elevated" className="animate-in fade-in slide-in-from-right duration-500 delay-700">
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Resumen de Actividad</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posts públicos:</span>
                    <span className="font-medium text-green-600">{publicPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Borradores:</span>
                    <span className="font-medium text-yellow-600">{draftPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Likes totales:</span>
                    <span className="font-medium text-pink-600">{totalLikes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posts NSFW:</span>
                    <span className="font-medium text-orange-600">{nsfwPosts}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        

        {/* Posts Section */}
        <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-800">
        <div className="flex items-center justify-between mb-6">
        <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        Mis Publicaciones
        </h2>
        <p className="text-gray-600 mt-1">
        {user.posts.length === 0
        ? "Aún no tienes publicaciones"
          : `${user.posts.length} publicación${user.posts.length !== 1 ? 'es' : ''} en total`
        }
        </p>
        </div>
        {user.posts.length > 0 && (
        <Link href="/post/create">
        <Button variant="outline" className="hover:scale-105 transition-transform duration-200">
        <Plus className="w-4 h-4 mr-2" />
          Nuevo Post
          </Button>
          </Link>
          )}
        </div>

        {user.posts.length === 0 ? (
        <Card variant="hover" className="border-2 border-dashed border-gray-300">
          <CardBody className="p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
              <PenSquare className="w-12 h-12 text-white" />
            </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                  ¡Es hora de crear tu primer post!
              </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
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
              <Card variant="elevated" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-700">{publicPosts} publicados</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Edit className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-700">{draftPosts} borradores</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-pink-600" />
                        <span className="font-medium text-pink-700">{totalLikes} likes totales</span>
                      </span>
                    </div>
                    <Link href="/settings" className="text-blue-600 hover:text-blue-700 font-medium text-xs underline">
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