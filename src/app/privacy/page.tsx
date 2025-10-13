import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/Card'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
          <p className="text-gray-600">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
        </div>

        <Card variant="elevated">
          <CardBody className="p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Información que Recopilamos</h2>
              <p className="text-gray-700">
                Recopilamos información que nos proporcionas directamente, como tu correo electrónico, nombre de usuario y contenido que publicas en la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Uso de la Información</h2>
              <p className="text-gray-700">
                Utilizamos tu información para proporcionar, mantener y mejorar nuestros servicios, así como para comunicarnos contigo sobre actualizaciones y cambios en la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Compartir Información</h2>
              <p className="text-gray-700">
                No vendemos ni compartimos tu información personal con terceros, excepto cuando sea necesario para proporcionar nuestros servicios o cuando la ley lo requiera.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Seguridad</h2>
              <p className="text-gray-700">
                Implementamos medidas de seguridad para proteger tu información personal contra acceso no autorizado, alteración o destrucción.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Tus Derechos</h2>
              <p className="text-gray-700">
                Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento desde la configuración de tu cuenta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Contacto</h2>
              <p className="text-gray-700">
                Si tienes preguntas sobre esta política de privacidad, contáctanos en contact@libreblog.com
              </p>
            </section>
          </CardBody>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
