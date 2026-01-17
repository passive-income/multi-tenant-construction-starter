import type { ReactNode } from 'react';

export function AnimatedSection({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`animate-fade-in-up ${className}`}>{children}</section>;
}
