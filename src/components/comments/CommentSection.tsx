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
  const [isDeletingAll, setIsDeletingAll] = useState(false)
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] = useState(false)

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
        {currentUserId === postAuthorId && comments.length > 0 && (
          <button
            onClick={() => setShowConfirmDeleteAll(true)}
            className="ml-auto px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full text-xs font-semibold shadow hover:from-red-700 hover:to-red-800 transition-colors disabled:opacity-60 disabled:pointer-events-none"
            disabled={isDeletingAll}
            title="Eliminar todos los comentarios de este post"
          >
            Eliminar todos
          </button>
        )}
      </div>
      {showConfirmDeleteAll && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowConfirmDeleteAll(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-red-700 mb-2">¿Eliminar todos los comentarios?</h3>
            <p className="text-sm text-[#5f638f] mb-6">Esta acción no se puede deshacer y borrará todos los comentarios del post, incluyendo respuestas.</p>
            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
                onClick={() => setShowConfirmDeleteAll(false)}
                disabled={isDeletingAll}
              >
                Cancelar
              </button>
              <button
                className="flex-1 px-4 py-2 rounded bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 disabled:opacity-60"
                onClick={async () => {
                  setIsDeletingAll(true)
                  try {
                    const res = await fetch(`/api/comments?postId=${postId}`, { method: 'DELETE' })
                    if (res.ok) {
                      await loadComments()
                    }
                  } finally {
                    setIsDeletingAll(false)
                    setShowConfirmDeleteAll(false)
                  }
                }}
                disabled={isDeletingAll}
              >
                {isDeletingAll ? 'Eliminando...' : 'Eliminar todos'}
              </button>
            </div>
          </div>
        </div>
      )}

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
