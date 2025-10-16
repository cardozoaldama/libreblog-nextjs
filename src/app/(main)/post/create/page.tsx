'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { ArrowLeft, Save, Eye, Image as ImageIcon, Video } from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getVideoEmbed } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
}

export default function CreatePostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState('')

  // Cargar categorías
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error loading categories:', error)
        setCategories([])
      }
    }
    loadCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!title.trim() || !content.trim()) {
      setError('El título y el contenido son obligatorios')
      setIsLoading(false)
      return
    }

    try {
      // Primero, verificar si el contenido es NSFW
      const moderationRes = await fetch('/api/moderate/nsfw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          images: imageUrl ? [imageUrl] : []
        }),
      })

      let isNSFW = false
      let nsfwCategories: string[] = []
      if (moderationRes.ok) {
        const moderationData = await moderationRes.json()
        isNSFW = moderationData.isNSFW
        nsfwCategories = moderationData.categories || []
      }

      // Crear el post con la información NSFW
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        title,
        content,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        categoryId: categoryId || null,
        isPublic,
        isNSFW,
          nsfwCategories,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al crear el post')
      }

      const { post } = await res.json()
      router.push(`/post/${post.slug}`)
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError(String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform duration-200">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </Link>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden hover:scale-105 transition-transform duration-200"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Editor' : 'Vista Previa'}
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Crear Nuevo Post
            </h1>
            <p className="text-gray-600 text-lg">Comparte tus ideas con el mundo</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-800 px-6 py-4 rounded-2xl shadow-lg animate-in slide-in-from-top duration-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className={`${showPreview ? 'hidden lg:block' : ''} animate-in fade-in slide-in-from-left duration-500 delay-200`}>
            <Card variant="hover">
              <CardHeader>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">✍️ Editor</h2>
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
                      className="w-full px-4 py-3 border-2 border-gray-300/50 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400/50 selectable"
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
                      className="w-full px-4 py-3 border-2 border-gray-300/50 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400/50"
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
                      className="w-full px-4 py-3 border-2 border-gray-300/50 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm transition-all duration-300 hover:border-gray-400/50 selectable"
                    />
                    <details className="mt-2">
                      <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-700 font-medium">
                        📖 Ver guía de Markdown
                      </summary>
                      <div className="mt-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 text-xs space-y-2">
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
                      className="w-full px-4 py-3 border-2 border-gray-300/50 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400/50 selectable"
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
                      className="w-full px-4 py-3 border-2 border-gray-300/50 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400/50 selectable"
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
                      isLoading={isLoading}
                      className="flex-1 shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Guardando...' : 'Publicar'}
                    </Button>
                    <Link href="/dashboard">
                      <Button variant="outline" className="hover:scale-105 transition-transform duration-200">Cancelar</Button>
                    </Link>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Vista Previa */}
          <div className={`${!showPreview ? 'hidden lg:block' : ''} animate-in fade-in slide-in-from-right duration-500 delay-300`}>
            <Card variant="hover">
              <CardHeader>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">👁️ Vista Previa</h2>
              </CardHeader>
              <CardBody>
                <article className="prose max-w-none">
                  <h1>{title || 'Tu título aquí'}</h1>
                  {imageUrl && (
                    <NextImage
                      src={imageUrl}
                      alt={title ? `Imagen del post: ${title}` : "Imagen de vista previa del post"}
                      className="rounded-lg"
                      width={800}
                      height={450}
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