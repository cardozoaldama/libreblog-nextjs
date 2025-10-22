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
  const [censoredUsers, setCensoredUsers] = useState<string[]>([])
  const [isUserLoaded, setIsUserLoaded] = useState(false)
  const [categories, setCategories] = useState<Array<{id: string; name: string; icon: string | null}>>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [followingUsers, setFollowingUsers] = useState<Array<{id: string; displayName: string | null; email: string}>>([])
  const [selectedUser, setSelectedUser] = useState('')

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const blockedRes = await fetch('/api/users/blocked')
          if (blockedRes.ok) {
            const blockedData = await blockedRes.json()
            setBlockedUsers(blockedData.blockedUsers || [])
            setCensoredUsers(blockedData.censoredUsers || [])
          }
          
          const res = await fetch('/api/users/me')
          const userData = await res.json()
          setCurrentUser({
            id: user.id,
            email: user.email!,
            nsfwProtection: userData?.nsfwProtection ?? true
          })

          // Cargar categorías
          const catRes = await fetch('/api/categories')
          if (catRes.ok) {
            const catData = await catRes.json()
            setCategories(catData || [])
          }

          // Cargar usuarios seguidos
          const followingRes = await fetch(`/api/users/${user.id}/following`)
          if (followingRes.ok) {
            const followingData = await followingRes.json()
            setFollowingUsers(followingData.following || [])
          }
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
      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedUser) params.append('author', selectedUser)

      const res = await fetch(`/api/posts/following?${params.toString()}`)
      const data = await res.json()

      setPosts(data.posts || [])
      setHasMore(data.hasMore || false)

      // Recargar lista de usuarios seguidos para mantenerla actualizada
      if (currentUser?.id) {
        const followingRes = await fetch(`/api/users/${currentUser.id}/following`)
        if (followingRes.ok) {
          const followingData = await followingRes.json()
          const newFollowingUsers = followingData.following || []
          setFollowingUsers(newFollowingUsers)
          
          // Si el usuario seleccionado ya no está en la lista, limpiar selección
          if (selectedUser && !newFollowingUsers.some((u: {id: string}) => u.id === selectedUser)) {
            setSelectedUser('')
          }
        }
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchQuery, selectedCategory, selectedUser, currentUser?.id])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    loadPosts()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dedff1] via-[#dedff1]/50 to-[#dedff1]/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#0c2b4d] via-[#36234e] to-[#5f638f] bg-clip-text text-transparent mb-4 animate-in slide-in-from-top duration-500">
            Seguidos
          </h1>
          <p className="text-xl text-[#000022]/70 animate-in slide-in-from-top duration-700 delay-200">
            Posts de usuarios que sigues
          </p>
        </div>

        <Card variant="elevated" className="mb-8">
          <CardBody className="p-4 sm:p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar en posts de seguidos..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#5f638f]/30 rounded-xl bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-[#0c2b4d] focus:border-transparent transition-all duration-300 hover:border-[#5f638f]/50"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2.5 border-2 border-[#5f638f]/30 rounded-xl bg-white/90 focus:ring-2 focus:ring-[#0c2b4d] focus:border-transparent transition-all text-sm"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedUser}
                  onChange={(e) => {
                    setSelectedUser(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2.5 border-2 border-[#5f638f]/30 rounded-xl bg-white/90 focus:ring-2 focus:ring-[#0c2b4d] focus:border-transparent transition-all text-sm"
                >
                  <option value="">Todos los usuarios</option>
                  {followingUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.displayName || user.email.split('@')[0]}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </CardBody>
        </Card>

        {(isLoading || !isUserLoaded) && (
          <div className="text-center py-16">
            <Image
              src="/loading.gif"
              alt="Cargando"
              width={120}
              height={120}
              className="mx-auto mb-6"
              unoptimized
            />
            <p className="text-xl text-[#000022]/70 font-medium">Cargando posts...</p>
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {posts.map((post) => {
            const authorAvatarUrl = getAvatarUrl(post.author.email, post.author.avatarUrl, 40)
            const excerpt = extractExcerpt(post.content, 150)
                const shouldFilter = !!(currentUser && post.isNSFW && currentUser.nsfwProtection)
                const isBlocked = blockedUsers.includes(post.author.id)
                
                if (isBlocked) return null

            return (
            <div key={post.id} className="block h-full">
            <NSFWFilter
                    isNSFW={shouldFilter}
                    authorId={post.author.id}
                    blockedUsers={blockedUsers}
                    censoredUsers={censoredUsers}
                  >
                    <Link href={`/post/${post.slug}`} className="block h-full">
                      <Card variant="hover" className="group animate-in fade-in slide-in-from-bottom duration-500 cursor-pointer h-full flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                        <CardBody className="p-0 flex flex-col h-full">
                      <div className="relative w-full h-64 flex-shrink-0">
                        {post.imageUrl ? (
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className={`object-cover ${shouldFilter || isBlocked ? 'blur-xl' : ''}`}
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#0c2b4d]/10 to-[#36234e]/10 flex items-center justify-center">
                            <span className="text-7xl">{post.category?.icon || '📝'}</span>
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-white to-[#dedff1]/20">
                        {post.category && (
                          <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-[#0c2b4d] to-[#36234e] text-white mb-4 shadow-md w-fit">
                            {post.category.icon} {post.category.name}
                          </span>
                        )}

                        <h3 className="text-2xl font-bold text-[#000022] mb-3 group-hover:text-[#0c2b4d] transition-all duration-300 line-clamp-2 leading-tight">
                          {post.title}
                        </h3>

                        <p className="text-[#5f638f] text-base mb-4 line-clamp-4 flex-1 leading-relaxed">{excerpt}</p>

                        <div className="flex items-center gap-3 pt-4 border-t-2 border-[#5f638f]/10 mt-auto">
                          <Image
                            src={authorAvatarUrl}
                            alt={`Foto de perfil de ${post.author.displayName || post.author.email}`}
                            width={40}
                            height={40}
                            className="rounded-full ring-2 ring-[#5f638f]/20"
                            unoptimized
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#0c2b4d] truncate">
                              {post.author.displayName || post.author.email.split('@')[0]}
                            </p>
                            <div className="flex items-center gap-3">
                              <p className="text-xs text-[#5f638f] font-medium">
                                {formatRelativeDate(new Date(post.createdAt))}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-[#5f638f] font-medium">
                                <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
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
