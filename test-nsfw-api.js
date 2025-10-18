/**
 * Script de prueba para la API de moderación NSFW
 * Ejecutar: node test-nsfw-api.js
 */

const API_URL = 'http://localhost:3000/api/moderate/nsfw'

const testCases = [
  {
    name: '✅ Contenido limpio - Blog de tecnología',
    data: {
      title: 'Cómo aprender JavaScript en 2024',
      content: 'JavaScript es un lenguaje de programación muy popular. En este tutorial aprenderás los fundamentos.'
    },
    expected: { isNSFW: false }
  },
  {
    name: '✅ Contenido limpio - Educación',
    data: {
      title: 'Educación sexual para adolescentes',
      content: 'La educación sexual es importante para el desarrollo saludable de los jóvenes.'
    },
    expected: { isNSFW: false }
  },
  {
    name: '⚠️ Contenido explícito - Palabras clave',
    data: {
      title: 'Contenido para adultos',
      content: 'Este es un post con contenido porn xxx nsfw'
    },
    expected: { isNSFW: true }
  },
  {
    name: '⚠️ Advertencia explícita - 18+',
    data: {
      title: 'Post solo para adultos',
      content: 'Este contenido es 18+ y NSFW, no apto para menores'
    },
    expected: { isNSFW: true }
  },
  {
    name: '⚠️ Dominio NSFW conocido',
    data: {
      title: 'Mira este video',
      content: 'Aquí hay un enlace: https://pornhub.com/video/123'
    },
    expected: { isNSFW: true }
  },
  {
    name: '⚠️ Imagen markdown con patrón NSFW',
    data: {
      title: 'Galería de fotos',
      content: 'Mira esta imagen: ![foto](https://example.com/nude-photo.jpg)',
    },
    expected: { isNSFW: true }
  },
  {
    name: '✅ Falso positivo evitado - Sussex',
    data: {
      title: 'Viaje a Sussex',
      content: 'Visité Sussex, Inglaterra. Es un lugar hermoso con mucha historia.'
    },
    expected: { isNSFW: false }
  },
  {
    name: '✅ Falso positivo evitado - Asexual',
    data: {
      title: 'Identidad asexual',
      content: 'La comunidad asexual es parte del espectro LGBTQ+'
    },
    expected: { isNSFW: false }
  }
]

async function testModeration() {
  console.log('🧪 Iniciando pruebas de moderación NSFW\n')
  console.log('=' .repeat(80))

  let passed = 0
  let failed = 0

  for (const testCase of testCases) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCase.data)
      })

      if (!response.ok) {
        console.log(`\n❌ ${testCase.name}`)
        console.log(`   Error HTTP: ${response.status}`)
        failed++
        continue
      }

      const result = await response.json()
      const success = result.isNSFW === testCase.expected.isNSFW

      if (success) {
        console.log(`\n✅ ${testCase.name}`)
        passed++
      } else {
        console.log(`\n❌ ${testCase.name}`)
        console.log(`   Esperado: isNSFW=${testCase.expected.isNSFW}`)
        console.log(`   Obtenido: isNSFW=${result.isNSFW}`)
        failed++
      }

      console.log(`   Confianza: ${(result.confidence * 100).toFixed(1)}%`)
      if (result.categories.length > 0) {
        console.log(`   Categorías: ${result.categories.join(', ')}`)
      }
      if (result.reasons.length > 0) {
        console.log(`   Razones: ${result.reasons.slice(0, 2).join('; ')}`)
      }

    } catch (error) {
      console.log(`\n❌ ${testCase.name}`)
      console.log(`   Error: ${error.message}`)
      failed++
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log(`\n📊 Resultados: ${passed} pasaron, ${failed} fallaron de ${testCases.length} pruebas`)
  console.log(`   Tasa de éxito: ${((passed / testCases.length) * 100).toFixed(1)}%\n`)
}

// Ejecutar pruebas
testModeration().catch(console.error)
