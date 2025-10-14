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

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      
      // Obtener código de la URL si existe
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const code = hashParams.get('access_token') ? null : new URLSearchParams(window.location.search).get('code')
      
      if (code) {
        // Intercambiar código por sesión
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          console.error('Error exchanging code:', error)
          setMessage({ type: 'error', text: 'Enlace de recuperación inválido o expirado' })
          return
        }
      }
      
      // Obtener usuario de la sesión
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user?.email) {
        setUserEmail(user.email)
      } else {
        setMessage({ type: 'error', text: 'No se pudo obtener la sesión. Intenta solicitar un nuevo enlace.' })
      }
    }
    
    checkSession()
  }, [router])

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
        throw error
      }

      setIsSuccess(true)
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        text: (error as Error).message || 'Error al actualizar la contraseña'
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
              Contraseña Actualizada
            </h1>
            <p className="text-gray-600 mb-6">
              Tu contraseña ha sido cambiada exitosamente.
            </p>
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => router.push('/dashboard')}
            >
              Ir al Dashboard
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  const strength = getPasswordStrength()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card variant="elevated" className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Nueva Contraseña</h1>
          {userEmail && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 font-medium">Cuenta:</p>
              <p className="text-base text-blue-800 font-mono">{userEmail}</p>
            </div>
          )}
          <p className="text-gray-600 mt-2">
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
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Volver al Login
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}