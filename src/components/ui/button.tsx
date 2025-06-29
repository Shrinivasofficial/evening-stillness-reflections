import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-sky-200 bg-white/80 backdrop-blur-sm hover:bg-sky-50 hover:border-sky-300 text-sky-700",
        secondary:
          "bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 hover:from-sky-100 hover:to-blue-100 border border-sky-200 shadow-sm",
        ghost: "hover:bg-sky-50 hover:text-sky-700 text-slate-600",
        link: "text-sky-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-sm",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    // Analytics click handler
    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      // Fire Google Analytics event if gtag is available
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        const label = (props['data-analytics-label'] as string) || (typeof props.children === 'string' ? props.children : undefined) || '';
        window.gtag('event', 'button_click', {
          event_category: 'Button',
          event_label: label,
          button_variant: variant,
        });
      }
      if (onClick) onClick(event);
    };
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
