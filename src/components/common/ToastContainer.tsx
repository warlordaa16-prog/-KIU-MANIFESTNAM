import React from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFellowship();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 left-4 right-4 sm:top-auto sm:bottom-20 sm:left-auto sm:right-6 z-50 flex flex-col gap-2 sm:max-w-sm sm:w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgColor = 'bg-slate-900/95 border-slate-700 text-slate-100';
        let Icon = Info;
        let iconColor = 'text-blue-400';

        if (toast.type === 'success') {
          bgColor = 'bg-slate-900/95 border-emerald-500/50 text-slate-100';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'warning') {
          bgColor = 'bg-slate-900/95 border-amber-500/50 text-slate-100';
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
        } else if (toast.type === 'error') {
          bgColor = 'bg-slate-900/95 border-rose-500/50 text-slate-100';
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2 sm:slide-in-from-bottom-3 duration-200 ${bgColor}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-xs font-medium leading-relaxed">
              {toast.operator && (
                <div className="text-[11px] text-orange-400 font-bold mb-0.5">
                  {toast.operator}
                </div>
              )}
              <div>{toast.message}</div>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
