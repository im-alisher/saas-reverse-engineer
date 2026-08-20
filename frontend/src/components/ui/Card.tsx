import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-surface rounded-xl border border-border p-6 ${hover ? 'transition-all duration-200 hover:shadow-lg hover:border-primary/20' : ''} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  },
)

Card.displayName = 'Card'
