'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react'

interface SearchableTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  rows?: number
}

export default function SearchableTextarea({ 
  value, 
  onChange, 
  placeholder = 'Escribe aquí...',
  className = '',
  rows = 30
}: SearchableTextareaProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSearchTerm, setActiveSearchTerm] = useState('')
  const [currentMatch, setCurrentMatch] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const matches = activeSearchTerm
    ? [...value.matchAll(new RegExp(activeSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'))].map(m => m.index!)
    : []

  const jumpToMatch = (index: number) => {
    if (matches.length === 0 || !textareaRef.current || !activeSearchTerm) return
    
    const position = matches[index]
    if (position === undefined) return
    
    const textarea = textareaRef.current
    
    // Crear elemento temporal para hacer scroll
    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'absolute'
    tempDiv.style.visibility = 'hidden'
    tempDiv.style.whiteSpace = 'pre-wrap'
    tempDiv.style.font = window.getComputedStyle(textarea).font
    tempDiv.style.width = textarea.clientWidth + 'px'
    tempDiv.textContent = value.substring(0, position)
    document.body.appendChild(tempDiv)
    
    const scrollPosition = tempDiv.offsetHeight
    document.body.removeChild(tempDiv)
    
    // Aplicar scroll y selección
    textarea.scrollTop = Math.max(0, scrollPosition - textarea.clientHeight / 2)
    textarea.focus()
    textarea.setSelectionRange(position, position + activeSearchTerm.length)
  }

  const handleSearch = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (!searchTerm.trim()) return
    setActiveSearchTerm(searchTerm)
    setCurrentMatch(0)
  }

  const nextMatch = () => {
    if (matches.length === 0) return
    const next = (currentMatch + 1) % matches.length
    setCurrentMatch(next)
    jumpToMatch(next)
  }

  const prevMatch = () => {
    if (matches.length === 0) return
    const prev = (currentMatch - 1 + matches.length) % matches.length
    setCurrentMatch(prev)
    jumpToMatch(prev)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault()
      setShowSearch(true)
    }
    if (e.key === 'Escape' && showSearch) {
      setShowSearch(false)
    }
  }

  useEffect(() => {
    if (activeSearchTerm && matches.length > 0) {
      jumpToMatch(currentMatch)
    }
  }, [activeSearchTerm])

  useEffect(() => {
    if (matches.length > 0) {
      jumpToMatch(currentMatch)
    }
  }, [currentMatch])

  const wordCount = value.split(/\s+/).filter(Boolean).length

  return (
    <div className="space-y-3">
      {showSearch && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-[#5f638f]/30 p-2 flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <Search className="w-4 h-4 text-[#5f638f] flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.stopPropagation()
                if (matches.length > 0) {
                  e.shiftKey ? prevMatch() : nextMatch()
                } else {
                  handleSearch(e)
                }
              }
              if (e.key === 'Escape') {
                setShowSearch(false)
              }
            }}
            placeholder="Buscar..."
            className="flex-1 min-w-[120px] px-2 py-1.5 border border-[#5f638f]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2b4d]"
            autoFocus
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={!searchTerm.trim()}
            className="px-2 py-1.5 bg-gradient-to-r from-[#0c2b4d] to-[#36234e] text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Buscar (Enter)"
          >
            Buscar
          </button>
          
          {matches.length > 0 && (
            <span className="text-xs font-medium text-[#5f638f] bg-[#dedff1]/50 px-2 py-1 rounded whitespace-nowrap">
              {currentMatch + 1}/{matches.length}
            </span>
          )}
          {activeSearchTerm && matches.length === 0 && (
            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded whitespace-nowrap">
              Sin resultados
            </span>
          )}
          
          <button 
            type="button"
            onClick={prevMatch} 
            disabled={matches.length === 0}
            className="p-1.5 hover:bg-[#dedff1]/50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Anterior (Shift+Enter)"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={nextMatch}
            disabled={matches.length === 0}
            className="p-1.5 hover:bg-[#dedff1]/50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Siguiente (Enter)"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          
          <button 
            type="button"
            onClick={() => {
              setShowSearch(false)
              setSearchTerm('')
              setActiveSearchTerm('')
            }}
            className="p-1.5 hover:bg-red-50 rounded transition-colors"
            title="Cerrar (Esc)"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      <div className="relative">
        {!showSearch && (
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            className="absolute top-2 right-2 z-10 p-2.5 sm:p-3 bg-white rounded-lg shadow-md border border-[#5f638f]/30 hover:bg-[#dedff1]/30 hover:border-[#5f638f]/50 transition-all duration-200 group touch-manipulation"
            title="Buscar (Ctrl+F)"
          >
            <Search className="w-5 h-5 sm:w-4 sm:h-4 text-[#5f638f] group-hover:text-[#0c2b4d]" />
          </button>
        )}

        <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 pr-14 border-2 border-[#5f638f]/30 rounded-xl resize-none focus:ring-2 focus:ring-[#0c2b4d] focus:border-transparent font-mono text-sm leading-6 ${className}`}
        />
      </div>

      <div className="mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs sm:text-sm text-[#5f638f]">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="flex items-center gap-1">
            <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="font-medium">Ctrl+F</span> <span className="hidden sm:inline">para buscar</span>
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 font-medium">
          <span>{wordCount.toLocaleString()} palabras</span>
          <span>·</span>
          <span>{value.length.toLocaleString()} caracteres</span>
        </div>
      </div>
    </div>
  )
}
