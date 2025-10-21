'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import Button from '@/components/ui/Button'
import { Trash2 } from 'lucide-react'

interface DeletePostButtonProps {
  postId: string
  postTitle: string
}

export default function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        alert('Error al eliminar el post')
        setIsDeleting(false)
        setShowConfirm(false)
      }
    } catch {
      console.error('Error al eliminar el post')
      alert('Error al eliminar el post')
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  const modal = showConfirm ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          ¿Eliminar post?
        </h3>
        <p className="text-gray-600 mb-4">
          ¿Estás seguro de que quieres eliminar &quot;{postTitle}&quot;? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
            className="flex-1"
          >
            Sí, eliminar
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowConfirm(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  ) : null

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowConfirm(true)}
        className="text-red-600 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
      {typeof document !== 'undefined' && modal && createPortal(modal, document.body)}
    </>
  )
}