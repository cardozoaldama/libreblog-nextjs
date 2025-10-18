import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/Card'
import { Info, Users, Zap, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Info className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Acerca de LibreBlog</h1>
          <p className="text-gray-600">Tu plataforma de blogging libre y sencilla</p>
        </div>

        <div className="space-y-6">
          <Card variant="elevated">
            <CardBody className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Qué es LibreBlog?</h2>
              <p className="text-gray-700 leading-relaxed">
                LibreBlog es una plataforma moderna de blogging diseñada para escritores, creadores de contenido y entusiastas que desean compartir sus ideas con el mundo. Nuestra misión es proporcionar una experiencia de escritura simple, elegante y sin distracciones.
              </p>
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="elevated">
              <CardBody className="p-6 text-center">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Comunidad</h3>
                <p className="text-gray-600 text-sm">
                  Conecta con otros escritores y lectores apasionados
                </p>
              </CardBody>
            </Card>

            <Card variant="elevated">
              <CardBody className="p-6 text-center">
                <Zap className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Rápido y Simple</h3>
                <p className="text-gray-600 text-sm">
                  Publica en segundos con soporte para Markdown
                </p>
              </CardBody>
            </Card>

            <Card variant="elevated">
              <CardBody className="p-6 text-center">
                <Heart className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Libre y Abierto</h3>
                <p className="text-gray-600 text-sm">
                  Plataforma gratuita enfocada en la libertad de expresión
                </p>
              </CardBody>
            </Card>
          </div>

          <Card variant="elevated">
          <CardBody className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Características Actuales <span className="text-sm font-normal text-gray-500">v2.0.0</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Editor Markdown con vista previa en tiempo real</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Sistema de autenticación con Supabase + 2FA</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Verificación de contraseñas con HaveIBeenPwned</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Recuperación de cuenta por email</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Organización por categorías temáticas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Sistema de likes para valorar contenido</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Perfiles personalizables con temas y avatares</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Sistema de seguimiento entre usuarios</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Feed de posts de usuarios seguidos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Búsqueda avanzada de posts y usuarios</span>
                  </li>
                </div>
                <div className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Soporte para imágenes y videos (YouTube, TikTok, Facebook)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Publicaciones públicas y borradores privados</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Marcado manual de contenido NSFW</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Sistema de censura personal de usuarios</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Filtros de protección NSFW personalizables</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Pinear publicaciones destacadas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Dashboard con filtros (públicos/borradores)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Paginación optimizada (20 posts por página)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Interfaz moderna con animaciones</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">Diseño responsive para móviles</span>
                  </li>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Creemos que todos tienen historias que contar y conocimientos que compartir. LibreBlog nació con la visión de democratizar la publicación de contenido, eliminando barreras técnicas y proporcionando herramientas poderosas pero simples.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Queremos construir una comunidad donde la calidad del contenido y las ideas sean lo más importante, no los algoritmos o la publicidad. Un espacio donde escritores y lectores puedan conectar de manera auténtica.
              </p>
            </CardBody>
          </Card>

          <Card variant="elevated">
          <CardBody className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Repositorio</h2>
          <p className="text-gray-700 mb-4">
          LibreBlog es un proyecto open source. Contribuye, reporta issues o explora el código.
          </p>
          <p className="text-gray-700">
          GitHub: <a href="https://github.com/IsmaNov12/libreblog-nextjs" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">https://github.com/IsmaNov12/libreblog-nextjs</a>
          </p>
          </CardBody>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
