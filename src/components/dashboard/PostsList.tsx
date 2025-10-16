'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import PinButton from '@/components/post/PinButton'
import DeletePostButton from '@/components/posts/DeletePostButton'
import { Eye, Edit, Pin, Search, Heart } from 'lucide-react'
import { formatRelativeDate, getAvatarUrl } from '@/lib/utils'
import NSFWFilter, { NSFWWarning } from '@/components/ui/NSFWFilter'

interface Post {
  id: string
  title: string
  slug: string
  imageUrl: string | null
  isPinned: boolean
  isPublic: boolean
  isNSFW: boolean
  nsfwCategories: string[]
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

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getAuthorDisplay = (post: Post) => {
    const author = post.author || currentUser
    return {
      name: author?.displayName || author?.email?.split('@')[0] || 'Autor desconocido',
      avatar: getAvatarUrl(author?.email || '', author?.avatarUrl, 32)
    }
  }

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
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
            const shouldFilter = post.isNSFW && (currentUser?.nsfwProtection ?? true)
            
            return (
            <div key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
              {/* NSFW Warning */}
              {post.isNSFW && <NSFWWarning isNSFW={true} categories={post.nsfwCategories} className="m-4 mb-0" />}
              
              <NSFWFilter
              isNSFW={shouldFilter}
              categories={post.nsfwCategories}
              postId={post.id}
                className=""
              >
              {/* Image */}
              {post.imageUrl && (
                <Link href={`/post/${post.slug}`}>
                  <div className="relative h-48 w-full bg-gray-200">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized
                    />
                  </div>
                </Link>
              )}

              {/* Content */}
              <div className="p-4">
                {/* Author Info */}
                <div className="flex items-center gap-2 mb-3">
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
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {post.category && (
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {post.category.icon} {post.category.name}
                    </span>
                  )}
                  {post.isPinned && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                      <Pin className="w-3 h-3" /> Pineado
                    </span>
                  )}
                  {post.isPublic ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Público
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Borrador
                    </span>
                  )}
                </div>

                {/* Title */}
                <Link href={`/post/${post.slug}`}>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                {/* Date & Likes */}
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-xs text-gray-500">
                    {formatRelativeDate(post.createdAt)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Heart className="w-3 h-3" />
                    <span>{post._count.likes}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <PinButton postId={post.id} initialIsPinned={post.isPinned} />
                  <Link href={`/post/${post.slug}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/post/edit/${post.id}`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <DeletePostButton postId={post.id} postTitle={post.title} />
                </div>
              </div>
              </NSFWFilter>
            </div>
            )
          })}
        </div>
      )}
    </>
  )
}
