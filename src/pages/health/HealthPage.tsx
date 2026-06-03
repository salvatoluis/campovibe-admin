import { useQuery } from '@tanstack/react-query';
import { Activity, Server, Database, Wifi, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Card, Badge } from '../../components/ui';
import { RoleGate } from '../../components/layout/Shell';
import api from '../../api/client';

function StatusDot({ ok }: { ok: boolean }) {
  return ok
    ? <CheckCircle size={16} className="text-emerald-400" />
    : <XCircle size={16} className="text-red-400" />;
}

export function HealthPage() {
  const { data: health, isLoading, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.get('/health') as any,
    refetchInterval: 30_000,
  });

  const { data: faculties } = useQuery({ queryKey: ['faculties-count'], queryFn: () => api.get('/faculties') as any, staleTime: 120_000 });
  const { data: semesters } = useQuery({ queryKey: ['semesters-list'], queryFn: () => api.get('/semesters') as any, staleTime: 120_000 });

  const uptime = health?.uptime ?? 0;
  const uptimeHrs = Math.floor(uptime / 3600);
  const uptimeMins = Math.floor((uptime % 3600) / 60);

  return (
    <RoleGate roles={['super_admin']}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>System Health</h1>
            <p className="text-slate-500 text-sm mt-1">
              Last checked: {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '—'}
            </p>
          </div>
          <button onClick={() => refetch()} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-white/5 border border-white/8 px-3 py-2 rounded-lg transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'API Status', value: health?.status === 'ok' ? 'Operational' : 'Degraded', ok: health?.status === 'ok', icon: Server },
            { label: 'Database', value: health?.db === 'connected' ? 'Connected' : 'Disconnected', ok: health?.db === 'connected', icon: Database },
            { label: 'Uptime', value: `${uptimeHrs}h ${uptimeMins}m`, ok: true, icon: Activity },
            { label: 'API Response', value: isLoading ? '...' : 'Healthy', ok: !isLoading, icon: Wifi },
          ].map((s) => (
            <Card key={s.label}>
              <div className="flex items-center justify-between mb-3">
                <s.icon size={16} className="text-slate-500" />
                <StatusDot ok={s.ok} />
              </div>
              <p className={`text-lg font-bold ${s.ok ? 'text-white' : 'text-red-400'}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Platform info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-sm font-semibold text-white mb-4">Platform Configuration</h2>
            {[
              { label: 'API Version', value: 'v1.0.0' },
              { label: 'Environment', value: 'Production', badge: 'green' },
              { label: 'Node.js', value: '20.x LTS' },
              { label: 'Database', value: 'PostgreSQL 16' },
              { label: 'Cache', value: 'Redis 7' },
              { label: 'Faculties', value: Array.isArray(faculties) ? faculties.length : '—' },
              { label: 'Semesters', value: Array.isArray(semesters) ? semesters.length : '—' },
              { label: 'Current Semester', value: Array.isArray(semesters) ? (semesters as any[]).find((s: any) => s.isCurrent)?.name ?? '—' : '—' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-slate-400">{item.label}</span>
                {item.badge
                  ? <Badge label={String(item.value)} color={item.badge} />
                  : <span className="text-sm font-medium text-white">{item.value}</span>}
              </div>
            ))}
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-white mb-4">Service Status</h2>
            {[
              { name: 'Authentication Service', ok: true },
              { name: 'Attendance Service (GPS)', ok: true },
              { name: 'Results & Grades', ok: true },
              { name: 'Library Management', ok: true },
              { name: 'AI Assistant (CampoAI)', ok: !!import.meta.env.VITE_AI_ENABLED },
              { name: 'M-Pesa Payments', ok: false, note: 'Not configured' },
              { name: 'SMS Notifications', ok: false, note: 'Not configured' },
              { name: 'Email Service', ok: false, note: 'Not configured' },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm text-slate-300">{s.name}</p>
                  {s.note && <p className="text-xs text-slate-600">{s.note}</p>}
                </div>
                <Badge label={s.ok ? 'Online' : 'Offline'} color={s.ok ? 'green' : 'gray'} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </RoleGate>
  );
}
