import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'hover'
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  const variants: Record<string, string> = {
    default: 'rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all duration-300',
    bordered: 'rounded-2xl border-2 border-gray-200/70 bg-white/90 backdrop-blur-sm p-6 transition-all duration-300 hover:border-gray-300',
    elevated: 'rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-2xl shadow-gray-200/60 transition-all duration-300 hover:shadow-3xl hover:shadow-gray-300/40',
    hover: 'rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-300/30 hover:scale-[1.02] hover:bg-white/95',
  }

  return <div className={cn(variants[variant], className)} {...props} />
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-xl font-semibold', className)} {...props} />
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-gray-500', className)} {...props} />
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-4', className)} {...props} />
}

// Backwards compatibility: some files still use CardBody name
export const CardBody = CardContent