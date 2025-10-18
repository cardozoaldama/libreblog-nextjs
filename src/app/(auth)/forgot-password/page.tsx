'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isEmailAuthEnabled, isProductionEnv, isValidEmailFormat, isDisposableEmail } from '@/lib/utils'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [botTrap, setBotTrap] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [lastSentAt, setLastSentAt] = useState<number | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)

  // Load/send cooldown from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('forgotPwdLastSentAt')
      if (stored) {
        const ts = parseInt(stored, 10)
        if (!Number.isNaN(ts)) {
          setLastSentAt(ts)
        }
      }
    } catch {}
  }, [])

  useEffect(() => {
    const tick = () => {
      if (!lastSentAt) {
        setRemainingSeconds(0)
        return
      }
      const elapsed = Math.floor((Date.now() - lastSentAt) / 1000)
      const cooldown = 60
      const remaining = Math.max(0, cooldown - elapsed)
      setRemainingSeconds(remaining)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [lastSentAt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setIsLoading(true)

    try {
      // Honeypot: if filled, simulate success and exit
      if (botTrap.trim().length > 0) {
        setIsSuccess(true)
        setMessage({ type: 'success', text: 'Se ha enviado un enlace de recuperación a tu email' })
        return
      }
      // Cooldown client-side: 60s between requests
      if (remainingSeconds > 0) {
        setMessage({ type: 'error', text: `Espera ${remainingSeconds}s antes de volver a intentarlo.` })
        return
      }
      // Gate by feature flag
      if (!isEmailAuthEnabled()) {
        setMessage({ type: 'error', text: 'La recuperación por email está deshabilitada.' })
        return
      }

      // Prevent sending real emails outside production
      if (!isProductionEnv()) {
        setIsSuccess(true)
        setMessage({ type: 'success', text: 'Email de recuperación simulado (entorno no productivo).' })
        return
      }

      // Basic validations
      const normalized = email.trim().toLowerCase()
      if (!isValidEmailFormat(normalized)) {
        setMessage({ type: 'error', text: 'Ingresa un correo válido.' })
        return
      }
      if (isDisposableEmail(normalized)) {
        setMessage({ type: 'error', text: 'No se permiten correos temporales/desechables.' })
        return
      }

      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(normalized, {
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
      const now = Date.now()
      setLastSentAt(now)
      try { localStorage.setItem('forgotPwdLastSentAt', String(now)) } catch {}
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
      <div className="min-h-screen bg-gradient-to-br from-[#dedff1] via-[#dedff1] to-[#5f638f]/20 flex items-center justify-center p-4">
        <Card variant="elevated" className="w-full max-w-md animate-in fade-in slide-in-from-bottom duration-700">
          <CardBody className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl mb-6 animate-pulse">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-[#0c2b4d] to-[#36234e] bg-clip-text text-transparent mb-4">
              Email Enviado
            </h1>
            <p className="text-[#5f638f] mb-6 text-lg">
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </p>
            <Link href="/login">
              <Button variant="primary" className="w-full shadow-xl">
                Volver al Login
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dedff1] via-[#dedff1] to-[#5f638f]/20 flex items-center justify-center p-4">
      <Card variant="elevated" className="w-full max-w-md animate-in fade-in slide-in-from-bottom duration-700">
        <CardHeader className="text-center pb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#0c2b4d] to-[#36234e] rounded-2xl shadow-xl mb-4">
            <Mail className="w-8 h-8 text-[#dedff1]" />
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#0c2b4d] to-[#36234e] bg-clip-text text-transparent">Recuperar Contraseña</h1>
          <p className="text-[#5f638f] mt-3">
            Ingresa tu email para recibir un enlace de recuperación
          </p>
          <p className="text-xs text-[#5f638f]/70 mt-2">
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
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#5f638f]/30 rounded-xl bg-white focus:ring-2 focus:ring-[#0c2b4d] focus:border-transparent shadow-sm"
                />
              </div>
              {/* Real-time warning for disposable/invalid email */}
              {email && (
                <p className={`mt-2 text-xs ${!isValidEmailFormat(email.trim().toLowerCase()) || isDisposableEmail(email.trim().toLowerCase()) ? 'text-red-600' : 'text-gray-500'}`}>
                  {!isValidEmailFormat(email.trim().toLowerCase())
                    ? 'Ingresa un correo válido.'
                    : isDisposableEmail(email.trim().toLowerCase())
                      ? 'Este dominio parece desechable. Usa un correo permanente para evitar problemas.'
                      : 'Usa un correo válido y activo para recibir el enlace.'}
                </p>
              )}
            </div>

            {/* Honeypot (hidden) */}
            <div className="hidden" aria-hidden>
              <label>Tu sitio web</label>
              <input
                type="text"
                autoComplete="off"
                tabIndex={-1}
                value={botTrap}
                onChange={(e) => setBotTrap(e.target.value)}
              />
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
              className="inline-flex items-center text-sm text-[#0c2b4d] hover:text-[#36234e] font-medium transition-colors"
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