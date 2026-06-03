import { clsx } from "clsx";
import { type ReactNode } from "react";

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={clsx('bg-[#111E30] border border-white/7 rounded-xl p-5', onClick && 'cursor-pointer hover:border-white/15 transition-colors', className)}
    >
      {children}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
const BADGE_COLORS: Record<string, string> = {
  green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  red: 'bg-red-500/15 text-red-400 border-red-500/20',
  orange: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  gray: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
};
export function Badge({ label, color = 'gray' }: { label: string; color?: string }) {
  return (
    <span className={clsx('inline-flex px-2 py-0.5 rounded-md text-xs font-medium border', BADGE_COLORS[color] ?? BADGE_COLORS.gray)}>
      {label}
    </span>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, loading, className = '', type = 'button' }: {
  children: ReactNode; onClick?: () => void; variant?: 'primary'|'secondary'|'ghost'|'danger';
  size?: 'sm'|'md'; disabled?: boolean; loading?: boolean; className?: string; type?: 'button'|'submit';
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' };
  const variants = {
    primary: 'bg-[#00C896] text-[#080F1E] hover:bg-emerald-400',
    secondary: 'bg-white/8 text-white border border-white/10 hover:bg-white/12',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/6',
    danger: 'bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={clsx(base, sizes[size], variants[variant], className)}>
      {loading && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, error, className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>}
      <input {...props} className={clsx('bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-[#00C896]/50 focus:ring-1 focus:ring-[#00C896]/20 transition-all', error && 'border-red-500/50', className)} />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ── Stat ──────────────────────────────────────────────────────────────────────
export function Stat({ label, value, sub, color = 'text-white', icon }: { label: string; value: string|number; sub?: string; color?: string; icon?: ReactNode }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        {icon && <div className="text-slate-500">{icon}</div>}
      </div>
      <p className={clsx('text-2xl font-bold tracking-tight', color)} style={{ fontFamily: 'Syne, sans-serif' }}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </Card>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────
export function Table({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/6">
            {headers.map((h) => <th key={h} className="text-left py-2.5 px-3 text-xs text-slate-500 font-medium uppercase tracking-wide">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/4 hover:bg-white/2 transition-colors">
              {row.map((cell, j) => <td key={j} className="py-3 px-3">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="text-center text-sm text-slate-500 py-8">No data</p>}
    </div>
  );
}
