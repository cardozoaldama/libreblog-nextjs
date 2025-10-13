'use client'

import { useState } from 'react'
import { Pin } from 'lucide-react'
import Button from '@/components/ui/Button'

interface PinButtonProps {
  postId: string
  initialIsPinned: boolean
}

export default function PinButton({ postId, initialIsPinned }: PinButtonProps) {
  const [isPinned, setIsPinned] = useState(initialIsPinned)
  const [isLoading, setIsLoading] = useState(false)

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
    <Button
      variant="ghost"
      size="sm"
      onClick={handlePin}
      disabled={isLoading}
      className="flex items-center gap-1"
    >
      <Pin className={`w-4 h-4 ${isPinned ? 'fill-blue-500 text-blue-500' : ''}`} />
      {isPinned ? 'Pineado' : 'Pinear'}
    </Button>
  )
}
