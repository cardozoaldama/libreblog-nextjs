import { ButtonHTMLAttributes, forwardRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Interfaz para las propiedades del componente Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean // Mostrar spinner de carga
}

/**
 * Componente Button reutilizable con múltiples variantes y estados
 * Incluye soporte para loading, diferentes tamaños y estilos
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    // Estilos base aplicados a todos los botones
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transform hover:scale-105 active:scale-95'

    // Variantes de estilo para diferentes tipos de botón
    const variants = {
      primary: 'bg-gradient-to-r from-[#0c2b4d] to-[#36234e] text-white hover:from-[#36234e] hover:to-[#5f638f] focus:ring-[#0c2b4d] shadow-lg shadow-[#0c2b4d]/30 hover:shadow-xl hover:shadow-[#36234e]/40',
      secondary: 'bg-gradient-to-r from-[#5f638f] to-[#36234e] text-white hover:from-[#36234e] hover:to-[#0c2b4d] focus:ring-[#5f638f] shadow-lg shadow-[#5f638f]/30',
      outline: 'border-2 border-[#5f638f] text-[#0c2b4d] hover:bg-[#dedff1]/50 hover:border-[#36234e] focus:ring-[#5f638f] hover:shadow-md',
      ghost: 'text-[#36234e] hover:bg-[#dedff1]/50 hover:text-[#0c2b4d] focus:ring-[#5f638f] backdrop-blur-sm',
      danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg shadow-red-500/30',
    }

    // Tamaños disponibles para el botón
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* GIF de carga cuando isLoading es true */}
        {isLoading && (
          <Image
            src="/loading.gif"
            alt="Cargando"
            width={16}
            height={16}
            className="-ml-1 mr-2"
            unoptimized
          />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
