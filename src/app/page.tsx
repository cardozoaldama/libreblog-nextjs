import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { PenSquare, Search, Users, Sparkles, TrendingUp, Shield, Heart, TrendingUpIcon } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getAvatarUrl, extractExcerpt } from '@/lib/utils'

export const revalidate = 60 // Revalidar cada 60 segundos

export default async function Home() {
  // Obtener estadísticas
  const [totalPosts, totalUsers, totalCategories] = await Promise.all([
    prisma.post.count({ where: { isPublic: true } }),
    prisma.user.count(),
    prisma.category.count(),
  ])

  // Obtener posts más populares
  const allPosts = await prisma.post.findMany({
    where: { isPublic: true },
    include: {
      author: true,
      category: true
    }
  })

  // Obtener conteo de likes para cada post
  const postsWithLikes = await Promise.all(
    allPosts.map(async (post) => {
      const likeCount = await prisma.like.count({
        where: { postId: post.id }
      })
      return {
        ...post,
        _count: { likes: likeCount }
      }
    })
  )

  const topPosts = postsWithLikes
    .sort((a, b) => b._count.likes - a._count.likes)
    .slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
          <div className="text-center space-y-8 animate-fadeIn">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <svg width="120" height="120" viewBox="0 0 120 120" className="relative z-10 group-hover:scale-105 transition-all duration-500">
                  <defs>
                    <linearGradient id="heroLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="30%" stopColor="#A78BFA" />
                      <stop offset="70%" stopColor="#F472B6" />
                      <stop offset="100%" stopColor="#FBBF24" />
                    </linearGradient>
                    <filter id="heroGlow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/> 
                      </feMerge>
                    </filter>
                  </defs>
                  <circle cx="60" cy="60" r="55" fill="url(#heroLogoGradient)" filter="url(#heroGlow)" className="animate-pulse" />
                  <circle cx="60" cy="60" r="45" fill="rgba(255,255,255,0.1)" />
                  <path d="M35 42h50M35 60h40M35 78h25" stroke="white" strokeWidth="4" strokeLinecap="round" className="drop-shadow-lg" />
                  <circle cx="90" cy="42" r="4" fill="white" className="animate-bounce" style={{animationDelay: '0.5s'}} />
                  <circle cx="85" cy="60" r="3" fill="rgba(255,255,255,0.8)" className="animate-bounce" style={{animationDelay: '1s'}} />
                  <circle cx="70" cy="78" r="2" fill="rgba(255,255,255,0.6)" className="animate-bounce" style={{animationDelay: '1.5s'}} />
                </svg>
              </div>
            </div>
            
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">Bienvenido a LibreBlog</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
              Tu espacio de
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200">
                expresión libre
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto px-4">
              Comparte tus ideas, historias y conocimientos con el mundo. 
              Escribe en Markdown, conecta con otros escritores y crece tu audiencia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/register">
                <Button size="lg" variant="primary" className="shadow-2xl shadow-blue-500/50 px-8">
                  Comenzar Gratis
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8">
                  Explorar Posts
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto pt-12">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{totalPosts}+</div>
                <div className="text-blue-200 text-xs sm:text-sm md:text-base">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{totalUsers}+</div>
                <div className="text-blue-200 text-xs sm:text-sm md:text-base">Escritores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{totalCategories}</div>
                <div className="text-blue-200 text-xs sm:text-sm md:text-base">Categorías</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249 250 251)"/>
          </svg>
        </div>
      </section>

      {/* Top Posts Section */}
      {topPosts.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 px-5 py-2.5 rounded-full mb-4 shadow-lg">
                <TrendingUpIcon className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-bold text-orange-900">Más Populares</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3">
                <Heart className="w-10 h-10 text-red-500 fill-current animate-pulse" />
                Posts con Más Likes
              </h2>
              <p className="text-lg text-gray-700">Los posts más queridos por la comunidad</p>
            </div>
            
            {/* Post #1 - Destacado */}
            {topPosts[0] && (() => {
              const post = topPosts[0]
              const authorAvatarUrl = getAvatarUrl(post.author.email, post.author.avatarUrl, 40)
              const excerpt = extractExcerpt(post.content, 120)
              
              return (
                <Link href={`/post/${post.slug}`} className="block mb-10">
                  <Card variant="hover" className="cursor-pointer group max-w-2xl mx-auto border-4 border-yellow-400 shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300">
                    <CardBody className="p-0">
                      {post.imageUrl && (
                        <div className="relative w-full h-64">
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            sizes="672px"
                            className="object-cover rounded-t-xl"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-xl" />
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white px-5 py-3 rounded-full text-lg font-black flex items-center gap-2 shadow-2xl animate-pulse">
                            <span className="text-3xl">👑</span>
                            <span>#1</span>
                          </div>
                        </div>
                      )}
                      <div className="p-6 bg-gradient-to-br from-white to-yellow-50">
                        {post.category && (
                          <span className="inline-block px-3 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-3 shadow-lg">
                            {post.category.icon} {post.category.name}
                          </span>
                        )}
                        <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{excerpt}</p>
                        <div className="flex items-center justify-between pt-4 border-t-2 border-yellow-200">
                          <div className="flex items-center gap-3">
                            <Image
                              src={authorAvatarUrl}
                              alt={post.author.displayName || post.author.email}
                              width={40}
                              height={40}
                              className="rounded-full border-2 border-yellow-400"
                              unoptimized
                            />
                            <span className="text-sm font-bold text-gray-800">
                              {post.author.displayName || post.author.email.split('@')[0]}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full shadow-lg">
                            <Heart className="w-5 h-5 fill-current" />
                            <span className="text-xl font-black">{post._count.likes}</span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              )
            })()}

            {/* Posts #2-6 - Grid responsive */}
            {topPosts.length > 1 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Otros Destacados</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {topPosts.slice(1).map((post, index) => {
                  const authorAvatarUrl = getAvatarUrl(post.author.email, post.author.avatarUrl, 28)
                  const excerpt = extractExcerpt(post.content, 80)
                  const medalColors = [
                    'from-gray-400 to-gray-600',
                    'from-orange-600 to-orange-800',
                    'from-blue-500 to-blue-700',
                    'from-purple-500 to-purple-700',
                    'from-green-500 to-green-700',
                  ]
                  
                    return (
                      <Link key={post.id} href={`/post/${post.slug}`} className="block">
                        <Card variant="hover" className="h-full cursor-pointer group shadow-xl hover:shadow-2xl transition-all duration-300">
                          <CardBody className="p-0">
                            {post.imageUrl && (
                              <div className="relative w-full h-40">
                                <Image
                                  src={post.imageUrl}
                                  alt={post.title}
                                  fill
                                  sizes="288px"
                                  className="object-cover rounded-t-xl"
                                  unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-t-xl" />
                                <div className={`absolute top-3 left-3 bg-gradient-to-r ${medalColors[index]} text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg`}>
                                  #{index + 2}
                                </div>
                              </div>
                            )}
                            <div className="p-5">
                              {post.category && (
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 mb-3">
                                  {post.category.icon} {post.category.name}
                                </span>
                              )}
                              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{excerpt}</p>
                              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                                <div className="flex items-center gap-2">
                                  <Image
                                    src={authorAvatarUrl}
                                    alt={post.author.displayName || post.author.email}
                                    width={28}
                                    height={28}
                                    className="rounded-full"
                                    unoptimized
                                  />
                                  <span className="text-xs font-semibold text-gray-700 truncate max-w-[120px]">
                                    {post.author.displayName || post.author.email.split('@')[0]}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded-full">
                                  <Heart className="w-4 h-4 fill-current" />
                                  <span className="text-sm font-bold">{post._count.likes}</span>
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir LibreBlog?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Todo lo que necesitas para crear, compartir y crecer como escritor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <PenSquare className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Editor Markdown</h3>
              <p className="text-gray-600">
                Escribe con formato profesional usando Markdown. Incluye sintaxis para código, listas, tablas y más.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-500">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Search className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Descubrimiento Fácil</h3>
              <p className="text-gray-600">
                Encuentra contenido relevante por categorías, busca por títulos o descubre nuevos escritores.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-pink-500">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Comunidad Activa</h3>
              <p className="text-gray-600">
                Conecta con otros escritores, comparte tus posts y construye tu audiencia de forma orgánica.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dashboard Personal</h3>
              <p className="text-gray-600">
                Gestiona todas tus publicaciones desde un panel intuitivo. Edita, elimina o actualiza en segundos.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-yellow-500">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multimedia</h3>
              <p className="text-gray-600">
                Añade imágenes y videos a tus posts. Soportamos URLs de YouTube para embeber contenido.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-red-500">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Privacidad Total</h3>
              <p className="text-gray-600">
                Controla quién ve tu contenido. Publica posts públicos o mantenlos privados como borradores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6">
            ¿Listo para comenzar a escribir?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 px-4">
            Únete a cientos de escritores que ya están compartiendo sus historias
          </p>
          <Link href="/register">
            <Button size="lg" variant="primary" className="shadow-2xl px-10">
              Crear mi cuenta gratis
            </Button>
          </Link>
          <p className="text-sm text-blue-200 mt-4">
            No se requiere tarjeta de crédito • 100% gratis
          </p>
        </div>
      </section>
    </div>
  )
}