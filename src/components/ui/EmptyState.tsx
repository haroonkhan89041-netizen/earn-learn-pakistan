import { ReactNode } from 'react';

export function EmptyState({ icon, title, description, action }: {
  icon: ReactNode; title: string; description: string; action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-50 text-navy-400">
        {icon}
      </div>
      <h3 className="font-display text-lg font-bold text-navy-900">{title}</h3>
      <p className="max-w-sm text-sm text-navy-500">{description}</p>
      {action}
    </div>
  );
}
