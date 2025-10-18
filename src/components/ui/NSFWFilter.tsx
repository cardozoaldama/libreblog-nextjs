'use client'

import { useState } from 'react'
import { Eye, AlertTriangle, Shield } from 'lucide-react'
import Button from './Button'

interface NSFWFilterProps {
  children: React.ReactNode
  isNSFW: boolean
  className?: string
  authorId?: string
  blockedUsers?: string[]
}

export default function NSFWFilter({ children, isNSFW, className = '', authorId, blockedUsers = [] }: NSFWFilterProps) {
  const isAuthorBlocked = authorId && blockedUsers.includes(authorId)
  const shouldFilter = isNSFW || isAuthorBlocked
  const [isRevealed, setIsRevealed] = useState(false)

  const handleReveal = () => {
    setIsRevealed(true)
  }

  if (!shouldFilter || isRevealed) {
    return <div className={`${className} h-full`}>{children}</div>
  }

  return (
  <div className={`relative ${className} h-full`}>
  {/* Contenido con filtro borroso */}
  <div className="relative overflow-hidden rounded-lg h-full">
  <div className="blur-sm pointer-events-none select-none h-full">
  {children}
  </div>

  {/* Overlay con advertencia */}
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center h-full">
          <div className="text-center p-6 max-w-md">
            <div className="mb-4">
              <Shield className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              {isAuthorBlocked && isNSFW ? 'Usuario Censurado + NSFW' : isAuthorBlocked ? 'Usuario Censurado' : 'Contenido NSFW'}
            </h3>
            
            <p className="text-gray-300 mb-4 text-sm">
              {isAuthorBlocked && isNSFW
                ? 'Has censurado a este usuario y además su contenido está marcado como NSFW.'
                : isAuthorBlocked 
                ? 'Has censurado a este usuario. Su contenido aparece filtrado.'
                : 'Este contenido está marcado como NSFW (Not Safe For Work).'}
            </p>
            
            <Button
              onClick={handleReveal}
              variant="primary"
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver de todos modos
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para mostrar advertencia en posts
export function NSFWWarning({ isNSFW, className = '' }: { isNSFW: boolean; className?: string }) {
  if (!isNSFW) return null

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 ${className}`}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
        <p className="text-sm font-medium text-yellow-800">
        Contenido NSFW
        </p>
      </div>
    </div>
  )
}

