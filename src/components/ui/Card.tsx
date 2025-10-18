import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'hover'
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  const variants: Record<string, string> = {
    default: 'rounded-2xl border border-[#5f638f]/20 bg-white/90 backdrop-blur-sm p-6 shadow-sm transition-all duration-300',
    bordered: 'rounded-2xl border-2 border-[#5f638f]/30 bg-white/95 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[#36234e]/50',
    elevated: 'rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-2xl shadow-[#0c2b4d]/10 transition-all duration-300 hover:shadow-3xl hover:shadow-[#36234e]/20',
    hover: 'rounded-2xl border border-[#5f638f]/20 bg-white/90 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#36234e]/20 hover:scale-[1.02] hover:bg-white/95',
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
  return <p className={cn('text-sm text-[#5f638f]', className)} {...props} />
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-4', className)} {...props} />
}

// Backwards compatibility: some files still use CardBody name
export const CardBody = CardContent