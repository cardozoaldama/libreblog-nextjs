import md5 from 'md5'

// Generar slug desde título
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Hacer slug único agregando timestamp si es necesario
export function makeSlugUnique(baseSlug: string): string {
  const timestamp = Date.now().toString(36)
  return `${baseSlug}-${timestamp}`
}

// Obtener avatar (custom o Gravatar)
export function getAvatarUrl(email: string, avatarUrl?: string | null, size: number = 200): string {
  if (avatarUrl) return avatarUrl
  if (!email) return `https://www.gravatar.com/avatar/00000000000000000000000000000000?s=${size}&d=identicon`
  const hash = md5(email.trim().toLowerCase())
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
}

// Obtener Gravatar desde email (mantener para compatibilidad)
export function getGravatarUrl(email: string, size: number = 200): string {
  return getAvatarUrl(email, null, size)
}

// Formatear fecha
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

// Formatear fecha relativa (hace 2 horas, hace 3 días, etc.)
export function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)

  if (diffInSeconds < 60) return 'hace un momento'
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`
  if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} días`
  
  return formatDate(date)
}

// Truncar texto
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Extraer primer párrafo del contenido markdown
export function extractExcerpt(markdown: string, maxLength: number = 200): string {
  const plainText = markdown
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remover imágenes
    .replace(/\[.*?\]\(.*?\)/g, '') // Remover links
    .replace(/[#*_`~]/g, '') // Remover marcadores markdown
    .replace(/\n/g, ' ') // Reemplazar saltos de línea
    .trim()
  
  return truncateText(plainText, maxLength)
}

// Extraer ID de video de YouTube desde URL (incluyendo Shorts)
export function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Detectar tipo de video y generar embed
export function getVideoEmbed(url: string): { type: 'youtube' | 'tiktok' | 'facebook' | null; embedUrl: string | null } {
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

// Validar URL de imagen
export function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlObj.pathname)
  } catch {
    return false
  }
}

// Combinar clases de Tailwind
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}