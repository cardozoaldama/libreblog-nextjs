'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Lock, Eye, EyeOff, AlertTriangle, CheckCircle, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [passwordCheck, setPasswordCheck] = useState<{
    isCompromised: boolean
    count: number
  } | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [hasValidToken, setHasValidToken] = useState(false)
  const [isCheckingToken, setIsCheckingToken] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      
      try {
        // Verificar si hay una sesión activa (viene del email de recovery)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setMessage({ type: 'error', text: 'Error al verificar la sesión' })
          setHasValidToken(false)
          setIsCheckingToken(false)
          return
        }
        
        // Si hay sesión, obtener el usuario
        if (session?.user) {
          setUserEmail(session.user.email || null)
          setHasValidToken(true)
          setIsCheckingToken(false)
          return
        }
        
        // Si no hay sesión, buscar token en la URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')
        
        // Verificar que sea un token de recovery
        if (type === 'recovery' && accessToken) {
          // Establecer la sesión con los tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          })
          
          if (error) {
            console.error('Error setting session:', error)
            setMessage({ type: 'error', text: 'Enlace de recuperación inválido o expirado' })
            setHasValidToken(false)
          } else if (data.user) {
            setUserEmail(data.user.email || null)
            setHasValidToken(true)
          }
        } else {
          // No hay token válido
          setMessage({ 
            type: 'error', 
            text: 'Acceso denegado. Debes usar el enlace enviado a tu email.' 
          })
          setHasValidToken(false)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        setMessage({ type: 'error', text: 'Error inesperado al verificar el enlace' })
        setHasValidToken(false)
      } finally {
        setIsCheckingToken(false)
      }
    }
    
    checkSession()
  }, [])

  const checkPasswordSecurity = async (pwd: string) => {
    if (pwd.length < 6) return
    
    try {
      const response = await fetch('/api/security/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd })
      })
      
      const result = await response.json()
      setPasswordCheck(result)
    } catch (error) {
      console.error('Error checking password:', error)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    
    if (newPassword.length >= 6) {
      const timeoutId = setTimeout(() => {
        checkPasswordSecurity(newPassword)
      }, 500)
      
      return () => clearTimeout(timeoutId)
    }
  }

  const getPasswordStrength = () => {
    if (password.length < 8) return { level: 'weak', text: 'Débil', color: 'text-red-500' }
    if (password.length < 12 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { level: 'medium', text: 'Media', color: 'text-yellow-500' }
    }
    return { level: 'strong', text: 'Fuerte', color: 'text-green-500' }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' })
      return
    }

    if (password.length < 8) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 8 caracteres' })
      return
    }

    if (passwordCheck?.isCompromised) {
      setMessage({ 
        type: 'error', 
        text: `Esta contraseña ha sido comprometida ${passwordCheck.count} veces. Elige una diferente.` 
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        // Traducir mensajes de error comunes
        let errorMessage = error.message
        if (error.message.includes('New password should be different')) {
          errorMessage = 'La nueva contraseña debe ser diferente a la anterior'
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'La contraseña debe tener al menos 8 caracteres'
        }
        throw new Error(errorMessage)
      }

      setIsSuccess(true)
      
      // Cerrar sesión y redirigir al login
      await supabase.auth.signOut()
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        text: (error as Error).message || 'Error al actualizar la contraseña'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar loading mientras verifica el token
  if (isCheckingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dedff1] via-[#dedff1] to-[#5f638f]/20 flex items-center justify-center p-4">
        <Card variant="elevated" className="w-full max-w-md">
          <CardBody className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0c2b4d] mx-auto mb-4"></div>
            <p className="text-[#5f638f]">Verificando enlace de recuperación...</p>
          </CardBody>
        </Card>
      </div>
    )
  }

  // Mostrar error si no hay token válido
  if (!hasValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dedff1] via-[#dedff1] to-[#5f638f]/20 flex items-center justify-center p-4">
        <Card variant="elevated" className="w-full max-w-md">
          <CardBody className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#000022] mb-4">
              Acceso Denegado
            </h1>
            <p className="text-[#5f638f] mb-6">
              {message?.text || 'Debes usar el enlace enviado a tu email para restablecer tu contraseña.'}
            </p>
            <div className="space-y-3">
              <Link href="/forgot-password">
                <Button variant="primary" className="w-full">
                  Solicitar Nuevo Enlace
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Volver al Login
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dedff1] via-[#dedff1] to-[#5f638f]/20 flex items-center justify-center p-4">
        <Card variant="elevated" className="w-full max-w-md">
          <CardBody className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#000022] mb-4">
              Contraseña Actualizada
            </h1>
            <p className="text-[#5f638f] mb-6">
              Tu contraseña ha sido cambiada exitosamente. Inicia sesión con tu nueva contraseña.
            </p>
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => router.push('/login')}
            >
              Ir al Login
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  const strength = getPasswordStrength()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dedff1] via-[#dedff1] to-[#5f638f]/20 flex items-center justify-center p-4">
      <Card variant="elevated" className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#0c2b4d] to-[#36234e] rounded-2xl shadow-xl mb-4">
            <Lock className="w-8 h-8 text-[#dedff1]" />
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#0c2b4d] to-[#36234e] bg-clip-text text-transparent">Nueva Contraseña</h1>
          {userEmail && (
            <div className="mt-3 p-3 bg-[#0c2b4d]/10 border border-[#5f638f]/30 rounded-lg">
              <p className="text-sm text-[#5f638f] font-medium">Cuenta:</p>
              <p className="text-base text-[#000022] font-mono">{userEmail}</p>
            </div>
          )}
          <p className="text-[#5f638f] mt-2">
            Crea una contraseña segura para tu cuenta
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
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Mínimo 8 caracteres"
                  required
                  className="w-full pl-10 pr-12 py-3 border-2 border-[#5f638f]/30 rounded-xl bg-white focus:ring-2 focus:ring-[#0c2b4d] focus:border-transparent shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Fortaleza:</span>
                    <span className={strength.color}>{strength.text}</span>
                  </div>
                  
                  {passwordCheck?.isCompromised && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Contraseña comprometida {passwordCheck.count} veces</span>
                    </div>
                  )}
                  
                  {passwordCheck && !passwordCheck.isCompromised && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <Shield className="w-4 h-4" />
                      <span>Contraseña segura</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  required
                  className="w-full pl-10 pr-12 py-3 border-2 border-[#5f638f]/30 rounded-xl bg-white focus:ring-2 focus:ring-[#0c2b4d] focus:border-transparent shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
              disabled={passwordCheck?.isCompromised}
            >
              Actualizar Contraseña
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-[#0c2b4d] hover:text-[#36234e] font-medium transition-colors"
            >
              Volver al Login
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}