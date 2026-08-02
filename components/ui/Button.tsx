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
      'inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-base font-semibold rounded-[7px] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-vector-red focus-visible:outline-none active:scale-[0.985] disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

    const variants = {
      primary:
        'bg-carbon text-white hover:bg-black hover:scale-[1.015] shadow-sm hover:shadow-md border border-transparent',
      vectorRed:
        'bg-vector-red text-white hover:bg-vector-darkRed hover:scale-[1.015] shadow-sm hover:shadow-md border border-transparent',
      secondary:
        'bg-transparent text-carbon border border-carbon/80 hover:bg-carbon/5 hover:border-carbon hover:scale-[1.015]',
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
