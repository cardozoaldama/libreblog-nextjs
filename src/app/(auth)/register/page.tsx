'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { isEmailAuthEnabled, isProductionEnv, isValidEmailFormat, isDisposableEmail } from '@/lib/utils'
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle, Shield, AlertTriangle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [botTrap, setBotTrap] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordCheck, setPasswordCheck] = useState<{
    isCompromised: boolean
    count: number
  } | null>(null)
  const [lastAttemptAt, setLastAttemptAt] = useState<number | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)

  // Load last attempt from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('registerLastAttemptAt')
      if (stored) {
        const ts = parseInt(stored, 10)
        if (!Number.isNaN(ts)) {
          setLastAttemptAt(ts)
        }
      }
    } catch {}
  }, [])

  // Cooldown timer
  useEffect(() => {
    const tick = () => {
      if (!lastAttemptAt) {
        setRemainingSeconds(0)
        return
      }
      const elapsed = Math.floor((Date.now() - lastAttemptAt) / 1000)
      const cooldown = 30 // 30 segundos entre intentos
      const remaining = Math.max(0, cooldown - elapsed)
      setRemainingSeconds(remaining)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [lastAttemptAt])

  useEffect(() => {
    const errorParam = searchParams.get('error')
    
    if (errorParam === 'email-not-confirmed') {
      setError('Debes confirmar tu email antes de poder usar la cuenta.')
    } else if (errorParam === 'confirmation-failed') {
      setError('Error al confirmar el email. Intenta registrarte nuevamente.')
    }
  }, [searchParams])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    // Validaciones
    if (!username || username.length < 3) {
      setError('El username debe tener al menos 3 caracteres')
      setIsLoading(false)
      return
    }

    if (usernameAvailable === false) {
      setError('Este username no está disponible')
      setIsLoading(false)
      return
    }

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
      // Cooldown: 30s between registration attempts
      if (remainingSeconds > 0) {
        setError(`Espera ${remainingSeconds}s antes de volver a intentarlo.`)
        return
      }

      // Gate by feature flag
      if (!isEmailAuthEnabled()) {
        setError('El registro con email está deshabilitado. Usa OAuth (GitHub).')
        return
      }

      // Honeypot: if filled, simulate success
      if (botTrap.trim().length > 0) {
        setSuccess(true)
        setError('')
        const now = Date.now()
        setLastAttemptAt(now)
        try { localStorage.setItem('registerLastAttemptAt', String(now)) } catch {}
        return
      }

      // Validate email format and block disposable
      const normalizedEmail = email.trim().toLowerCase()
      if (!isValidEmailFormat(normalizedEmail)) {
        setError('El correo electrónico no es válido')
        return
      }
      if (isDisposableEmail(normalizedEmail)) {
        setError('No se permiten correos temporales/desechables')
        return
      }

      // In non-production, also send emails for testing
      // if (!isProductionEnv()) {
      //   setSuccess(true)
      //   setError('')
      //   return
      // }

      const supabase = createClient()
      
      // Cerrar sesión actual si existe (cambio de cuenta)
      const { data: currentUser } = await supabase.auth.getUser()
      if (currentUser.user) {
        await supabase.auth.signOut()
      }

      // Registrar usuario en Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          data: {
            username: username.toLowerCase(),
            display_name: displayName || username,
          },
        },
      })

      if (authError) {
        if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
          setError('Este correo ya está registrado. Intenta iniciar sesión.')
        } else if (authError.message.includes('invalid email')) {
          setError('El correo electrónico no es válido')
        } else {
          setError(authError.message)
        }
        return
      }

      if (data.user) {
        // NO crear usuario en BD hasta que confirme email
        // El callback lo creará después de la confirmación
        
        setSuccess(true)
        setError('')
        
        // Save attempt timestamp
        const now = Date.now()
        setLastAttemptAt(now)
        try { localStorage.setItem('registerLastAttemptAt', String(now)) } catch {}
        
        // No redirigir automáticamente, mostrar mensaje
        // El usuario debe confirmar su email primero
      }
    } catch (err) {
      setError('Error al crear la cuenta. Intenta nuevamente.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dedff1] via-[#dedff1] to-[#5f638f]/20 px-4 py-12">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom duration-700">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#36234e] to-[#5f638f] rounded-3xl shadow-2xl mb-6 animate-pulse">
            <UserPlus className="w-10 h-10 text-[#dedff1]" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-[#36234e] to-[#5f638f] bg-clip-text text-transparent">Crear Cuenta</h1>
          <p className="text-[#5f638f] mt-3 text-lg">Únete a la comunidad de LibreBlog</p>
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
                    <p className="mt-1">Revisa tu correo para confirmar tu cuenta. Después podrás iniciar sesión.</p>
                  </div>
                </div>
              )}

              {/* Username Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={async (e) => {
                      const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')
                      setUsername(value)
                      
                      if (value.length >= 3) {
                        try {
                          const res = await fetch('/api/users/check-username', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: value })
                          })
                          const data = await res.json()
                          setUsernameAvailable(data.available)
                        } catch (error) {
                          console.error('Error checking username:', error)
                        }
                      } else {
                        setUsernameAvailable(null)
                      }
                    }}
                    placeholder="tu_username"
                    pattern="[a-z0-9_-]+"
                    minLength={3}
                    maxLength={30}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                {username.length >= 3 && usernameAvailable !== null && (
                  <div className="mt-2">
                    {usernameAvailable ? (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Username disponible</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>Username no disponible</span>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Tu perfil será: libreblog.com/@{username || 'username'}
                </p>
              </div>

              {/* Display Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre para Mostrar (opcional)
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
                  Correo Electrónico *
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
                {/* Real-time warning for disposable/invalid email */}
                {email && (
                  <p className={`mt-2 text-xs ${!isValidEmailFormat(email.trim().toLowerCase()) || isDisposableEmail(email.trim().toLowerCase()) ? 'text-red-600' : 'text-gray-500'}`}>
                    {!isValidEmailFormat(email.trim().toLowerCase())
                      ? 'Ingresa un correo válido.'
                      : isDisposableEmail(email.trim().toLowerCase())
                        ? 'Este dominio parece desechable. Usa un correo permanente para evitar problemas.'
                        : 'Usa un correo válido y activo para recibir el enlace de confirmación.'}
                  </p>
                )}
                <p className="text-xs text-[#5f638f] mt-1">
                  ⚠️ Asegúrate de que tu email sea correcto. Los emails inválidos pueden causar problemas de entrega.
                </p>
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
                disabled={success || remainingSeconds > 0}
                className="w-full"
              >
                {remainingSeconds > 0 
                  ? `Espera ${remainingSeconds}s` 
                  : isLoading 
                    ? 'Creando cuenta...' 
                    : 'Crear Cuenta Gratis'}
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
          <p className="text-[#000022]">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-[#36234e] font-bold hover:text-[#5f638f] transition-colors underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-[#5f638f] hover:text-[#0c2b4d] transition-colors font-medium">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}