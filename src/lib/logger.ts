/**
 * Logger personalizado que oculta información sensible en producción
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  
  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error(...args)
    } else {
      // En producción, solo log genérico sin detalles
      console.error('Error occurred')
    }
  },
  
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },
  
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  }
}
