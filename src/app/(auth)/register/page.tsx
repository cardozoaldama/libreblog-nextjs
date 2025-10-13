'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle, Shield, AlertTriangle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordCheck, setPasswordCheck] = useState<{
    isCompromised: boolean
    count: number
  } | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    // Validaciones
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    if (passwordCheck?.isCompromised) {
      setError(`Esta contraseña ha sido comprometida ${passwordCheck.count} veces. Elige una diferente.`)
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      // Cerrar sesión actual si existe (cambio de cuenta)
      const { data: currentUser } = await supabase.auth.getUser()
      if (currentUser.user) {
        await supabase.auth.signOut()
      }

      // Registrar usuario en Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0],
          },
        },
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Este correo ya está registrado')
        } else {
          setError(authError.message)
        }
        return
      }

      if (data.user) {
        // Crear usuario en la base de datos
        const response = await fetch('/api/users/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            displayName: displayName || email.split('@')[0],
          }),
        })

        if (!response.ok) {
          console.error('Error creating user in database')
        }

        setSuccess(true)
        
        // Forzar recarga completa para actualizar el layout con el nuevo usuario
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      }
    } catch (err) {
      setError('Error al crear la cuenta. Intenta nuevamente.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Crear Cuenta</h1>
          <p className="text-gray-600 mt-2">Únete a la comunidad de LibreBlog</p>
        </div>

        {/* Card de Registro */}
        <Card variant="elevated">
          <CardContent className="p-6">
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Success Alert */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold">¡Cuenta creada exitosamente!</p>
                    <p className="mt-1">Redirigiendo al dashboard...</p>
                  </div>
                </div>
              )}

              {/* Display Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de Usuario (opcional)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={async (e) => {
                      const newPassword = e.target.value
                      setPassword(newPassword)
                      
                      if (newPassword.length >= 8) {
                        try {
                          const response = await fetch('/api/security/check-password', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ password: newPassword })
                          })
                          const result = await response.json()
                          setPasswordCheck(result)
                        } catch (error) {
                          console.error('Error checking password:', error)
                        }
                      } else {
                        setPasswordCheck(null)
                      }
                    }}
                    placeholder="Mínimo 8 caracteres"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                {password && passwordCheck && (
                  <div className="mt-2">
                    {passwordCheck.isCompromised ? (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Contraseña comprometida {passwordCheck.count} veces</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <Shield className="w-4 h-4" />
                        <span>Contraseña segura</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                disabled={success}
                className="w-full"
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta Gratis'}
              </Button>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center">
                Al crear una cuenta, aceptas nuestros{' '}
                <Link href="/terms" className="text-purple-600 hover:underline">
                  Términos de Servicio
                </Link>{' '}
                y{' '}
                <Link href="/privacy" className="text-purple-600 hover:underline">
                  Política de Privacidad
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}