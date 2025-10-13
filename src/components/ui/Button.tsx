import { ButtonHTMLAttributes, forwardRef } from 'react'
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
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95'
    
    // Variantes de estilo para diferentes tipos de botón
    const variants = {
      primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-purple-500/40',
      secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 focus:ring-gray-500 shadow-lg shadow-gray-500/30',
      outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500 hover:shadow-md',
      ghost: 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 focus:ring-gray-500 backdrop-blur-sm',
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
        {/* Spinner de carga cuando isLoading es true */}
        {isLoading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button