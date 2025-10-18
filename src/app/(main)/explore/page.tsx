'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Search, Filter, X, Heart } from 'lucide-react'
import { formatRelativeDate, extractExcerpt, getAvatarUrl } from '@/lib/utils'
import NSFWFilter from '@/components/ui/NSFWFilter'
import { createClient } from '@/lib/supabase/client'

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
}

interface Author {
  id: string
  email: string
  username: string
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
category: Category | null
imageUrl: string | null
isNSFW: boolean
_count?: {
    likes: number
  }
}

interface CurrentUser {
  id: string
  email: string
  nsfwProtection?: boolean
}

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [blockedUsers, setBlockedUsers] = useState<string[]>([])
  const [isUserLoaded, setIsUserLoaded] = useState(false)

  // Cargar categorías y usuario actual
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error loading categories:', error)
        setCategories([])
      }
    }

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

    loadCategories()
    loadCurrentUser()
  }, [])

  const [users, setUsers] = useState<Author[]>([])
  const [searchType, setSearchType] = useState<'posts' | 'users'>('posts')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  // Cargar posts
  useEffect(() => {
    async function loadPosts() {
      if (searchType !== 'posts') return
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedCategory) params.append('categoryId', selectedCategory)
        if (searchQuery) params.append('search', searchQuery)
        params.append('page', currentPage.toString())

        const res = await fetch(`/api/posts?${params.toString()}`)
        const data = await res.json()
        setPosts(data.posts || [])
        setHasMore(data.hasMore || false)
      } catch (error) {
        console.error('Error loading posts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadPosts()
  }, [selectedCategory, searchQuery, searchType, currentPage])

  // Buscar usuarios
  useEffect(() => {
    async function searchUsers() {
      if (searchType !== 'users' || !searchQuery) {
        setUsers([])
        return
      }
      setIsLoading(true)
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await res.json()
        setUsers(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error searching users:', error)
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }
    searchUsers()
  }, [searchQuery, searchType])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSearchQuery('')
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dedff1] via-[#dedff1]/50 to-[#dedff1]/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#0c2b4d] via-[#36234e] to-[#5f638f] bg-clip-text text-transparent mb-4 animate-in slide-in-from-top duration-500">
            Explorar Posts
          </h1>
          <p className="text-xl text-[#000022]/70 animate-in slide-in-from-top duration-700 delay-200">
            Descubre contenido increíble de nuestra comunidad
          </p>
        </div>

        {/* Search and Filters */}
        <Card variant="elevated" className="mb-8">
          <CardBody className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="space-y-3">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={searchType === 'posts' ? "Buscar posts..." : "Buscar usuarios..."}
                      className="w-full pl-10 pr-4 py-3 border-2 border-[#5f638f]/30 rounded-xl bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-[#0c2b4d] focus:border-transparent transition-all duration-300 hover:border-[#5f638f]/50"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSearchType('posts')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      searchType === 'posts'
                        ? 'bg-gradient-to-r from-[#0c2b4d] to-[#36234e] text-white shadow-lg shadow-[#0c2b4d]/30'
                        : 'bg-white/90 backdrop-blur-sm text-[#000022] hover:bg-white border border-[#5f638f]/20 hover:border-[#5f638f]/40'
                    }`}
                  >
                    Posts
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchType('users')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      searchType === 'users'
                        ? 'bg-gradient-to-r from-[#0c2b4d] to-[#36234e] text-white shadow-lg shadow-[#0c2b4d]/30'
                        : 'bg-white/90 backdrop-blur-sm text-[#000022] hover:bg-white border border-[#5f638f]/20 hover:border-[#5f638f]/40'
                    }`}
                  >
                    Usuarios
                  </button>
                </div>
              </form>

              {/* Filters */}
              {showFilters && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-[#000022]">
                      Filtrar por categoría
                    </h3>
                    {(selectedCategory || searchQuery) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Limpiar filtros
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() =>
                          setSelectedCategory(
                            selectedCategory === cat.id ? '' : cat.id
                          )
                        }
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                          selectedCategory === cat.id
                            ? 'bg-gradient-to-r from-[#0c2b4d] to-[#36234e] text-white shadow-lg shadow-[#0c2b4d]/30'
                            : 'bg-white/90 backdrop-blur-sm text-[#000022] hover:bg-white border border-[#5f638f]/20 hover:border-[#5f638f]/40'
                        }`}
                      >
                        {cat.icon} {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Loading State */}
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
            <p className="text-xl text-[#000022]/70 font-medium">Cargando contenido...</p>
          </div>
        )}

        {/* Users Grid */}
        {!isLoading && searchType === 'users' && users.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => {
            const avatarUrl = getAvatarUrl(user.email, user.avatarUrl, 80)
              return (
                <Card key={user.id} variant="hover" className="group animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: `${users.indexOf(user) * 100}ms`}}>
                  <CardBody className="p-6 text-center">
                    <Image
                      src={avatarUrl}
                      alt={`Foto de perfil de ${user.displayName || user.email}`}
                      width={80}
                      height={80}
                      className="rounded-full mx-auto mb-4"
                    />
                    <h3 className="text-xl font-bold text-[#000022] mb-1">
                      {user.displayName || user.email.split('@')[0]}
                    </h3>
                    <p className="text-sm text-[#5f638f] mb-4">{user.email}</p>
                    <Link href={`/profile/${user.username || user.email.split('@')[0]}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Ver Perfil
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && searchType === 'posts' && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post) => {
              const authorAvatarUrl = getAvatarUrl(post.author.email, post.author.avatarUrl, 32)
                const excerpt = extractExcerpt(post.content, 120)
              const shouldFilter = !!(currentUser && post.isNSFW && currentUser.nsfwProtection)
              const isBlocked = blockedUsers.includes(post.author.id)

                return (
              <div key={post.id} className="block h-full">
                {currentUser ? (
                  <NSFWFilter
                  isNSFW={shouldFilter}
                  authorId={post.author.id}
                  blockedUsers={blockedUsers}
                  >
                    <Link href={`/post/${post.slug}`} className="block h-full">
                    <Card
                      variant="hover"
                      className="group animate-in fade-in slide-in-from-bottom duration-500 cursor-pointer h-full flex flex-col"
                      style={{animationDelay: `${posts.indexOf(post) * 100}ms`}}
                    >
                      <CardBody className="p-0 flex flex-col h-full">
                      {/* Image */}
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
                        {/* Category */}
                        {post.category && (
                          <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 mb-3 transition-all duration-300 group-hover:from-blue-200 group-hover:to-purple-200">
                            {post.category.icon} {post.category.name}
                          </span>
                        )}

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-all duration-300 line-clamp-2 group-hover:scale-[1.02] min-h-[3.5rem]">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                          {excerpt}
                        </p>

                        {/* Author & Likes */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 mt-auto">
                          <Image
                            src={authorAvatarUrl}
                            alt={`Foto de perfil de ${post.author.displayName || post.author.email}`}
                            width={32}
                            height={32}
                            className="rounded-full"
                            unoptimized
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {post.author.displayName ||
                                post.author.email.split('@')[0]}
                            </p>
                            <div className="flex items-center gap-3">
                              <p className="text-xs text-gray-500">
                                {formatRelativeDate(new Date(post.createdAt))}
                              </p>
                              {post._count && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Heart className="w-3 h-3" />
                                  <span>{post._count.likes}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                        </CardBody>
                      </Card>
                    </Link>
                  </NSFWFilter>
                ) : (
                  <Link href={`/post/${post.slug}`} className="block h-full">
                    <Card
                      variant="hover"
                      className="group animate-in fade-in slide-in-from-bottom duration-500 cursor-pointer h-full flex flex-col"
                      style={{animationDelay: `${posts.indexOf(post) * 100}ms`}}
                    >
                      <CardBody className="p-0 flex flex-col h-full">
                      <div className="relative w-full h-48 flex-shrink-0">
                        {post.imageUrl ? (
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover rounded-t-xl blur-xl"
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
                          <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 mb-3 transition-all duration-300 group-hover:from-blue-200 group-hover:to-purple-200">
                            {post.category.icon} {post.category.name}
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-all duration-300 line-clamp-2 group-hover:scale-[1.02] min-h-[3.5rem]">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                          {excerpt}
                        </p>
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 mt-auto">
                          <Image
                            src={authorAvatarUrl}
                            alt={`Foto de perfil de ${post.author.displayName || post.author.email}`}
                            width={32}
                            height={32}
                            className="rounded-full"
                            unoptimized
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {post.author.displayName ||
                                post.author.email.split('@')[0]}
                            </p>
                            <div className="flex items-center gap-3">
                              <p className="text-xs text-gray-500">
                                {formatRelativeDate(new Date(post.createdAt))}
                              </p>
                              {post._count && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Heart className="w-3 h-3" />
                                  <span>{post._count.likes}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                        </CardBody>
                      </Card>
                    </Link>
                )}
                  </div>
                )
              })}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center gap-4">
              {currentPage > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Anterior
                </Button>
              )}
              {hasMore && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Siguiente
                </Button>
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && ((searchType === 'posts' && posts.length === 0) || (searchType === 'users' && users.length === 0)) && (
          <Card variant="elevated">
            <CardBody className="p-12 text-center">
              <Search className="w-16 h-16 text-[#5f638f]/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#000022] mb-2">
                {searchType === 'posts' ? 'No se encontraron posts' : 'No se encontraron usuarios'}
              </h3>
              <p className="text-[#000022]/70 mb-6">
                Intenta con otros términos de búsqueda
              </p>
              {(selectedCategory || searchQuery) && (
                <Button variant="primary" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}