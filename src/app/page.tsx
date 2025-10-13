import Link from 'next/link'
import Button from '@/components/ui/Button'
import { PenSquare, Search, Users, Sparkles, TrendingUp, Shield } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  // Obtener estadísticas
  const [totalPosts, totalUsers, totalCategories] = await Promise.all([
    prisma.post.count({ where: { isPublic: true } }),
    prisma.user.count(),
    prisma.category.count(),
  ])

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