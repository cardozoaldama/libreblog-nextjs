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
    <footer className="bg-gradient-to-r from-[#000022] via-[#0c2b4d] to-[#36234e] text-white">
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
              <svg width="32" height="32" viewBox="0 0 32 32" className="group-hover:scale-110 transition-transform duration-300">
                <defs>
                  <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0c2b4d" />
                    <stop offset="50%" stopColor="#36234e" />
                    <stop offset="100%" stopColor="#5f638f" />
                  </linearGradient>
                </defs>
                <path d="M25.6 6.4 Q24 4.8 22.4 6.4 L9.6 22.4 Q8 24 6.4 25.6 L8 27.2 Q9.6 25.6 11.2 24 L27.2 8 Q28.8 6.4 27.2 4.8 Z" fill="url(#footerLogoGradient)"/>
                <path d="M6.4 25.6 L4.8 30.4 L9.6 28.8 L8 27.2 Z" fill="#dedff1" opacity="0.6"/>
                <path d="M22.4 6.4 L25.6 9.6" stroke="#dedff1" strokeWidth="1.2" strokeLinecap="round" opacity="0.8"/>
              </svg>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#dedff1] to-[#5f638f] bg-clip-text text-transparent">
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
            <p className="text-[#dedff1]/80 text-sm leading-relaxed">
              Una plataforma moderna para compartir ideas, historias y conocimiento.
              Construida con amor y las mejores tecnologías web.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#5f638f]">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/explore" className="text-[#dedff1]/80 hover:text-white transition-colors">Explorar</Link></li>
              <li><Link href="/dashboard" className="text-[#dedff1]/80 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/post/create" className="text-[#dedff1]/80 hover:text-white transition-colors">Crear Post</Link></li>
              <li><Link href="https://github.com/IsmaNov12/libreblog-nextjs" className="text-[#dedff1]/80 hover:text-white transition-colors">Repositorio</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#5f638f]">Acerca de</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-[#dedff1]/80 hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/privacy" className="text-[#dedff1]/80 hover:text-white transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/about" className="text-[#dedff1]/80 hover:text-white transition-colors">Acerca de nosotros</Link></li>
              <li><span className="text-[#dedff1]/80">Versión 2.1.0</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#5f638f]/30 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-[#dedff1]/70 text-sm">
            <span>© 2025 LibreBlog. Hecho con</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>y mucho</span>
            <Coffee className="w-4 h-4 text-yellow-600" />
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-xs text-[#5f638f]">
              {clickCount > 0 && `Clicks restantes: ${5 - clickCount}`}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
