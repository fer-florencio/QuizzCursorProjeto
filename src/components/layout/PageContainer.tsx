import { type ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={`mx-auto w-full max-w-5xl flex-1 px-4 py-8 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
