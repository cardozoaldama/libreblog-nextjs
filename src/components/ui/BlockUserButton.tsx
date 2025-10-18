'use client'

import { useState, useEffect } from 'react'
import { Ban, Check } from 'lucide-react'

interface BlockUserButtonProps {
  userId: string
  username: string
}

export default function BlockUserButton({ userId, username }: BlockUserButtonProps) {
  const [isBlocked, setIsBlocked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function checkBlockStatus() {
      try {
        const res = await fetch('/api/users/blocked')
        if (res.ok) {
          const { blockedUsers } = await res.json()
          setIsBlocked(blockedUsers.includes(userId))
        }
      } catch {
        // Ignorar errores
      }
    }
    checkBlockStatus()
  }, [userId])

  const handleToggleBlock = async () => {
    setIsLoading(true)
    try {
      const method = isBlocked ? 'DELETE' : 'POST'
      const res = await fetch('/api/users/blocked', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (res.ok) {
        setIsBlocked(!isBlocked)
        window.location.reload()
      }
    } catch {
      // Ignorar errores
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleBlock}
      disabled={isLoading}
      title={isBlocked ? `Dejar de censurar a ${username}` : `Censurar contenido de ${username}`}
      className={`group relative p-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
        isBlocked
          ? 'bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40'
          : 'bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
    >
      <div className="relative z-10 text-white">
        {isBlocked ? <Check className="w-5 h-5" strokeWidth={2.5} /> : <Ban className="w-5 h-5" strokeWidth={2.5} />}
      </div>
      <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  )
}
