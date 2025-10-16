import { NextRequest, NextResponse } from 'next/server'

// Lista de palabras clave NSFW (básica, se puede expandir)
const NSFW_KEYWORDS = [
  // Palabras explícitas en español e inglés
  'sexo', 'sexual', 'porn', 'pornografia', 'xxx', 'adulto', 'adultos',
  'desnudo', 'desnuda', 'desnudos', 'desnudas', 'nude', 'nudes',
  'explicito', 'explicita', 'explicit', 'nsfw', 'erotico', 'erotica',
  'fetiche', 'fetish', 'bdsm', 'violencia', 'violento', 'sangre',
  'drogas', 'drogas', 'marihuana', 'cocaína', 'heroína',
  'suicidio', 'suicidarse', 'matar', 'muerte', 'asesinato',
  'violar', 'violación', 'incesto', 'genocidio', 'tortura',
  'follar', 'follado', 'folles', 'coger', 'cogido', 'cogiendo',
  // Palabras en inglés
  'sex', 'sexual', 'porn', 'pornography', 'adult', 'nude', 'naked',
  'explicit', 'erotic', 'fetish', 'violence', 'violent', 'blood',
  'drugs', 'marijuana', 'cocaine', 'heroin', 'suicide', 'kill', 'death',
  'rape', 'incest', 'genocide', 'torture'
]

// Dominios conocidos por contenido NSFW (imágenes)
const NSFW_IMAGE_DOMAINS = [
  'pornhub.com', 'xvideos.com', 'redtube.com', 'youporn.com',
  'xhamster.com', 'tube8.com', 'beeg.com', 'tnaflix.com',
  'xtube.com', 'empflix.com', 'slutload.com', 'keezmovies.com',
  'imgur.com', 'reddit.com', '4chan.org', '8kun.top',
  'flickr.com', 'photobucket.com', 'imageshack.us', 'tinypic.com',
  'postimg.org', 'imgbb.com', 'freeimage.host', 'imgbox.com',
  // CDN domains
  'phncdn.com', 'xvideos-cdn.com', 'xnxx-cdn.com', 'xhcdn.com',
  // Additional NSFW sites
  'erome.com', 'manyvids.com', 'clips4sale.com', 'tmohentai.com',
  'perfectgirls.xxx', 'porndiff.com', 'xpaja.net', 'xgroovy.com',
  'puritanas.com', 'pictoa.com', 'xxxshame.com', 'youx.xxx',
  'hdroom.xxx', 'sexkomix2.com', 'hhpanel.org', 'ijuegosporno.com',
  'comicsflix.com', 'comicsparaadultos.com', 'rule34.xxx'
]

// Patrones de URLs de imágenes NSFW
const NSFW_IMAGE_PATTERNS = [
  /porn/i, /xxx/i, /adult/i, /sex/i, /nude/i, /naked/i,
  /fetish/i, /bdsm/i, /nsfw/i, /hentai/i, /anime/i,
  /boobs/i, /tits/i, /ass/i, /pussy/i, /dick/i, /cock/i,
  /cum/i, /fuck/i, /shit/i, /bitch/i, /whore/i
]

// Patrones de URLs sospechosas
const SUSPICIOUS_PATTERNS = [
  /porn/i, /xxx/i, /adult/i, /sex/i, /nude/i, /naked/i,
  /fetish/i, /bdsm/i, /violence/i, /gore/i
]

interface ModerationResult {
  isNSFW: boolean
  confidence: number
  reasons: string[]
  categories: string[]
  detectedContent: {
    text: string[]
    urls: string[]
    images: string[]
  }
}

/**
 * Analiza texto en busca de contenido NSFW
 */
function analyzeText(text: string): { isNSFW: boolean; confidence: number; reasons: string[]; detectedText: string[]; categories: string[] } {
  const detectedText: string[] = []
  const reasons: string[] = []
  const categories: string[] = []
  let confidence = 0

  const lowerText = text.toLowerCase()

  // Categorías de palabras clave
  const keywordCategories: Record<string, string[]> = {
    sexual: ['sexo', 'sexual', 'porn', 'pornografia', 'xxx', 'adulto', 'adultos', 'desnudo', 'desnuda', 'desnudos', 'desnudas', 'nude', 'nudes', 'explicito', 'explicita', 'explicit', 'nsfw', 'erotico', 'erotica', 'fetiche', 'fetish', 'bdsm', 'incesto', 'follar', 'follado', 'folles', 'coger', 'cogido', 'cogiendo', 'sex', 'porn', 'pornography', 'adult', 'nude', 'naked', 'explicit', 'erotic', 'fetish', 'incest'],
    violencia: ['violencia', 'violento', 'sangre', 'muerte', 'asesinato', 'matar', 'violar', 'violación', 'genocidio', 'tortura', 'violence', 'violent', 'blood', 'death', 'kill', 'suicide', 'suicidarse', 'rape', 'genocide', 'torture'],
    drogas: ['drogas', 'marihuana', 'cocaína', 'heroína', 'drugs', 'marijuana', 'cocaine', 'heroin']
  }

  // Buscar palabras clave
  for (const keyword of NSFW_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      detectedText.push(keyword)
      confidence += 0.3
      reasons.push(`Palabra clave detectada: ${keyword}`)

      // Asignar categoría
      for (const [category, words] of Object.entries(keywordCategories)) {
        if (words.includes(keyword.toLowerCase()) && !categories.includes(category)) {
          categories.push(category)
        }
      }
    }
  }

  // Buscar patrones sospechosos
  if (lowerText.includes('www.') || lowerText.includes('http')) {
    const urlMatches = lowerText.match(/https?:\/\/[^\s]+/g) || []
    for (const url of urlMatches) {
      if (SUSPICIOUS_PATTERNS.some(pattern => pattern.test(url))) {
        detectedText.push(url)
        confidence += 0.4
        reasons.push(`URL sospechosa detectada: ${url}`)
      }
    }
  }

  // Buscar menciones explícitas
  const explicitMentions = [
    /no\s+apto\s+para\s+menores/i,
    /contenido\s+adulto/i,
    /solo\s+adultos/i,
    /18\+/i,
    /nsfw/i
  ]

  for (const pattern of explicitMentions) {
    if (pattern.test(text)) {
      confidence += 0.5
      reasons.push('Menciones explícitas de contenido adulto')
    }
  }

  return {
    isNSFW: confidence >= 0.3,
    confidence: Math.min(confidence, 1),
    reasons,
    detectedText,
    categories
  }
}

/**
 * Analiza URLs en busca de contenido NSFW
 */
function analyzeUrls(text: string): { isNSFW: boolean; confidence: number; reasons: string[]; detectedUrls: string[]; categories: string[] } {
  const detectedUrls: string[] = []
  const reasons: string[] = []
  const categories: string[] = []
  let confidence = 0

  const urlRegex = /https?:\/\/[^\s]+/g
  const urls = text.match(urlRegex) || []

  for (const url of urls) {
    try {
      const urlObj = new URL(url)
      const domain = urlObj.hostname.toLowerCase()

      // Verificar dominios conocidos
      if (NSFW_IMAGE_DOMAINS.some(nsfwDomain => domain.includes(nsfwDomain))) {
        detectedUrls.push(url)
        confidence += 0.8
        reasons.push(`Dominio NSFW conocido: ${domain}`)
        if (!categories.includes('sexual')) categories.push('sexual')
      }

      // Verificar patrones en la URL
      if (SUSPICIOUS_PATTERNS.some(pattern => pattern.test(url))) {
        detectedUrls.push(url)
        confidence += 0.6
        reasons.push(`Patrón sospechoso en URL: ${url}`)
        if (!categories.includes('sospechoso')) categories.push('sospechoso')
      }
    } catch (error) {
      // URL inválida, ignorar
    }
  }

  return {
    isNSFW: confidence >= 0.3,
    confidence: Math.min(confidence, 1),
    reasons,
    detectedUrls,
    categories
  }
}

/**
 * Analiza imágenes usando detección básica gratuita (sin APIs externas)
 */
async function analyzeImages(imageUrls: string[]): Promise<{ isNSFW: boolean; confidence: number; reasons: string[]; detectedImages: string[]; categories: string[] }> {
  const detectedImages: string[] = []
  const reasons: string[] = []
  const categories: string[] = []
  let confidence = 0

  // Detección agresiva por URL, dominios y patrones
  for (const imageUrl of imageUrls) {
    const lowerUrl = imageUrl.toLowerCase()

    // Verificar dominios conocidos por contenido NSFW
    if (NSFW_IMAGE_DOMAINS.some(domain => lowerUrl.includes(domain))) {
      detectedImages.push(imageUrl)
      confidence += 0.9
      reasons.push(`Imagen de dominio NSFW conocido: ${imageUrl}`)
      if (!categories.includes('sexual')) categories.push('sexual')
    }

    // Verificar patrones NSFW en la URL completa
    if (NSFW_IMAGE_PATTERNS.some(pattern => pattern.test(lowerUrl))) {
      if (!detectedImages.includes(imageUrl)) {
        detectedImages.push(imageUrl)
        confidence += 0.8
        reasons.push(`URL de imagen con contenido NSFW: ${imageUrl}`)
        if (!categories.includes('sexual')) categories.push('sexual')
      }
    }

    // Verificar nombres de archivo muy sugerentes
    const filename = imageUrl.split('/').pop()?.split('?')[0] || ''
    const filenameSuggestivePatterns = [/nude/i, /porn/i, /sex/i, /xxx/i, /adult/i, /naked/i, /boobs/i, /tits/i, /ass/i, /pussy/i, /dick/i, /cock/i]
    if (filenameSuggestivePatterns.some(pattern => pattern.test(filename))) {
      if (!detectedImages.includes(imageUrl)) {
        detectedImages.push(imageUrl)
        confidence += 0.7
        reasons.push(`Nombre de archivo NSFW: ${filename}`)
        if (!categories.includes('sexual')) categories.push('sexual')
      }
    }

    // Verificar patrones en path de la URL
    const urlPath = imageUrl.split('?')[0] // quitar query params
    if (NSFW_IMAGE_PATTERNS.some(pattern => pattern.test(urlPath))) {
      if (!detectedImages.includes(imageUrl)) {
        detectedImages.push(imageUrl)
        confidence += 0.6
        reasons.push(`Path de imagen con contenido NSFW: ${imageUrl}`)
        if (!categories.includes('sospechoso')) categories.push('sospechoso')
      }
    }
  }

  return {
    isNSFW: confidence >= 0.3,
    confidence: Math.min(confidence, 1),
    reasons,
    detectedImages,
    categories
  }
}

/**
 * Extrae URLs de imágenes del texto markdown
 */
function extractImageUrls(text: string): string[] {
  const imageRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g
  const urls: string[] = []
  let match

  while ((match = imageRegex.exec(text)) !== null) {
    urls.push(match[1])
  }

  return urls
}

export async function POST(request: NextRequest) {
  try {
    const { content, title, images } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Contenido requerido' },
        { status: 400 }
      )
    }

    // Combinar título y contenido para análisis
    const fullText = `${title || ''} ${content}`.trim()
    
    // Extraer URLs de imágenes del contenido
    const imageUrls = extractImageUrls(content)
    const allImages = [...(images || []), ...imageUrls]

    // Analizar texto
    const textAnalysis = analyzeText(fullText)
    
    // Analizar URLs
    const urlAnalysis = analyzeUrls(fullText)
    
    // Analizar imágenes
    const imageAnalysis = await analyzeImages(allImages)

    // Combinar resultados
    const isNSFW = textAnalysis.isNSFW || urlAnalysis.isNSFW || imageAnalysis.isNSFW
    const confidence = Math.max(textAnalysis.confidence, urlAnalysis.confidence, imageAnalysis.confidence)
    const allReasons = [...textAnalysis.reasons, ...urlAnalysis.reasons, ...imageAnalysis.reasons]
    const allCategories = [...new Set([...textAnalysis.categories, ...urlAnalysis.categories, ...imageAnalysis.categories])]

    const result: ModerationResult = {
      isNSFW,
      confidence,
      reasons: allReasons,
      categories: allCategories,
      detectedContent: {
        text: textAnalysis.detectedText,
        urls: urlAnalysis.detectedUrls,
        images: imageAnalysis.detectedImages
      }
    }

    // Logging de métricas
    console.log(`[NSFW Moderation] Result: isNSFW=${isNSFW}, confidence=${confidence.toFixed(2)}, categories=[${allCategories.join(',')}], text_words=${textAnalysis.detectedText.length}, urls=${urlAnalysis.detectedUrls.length}, images=${imageAnalysis.detectedImages.length}`)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error en moderación NSFW:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
