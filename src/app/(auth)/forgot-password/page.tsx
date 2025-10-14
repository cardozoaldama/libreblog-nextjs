'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        // Mostrar mensaje de éxito incluso si hay rate limiting
        if (error.message.includes('rate') || error.message.includes('limit')) {
          setMessage({
            type: 'error',
            text: 'Has solicitado demasiados emails. Espera unos minutos e inténtalo de nuevo.'
          })
          return
        }
        throw error
      }

      setIsSuccess(true)
      setMessage({
        type: 'success',
        text: 'Se ha enviado un enlace de recuperación a tu email'
      })
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'Error al enviar el email de recuperación'
      setMessage({
        type: 'error',
        text: errorMessage.includes('rate') || errorMessage.includes('limit')
          ? 'Has solicitado demasiados emails. Espera unos minutos.'
          : errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card variant="elevated" className="w-full max-w-md">
          <CardBody className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email Enviado
            </h1>
            <p className="text-gray-600 mb-6">
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </p>
            <Link href="/login">
              <Button variant="primary" className="w-full">
                Volver al Login
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card variant="elevated" className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Recuperar Contraseña</h1>
          <p className="text-gray-600 mt-2">
            Ingresa tu email para recibir un enlace de recuperación
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Si no recibes el email, revisa tu carpeta de spam
          </p>
        </CardHeader>
        
        <CardBody className="p-6">
          {message && (
            <div
              className={`mb-4 px-4 py-3 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
            >
              Enviar Enlace de Recuperación
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver al Login
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}