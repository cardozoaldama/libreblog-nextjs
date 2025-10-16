'use client'

import { useState } from 'react'
import { Eye, AlertTriangle, Shield } from 'lucide-react'
import Button from './Button'

interface NSFWFilterProps {
  children: React.ReactNode
  isNSFW: boolean
  categories?: string[]
  className?: string
}

export default function NSFWFilter({ children, isNSFW, categories = [], className = '' }: NSFWFilterProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  const handleReveal = () => {
    setIsRevealed(true)
  }

  if (!isNSFW || isRevealed) {
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
              Contenido NSFW Detectado
            </h3>
            
            <p className="text-gray-300 mb-4 text-sm">
            Este contenido ha sido marcado como NSFW (Not Safe For Work).
            {categories.length > 0 && (
                <span className="block mt-2 text-xs text-yellow-300">
                  Categorías: {categories.join(', ')}
                </span>
              )}
            </p>
            
            <div className="space-y-3">
            <Button
              onClick={handleReveal}
              variant="primary"
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver de todos modos
            </Button>

            <p className="text-xs text-gray-400 mt-3 text-center">
              Al continuar, confirmas que eres mayor de 18 años
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para mostrar advertencia en posts
export function NSFWWarning({ isNSFW, categories = [], className = '' }: { isNSFW: boolean; categories?: string[]; className?: string }) {
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
