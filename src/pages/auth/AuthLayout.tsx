import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import { GraduationCap } from 'lucide-react';

export function AuthLayout({ title, subtitle, children, footer }: {
  title: string; subtitle: string; children: ReactNode; footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-50/60 px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 font-display text-lg font-extrabold text-navy-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 text-white"><GraduationCap size={18} /></span>
          Earn &amp; Learn PK
        </Link>
        <div className="card p-7">
          <h1 className="font-display text-xl font-extrabold text-navy-900">{title}</h1>
          <p className="mt-1 text-sm text-navy-500">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        <p className="mt-5 text-center text-sm text-navy-500">{footer}</p>
      </div>
    </div>
  );
}
