/**
 * Script para moderar posts existentes con el sistema NSFW
 * Ejecuta: node moderate-existing-posts.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Función para extraer URLs de imágenes del contenido markdown
function extractImageUrls(text) {
  const imageRegex = /!\[.*?\]\((https?:\/\/[^)]+)\)/g
  const urls = []
  let match
  while ((match = imageRegex.exec(text)) !== null) {
    urls.push(match[1])
  }
  return urls
}

// Función para moderar un post
async function moderatePost(post) {
  try {
    // Combinar título y contenido
    const fullText = `${post.title || ''} ${post.content}`.trim()

    // Extraer URLs de imágenes
    const imageUrls = extractImageUrls(post.content)
    const allImages = post.imageUrl ? [post.imageUrl, ...imageUrls] : imageUrls

    // Preparar datos para la API
    const moderationData = {
      content: post.content,
      title: post.title || '',
      images: allImages
    }

    // Llamar a la API de moderación
    const response = await fetch('http://localhost:3000/api/moderate/nsfw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(moderationData)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const moderationResult = await response.json()

    // Actualizar el post en la base de datos
    await prisma.post.update({
      where: { id: post.id },
      data: {
        isNSFW: moderationResult.isNSFW,
        nsfwCategories: moderationResult.categories || []
      }
    })

    console.log(`✅ Moderado post ${post.id}: isNSFW=${moderationResult.isNSFW}, categories=[${moderationResult.categories?.join(', ') || ''}]`)

    return moderationResult

  } catch (error) {
    console.error(`❌ Error moderando post ${post.id}:`, error.message)
    return null
  }
}

async function moderateAllPosts() {
  try {
    console.log('🚀 Iniciando moderación de posts existentes...')

    // Obtener todos los posts (puedes limitar con where si es necesario)
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        isNSFW: true,
        nsfwCategories: true
      }
    })

    console.log(`📊 Encontrados ${posts.length} posts para moderar`)

    let processed = 0
    let updated = 0
    const batchSize = 10 // Procesar en lotes para evitar sobrecarga

    for (let i = 0; i < posts.length; i += batchSize) {
      const batch = posts.slice(i, i + batchSize)
      console.log(`\n📦 Procesando lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(posts.length/batchSize)}`)

      const promises = batch.map(post => moderatePost(post))
      const results = await Promise.all(promises)

      processed += batch.length
      updated += results.filter(result => result !== null).length

      // Pequeña pausa entre lotes para no sobrecargar
      if (i + batchSize < posts.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    console.log('\n🎉 Moderación completada!')
    console.log(`📈 Estadísticas:`)
    console.log(`   • Posts procesados: ${processed}`)
    console.log(`   • Posts actualizados: ${updated}`)
    console.log(`   • Posts sin cambios: ${processed - updated}`)

  } catch (error) {
    console.error('💥 Error general:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  moderateAllPosts()
}

module.exports = { moderateAllPosts, moderatePost }
