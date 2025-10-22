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
import CreatorGuide from '@/components/post/CreatorGuide'
import SearchableTextarea from '@/components/editor/SearchableTextarea'

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
  const [isNSFW, setIsNSFW] = useState(false)
  const [allowPdfDownload, setAllowPdfDownload] = useState(true)
  const [allowComments, setAllowComments] = useState(true)
  const [enablePagination, setEnablePagination] = useState(false)
  const [showTableOfContents, setShowTableOfContents] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showPreviewColumn, setShowPreviewColumn] = useState(true)
  const [previewPage, setPreviewPage] = useState(0)
  const [error, setError] = useState('')

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
        setAllowPdfDownload(postData.allowPdfDownload ?? true)
        setAllowComments(postData.allowComments ?? true)
        setEnablePagination(postData.enablePagination ?? false)
        setShowTableOfContents(postData.showTableOfContents ?? true)
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
          isNSFW,
          allowPdfDownload,
          allowComments,
          enablePagination,
          showTableOfContents,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al actualizar el post')
      }

      const { post: updatedPost } = await res.json()
      router.push(`/post/${updatedPost.slug}`)
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
          <NextImage
            src="/loading.gif"
            alt="Cargando"
            width={48}
            height={48}
            className="mx-auto mb-4"
            unoptimized
          />
          <p className="text-gray-600">Cargando post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Editar Post</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Editor' : 'Vista Previa'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowPreviewColumn(!showPreviewColumn)}
              className="hidden lg:flex"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreviewColumn ? 'Ocultar Preview' : 'Mostrar Preview'}
            </Button>
          </div>
        </div>

        {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
        {error}
        </div>
        )}



        <div className={`grid grid-cols-1 gap-4 sm:gap-6 ${showPreviewColumn ? 'lg:grid-cols-2' : ''}`}>
          {/* Editor */}
          <div className={showPreview ? 'hidden lg:block' : ''}>
            <Card variant="elevated">
              <CardHeader>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Editor</h2>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
                    <SearchableTextarea
                      value={content}
                      onChange={setContent}
                      placeholder="Escribe tu contenido en Markdown...&#10;&#10;**Negrita**, *cursiva*, # Títulos&#10;&#10;- Lista&#10;- De items&#10;&#10;```javascript&#10;// Código&#10;```"
                      rows={20}
                    />
                    <details className="mt-2">
                      <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-700 font-medium">
                        📖 Ver guía de Markdown
                      </summary>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs space-y-3">
                        <div className="space-y-1">
                          <strong className="text-blue-600">Texto:</strong>
                          <code className="block bg-blue-50 p-2 rounded select-all">**negrita** *cursiva* ~~tachado~~</code>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-blue-600">Títulos:</strong>
                          <code className="block bg-blue-50 p-2 rounded select-all"># H1{"\n"}## H2{"\n"}### H3</code>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-blue-600">Listas:</strong>
                          <code className="block bg-blue-50 p-2 rounded select-all">- Item 1{"\n"}1. Item numerado</code>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-blue-600">Enlaces:</strong>
                          <code className="block bg-blue-50 p-2 rounded select-all">[texto](https://url.com)</code>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-blue-600">Imágenes:</strong>
                          <code className="block bg-blue-50 p-2 rounded select-all">![descripción](https://url.com/img.jpg)</code>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-blue-600">Código:</strong>
                          <code className="block bg-blue-50 p-2 rounded select-all">`código inline`{"\n"}```javascript{"\n"}// bloque de código{"\n"}```</code>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-blue-600">Citas:</strong>
                          <code className="block bg-blue-50 p-2 rounded select-all">&gt; Texto citado</code>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-blue-600">Separador de página:</strong>
                          <code className="block bg-blue-50 p-2 rounded select-all">---PAGE---</code>
                          <p className="text-gray-500 text-[10px] italic">Divide tu post en páginas (requiere activar paginación)</p>
                        </div>
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

                  {/* Opciones Principales */}
                  <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">⚙️ Configuración Principal</h3>
                    
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
                        🌍 Hacer público (visible para todos)
                      </label>
                    </div>

                    {/* Contenido NSFW */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isNSFW"
                        checked={isNSFW}
                        onChange={(e) => setIsNSFW(e.target.checked)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <label htmlFor="isNSFW" className="text-sm font-medium text-gray-700">
                        🔞 Marcar como contenido NSFW (18+)
                      </label>
                    </div>
                  </div>

                  {/* Opciones Avanzadas (Colapsable) */}
                  <details className="group">
                    <summary className="cursor-pointer list-none">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
                        <span className="text-sm font-bold text-gray-800">🔧 Opciones Avanzadas</span>
                        <svg
                          className="w-5 h-5 text-gray-600 transition-transform duration-200 group-open:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </summary>
                    
                    <div className="mt-3 p-4 bg-white rounded-xl border border-gray-200 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      {/* Permitir descarga PDF */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="allowPdfDownload"
                          checked={allowPdfDownload}
                          onChange={(e) => setAllowPdfDownload(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="allowPdfDownload" className="text-sm font-medium text-gray-700">
                          📄 Permitir descarga en PDF
                        </label>
                      </div>

                      {/* Permitir comentarios */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="allowComments"
                          checked={allowComments}
                          onChange={(e) => setAllowComments(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="allowComments" className="text-sm font-medium text-gray-700">
                          💬 Permitir comentarios
                        </label>
                      </div>

                      {/* Dividir en páginas */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="enablePagination"
                          checked={enablePagination}
                          onChange={(e) => setEnablePagination(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="enablePagination" className="text-sm font-medium text-gray-700">
                          📑 Dividir post en páginas
                        </label>
                      </div>

                      {/* Mostrar tabla de contenidos */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="showTableOfContents"
                          checked={showTableOfContents}
                          onChange={(e) => setShowTableOfContents(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="showTableOfContents" className="text-sm font-medium text-gray-700">
                          📋 Mostrar índice de contenidos
                        </label>
                      </div>
                    </div>
                  </details>

                  {isNSFW && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-red-800 mb-1">
                            Contenido para adultos
                          </p>
                          <p className="text-red-700 mb-2">
                            Este contenido está marcado como NSFW y aparecerá con filtros de protección para otros usuarios.
                          </p>
                          <Link
                            href="/nsfw-rules"
                            className="inline-flex items-center gap-1 text-red-700 hover:text-red-800 font-medium underline"
                          >
                            📋 Leer reglas de contenido NSFW
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botones */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSaving}
                      className="flex-1"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                    <Link href="/dashboard" className="w-full sm:w-auto">
                      <Button variant="outline" className="w-full">Cancelar</Button>
                    </Link>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Vista Previa */}
          {showPreviewColumn && (
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
                  {(() => {
                    const pages = (content || '*Escribe algo para ver la vista previa...*').split('---PAGE---')
                    
                    if (enablePagination && pages.length > 1) {
                      return (
                        <>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{pages[previewPage]}</ReactMarkdown>
                          <div className="mt-6 flex items-center justify-between border-t-2 border-gray-200 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setPreviewPage(p => Math.max(0, p - 1))}
                              disabled={previewPage === 0}
                              size="sm"
                            >
                              ← Anterior
                            </Button>
                            <span className="text-sm text-gray-600 font-medium">
                              Página {previewPage + 1} de {pages.length}
                            </span>
                            <Button
                              variant="outline"
                              onClick={() => setPreviewPage(p => Math.min(pages.length - 1, p + 1))}
                              disabled={previewPage === pages.length - 1}
                              size="sm"
                            >
                              Siguiente →
                            </Button>
                          </div>
                        </>
                      )
                    }
                    
                    return pages.map((page, index) => (
                      <div key={index}>
                        {index > 0 && (
                          <div className="my-4 sm:my-6 lg:my-8 flex items-center gap-2 sm:gap-3">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                            <span className="text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">Página {index + 1}</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                          </div>
                        )}
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{page}</ReactMarkdown>
                      </div>
                    ))
                  })()}
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
          )}
        </div>

        {/* Guía para Creadores */}
        <div className="mt-8">
          <CreatorGuide />
        </div>
      </div>
    </div>
  )
}