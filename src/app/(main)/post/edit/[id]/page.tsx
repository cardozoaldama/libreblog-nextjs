'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { ArrowLeft, Save, Eye, Image as ImageIcon, Video, AlertTriangle } from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { use } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
}

interface Post {
  id: string
  title: string
  content: string
  slug: string
  imageUrl: string | null
  videoUrl: string | null
  categoryId: string | null
  isPublic: boolean
  isNSFW: boolean
  nsfwCategories: string[]
}

// Función auxiliar para validar URLs
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Función auxiliar para extraer ID de video de YouTube
const extractYouTubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Función auxiliar para detectar tipo de video y generar embed
const getVideoEmbed = (url: string): { type: 'youtube' | 'tiktok' | 'facebook' | null; embedUrl: string | null } => {
  // YouTube (videos normales, Shorts, listas, mixes)
  const youtubeId = extractYouTubeId(url)
  if (youtubeId) {
    // Extraer parámetros de lista si existen
    const listMatch = url.match(/[?&]list=([^&]+)/)
    const listParam = listMatch ? `?list=${listMatch[1]}` : ''
    return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${youtubeId}${listParam}` }
  }

  // TikTok
  const tiktokMatch = url.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)/)
  if (tiktokMatch) {
    return { type: 'tiktok', embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}` }
  }

  // Facebook Reels
  const facebookMatch = url.match(/facebook\.com\/reel\/(\d+)/)
  if (facebookMatch) {
    return { type: 'facebook', embedUrl: `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/${facebookMatch[1]}` }
  }

  return { type: null, embedUrl: null }
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params usando React.use()
  const { id } = use(params)

  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState('')
  const [forceModeration, setForceModeration] = useState(false)
  const [isNSFW, setIsNSFW] = useState(false)
  const [nsfwCategories, setNsfwCategories] = useState<string[]>([])
  const [isRecheckingNSFW, setIsRecheckingNSFW] = useState(false)
  const [recheckSuccess, setRecheckSuccess] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Función para forzar re-moderación del post
  const handleForceModeration = async () => {
    setIsRecheckingNSFW(true)
    setRecheckSuccess(false)
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setForceModeration(true)
          // Actualizar el estado NSFW local
          if (result.moderation) {
            setIsNSFW(result.moderation.isNSFW)
            setNsfwCategories(result.moderation.categories || [])
          }
          // Recargar el post para obtener los nuevos flags NSFW
          const postResponse = await fetch(`/api/posts/single/${id}`)
          if (postResponse.ok) {
            const postData = await postResponse.json()
            setPost(postData)
            setIsNSFW(postData.isNSFW)
            setNsfwCategories(postData.nsfwCategories || [])
          }
          setRecheckSuccess(true)
          setTimeout(() => setRecheckSuccess(false), 3000)
        }
      }
    } catch (err) {
      console.error('Error forcing moderation:', err)
    } finally {
      setIsRecheckingNSFW(false)
    }
  }

  // Cargar post y categorías
  useEffect(() => {
    async function loadData() {
      try {
        // Cargar categorías
        const catRes = await fetch('/api/categories')
        const catData = await catRes.json()
        setCategories(Array.isArray(catData) ? catData : [])

        // Cargar post
        const postRes = await fetch(`/api/posts/single/${id}`)
        if (!postRes.ok) {
          router.push('/dashboard')
          return
        }
        const postData = await postRes.json()
        setPost(postData)
        setTitle(postData.title)
        setContent(postData.content)
        setImageUrl(postData.imageUrl || '')
        setVideoUrl(postData.videoUrl || '')
        setCategoryId(postData.categoryId || '')
        setIsPublic(postData.isPublic)
        setIsNSFW(postData.isNSFW || false)
        setNsfwCategories(postData.nsfwCategories || [])

        // Forzar re-moderación automática al cargar la página de edición
        try {
          await fetch(`/api/posts/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
          setForceModeration(true)
        } catch (moderationError) {
          console.error('Error during automatic moderation on edit load:', moderationError)
        }
      } catch {
        console.error('Error loading data')
        setError('Error al cargar el post')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaveSuccess(false)
    setIsSaving(true)

    if (!title.trim() || !content.trim()) {
      setError('El título y el contenido son obligatorios')
      setIsSaving(false)
      return
    }

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          imageUrl: imageUrl || null,
          videoUrl: videoUrl || null,
          categoryId: categoryId || null,
          isPublic,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al actualizar el post')
      }

      const { post: updatedPost } = await res.json()
      
      // Actualizar estado NSFW local con los datos del post actualizado
      setIsNSFW(updatedPost.isNSFW || false)
      setNsfwCategories(updatedPost.nsfwCategories || [])
      setSaveSuccess(true)
      
      // Redirigir después de un breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        router.push(`/post/${updatedPost.slug}`)
      }, 1500)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error desconocido')
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Editar Post</h1>
          </div>
          <Button variant="ghost" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Editor' : 'Vista Previa'}
          </Button>
        </div>

        {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
        {error}
        </div>
        )}

        {saveSuccess && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900 mb-1">✅ Post guardado exitosamente</h3>
                <p className="text-sm text-green-800">
                  {isNSFW 
                    ? '⚠️ El contenido ha sido marcado como NSFW y tendrá filtros aplicados.'
                    : '✅ El contenido está limpio y no tiene filtros NSFW aplicados.'}
                </p>
                <p className="text-xs text-green-700 mt-1">Redirigiendo...</p>
              </div>
            </div>
          </div>
        )}

        {/* NSFW Status and Warning */}
        <div className="mb-6 space-y-4">
          {/* Current NSFW Status */}
          {isNSFW ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900 mb-1">⚠️ Este post está marcado como NSFW</h3>
                    <p className="text-sm text-red-800 mb-2">
                      El contenido actual ha sido detectado como censurable y tiene filtros aplicados.
                    </p>
                    {nsfwCategories.length > 0 && (
                      <div className="text-xs text-red-700 mb-2">
                        <strong>Categorías detectadas:</strong> {nsfwCategories.join(', ')}
                      </div>
                    )}
                    <p className="text-xs text-red-700">
                      💡 <strong>Para quitar el filtro:</strong> Edita el contenido eliminando las palabras o imágenes problemáticas y guarda el post. Se re-moderará automáticamente.
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleForceModeration}
                  disabled={isRecheckingNSFW}
                  className="flex-shrink-0"
                >
                  {isRecheckingNSFW ? 'Verificando...' : 'Re-verificar ahora'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-900 mb-1">✅ Este post NO está marcado como NSFW</h3>
                    <p className="text-sm text-green-800">
                      El contenido actual no contiene palabras o imágenes censuradas detectadas.
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleForceModeration}
                  disabled={isRecheckingNSFW}
                  className="flex-shrink-0"
                >
                  {isRecheckingNSFW ? 'Verificando...' : 'Verificar'}
                </Button>
              </div>
            </div>
          )}

          {recheckSuccess && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                ✅ Re-verificación completada. Estado NSFW actualizado.
              </p>
            </div>
          )}

          {/* Auto Re-moderation Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900 mb-1">🔄 Re-moderación Automática al Guardar</h3>
                <p className="text-sm text-yellow-800 mb-2">
                  Cuando guardes este post, se analizará automáticamente el contenido. Los filtros NSFW se aplicarán o quitarán según corresponda.
                </p>
                <p className="text-xs text-yellow-700 mb-2">
                  <strong>Palabras detectadas:</strong> follar, coger, violar, matar, drogas, URLs adultas, etc.
                </p>
                <Link href="/nsfw-rules" className="text-xs text-blue-600 hover:text-blue-700 underline">
                  Ver reglas completas de contenido NSFW →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className={showPreview ? 'hidden lg:block' : ''}>
            <Card variant="elevated">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">Editor</h2>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Título */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Un título atractivo para tu post..."
                      required
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent selectable"
                    />
                  </div>

                  {/* Categoría */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sin categoría</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Contenido Markdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenido (Markdown) *
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Escribe tu contenido en Markdown...&#10;&#10;**Negrita**, *cursiva*, # Títulos&#10;&#10;- Lista&#10;- De items&#10;&#10;```javascript&#10;// Código&#10;```"
                      required
                      rows={15}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm selectable"
                    />
                    <details className="mt-2">
                      <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-700 font-medium">
                        📖 Ver guía de Markdown
                      </summary>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs space-y-2">
                        <div><strong>Texto:</strong> **negrita** *cursiva* ~~tachado~~</div>
                        <div><strong>Títulos:</strong> # H1, ## H2, ### H3</div>
                        <div><strong>Listas:</strong> - item o 1. item</div>
                        <div><strong>Enlaces:</strong> [texto](url)</div>
                        <div><strong>Imágenes:</strong> ![alt](https://url.com/img.jpg)</div>
                        <div><strong>Código:</strong> `código` o ```lenguaje código```</div>
                        <div><strong>Citas:</strong> &gt; texto citado</div>
                        <div><strong>Línea:</strong> ---</div>
                      </div>
                    </details>
                  </div>

                  {/* URL de Imagen */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <ImageIcon className="w-4 h-4 inline mr-1" aria-hidden="true" />
                      Imagen de Portada (opcional)
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent selectable"
                    />
                    <p className="text-xs text-gray-500 mt-1">Imagen principal que aparecerá en la cabecera del post</p>
                  </div>

                  {/* URL de Video */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Video className="w-4 h-4 inline mr-1" />
                      Video Embebido (opcional)
                    </label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent selectable"
                    />
                    <p className="text-xs text-gray-500 mt-1">Soporta: YouTube, Shorts, TikTok, Facebook Reels</p>
                  </div>

                  {/* Público/Privado */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                      Hacer público (visible para todos)
                    </label>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-3 pt-4">
                  <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  className="flex-1"
                  >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                  <Button
                  type="button"
                    variant="secondary"
                      onClick={handleForceModeration}
                      disabled={forceModeration}
                      className="whitespace-nowrap"
                    >
                      🔍 {forceModeration ? 'Re-moderado' : 'Re-moderar'}
                    </Button>
                    <Link href="/dashboard">
                      <Button variant="outline">Cancelar</Button>
                    </Link>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Vista Previa */}
          <div className={!showPreview ? 'hidden lg:block' : ''}>
            <Card variant="elevated">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">Vista Previa</h2>
              </CardHeader>
              <CardBody>
                <article className="prose max-w-none">
                  <h1>{title || 'Tu título aquí'}</h1>
                  {imageUrl && isValidUrl(imageUrl) && (
                    <NextImage
                      src={imageUrl}
                      alt={title ? `Imagen del post: ${title}` : "Imagen de vista previa del post"}
                      width={800}
                      height={450}
                      className="rounded-lg"
                      unoptimized
                    />
                  )}
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content || '*Escribe algo para ver la vista previa...*'}
                  </ReactMarkdown>
                  {videoUrl && (() => {
                    const embed = getVideoEmbed(videoUrl)
                    return embed.embedUrl ? (
                      <div className={embed.type === 'tiktok' ? 'max-w-[325px] mx-auto' : 'aspect-video'}>
                        <iframe
                          src={embed.embedUrl}
                          className={`w-full rounded-lg ${embed.type === 'tiktok' ? 'h-[738px]' : 'h-full'}`}
                          allowFullScreen
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          title="Video preview"
                        />
                      </div>
                    ) : null
                  })()}
                </article>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}