import { NextRequest, NextResponse } from 'next/server'
import { ImageAnnotatorClient } from '@google-cloud/vision'

// Lista de palabras clave NSFW (básica, se puede expandir)
const NSFW_KEYWORDS = [
  // Palabras explícitas en español e inglés
  'sexo', 'sexual', 'porn', 'pornografia', 'xxx', 'adulto', 'adultos',
  'desnudo', 'desnuda', 'desnudos', 'desnudas', 'nude', 'nudes',
  'explicito', 'explicita', 'explicit', 'nsfw', 'erotico', 'erotica',
  'fetiche', 'fetish', 'bdsm', 'violencia', 'violento', 'sangre',
  'drogas', 'drogas', 'marihuana', 'cocaína', 'heroína', 'alcohol',
  'suicidio', 'suicidarse', 'matar', 'muerte', 'asesinato',
  // Palabras en inglés
  'sex', 'sexual', 'porn', 'pornography', 'adult', 'nude', 'naked',
  'explicit', 'erotic', 'fetish', 'violence', 'violent', 'blood',
  'drugs', 'marijuana', 'cocaine', 'heroin', 'suicide', 'kill', 'death'
]

// Dominios conocidos por contenido NSFW
const NSFW_DOMAINS = [
  'pornhub.com', 'xvideos.com', 'redtube.com', 'youporn.com',
  'xhamster.com', 'tube8.com', 'beeg.com', 'tnaflix.com',
  'xtube.com', 'empflix.com', 'slutload.com', 'keezmovies.com'
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
    sexual: ['sexo', 'sexual', 'porn', 'pornografia', 'xxx', 'adulto', 'adultos', 'desnudo', 'desnuda', 'desnudos', 'desnudas', 'nude', 'nudes', 'explicito', 'explicita', 'explicit', 'nsfw', 'erotico', 'erotica', 'fetiche', 'fetish', 'bdsm', 'sex', 'porn', 'pornography', 'adult', 'nude', 'naked', 'explicit', 'erotic', 'fetish'],
    violencia: ['violencia', 'violento', 'sangre', 'muerte', 'asesinato', 'matar', 'violence', 'violent', 'blood', 'death', 'kill', 'suicide', 'suicidarse'],
    drogas: ['drogas', 'marihuana', 'cocaína', 'heroína', 'alcohol', 'drugs', 'marijuana', 'cocaine', 'heroin']
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
    isNSFW: confidence > 0.3,
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
      if (NSFW_DOMAINS.some(nsfwDomain => domain.includes(nsfwDomain))) {
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
    isNSFW: confidence > 0.3,
    confidence: Math.min(confidence, 1),
    reasons,
    detectedUrls,
    categories
  }
}

/**
 * Analiza imágenes usando Google Vision API para detección de contenido NSFW
 */
async function analyzeImages(imageUrls: string[]): Promise<{ isNSFW: boolean; confidence: number; reasons: string[]; detectedImages: string[]; categories: string[] }> {
  const detectedImages: string[] = []
  const reasons: string[] = []
  const categories: string[] = []
  let confidence = 0

  // Si no hay API key, usar detección básica por URL
  if (!process.env.GOOGLE_VISION_API_KEY) {
    console.warn('GOOGLE_VISION_API_KEY no configurada, usando detección básica por URL')

    for (const imageUrl of imageUrls) {
      if (SUSPICIOUS_PATTERNS.some(pattern => pattern.test(imageUrl))) {
        detectedImages.push(imageUrl)
        confidence += 0.5
        reasons.push(`URL de imagen sospechosa: ${imageUrl}`)
        categories.push('sospechoso')
      }
    }

    return {
      isNSFW: confidence > 0.3,
      confidence: Math.min(confidence, 1),
      reasons,
      detectedImages,
      categories
    }
  }

  try {
    // Inicializar cliente de Google Vision
    const client = new ImageAnnotatorClient({
      apiKey: process.env.GOOGLE_VISION_API_KEY
    })

    for (const imageUrl of imageUrls) {
      try {
        // Analizar imagen con Google Vision
        const [result] = await client.safeSearchDetection(imageUrl)
        const safeSearch = result.safeSearchAnnotation

        if (!safeSearch) continue

        // Evaluar niveles de seguridad
        const adultLikelihood = safeSearch.adult || 'UNKNOWN'
        const violenceLikelihood = safeSearch.violence || 'UNKNOWN'
        const racyLikelihood = safeSearch.racy || 'UNKNOWN'

        // Mapeo de likelihood a valores numéricos
        const likelihoodToScore = {
          'UNKNOWN': 0,
          'VERY_UNLIKELY': 0.1,
          'UNLIKELY': 0.3,
          'POSSIBLE': 0.6,
          'LIKELY': 0.8,
          'VERY_LIKELY': 0.9
        }

        const adultScore = likelihoodToScore[adultLikelihood] || 0
        const violenceScore = likelihoodToScore[violenceLikelihood] || 0
        const racyScore = likelihoodToScore[racyLikelihood] || 0

        // Si algún score es alto, marcar como NSFW
        const maxScore = Math.max(adultScore, violenceScore, racyScore)

        if (maxScore >= 0.7) {
          detectedImages.push(imageUrl)
          confidence += maxScore

          if (adultScore >= 0.7) {
            reasons.push(`Contenido adulto detectado en imagen (${adultLikelihood.toLowerCase()})`)
            categories.push('adulto')
          }
          if (violenceScore >= 0.7) {
            reasons.push(`Contenido violento detectado en imagen (${violenceLikelihood.toLowerCase()})`)
            categories.push('violencia')
          }
          if (racyScore >= 0.7) {
            reasons.push(`Contenido sugerente detectado en imagen (${racyLikelihood.toLowerCase()})`)
            categories.push('sugerente')
          }
        }
      } catch (error) {
        console.error(`Error analizando imagen ${imageUrl}:`, error)

        // Fallback: verificar URL por patrones
        if (SUSPICIOUS_PATTERNS.some(pattern => pattern.test(imageUrl))) {
          detectedImages.push(imageUrl)
          confidence += 0.4
          reasons.push(`URL de imagen sospechosa (fallback): ${imageUrl}`)
          categories.push('sospechoso')
        }
      }
    }
  } catch (error) {
    console.error('Error inicializando Google Vision API:', error)

    // Fallback completo: detección básica por URL
    for (const imageUrl of imageUrls) {
      if (SUSPICIOUS_PATTERNS.some(pattern => pattern.test(imageUrl))) {
        detectedImages.push(imageUrl)
        confidence += 0.4
        reasons.push(`URL de imagen sospechosa (fallback completo): ${imageUrl}`)
        categories.push('sospechoso')
      }
    }
  }

  return {
    isNSFW: confidence > 0.3,
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
