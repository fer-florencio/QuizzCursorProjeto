import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({
  hover = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-card p-6 shadow-lg ${hover ? "transition hover:border-primary/40 hover:shadow-primary/10" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
