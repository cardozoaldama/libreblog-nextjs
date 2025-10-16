'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { ArrowLeft, Shield, AlertTriangle, X, Check } from 'lucide-react'

export default function NSFWRulesPage() {


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/post/create">
              <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform duration-200">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a crear post
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl shadow-lg mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
              Reglas de Contenido Censurable
            </h1>
            <p className="text-gray-600 text-lg">Guía completa sobre contenido NSFW en LibreBlog</p>
          </div>
        </div>

        {/* Introduction */}
        <Card variant="elevated" className="mb-6">
          <CardBody className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">¿Qué es contenido NSFW?</h2>
                <p className="text-gray-700 mb-4">
                NSFW significa &quot;Not Safe For Work&quot; (No apto para el trabajo) y se refiere a contenido que puede ser
                inapropiado en entornos profesionales. En LibreBlog, aplicamos filtros automáticos
                a este tipo de contenido para respetar las preferencias de nuestra comunidad.
                </p>
                <p className="text-gray-700">
                  Los usuarios pueden elegir si quieren ver este contenido con filtros o sin ellos en sus configuraciones personales.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Dynamic Re-moderation Feature */}
        <Card variant="elevated" className="mb-6 border-2 border-green-200 bg-green-50/50">
          <CardHeader className="bg-green-100">
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">✨ Re-moderación Dinámica Automática</h3>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-gray-900 font-medium mb-2">
                  🔄 <strong>¡Cada vez que editas un post, se re-modera automáticamente!</strong>
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  Esto resuelve el problema de los posts que permanecen marcados como NSFW incluso después de eliminar el contenido problemático.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-2">¿Cómo funciona?</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Si eliminas contenido NSFW:</strong> El filtro se quitará automáticamente al guardar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Si agregas contenido NSFW:</strong> El filtro se aplicará automáticamente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Cambios detectados:</strong> Título, contenido, imágenes y videos activan la re-moderación</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>100% automático:</strong> No necesitas hacer nada especial, funciona transparentemente</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>💡 Tip:</strong> Si tu post fue marcado como NSFW por error, simplemente edítalo, 
                  asegúrate de que el contenido está limpio, y guárdalo de nuevo. El sistema lo re-evaluará 
                  automáticamente y quitará el filtro si ya no detecta contenido NSFW.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Content Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Prohibited Content */}
          <Card variant="elevated" className="border-red-200">
            <CardHeader className="bg-red-50">
              <div className="flex items-center gap-3">
                <X className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-900">Contenido Prohibido</h3>
              </div>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Contenido Ilegal</p>
                    <p className="text-sm text-gray-600">Material de abuso infantil, violencia real, etc.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Spam y Acoso</p>
                    <p className="text-sm text-gray-600">Contenido diseñado para molestar o spam</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Contenido Engañoso</p>
                    <p className="text-sm text-gray-600">Información falsa que puede dañar</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Flagged Content */}
          <Card variant="elevated" className="border-yellow-200">
          <CardHeader className="bg-yellow-50">
          <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
          <h3 className="text-lg font-semibold text-yellow-900">Contenido Marcado como NSFW</h3>
          </div>
          </CardHeader>
          <CardBody className="p-6">
          <div className="space-y-4">
          <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
          <p className="font-medium text-gray-900">Contenido Sexual Explícito</p>
          <p className="text-sm text-gray-600 mb-1">Palabras como: follar, follado, folles, coger, cogido, cogiendo, sexo, pornografía, desnudo, etc.</p>
            <p className="text-xs text-gray-500">También incluye términos en inglés: fuck, sex, porn, etc.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
          <p className="font-medium text-gray-900">Violencia y Crímenes Graves</p>
            <p className="text-sm text-gray-600 mb-1">Términos como: violar, violación, matar, asesinato, tortura, genocidio, etc.</p>
              <p className="text-xs text-gray-500">Incluye violencia, sangre, muerte, suicidio y crímenes graves.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Drogas y Sustancias</p>
              <p className="text-sm text-gray-600 mb-1">Menciones de: marihuana, cocaína, heroína, drogas, etc.</p>
              <p className="text-xs text-gray-500">Sin incluir alcohol en la detección actual.</p>
          </div>
          </div>
          <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
              <p className="font-medium text-gray-900">Dominios y URLs Conocidos</p>
                <p className="text-sm text-gray-600 mb-1">Sitios como: pornhub.com, xvideos.com, redtube.com, etc.</p>
                  <p className="text-xs text-gray-500">También patrones como &quot;porn&quot;, &quot;xxx&quot;, &quot;adult&quot; en URLs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Contenido para Adultos</p>
                    <p className="text-sm text-gray-600 mb-1">Menciones explícitas: &quot;18+&quot;, &quot;NSFW&quot;, &quot;solo adultos&quot;, etc.</p>
                    <p className="text-xs text-gray-500">Etiquetas y advertencias de contenido adulto.</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Detection Methods */}
        <Card variant="elevated" className="mb-6">
          <CardHeader>
            <h3 className="text-xl font-semibold text-gray-900">Cómo se Detecta el Contenido NSFW</h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📝</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Análisis de Texto</h4>
                <p className="text-sm text-gray-600">
                  Detecta palabras clave, frases explícitas y menciones de contenido adulto en títulos y contenido.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🖼️</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Análisis de Imágenes</h4>
                <p className="text-sm text-gray-600">
                  Revisa URLs de imágenes en busca de dominios conocidos y patrones sospechosos.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔗</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Verificación de URLs</h4>
                <p className="text-sm text-gray-600">
                  Identifica enlaces a sitios conocidos por contenido adulto o inapropiado.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* User Control */}
        <Card variant="elevated" className="mb-6">
          <CardHeader>
            <h3 className="text-xl font-semibold text-gray-900">Control del Usuario</h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Protección Activada (Por defecto)</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Los posts marcados como NSFW aparecen con filtros borrosos y advertencias.
                  Debes confirmar que eres mayor de edad para ver el contenido.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <X className="w-5 h-5 text-gray-400" />
                  <h4 className="font-semibold text-gray-900">Protección Desactivada</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Ves todo el contenido sin filtros. Otros usuarios mantienen sus propias preferencias.
                </p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Tus preferencias solo afectan tu experiencia visual. Los posts marcados como NSFW
                siguen apareciendo con filtros para usuarios que tienen la protección activada.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Important Notes */}
        <Card variant="elevated" className="border-yellow-200">
          <CardHeader className="bg-yellow-50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-yellow-900">Consideraciones Importantes</h3>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Falsos Positivos</p>
                  <p className="text-sm text-gray-700 mb-2">
                    El sistema puede marcar contenido legítimo como NSFW si contiene palabras que coinciden con el filtro.
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Soluciones:</strong>
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Edita tu post y guárdalo - se re-moderará automáticamente</li>
                    <li>Si el contenido es legítimo pero usa palabras sensibles, reformula el texto</li>
                    <li>Los usuarios pueden desactivar los filtros NSFW en sus configuraciones personales</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Privacidad y Seguridad</p>
                  <p className="text-sm text-gray-700">
                    Todo el análisis se hace localmente en el servidor. No se envían datos a servicios externos
                    ni se almacena contenido sensible.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Transparencia</p>
                  <p className="text-sm text-gray-700">
                    El sistema es completamente automático y objetivo. No hay moderación manual ni decisiones arbitrarias.
                    Los mismos criterios se aplican a todos los posts por igual.
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Back to Create Post */}
        <div className="text-center mt-8">
          <Link href="/post/create">
            <Button variant="primary" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Crear Post
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}