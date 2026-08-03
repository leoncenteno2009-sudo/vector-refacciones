import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'vectorRed'
  asChild?: boolean
  href?: string
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', href, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-base font-semibold rounded-[8px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-vector-red focus-visible:outline-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer group'

    const variants = {
      primary:
        'bg-carbon text-white hover:bg-black hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(13,15,18,0.18)] hover:shadow-[0_8px_25px_rgba(13,15,18,0.32)] border border-transparent',
      vectorRed:
        'bg-vector-red text-white hover:bg-vector-darkRed hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(217,43,43,0.25)] hover:shadow-[0_8px_25px_rgba(217,43,43,0.42)] border border-transparent',
      secondary:
        'bg-white/80 backdrop-blur-md text-carbon border border-carbon/20 hover:border-vector-red/60 hover:text-vector-red hover:bg-white hover:-translate-y-0.5 shadow-sm hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]',
    }

    const classes = cn(baseStyles, variants[variant], className)

    if (href) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      )
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
