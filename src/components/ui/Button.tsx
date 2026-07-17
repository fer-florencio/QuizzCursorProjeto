import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "success" | "danger" | "ghost" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary",
  success:
    "bg-success text-white hover:bg-success/90 focus-visible:ring-success",
  danger: "bg-error text-white hover:bg-error/90 focus-visible:ring-error",
  ghost: "bg-transparent text-white/80 hover:bg-white/10",
  outline:
    "border border-white/20 bg-transparent text-white hover:bg-white/5",
};

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-14 min-w-[120px] items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
