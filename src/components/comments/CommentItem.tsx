'use client'

import { useState } from 'react'
import { Reply, Edit2, Trash2, MoreVertical } from 'lucide-react'
import Image from 'next/image'
import { getGravatarUrl } from '@/lib/utils'
import CommentForm from './CommentForm'
import Button from '@/components/ui/Button'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    displayName: string
    avatarUrl: string | null
    email: string
  }
  replies: Comment[]
}

interface CommentItemProps {
  comment: Comment
  postId: string
  postAuthorId: string
  currentUserId?: string
  onUpdate: () => void
  isReply?: boolean
}

export default function CommentItem({ comment, postId, postAuthorId, currentUserId, onUpdate, isReply }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isAuthor = currentUserId === comment.user.id
  const isPostAuthor = currentUserId === postAuthorId
  const canDelete = isAuthor || isPostAuthor

  const handleEdit = async () => {
    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent.trim() })
      })

      if (res.ok) {
        setIsEditing(false)
        onUpdate()
      }
    } catch (error) {
      console.error('Error editing comment:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este comentario?')) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/comments/${comment.id}`, { method: 'DELETE' })
      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className={`${isReply ? 'ml-6 sm:ml-12' : ''}`}>
      <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-white/50 border border-[#5f638f]/10 hover:border-[#5f638f]/20 transition-colors">
        <div className="flex-shrink-0">
          <Image
            src={comment.user.avatarUrl || getGravatarUrl(comment.user.email)}
            alt={comment.user.displayName}
            width={40}
            height={40}
            className="rounded-full ring-2 ring-[#5f638f]/20 w-8 h-8 sm:w-10 sm:h-10 object-cover"
            unoptimized
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-[#0c2b4d] text-sm sm:text-base truncate">{comment.user.displayName}</p>
              <p className="text-xs text-[#5f638f]">
                {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {(isAuthor || canDelete) && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 rounded-full hover:bg-[#5f638f]/10"
                >
                  <MoreVertical className="w-4 h-4 text-[#5f638f]" />
                </button>

                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-[#5f638f]/20 py-1 z-20">
                      {isAuthor && (
                        <button
                          onClick={() => {
                            setIsEditing(true)
                            setShowMenu(false)
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-[#5f638f]/5 flex items-center gap-2"
                        >
                          <Edit2 className="w-3 h-3" />
                          Editar
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => {
                            handleDelete()
                            setShowMenu(false)
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-3 h-3" />
                          Eliminar
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-[#5f638f]/30 rounded-lg text-sm"
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEdit}>Guardar</Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancelar</Button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm sm:text-base text-[#000022] whitespace-pre-wrap break-words">{comment.content}</p>
          )}

          {currentUserId && !isReply && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="mt-2 text-sm text-[#5f638f] hover:text-[#0c2b4d] flex items-center gap-1 font-medium"
            >
              <Reply className="w-3 h-3" />
              Responder
            </button>
          )}

          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                postId={postId}
                postAuthorId={postAuthorId}
                currentUserId={currentUserId!}
                parentId={comment.id}
                onCommentAdded={() => {
                  setShowReplyForm(false)
                  onUpdate()
                }}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              postAuthorId={postAuthorId}
              currentUserId={currentUserId}
              onUpdate={onUpdate}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  )
}
