'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Loader2 } from 'lucide-react'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    displayName: string
    username: string | null
    avatarUrl: string | null
    email: string
  }
  replies: Comment[]
}

interface CommentSectionProps {
  postId: string
  postAuthorId: string
  allowComments: boolean
  currentUserId?: string
}

export default function CommentSection({ postId, postAuthorId, allowComments, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments)
      }
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCommentAdded = async (newComment?: any) => {
    // Siempre recargar para asegurar consistencia
    await loadComments()
  }

  if (!allowComments) {
    return (
      <div className="text-center py-8 text-[#5f638f]">
        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Los comentarios están desactivados en este post</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#0c2b4d]" />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 pb-3 sm:pb-4 border-b border-[#5f638f]/20">
        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#0c2b4d]" />
        <h3 className="text-lg sm:text-xl font-bold text-[#0c2b4d]">
          Comentarios ({comments.length})
        </h3>
      </div>

      {currentUserId && (
        <CommentForm
          postId={postId}
          postAuthorId={postAuthorId}
          currentUserId={currentUserId}
          onCommentAdded={handleCommentAdded}
        />
      )}

      <div className="space-y-3 sm:space-y-4">
        {comments.length === 0 ? (
          <p className="text-center py-8 text-[#5f638f]">
            Sé el primero en comentar
          </p>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              postAuthorId={postAuthorId}
              currentUserId={currentUserId}
              onUpdate={loadComments}
            />
          ))
        )}
      </div>
    </div>
  )
}
