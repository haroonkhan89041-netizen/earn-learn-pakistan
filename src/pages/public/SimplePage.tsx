// Shared shell for simple content pages (About, legal pages, etc.)
import { ReactNode } from 'react';

export function SimplePage({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="container-app max-w-3xl py-14 md:py-20">
      <h1 className="font-display text-3xl font-extrabold text-navy-900 md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 text-navy-500">{subtitle}</p>}
      <div className="prose-navy mt-8 space-y-4 text-[15px] leading-7 text-navy-700">
        {children}
      </div>
    </div>
  );
}
