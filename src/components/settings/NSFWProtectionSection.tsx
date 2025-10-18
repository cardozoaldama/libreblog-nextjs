'use client'

import { useState } from 'react'
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'

interface NSFWProtectionSectionProps {
  nsfwProtection: boolean
  onToggle: (enabled: boolean) => Promise<void>
}

export default function NSFWProtectionSection({ nsfwProtection, onToggle }: NSFWProtectionSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleToggle = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      await onToggle(!nsfwProtection)
      setMessage({
        type: 'success',
        text: nsfwProtection 
          ? 'Protección NSFW desactivada. Ahora verás todo el contenido sin filtros.'
          : 'Protección NSFW activada. El contenido NSFW será filtrado.'
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al actualizar la configuración. Intenta nuevamente.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card variant="default">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Protección de Contenido NSFW
            </h3>
            <p className="text-sm text-gray-600">
              Controla cómo se muestra el contenido no apto para menores
            </p>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        {message && (
          <div
            className={`p-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {nsfwProtection ? (
                <EyeOff className="w-5 h-5 text-blue-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
              <h4 className="font-medium text-gray-900">
                {nsfwProtection ? 'Protección Activada' : 'Protección Desactivada'}
              </h4>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {nsfwProtection ? (
                <>
                  Los posts marcados como NSFW y los usuarios que censures aparecerán con efecto borroso.
                  Podrás hacer clic para revelar el contenido cuando lo desees.
                </>
              ) : (
                <>
                  Los posts marcados como NSFW se mostrarán sin filtro. Los usuarios censurados seguirán con blur.
                  Puedes censurar usuarios desde sus perfiles para ocultar todo su contenido.
                </>
              )}
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Información Importante
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    {nsfwProtection 
                      ? 'Desactivar solo afecta posts NSFW. Los usuarios censurados siempre tendrán blur.'
                      : 'Con protección desactivada, solo verás blur en usuarios que hayas censurado manualmente.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleToggle}
            variant={nsfwProtection ? "secondary" : "primary"}
            isLoading={isLoading}
            className="whitespace-nowrap"
          >
            {nsfwProtection ? 'Desactivar Protección' : 'Activar Protección'}
          </Button>
        </div>

        <div className="border-t pt-4">
          <h5 className="text-sm font-medium text-gray-900 mb-2">
            ¿Cómo funciona el sistema de filtros?
          </h5>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Posts NSFW:</strong> Los autores marcan su contenido como NSFW manualmente</li>
            <li>• <strong>Protección activada:</strong> Posts NSFW aparecen con blur, clic para revelar</li>
            <li>• <strong>Protección desactivada:</strong> Posts NSFW se muestran sin filtro</li>
            <li>• <strong>Censura de usuarios:</strong> Bloquea todo el contenido de un usuario (siempre con blur)</li>
            <li>• <strong>Gestión personal:</strong> Tú decides qué usuarios censurar desde sus perfiles</li>
          </ul>
        </div>
      </CardBody>
    </Card>
  )
}

