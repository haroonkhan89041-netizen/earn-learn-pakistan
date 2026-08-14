import { useState, ReactNode } from 'react';
import { X } from 'lucide-react';

export function useConfirmDialog() {
  const [state, setState] = useState<{
    open: boolean; title: string; description: string; confirmLabel: string;
    onConfirm: () => void; danger?: boolean;
  } | null>(null);

  function confirm(opts: { title: string; description: string; confirmLabel?: string; onConfirm: () => void; danger?: boolean }) {
    setState({ open: true, confirmLabel: 'Confirm', ...opts });
  }

  const dialog: ReactNode = state?.open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4" onClick={() => setState(null)}>
      <div className="card w-full max-w-sm p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between">
          <h3 className="font-display text-base font-bold text-navy-900">{state.title}</h3>
          <button onClick={() => setState(null)} className="text-navy-400 hover:text-navy-700"><X size={18} /></button>
        </div>
        <p className="mb-5 text-sm text-navy-600">{state.description}</p>
        <div className="flex justify-end gap-2">
          <button className="btn-outline" onClick={() => setState(null)}>Cancel</button>
          <button
            className={state.danger ? 'btn bg-red-600 text-white hover:bg-red-700' : 'btn-primary'}
            onClick={() => { state.onConfirm(); setState(null); }}
          >
            {state.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, dialog };
}
