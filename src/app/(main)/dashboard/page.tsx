import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Button from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import PostsList from '@/components/dashboard/PostsList'
import { PenSquare, FileText, Eye, Edit, Plus } from 'lucide-react'

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
        },
      },
    },
  })

  if (!user) {
    // Si el usuario no existe en la BD, crearlo
    const baseUsername = authUser.email!.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '')
    await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email!,
        username: baseUsername,
        displayName: authUser.user_metadata?.display_name || authUser.email!.split('@')[0],
      },
    })
    redirect('/dashboard')
  }

  // Obtener conteo de likes para cada post
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

  const totalPosts = user.posts.length
  const publicPosts = user.posts.filter((p) => p.isPublic).length
  const draftPosts = user.posts.filter((p) => !p.isPublic).length

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="hover" className="animate-in fade-in slide-in-from-left duration-500 delay-200">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Posts</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{totalPosts}</p>
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
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Borradores</p>
                  <p className="text-4xl font-bold text-yellow-600 mt-2">{draftPosts}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Edit className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Create Post Button */}
        <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom duration-500 delay-500">
          <Link href="/post/create">
            <Button variant="primary" size="lg" className="w-full md:w-auto shadow-2xl hover:shadow-3xl transform hover:scale-105">
              <Plus className="w-5 h-5 mr-2" />
              Crear Nuevo Post
            </Button>
          </Link>
        </div>

        {/* Posts List */}
        <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-600">
          {user.posts.length === 0 ? (
            <Card variant="hover">
              <CardBody className="p-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <PenSquare className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                  Aún no tienes publicaciones
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Comienza a escribir y comparte tus ideas con el mundo
                </p>
                <Link href="/post/create">
                  <Button variant="primary" size="lg" className="shadow-xl hover:shadow-2xl transform hover:scale-105">
                    Crear mi primer post
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            <PostsList 
          posts={postsWithLikes} 
          currentUser={{
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl
          }}
        />
          )}
        </div>
      </div>
    </div>
  )
}