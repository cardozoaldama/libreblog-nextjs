'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import PinButton from '@/components/post/PinButton'
import DeletePostButton from '@/components/posts/DeletePostButton'
import { Eye, Edit, Pin, Search, Heart, AlertTriangle } from 'lucide-react'
import { formatRelativeDate, getGravatarUrl } from '@/lib/utils'
import NSFWFilter from '@/components/ui/NSFWFilter'

interface Post {
  id: string
  title: string
  slug: string
  imageUrl: string | null
  isPinned: boolean
  isPublic: boolean
  isNSFW: boolean
  createdAt: Date
  category: {
    id: string
    name: string
    icon: string | null
  } | null
  author?: {
    id: string
    email: string
    displayName: string | null
    avatarUrl: string | null
  }
  _count: {
    likes: number
  }
}

interface PostsListProps {
  posts: Post[]
  currentUser?: {
    id: string
    email: string
    displayName: string | null
    avatarUrl: string | null
    nsfwProtection?: boolean
  }
}

export default function PostsList({ posts, currentUser }: PostsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'public' | 'draft'>('all')
  const router = useRouter()

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'public' && post.isPublic) || 
                         (statusFilter === 'draft' && !post.isPublic)
    return matchesSearch && matchesStatus
  })

  const getAuthorDisplay = (post: Post) => {
    const author = post.author || currentUser
    return {
      name: author?.displayName || author?.email?.split('@')[0] || 'Autor desconocido',
      avatar: author?.avatarUrl || getGravatarUrl(author?.email || '', 32)
    }
  }

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en mis publicaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({posts.length})
          </button>
          <button
            onClick={() => setStatusFilter('public')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === 'public'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Públicos ({posts.filter(p => p.isPublic).length})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === 'draft'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Borradores ({posts.filter(p => !p.isPublic).length})
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 px-4">
          <p className="text-gray-600">
            {searchQuery ? 'No se encontraron publicaciones' : 'Aún no tienes publicaciones'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const authorInfo = getAuthorDisplay(post)
            const shouldFilter = !!(post.isNSFW && (currentUser?.nsfwProtection ?? true))
            
            return (
            <div key={post.id} className="block h-full">
              <NSFWFilter
              isNSFW={shouldFilter}
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
                    className="object-cover rounded-t-xl"
                    unoptimized
                />
              ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-xl">
                  <span className="text-6xl text-gray-400">{post.category?.icon || '📝'}</span>
              </div>
              )}
                {post.isNSFW && (
                        <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded border border-yellow-200 flex items-center gap-1 text-sm font-medium">
                          <AlertTriangle className="w-4 h-4" />
                          Contenido NSFW
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      {post.category && (
                          <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 mb-3 shadow-md">
                          {post.category.icon} {post.category.name}
                        </span>
                      )}

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all relative z-10 line-clamp-2">
                    {post.title}
                </h3>

              <div className="flex items-center gap-2 mb-3">
                {post.isPinned && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                    <Pin className="w-3 h-3" /> Pineado
                    </span>
                    )}
                  {post.isPublic ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Público
                      </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Borrador
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 mt-auto relative z-10">
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500">
                            {authorInfo.avatar ? (
                              <Image
                                src={authorInfo.avatar}
                                alt={authorInfo.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                {authorInfo.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{authorInfo.name}</span>
                          </div>
                        <div className="flex items-center gap-3">
                          <p className="text-xs text-gray-500">
                            {formatRelativeDate(post.createdAt)}
                        </p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Heart className="w-3 h-3" />
                              <span>{post._count.likes}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap mt-4 relative z-20">
                        <div onClick={(e) => e.preventDefault()} className="contents">
                          <PinButton postId={post.id} initialIsPinned={post.isPinned} />
                          <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); router.push(`/post/edit/${post.id}`) }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <DeletePostButton postId={post.id} postTitle={post.title} />
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
      )}
    </>
  )
}
