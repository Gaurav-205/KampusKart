import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kk-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
      variants: {
        variant: {
          default: "bg-kk-ink text-white hover:bg-kk-graphite active:bg-kk-ink hover:text-white rounded-lg font-bold",
          destructive:
            "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
          outline:
            "border-2 border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 hover:text-black rounded-lg font-bold text-black",
          secondary:
            "bg-gray-100 text-black hover:bg-gray-200",
          ghost: "hover:bg-gray-100 hover:text-gray-900",
          link: "text-kk-accent underline-offset-4 hover:underline hover:text-kk-accent/80",
        },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

