'use client'

import { useEffect, useState } from 'react'
import { List, ChevronRight, X } from 'lucide-react'

interface TOCItem {
  id: string
  text: string
  level: number
  page: number
}

interface TableOfContentsProps {
  content: string
  enablePagination?: boolean
  currentPage?: number
  onNavigate?: (page: number) => void
}

export default function TableOfContents({ content, enablePagination = false, currentPage = 1, onNavigate }: TableOfContentsProps) {
  const [toc, setToc] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Extraer headers del contenido Markdown con información de página
    const headerRegex = /^(#{1,6})\s+(.+)$/gm
    const items: TOCItem[] = []
    
    if (enablePagination) {
      // Dividir por páginas
      const pages = content.split('---PAGE---')
      pages.forEach((pageContent, pageIndex) => {
        let match
        const regex = new RegExp(headerRegex.source, headerRegex.flags)
        while ((match = regex.exec(pageContent)) !== null) {
          const level = match[1].length
          const text = match[2].trim()
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          items.push({ id, text, level, page: pageIndex + 1 })
        }
      })
    } else {
      // Sin paginación
      let match
      while ((match = headerRegex.exec(content)) !== null) {
        const level = match[1].length
        const text = match[2].trim()
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        items.push({ id, text, level, page: 1 })
      }
    }

    setToc(items)
  }, [content, enablePagination])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -80% 0px' }
    )

    toc.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [toc])

  const scrollToSection = (id: string, page: number) => {
    // Cambiar de página si es necesario
    if (onNavigate && page !== currentPage) {
      onNavigate(page)
      // Esperar a que se renderice la nueva página
      setTimeout(() => {
        scrollToElement(id)
      }, 300)
    } else {
      scrollToElement(id)
    }
  }
  
  const scrollToElement = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  if (toc.length === 0) return null

  return (
    <div className="bg-gradient-to-br from-[#0c2b4d] to-[#36234e] rounded-xl shadow-lg border border-[#5f638f]/20 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 text-[#dedff1] font-semibold hover:bg-[#5f638f]/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <List className="w-5 h-5" />
          <span>Índice de Contenidos</span>
        </div>
        <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {/* Lista de contenidos */}
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="p-4 pt-0 space-y-1 max-h-96 overflow-y-auto">
          {toc.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id, item.page)}
              className={`
                block w-full text-left text-sm py-2 px-3 rounded-lg transition-all
                ${activeId === item.id 
                  ? 'bg-[#5f638f] text-white font-medium' 
                  : 'text-[#dedff1]/80 hover:bg-[#5f638f]/30 hover:text-white'
                }
              `}
              style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
            >
              <span className="flex-1 text-left">{item.text}</span>
              {enablePagination && toc.length > 0 && (
                <span className="text-xs opacity-60 ml-2">p.{item.page}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      {isOpen && (
        <div className="px-4 pb-4 text-xs text-[#dedff1]/60 text-center">
          {toc.length} sección{toc.length !== 1 ? 'es' : ''}
        </div>
      )}
    </div>
  )
}
