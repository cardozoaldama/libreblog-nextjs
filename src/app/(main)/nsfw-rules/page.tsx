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
                inapropiado en entornos profesionales o que algunos usuarios prefieren no ver.
                </p>
                <p className="text-gray-700">
                  En LibreBlog, los creadores marcan manualmente su contenido como NSFW. Los usuarios pueden ver este contenido cuando lo deseen.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Manual System Feature */}
        <Card variant="elevated" className="mb-6 border-2 border-blue-200 bg-blue-50/50">
          <CardHeader className="bg-blue-100">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">✨ Sistema Manual de Moderación</h3>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-gray-900 font-medium mb-2">
                  🎯 <strong>Control Total del Usuario</strong>
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  LibreBlog te da control completo sobre tu contenido. Tú decides qué marcar como NSFW.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">¿Cómo funciona?</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Checkbox simple:</strong> Marca tu post como NSFW con un solo click</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Sin detección automática:</strong> No hay análisis ni sugerencias, tú decides</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Responsabilidad:</strong> Marca apropiadamente tu contenido para respetar a la comunidad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Censura personal:</strong> Puedes censurar usuarios específicos desde sus perfiles</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-sm text-yellow-900">
                  <strong>💡 Tip:</strong> Si tu contenido incluye material adulto, violencia explícita o temas sensibles, 
                  márcalo como NSFW para que otros usuarios puedan decidir si quieren verlo.
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
          <h3 className="text-lg font-semibold text-yellow-900">¿Qué debería marcarse como NSFW?</h3>
          </div>
          </CardHeader>
          <CardBody className="p-6">
          <div className="space-y-4">
          <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
          <p className="font-medium text-gray-900">Contenido Sexual Explícito</p>
          <p className="text-sm text-gray-600">Desnudos, contenido pornográfico o referencias sexuales explícitas</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
          <p className="font-medium text-gray-900">Violencia Gráfica</p>
            <p className="text-sm text-gray-600">Imágenes o descripciones detalladas de violencia, sangre o gore</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Temas Sensibles</p>
              <p className="text-sm text-gray-600">Drogas, autolesiones, o contenido perturbador</p>
          </div>
          </div>
          <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
              <p className="font-medium text-gray-900">Lenguaje Ofensivo</p>
                <p className="text-sm text-gray-600">Uso excesivo de lenguaje vulgar o insultos</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* User Censorship System */}
        <Card variant="elevated" className="mb-6">
          <CardHeader>
            <h3 className="text-xl font-semibold text-gray-900">Sistema de Censura Personal</h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🚫</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Censurar Usuarios</h4>
                <p className="text-sm text-gray-600">
                  Desde el perfil de cualquier usuario, puedes censurarlo para aplicar blur a todo su contenido.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✅</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Quitar Censura</h4>
                <p className="text-sm text-gray-600">
                  Puedes desbloquear usuarios en cualquier momento desde su perfil o desde configuración.
                </p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> La censura es personal y solo afecta tu experiencia. Otros usuarios no ven tus bloqueos.
              </p>
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
                  Puedes hacer click para ver el contenido cuando lo desees.
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
                  <p className="font-medium text-gray-900">Responsabilidad del Creador</p>
                  <p className="text-sm text-gray-700">
                    Es tu responsabilidad marcar apropiadamente tu contenido. Marca como NSFW cualquier contenido
                    que pueda ser inapropiado para algunos usuarios.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Control Personal</p>
                  <p className="text-sm text-gray-700">
                    Cada usuario decide qué quiere ver. Los filtros NSFW se pueden desactivar en configuración,
                    y puedes censurar usuarios específicos desde sus perfiles.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Respeto a la Comunidad</p>
                  <p className="text-sm text-gray-700">
                    Marcar correctamente tu contenido ayuda a crear un ambiente respetuoso donde todos
                    pueden disfrutar de la plataforma según sus preferencias.
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