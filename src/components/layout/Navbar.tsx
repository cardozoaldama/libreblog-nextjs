'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, PenSquare, Search, User, LogOut, Settings, Heart } from 'lucide-react'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { getGravatarUrl } from '@/lib/utils'

interface NavbarProps {
  user?: {
    id: string
    email: string
    displayName?: string | null
    avatarUrl?: string | null
  } | null
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = user
    ? [
        { href: '/explore', label: 'Explorar', icon: Search },
        { href: '/following', label: 'Seguidos', icon: Heart },
        { href: '/dashboard', label: 'Dashboard', icon: User },
        { href: '/post/create', label: 'Crear Post', icon: PenSquare },
      ]
    : [
        { href: '/explore', label: 'Explorar', icon: Search },
      ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative group-hover:scale-105 transition-all duration-300 ease-out">
              <svg width="40" height="40" viewBox="0 0 40 40" className="relative z-10">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/> 
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" filter="url(#glow)" className="group-hover:animate-pulse" />
                <path d="M12 14h16M12 20h12M12 26h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="drop-shadow-sm" />
                <circle cx="30" cy="14" r="2" fill="white" className="animate-pulse" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-300">
              LibreBlog
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  <span className="relative">
                    {link.label}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                    )}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-gray-50/80 transition-all duration-300 group"
                >
                  <div className="relative">
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={`Foto de perfil de ${user.displayName || user.email}`}
                        width={32}
                        height={32}
                        className="rounded-full ring-2 ring-transparent group-hover:ring-blue-200 transition-all duration-300"
                        priority
                        unoptimized
                      />
                    ) : (
                      <Image
                        src={getGravatarUrl(user.email)}
                        alt={`Foto de perfil de ${user.displayName || user.email}`}
                        width={32}
                        height={32}
                        className="rounded-full ring-2 ring-transparent group-hover:ring-blue-200 transition-all duration-300"
                        priority
                        unoptimized
                      />
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.displayName || user.email.split('@')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-20 animate-in slide-in-from-top-2 duration-200">
                      <Link
                        href={`/profile/${user.email.split('@')[0]}`}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl mx-2 transition-all duration-200 group"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">Mi Perfil</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl mx-2 transition-all duration-200 group"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">Configuración</span>
                      </Link>
                      <hr className="my-2 border-gray-200/50 mx-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 hover:text-red-700 rounded-xl mx-2 transition-all duration-200 group"
                      >
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">Cerrar Sesión</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" className="hover:scale-105 transition-transform duration-200">Iniciar Sesión</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" className="hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-gray-100/80 transition-all duration-300 group"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors duration-200" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors duration-200" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/50 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl mx-2 transition-all duration-300 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-medium shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
              
              <hr className="my-3 border-gray-200/50 mx-2" />
              
              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-4 border-b border-gray-200/50 mx-2 rounded-xl bg-gray-50/50">
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={`Foto de perfil de ${user.displayName || user.email}`}
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-blue-200"
                        priority
                        unoptimized
                      />
                    ) : (
                      <Image
                        src={getGravatarUrl(user.email)}
                        alt={`Foto de perfil de ${user.displayName || user.email}`}
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-blue-200"
                        priority
                        unoptimized
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {user.displayName || user.email.split('@')[0]}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="px-2 py-2 space-y-1">
                    <Link
                      href={`/profile/${user.email.split('@')[0]}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl transition-all duration-200 group"
                    >
                      <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Mi Perfil</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 rounded-xl transition-all duration-200 group"
                    >
                      <Settings className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Configuración</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 hover:text-red-700 rounded-xl transition-all duration-200 group"
                    >
                      <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Cerrar Sesión</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-2 py-2 space-y-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-center">Iniciar Sesión</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full justify-center">Registrarse</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}