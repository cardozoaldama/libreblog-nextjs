'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import Button from '@/components/ui/Button'

interface CommentFormProps {
  postId: string
  postAuthorId: string
  currentUserId: string
  parentId?: string
  onCommentAdded: (newComment?: any) => void
  onCancel?: () => void
}

export default function CommentForm({ postId, postAuthorId, currentUserId, parentId, onCommentAdded, onCancel }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const MAX_LENGTH = 600

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: content.trim(), parentId })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al crear comentario')
      }

      const newComment = await res.json()
      setContent('')
      onCommentAdded(newComment)
      if (onCancel) onCancel()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentId ? 'Escribe una respuesta...' : 'Escribe un comentario...'}
          rows={3}
          maxLength={MAX_LENGTH}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-[#5f638f]/30 rounded-xl bg-white/80 focus:ring-2 focus:ring-[#0c2b4d] focus:border-transparent resize-none"
          disabled={isSubmitting}
        />
        <div className={`absolute bottom-2 right-2 text-xs font-medium ${
          content.length > MAX_LENGTH * 0.9 ? 'text-red-600' : 'text-[#5f638f]/60'
        }`}>
          {content.length}/{MAX_LENGTH}
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <div className="flex flex-wrap gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} size="sm">
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSubmitting}
          disabled={!content.trim() || isSubmitting}
        >
          <Send className="w-4 h-4 mr-2" />
          {parentId ? 'Responder' : 'Comentar'}
        </Button>
      </div>
    </form>
  )
}
