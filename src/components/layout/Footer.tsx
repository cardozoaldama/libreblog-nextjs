'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, Code, Coffee, Sparkles } from 'lucide-react'

export default function Footer() {
  const [clickCount, setClickCount] = useState(0)
  const router = useRouter()

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1)
    if (clickCount >= 4) {
      router.push('/easter-egg')
      setClickCount(0)
    }
  }

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div
              className="flex items-center space-x-3 mb-4 cursor-pointer group"
              onClick={handleLogoClick}
              title={`Haz click ${5 - clickCount} veces más para una sorpresa...`}
            >
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LibreBlog
              </span>
              {clickCount > 0 && (
                <div className="flex space-x-1">
                  {Array.from({ length: clickCount }).map((_, i) => (
                    <Sparkles key={i} className="w-4 h-4 text-yellow-400 animate-pulse" />
                  ))}
                </div>
              )}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Una plataforma moderna para compartir ideas, historias y conocimiento.
              Construida con amor y las mejores tecnologías web.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/explore" className="text-gray-300 hover:text-white transition-colors">Explorar</Link></li>
              <li><Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/post/create" className="text-gray-300 hover:text-white transition-colors">Crear Post</Link></li>
              <li><Link href="https://github.com/IsmaNov12/libreblog-nextjs" className="text-gray-300 hover:text-white transition-colors">Repositorio</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Acerca de</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">Acerca de nosotros</Link></li>
              <li><span className="text-gray-300">Versión 1.0.0</span></li>
            </ul>
          </div>
        </div>



        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>© 2025 LibreBlog. Hecho con</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>y mucho</span>
            <Coffee className="w-4 h-4 text-yellow-600" />
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-xs text-gray-500">
              {clickCount > 0 && `Clicks restantes: ${5 - clickCount}`}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
