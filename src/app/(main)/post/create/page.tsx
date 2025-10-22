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
import { getVideoEmbed } from '@/lib/utils'
import CreatorGuide from '@/components/post/CreatorGuide'
import SearchableTextarea from '@/components/editor/SearchableTextarea'

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
  const [isNSFW, setIsNSFW] = useState(false)
  const [allowPdfDownload, setAllowPdfDownload] = useState(true)
  const [allowComments, setAllowComments] = useState(true)
  const [enablePagination, setEnablePagination] = useState(false)
  const [showTableOfContents, setShowTableOfContents] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showPreviewColumn, setShowPreviewColumn] = useState(true)
  const [previewPage, setPreviewPage] = useState(0)
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
          allowPdfDownload,
          allowComments,
          enablePagination,
          showTableOfContents,
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
    <div className="min-h-screen bg-gradient-to-br from-[#dedff1] via-[#dedff1] to-[#5f638f]/20 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform duration-200">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </Link>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="lg:hidden hover:scale-105 transition-transform duration-200"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Editor' : 'Vista Previa'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreviewColumn(!showPreviewColumn)}
                className="hidden lg:flex hover:scale-105 transition-transform duration-200"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreviewColumn ? 'Ocultar Preview' : 'Mostrar Preview'}
              </Button>
            </div>
          </div>
          <div className="text-center w-full">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#0c2b4d] via-[#36234e] to-[#5f638f] bg-clip-text text-transparent mb-2">
              Crear Nuevo Post
            </h1>
            <p className="text-[#000022]/70 text-sm sm:text-base lg:text-lg">Comparte tus ideas con el mundo</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl shadow-lg animate-in slide-in-from-top duration-300">
            {error}
          </div>
        )}

        <div className={`grid grid-cols-1 gap-4 sm:gap-6 ${showPreviewColumn ? 'lg:grid-cols-2' : ''}`}>
          {/* Editor */}
          <div className={`${showPreview ? 'hidden lg:block' : ''} animate-in fade-in slide-in-from-left duration-500 delay-200`}>
            <Card variant="hover">
              <CardHeader>
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#0c2b4d] to-[#5f638f] bg-clip-text text-transparent">✍️ Editor</h2>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  {/* Título */}
                  <div>
                    <label className="block text-sm font-medium text-[#000022] mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Un título atractivo para tu post..."
                      required
                      className="w-full px-4 py-3 border-2 border-[#5f638f]/30 rounded-xl bg-white/80 focus:ring-2 focus:ring-[#0c2b4d] focus:border-transparent transition-all duration-300 hover:border-[#5f638f]/50 selectable"
                    />
                  </div>

                  {/* Categoría */}
                  <div>
                    <label className="block text-sm font-medium text-[#000022] mb-2">
                      Categoría
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#5f638f]/30 rounded-xl bg-white/80 focus:ring-2 focus:ring-[#0c2b4d] focus:border-transparent transition-all duration-300 hover:border-[#5f638f]/50"
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
                    <label className="block text-sm font-medium text-[#000022] mb-2">
                      Contenido (Markdown) *
                    </label>
                    <SearchableTextarea
                      value={content}
                      onChange={setContent}
                      placeholder="Escribe tu contenido en Markdown...&#10;&#10;**Negrita**, *cursiva*, # Títulos&#10;&#10;- Lista&#10;- De items&#10;&#10;```javascript&#10;// Código&#10;```"
                      rows={20}
                    />
                    <details className="mt-2">
                      <summary className="text-xs text-[#0c2b4d] cursor-pointer hover:text-[#36234e] font-medium">
                        📖 Ver guía de Markdown
                      </summary>
                      <div className="mt-2 p-4 bg-white/80 rounded-xl border border-[#5f638f]/20 text-xs space-y-3">
                        <div className="space-y-1">
                          <strong className="text-[#0c2b4d]">Texto:</strong>
                          <code className="block bg-[#0c2b4d]/10 p-2 rounded select-all">**negrita** *cursiva* ~~tachado~~</code>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-[#0c2b4d]">Títulos:</strong>
                          <code className="block bg-[#0c2b4d]/10 p-2 rounded select-all"># H1{"\n"}## H2{"\n"}### H3</code>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-[#0c2b4d]">Listas:</strong>
                          <code className="block bg-[#0c2b4d]/10 p-2 rounded select-all">- Item 1{"\n"}1. Item numerado</code>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-[#0c2b4d]">Enlaces:</strong>
                          <code className="block bg-[#0c2b4d]/10 p-2 rounded select-all">[texto](https://url.com)</code>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-[#0c2b4d]">Imágenes:</strong>
                          <code className="block bg-[#0c2b4d]/10 p-2 rounded select-all">![descripción](https://url.com/img.jpg)</code>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-[#0c2b4d]">Código:</strong>
                          <code className="block bg-[#0c2b4d]/10 p-2 rounded select-all">`código inline`{"\n"}```javascript{"\n"}// bloque de código{"\n"}```</code>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-[#0c2b4d]">Citas:</strong>
                          <code className="block bg-[#0c2b4d]/10 p-2 rounded select-all">&gt; Texto citado</code>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-[#0c2b4d]">Separador de página:</strong>
                          <code className="block bg-[#0c2b4d]/10 p-2 rounded select-all">---PAGE---</code>
                          <p className="text-[#5f638f] text-[10px] italic">Divide tu post en páginas (requiere activar paginación)</p>
                        </div>
                      </div>
                    </details>
                  </div>

                  {/* URL de Imagen */}
                  <div>
                    <label className="block text-sm font-medium text-[#000022] mb-2">
                      <ImageIcon className="w-4 h-4 inline mr-1" aria-hidden="true" />
                      Imagen de Portada (opcional)
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="w-full px-4 py-3 border-2 border-[#5f638f]/30 rounded-xl bg-white/80 focus:ring-2 focus:ring-[#0c2b4d] focus:border-transparent transition-all duration-300 hover:border-[#5f638f]/50 selectable"
                    />
                    <p className="text-xs text-[#5f638f] mt-1">Imagen principal que aparecerá en la cabecera del post</p>
                  </div>

                  {/* URL de Video */}
                  <div>
                    <label className="block text-sm font-medium text-[#000022] mb-2">
                      <Video className="w-4 h-4 inline mr-1" />
                      Video Embebido (opcional)
                    </label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#5f638f]/30 rounded-xl bg-white/80 focus:ring-2 focus:ring-[#0c2b4d] focus:border-transparent transition-all duration-300 hover:border-[#5f638f]/50 selectable"
                    />
                    <p className="text-xs text-[#5f638f] mt-1">Soporta: YouTube, Shorts, TikTok, Facebook Reels</p>
                    </div>

                    {/* Opciones Principales */}
                    <div className="space-y-3 p-4 bg-gradient-to-r from-[#0c2b4d]/5 to-[#36234e]/5 rounded-xl border-2 border-[#5f638f]/20">
                      <h3 className="text-sm font-bold text-[#0c2b4d] mb-3">⚙️ Configuración Principal</h3>
                      
                      {/* Público/Privado */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isPublic"
                          checked={isPublic}
                          onChange={(e) => setIsPublic(e.target.checked)}
                          className="w-4 h-4 text-[#0c2b4d] border-[#5f638f]/30 rounded focus:ring-[#0c2b4d]"
                        />
                        <label htmlFor="isPublic" className="text-sm font-medium text-[#000022]">
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
                          className="w-4 h-4 text-red-600 border-[#5f638f]/30 rounded focus:ring-red-500"
                        />
                        <label htmlFor="isNSFW" className="text-sm font-medium text-[#000022]">
                          🔞 Marcar como contenido NSFW (18+)
                        </label>
                      </div>
                    </div>

                    {/* Opciones Avanzadas (Colapsable) */}
                    <details className="group">
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#dedff1]/50 to-[#5f638f]/10 rounded-xl border-2 border-[#5f638f]/20 hover:border-[#5f638f]/40 transition-all duration-200 hover:shadow-lg">
                          <span className="text-sm font-bold text-[#0c2b4d]">🔧 Opciones Avanzadas</span>
                          <svg
                            className="w-5 h-5 text-[#5f638f] transition-transform duration-200 group-open:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </summary>
                      
                      <div className="mt-3 p-4 bg-white/80 rounded-xl border-2 border-[#5f638f]/20 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* Permitir descarga PDF */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="allowPdfDownload"
                            checked={allowPdfDownload}
                            onChange={(e) => setAllowPdfDownload(e.target.checked)}
                            className="w-4 h-4 text-[#0c2b4d] border-[#5f638f]/30 rounded focus:ring-[#0c2b4d]"
                          />
                          <label htmlFor="allowPdfDownload" className="text-sm font-medium text-[#000022]">
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
                            className="w-4 h-4 text-[#0c2b4d] border-[#5f638f]/30 rounded focus:ring-[#0c2b4d]"
                          />
                          <label htmlFor="allowComments" className="text-sm font-medium text-[#000022]">
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
                            className="w-4 h-4 text-[#0c2b4d] border-[#5f638f]/30 rounded focus:ring-[#0c2b4d]"
                          />
                          <label htmlFor="enablePagination" className="text-sm font-medium text-[#000022]">
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
                            className="w-4 h-4 text-[#0c2b4d] border-[#5f638f]/30 rounded focus:ring-[#0c2b4d]"
                          />
                          <label htmlFor="showTableOfContents" className="text-sm font-medium text-[#000022]">
                            📋 Mostrar índice de contenidos
                          </label>
                        </div>
                      </div>
                    </details>

                    {/* Advertencia si está marcado como NSFW */}
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
                      isLoading={isLoading}
                      className="flex-1 shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Guardando...' : 'Publicar'}
                    </Button>
                    <Link href="/dashboard" className="w-full sm:w-auto">
                      <Button variant="outline" className="w-full hover:scale-105 transition-transform duration-200">Cancelar</Button>
                    </Link>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Vista Previa */}
          {showPreviewColumn && (
          <div className={`${!showPreview ? 'hidden lg:block' : ''} animate-in fade-in slide-in-from-right duration-500 delay-300`}>
            <Card variant="hover">
              <CardHeader>
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#0c2b4d] to-[#5f638f] bg-clip-text text-transparent">👁️ Vista Previa</h2>
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
                  {(() => {
                    const pages = (content || '*Escribe algo para ver la vista previa...*').split('---PAGE---')
                    
                    if (enablePagination && pages.length > 1) {
                      return (
                        <>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{pages[previewPage]}</ReactMarkdown>
                          <div className="mt-6 flex items-center justify-between border-t-2 border-[#5f638f]/20 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setPreviewPage(p => Math.max(0, p - 1))}
                              disabled={previewPage === 0}
                              size="sm"
                            >
                              ← Anterior
                            </Button>
                            <span className="text-sm text-[#5f638f] font-medium">
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
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#5f638f]/30 to-transparent" />
                            <span className="text-xs sm:text-sm font-medium text-[#5f638f] bg-[#dedff1]/50 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">Página {index + 1}</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#5f638f]/30 to-transparent" />
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
        <div className="mt-8 animate-in fade-in slide-in-from-bottom duration-500 delay-500">
          <CreatorGuide />
        </div>
      </div>
    </div>
  )
}