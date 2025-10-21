'use client'

import { useState, useEffect } from 'react'
import { EyeOff, Ban, MoreVertical } from 'lucide-react'

interface CensorBlockButtonProps {
  userId: string
  username: string
}

export default function CensorBlockButton({ userId, username }: CensorBlockButtonProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isCensored, setIsCensored] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/users/blocked')
        if (res.ok) {
          const { blockedUsers, censoredUsers } = await res.json()
          setIsBlocked(blockedUsers.includes(userId))
          setIsCensored(censoredUsers.includes(userId))
        }
      } catch {
        // Ignorar errores
      }
    }
    checkStatus()
  }, [userId])

  const handleCensor = async () => {
    setIsLoading(true)
    try {
      const method = isCensored ? 'DELETE' : 'POST'
      const res = await fetch('/api/users/censored', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (res.ok) {
        const data = await res.json()
        setIsCensored(data.censored)
        setShowMenu(false)
        window.location.reload()
      }
    } catch {
      // Ignorar errores
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlock = async () => {
    setIsLoading(true)
    try {
      const method = isBlocked ? 'DELETE' : 'POST'
      const res = await fetch('/api/users/blocked', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (res.ok) {
        const data = await res.json()
        setIsBlocked(data.blocked)
        setShowMenu(false)
        window.location.reload()
      }
    } catch {
      // Ignorar errores
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isLoading}
        className={`group relative p-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
          isBlocked || isCensored
            ? 'bg-gradient-to-br from-[#36234e] to-[#5f638f] hover:from-[#0c2b4d] hover:to-[#36234e] shadow-lg shadow-[#36234e]/30 hover:shadow-xl hover:shadow-[#5f638f]/40'
            : 'bg-gradient-to-br from-[#5f638f] to-[#36234e] hover:from-[#36234e] hover:to-[#0c2b4d] shadow-lg shadow-[#5f638f]/30 hover:shadow-xl hover:shadow-[#36234e]/40'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
      >
        <div className="relative z-10 text-[#dedff1]">
          <MoreVertical className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div className="absolute inset-0 rounded-full bg-[#dedff1]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-[#dedff1] to-white rounded-xl shadow-2xl border-2 border-[#5f638f]/30 z-50 overflow-hidden">
            <button
              onClick={handleCensor}
              disabled={isLoading}
              className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-[#5f638f]/10 hover:to-[#36234e]/10 flex items-center gap-3 transition-all duration-200 disabled:opacity-50 group"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#5f638f]/20 to-[#36234e]/20 group-hover:from-[#5f638f]/30 group-hover:to-[#36234e]/30 transition-all">
                <EyeOff className="w-5 h-5 text-[#0c2b4d]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#000022]">
                  {isCensored ? 'Dejar de censurar' : 'Censurar contenido'}
                </p>
                <p className="text-xs text-[#5f638f] font-medium">
                  {isCensored ? 'Ver contenido normal' : 'Aplicar blur a posts'}
                </p>
              </div>
            </button>
            <div className="h-px bg-gradient-to-r from-transparent via-[#5f638f]/30 to-transparent" />
            <button
              onClick={handleBlock}
              disabled={isLoading}
              className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/50 flex items-center gap-3 transition-all duration-200 disabled:opacity-50 group"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-100 to-red-200 group-hover:from-red-200 group-hover:to-red-300 transition-all">
                <Ban className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-700">
                  {isBlocked ? 'Desbloquear usuario' : 'Bloquear usuario'}
                </p>
                <p className="text-xs text-red-600 font-medium">
                  {isBlocked ? 'Volver a ver posts' : 'Ocultar todos los posts'}
                </p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
