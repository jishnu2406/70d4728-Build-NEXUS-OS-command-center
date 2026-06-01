import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-ring inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-medium transition active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-bg shadow-lift hover:bg-accent/90 dark:bg-accent dark:text-bg",
        secondary:
          "border border-border bg-panel/80 text-text hover:border-accent/40 hover:bg-panel",
        ghost: "text-muted hover:bg-panel/80 hover:text-text",
        danger: "bg-danger text-white hover:bg-danger/90",
        subtle: "bg-accent-2/14 text-accent-2 hover:bg-accent-2/22",
        outline: "border border-border bg-transparent text-text hover:bg-panel",
        glass: "glass text-text hover:border-accent/40",
        icon: "h-10 w-10 rounded-lg border border-border bg-panel/75 p-0 text-muted hover:text-text",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-5 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { buttonVariants };
