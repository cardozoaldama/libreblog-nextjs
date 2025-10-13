'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Search, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { formatRelativeDate, extractExcerpt, getAvatarUrl } from '@/lib/utils'

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
  _count: { likes: number }
}

export default function FollowingPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [currentPage, searchQuery])

  const loadPosts = async () => {
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
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    loadPosts()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Seguidos</h1>
          <p className="text-gray-600">Posts de usuarios que sigues</p>
        </div>

        <Card variant="elevated" className="mb-8">
          <CardBody className="p-6">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar en posts de seguidos..."
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
          </CardBody>
        </Card>

        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando posts...</p>
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post) => {
                const authorAvatarUrl = getAvatarUrl(post.author.email, post.author.avatarUrl)
                const excerpt = extractExcerpt(post.content, 120)

                return (
                  <Card key={post.id} variant="elevated" className="hover:shadow-2xl transition-shadow duration-300">
                    <CardBody className="p-0">
                      {post.imageUrl && (
                        <div className="relative w-full h-48">
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover rounded-t-xl"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        {post.category && (
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                            {post.category.icon} {post.category.name}
                          </span>
                        )}

                        <Link href={`/post/${post.slug}`}>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{excerpt}</p>

                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
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
                              {post.author.displayName || post.author.email.split('@')[0]}
                            </p>
                            <div className="flex items-center gap-3">
                              <p className="text-xs text-gray-500">
                                {formatRelativeDate(new Date(post.createdAt))}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Heart className="w-3 h-3" />
                                <span>{post._count.likes}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
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
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay posts de seguidos
              </h3>
              <p className="text-gray-600 mb-6">
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