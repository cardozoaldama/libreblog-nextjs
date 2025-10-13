'use client'

import { useState, useEffect } from 'react'
import { Heart, Share2, Pin } from 'lucide-react'
import Button from '@/components/ui/Button'

interface PostActionsProps {
  postId: string
  isAuthor?: boolean
  initialIsPinned?: boolean
}

export default function PostActions({ postId, isAuthor = false, initialIsPinned = false }: PostActionsProps) {
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isPinned, setIsPinned] = useState(initialIsPinned)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/posts/${postId}/like`)
      .then(res => res.json())
      .then(data => {
        setLikeCount(data.likeCount || 0)
        setIsLiked(data.isLiked || false)
      })
      .catch(() => {})
  }, [postId])

  const handleLike = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      })
      if (res.status === 401) {
        alert('Debes iniciar sesión para dar like')
        setIsLoading(false)
        return
      }
      if (!res.ok) throw new Error()
      const data = await res.json()
      setIsLiked(data.liked)
      setLikeCount(data.likeCount)
    } catch (error) {
      console.error('Error al dar like:', error)
    }
    setIsLoading(false)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${postId}`
    try {
      await navigator.clipboard.writeText(url)
      alert('¡Enlace copiado al portapapeles!')
    } catch {
      alert('No se pudo copiar el enlace')
    }
  }

  const handlePin = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/posts/${postId}/pin`, {
        method: 'PATCH',
      })
      if (!res.ok) {
        const error = await res.json()
        console.error('Error al pinear:', error)
        alert('Error al pinear post')
        setIsLoading(false)
        return
      }
      const data = await res.json()
      setIsPinned(data.isPinned)
    } catch (error) {
      console.error('Error al pinear:', error)
      alert('Error al pinear post')
    }
    setIsLoading(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
      <Button
        variant="ghost"
        onClick={handleLike}
        disabled={isLoading}
        className="flex items-center gap-1 sm:gap-2"
      >
        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        <span className="text-sm sm:text-base">{likeCount}</span>
      </Button>

      <Button
        variant="ghost"
        onClick={handleShare}
        className="flex items-center gap-1 sm:gap-2"
      >
        <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-sm sm:text-base">Compartir</span>
      </Button>

      {isAuthor && (
        <Button
          variant="ghost"
          onClick={handlePin}
          disabled={isLoading}
          className="flex items-center gap-1 sm:gap-2"
        >
          <Pin className={`w-4 h-4 sm:w-5 sm:h-5 ${isPinned ? 'fill-blue-500 text-blue-500' : ''}`} />
          <span className="text-sm sm:text-base">{isPinned ? 'Despinear' : 'Pinear'}</span>
        </Button>
      )}
    </div>
  )
}
