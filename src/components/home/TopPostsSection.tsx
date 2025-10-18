'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, TrendingUpIcon } from 'lucide-react'
import { getAvatarUrl, extractExcerpt } from '@/lib/utils'
import NSFWFilter from '@/components/ui/NSFWFilter'

interface Post {
  id: string
  title: string
  content: string
  slug: string
  imageUrl: string | null
  isNSFW: boolean
  author: {
    id: string
    email: string
    displayName: string | null
    avatarUrl: string | null
  }
  category: {
    id: string
    name: string
    icon: string | null
  } | null
  _count: {
    likes: number
  }
}

export default function TopPostsSection({ posts, nsfwProtection }: { posts: Post[], nsfwProtection: boolean }) {
  const [blockedUsers, setBlockedUsers] = useState<string[]>([])

  useEffect(() => {
    async function loadBlockedUsers() {
      try {
        const res = await fetch('/api/users/blocked')
        if (res.ok) {
          const data = await res.json()
          setBlockedUsers(data.blockedUsers || [])
        }
      } catch {}
    }
    loadBlockedUsers()
  }, [])

  if (posts.length === 0) return null

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      <style jsx global>{`
        .nsfw-image { opacity: 0; animation: fadeIn 0.3s ease-in forwards 0.1s; }
        @keyframes fadeIn { to { opacity: 1; } }
      `}</style>
      
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
        </div>

        {posts.map((post, idx) => (
          <NSFWFilter key={post.id} isNSFW={!!(post.isNSFW && nsfwProtection)} authorId={post.author.id} blockedUsers={blockedUsers}>
            <Link href={`/post/${post.slug}`}>
              {post.imageUrl && <Image src={post.imageUrl} alt={post.title} width={400} height={300} className="nsfw-image" unoptimized />}
              <h3>{post.title}</h3>
            </Link>
          </NSFWFilter>
        ))}
      </div>
    </section>
  )
}
