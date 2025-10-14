'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { User, Save, ArrowLeft, Globe, Facebook, Instagram, Linkedin, Github, ChevronDown, ChevronUp } from 'lucide-react'
import { getGravatarUrl } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import UsernameSection from '@/components/settings/UsernameSection'
import PublicEmailSection from '@/components/settings/PublicEmailSection'

interface UserData {
  id: string
  email: string
  username: string
  publicEmail: string | null
  usernameLastChanged: Date | null
  displayName: string | null
  bio: string | null
  avatarUrl: string | null
  websiteUrl: string | null
  githubUrl: string | null
  facebookUrl: string | null
  instagramUrl: string | null
  xUrl: string | null
  tiktokUrl: string | null
  linkedinUrl: string | null
}

export default function EditProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [xUrl, setXUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [showSocialLinks, setShowSocialLinks] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient()
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !authUser) {
          router.push('/login')
          return
        }

        const res = await fetch(`/api/users/${authUser.id}`)
        if (!res.ok) throw new Error('Error al cargar usuario')
        
        const userData = await res.json()
        setUser(userData)
        setDisplayName(userData.displayName || '')
        setBio(userData.bio || '')
        setAvatarUrl(userData.avatarUrl || '')
        setWebsiteUrl(userData.websiteUrl || '')
        setGithubUrl(userData.githubUrl || '')
        setFacebookUrl(userData.facebookUrl || '')
        setInstagramUrl(userData.instagramUrl || '')
        setXUrl(userData.xUrl || '')
        setTiktokUrl(userData.tiktokUrl || '')
        setLinkedinUrl(userData.linkedinUrl || '')
      } catch (error) {
        console.error('Error:', error)
        setMessage({ type: 'error', text: 'Error al cargar los datos' })
      }
    }
    loadUser()
  }, [router])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setIsSaving(true)

    try {
      if (!user?.id) throw new Error('No se encontró información del usuario')

      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          displayName: displayName.trim() || null, 
          bio: bio.trim() || null, 
          avatarUrl: avatarUrl.trim() || null,
          websiteUrl: websiteUrl.trim() || null,
          githubUrl: githubUrl.trim() || null,
          facebookUrl: facebookUrl.trim() || null,
          instagramUrl: instagramUrl.trim() || null,
          xUrl: xUrl.trim() || null,
          tiktokUrl: tiktokUrl.trim() || null,
          linkedinUrl: linkedinUrl.trim() || null,
        }),
      })

      if (!res.ok) throw new Error('Error al actualizar')

      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' })
      setTimeout(() => window.location.href = `/profile/${user.username}`, 1000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar el perfil' })
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  const gravatarUrl = getGravatarUrl(user.email)
  const isValidUrl = (url: string): boolean => {
    if (!url || !url.trim()) return false
    try {
      new URL(url)
      return url.startsWith('http')
    } catch {
      return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/settings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Configuración
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Editar Perfil</h1>
          <p className="text-gray-600">Personaliza cómo te ven los demás</p>
        </div>

        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Username Section */}
        <div className="mb-6">
          <UsernameSection
            currentUsername={user.username}
            usernameLastChanged={user.usernameLastChanged}
            onUpdate={async (username) => {
              try {
                const res = await fetch(`/api/users/${user.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username })
                })
                if (!res.ok) throw new Error('Error al actualizar username')
                setMessage({ type: 'success', text: 'Username actualizado' })
                setTimeout(() => window.location.reload(), 1000)
              } catch (error) {
                setMessage({ type: 'error', text: 'Error al actualizar username' })
              }
            }}
          />
        </div>

        {/* Public Email Section */}
        <div className="mb-6">
          <PublicEmailSection
            currentPublicEmail={user.publicEmail}
            accountEmail={user.email}
            onUpdate={async (publicEmail) => {
              try {
                const res = await fetch(`/api/users/${user.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ publicEmail })
                })
                if (!res.ok) throw new Error('Error al actualizar')
                setMessage({ type: 'success', text: 'Email público actualizado' })
                setTimeout(() => window.location.reload(), 1000)
              } catch (error) {
                setMessage({ type: 'error', text: 'Error al actualizar' })
              }
            }}
          />
        </div>

        {/* Profile Info */}
        <Card variant="elevated" className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Información del Perfil</h2>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center gap-6">
                <Image
                  src={isValidUrl(avatarUrl) ? avatarUrl : gravatarUrl}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-gray-100"
                  unoptimized
                />
                <div>
                  <h3 className="font-semibold text-gray-900">@{user.username}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {avatarUrl ? 'Foto personalizada' : 'Foto de Gravatar'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de Foto de Perfil (opcional)
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://ejemplo.com/mi-foto.jpg"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre para mostrar
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este nombre aparecerá en tu perfil. Puedes cambiarlo cuando quieras.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biografía (soporta Markdown)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Cuéntanos sobre ti..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {bio.length}/500 caracteres
                </p>
              </div>

              {/* Social Links */}
              <div className="border-2 border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => setShowSocialLinks(!showSocialLinks)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-sm font-semibold text-gray-900">Redes Sociales (opcional)</h3>
                  {showSocialLinks ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {showSocialLinks && (
                  <div className="p-4 pt-0 space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Globe className="w-4 h-4" /> Sitio Web
                      </label>
                      <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://tusitio.com"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Github className="w-4 h-4" /> GitHub
                      </label>
                      <input
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/tuperfil"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Facebook className="w-4 h-4" /> Facebook
                      </label>
                      <input
                        type="url"
                        value={facebookUrl}
                        onChange={(e) => setFacebookUrl(e.target.value)}
                        placeholder="https://facebook.com/tuperfil"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Instagram className="w-4 h-4" /> Instagram
                      </label>
                      <input
                        type="url"
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        placeholder="https://instagram.com/tuperfil"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Linkedin className="w-4 h-4" /> LinkedIn
                      </label>
                      <input
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/tuperfil"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
                className="w-full md:w-auto"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
