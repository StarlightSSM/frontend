import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/utils"; // className merge utils

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
          variant === "destructive" ? "bg-red-500 text-white" : "bg-blue-500 text-white",
          size === "sm" ? "h-8 px-3" : size === "lg" ? "h-12 px-6" : "h-10 px-4",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
