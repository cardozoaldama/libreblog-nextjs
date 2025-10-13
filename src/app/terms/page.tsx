import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/Card'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Términos y Condiciones</h1>
          <p className="text-gray-600">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
        </div>

        <Card variant="elevated">
          <CardBody className="p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Aceptación de Términos</h2>
              <p className="text-gray-700">
                Al acceder y utilizar LibreBlog, aceptas estar sujeto a estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestra plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Uso de la Plataforma</h2>
              <p className="text-gray-700">
                LibreBlog es una plataforma de blogging donde puedes crear, publicar y compartir contenido. Te comprometes a usar la plataforma de manera responsable y respetuosa con otros usuarios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Contenido del Usuario</h2>
              <p className="text-gray-700">
                Eres responsable del contenido que publicas en LibreBlog. Conservas todos los derechos sobre tu contenido, pero nos otorgas una licencia para mostrarlo en nuestra plataforma. No debes publicar contenido ilegal, ofensivo o que infrinja derechos de terceros.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Cuentas de Usuario</h2>
              <p className="text-gray-700">
                Eres responsable de mantener la seguridad de tu cuenta y contraseña. LibreBlog no será responsable de ninguna pérdida o daño derivado de tu incumplimiento de esta obligación de seguridad.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Prohibiciones</h2>
              <p className="text-gray-700">
                Está prohibido usar la plataforma para spam, acoso, distribución de malware, violación de derechos de autor, o cualquier actividad ilegal. Nos reservamos el derecho de suspender o eliminar cuentas que violen estos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Modificaciones</h2>
              <p className="text-gray-700">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cambios significativos y tu uso continuado de la plataforma constituirá tu aceptación de los nuevos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Limitación de Responsabilidad</h2>
              <p className="text-gray-700">
                LibreBlog se proporciona "tal cual" sin garantías de ningún tipo. No seremos responsables de daños indirectos, incidentales o consecuentes derivados del uso de la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Contacto</h2>
              <p className="text-gray-700">
                Si tienes preguntas sobre estos términos, contáctanos en contact@libreblog.com
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
