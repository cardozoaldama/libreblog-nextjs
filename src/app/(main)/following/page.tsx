'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Search, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { formatRelativeDate, extractExcerpt, getAvatarUrl } from '@/lib/utils'
import NSFWFilter from '@/components/ui/NSFWFilter'
import { createClient } from '@/lib/supabase/client'

interface Author {
  id: string
  email: string
  displayName: string | null
  avatarUrl: string | null
}

interface Post {
  id: string
  title: string
  content: string
  slug: string
  createdAt: string
  author: Author
  category: { id: string; name: string; icon: string | null } | null
  imageUrl: string | null
  isNSFW: boolean
  _count: { likes: number }
}

interface CurrentUser {
  id: string
  email: string
  nsfwProtection?: boolean
}

export default function FollowingPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [blockedUsers, setBlockedUsers] = useState<string[]>([])
  const [isUserLoaded, setIsUserLoaded] = useState(false)

  // Cargar usuario actual
  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Cargar usuarios bloqueados primero
          const blockedRes = await fetch('/api/users/blocked')
          if (blockedRes.ok) {
            const blockedData = await blockedRes.json()
            setBlockedUsers(blockedData.blockedUsers || [])
          }
          
          // Obtener preferencias NSFW del usuario
          const res = await fetch('/api/users/me')
          const userData = await res.json()
          setCurrentUser({
            id: user.id,
            email: user.email!,
            nsfwProtection: userData?.nsfwProtection ?? true
          })
        }
      } catch (error) {
        console.error('Error loading current user:', error)
      } finally {
        setIsUserLoaded(true)
      }
    }
    loadCurrentUser()
  }, [])

  const loadPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', currentPage.toString())
      if (searchQuery) params.append('search', searchQuery)

      const res = await fetch(`/api/posts/following?${params.toString()}`)
      const data = await res.json()

      setPosts(data.posts || [])
      setHasMore(data.hasMore || false)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchQuery])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    loadPosts()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dedff1] via-[#dedff1] to-[#5f638f]/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0c2b4d] to-[#5f638f] bg-clip-text text-transparent mb-2">Seguidos</h1>
          <p className="text-[#000022]/70">Posts de usuarios que sigues</p>
        </div>

        <Card variant="elevated" className="mb-8">
          <CardBody className="p-6">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5f638f]/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar en posts de seguidos..."
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-[#5f638f]/30 rounded-lg focus:ring-2 focus:ring-[#0c2b4d] focus:border-transparent bg-white/80"
                />
              </div>
            </form>
          </CardBody>
        </Card>

        {(isLoading || !isUserLoaded) && (
          <div className="text-center py-12">
            <Image
              src="/loading.gif"
              alt="Cargando"
              width={120}
              height={120}
              className="mx-auto mb-4"
              unoptimized
            />
            <p className="text-[#5f638f]">Cargando posts...</p>
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post) => {
            const authorAvatarUrl = getAvatarUrl(post.author.email, post.author.avatarUrl, 32)
            const excerpt = extractExcerpt(post.content, 120)
                const shouldFilter = currentUser && post.isNSFW && currentUser.nsfwProtection
                const isBlocked = blockedUsers.includes(post.author.id)

            return (
            <div key={post.id} className="block h-full">
            <NSFWFilter
                    isNSFW={shouldFilter}
                    authorId={post.author.id}
                    blockedUsers={blockedUsers}
                  >
                    <Link href={`/post/${post.slug}`} className="block h-full">
                      <Card variant="hover" className="group animate-in fade-in slide-in-from-bottom duration-500 cursor-pointer h-full flex flex-col">
                        <CardBody className="p-0 flex flex-col h-full">
                      <div className="relative w-full h-48 flex-shrink-0">
                        {post.imageUrl ? (
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className={`object-cover rounded-t-xl ${shouldFilter || isBlocked ? 'blur-xl' : ''}`}
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-xl">
                            <span className="text-6xl text-gray-400">{post.category?.icon || '📝'}</span>
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        {post.category && (
                          <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#dedff1] to-[#5f638f]/20 text-[#0c2b4d] mb-3 transition-all duration-300 group-hover:from-[#5f638f]/20 group-hover:to-[#dedff1]">
                            {post.category.icon} {post.category.name}
                          </span>
                        )}

                        <h3 className="text-xl font-bold text-[#000022] mb-2 group-hover:text-[#0c2b4d] transition-all duration-300 line-clamp-2 group-hover:scale-[1.02] min-h-[3.5rem]">
                          {post.title}
                        </h3>

                        <p className="text-[#5f638f] text-sm mb-4 line-clamp-3 flex-1">{excerpt}</p>

                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 mt-auto">
                          <Image
                            src={authorAvatarUrl}
                            alt={`Foto de perfil de ${post.author.displayName || post.author.email}`}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#000022] truncate">
                              {post.author.displayName || post.author.email.split('@')[0]}
                            </p>
                            <div className="flex items-center gap-3">
                              <p className="text-xs text-[#5f638f]">
                                {formatRelativeDate(new Date(post.createdAt))}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-[#5f638f]">
                                <Heart className="w-3 h-3" />
                                <span>{post._count.likes}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      </CardBody>
                      </Card>
                      </Link>
                      </NSFWFilter>
                      </div>
                )
              })}
            </div>

            <div className="flex justify-center gap-4">
              {currentPage > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
              )}
              {hasMore && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </>
        )}

        {!isLoading && posts.length === 0 && (
          <Card variant="elevated">
            <CardBody className="p-12 text-center">
              <Search className="w-16 h-16 text-[#5f638f]/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#000022] mb-2">
                No hay posts de seguidos
              </h3>
              <p className="text-[#5f638f] mb-6">
                Sigue a otros usuarios para ver sus publicaciones aquí
              </p>
              <Link href="/explore">
                <Button variant="primary">Explorar usuarios</Button>
              </Link>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}