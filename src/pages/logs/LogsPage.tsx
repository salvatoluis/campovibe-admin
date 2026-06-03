import { useQuery } from '@tanstack/react-query';
import { ScrollText, RefreshCw } from 'lucide-react';
import { Card, Badge } from '../../components/ui';
import { RoleGate } from '../../components/layout/Shell';
import api from '../../api/client';

export function LogsPage() {
  const { data: convs, refetch } = useQuery({ queryKey: ['ai-logs'], queryFn: () => api.get('/ai/chat/history') as any, staleTime: 30_000 });
  const { data: ecoEvents } = useQuery({ queryKey: ['eco-events'], queryFn: () => api.get('/eco/leaderboard') as any, staleTime: 60_000 });

  const msgs = (convs as any)?.messages ?? [];
  const leaders = Array.isArray(ecoEvents) ? ecoEvents as any[] : [];

  return (
    <RoleGate roles={['super_admin']}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Activity Logs</h1>
            <p className="text-slate-500 text-sm mt-1">AI conversations and eco activity</p>
          </div>
          <button onClick={() => refetch()} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-white/5 border border-white/8 px-3 py-2 rounded-lg transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <ScrollText size={14} className="text-purple-400" /> CampoAI Conversations
            </h2>
            {msgs.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No AI conversations yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {msgs.slice(0, 20).map((m: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                    <Badge label={m.role} color={m.role === 'user' ? 'blue' : 'green'} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 truncate">{m.content}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{m.contextType} · {new Date(m.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              🌿 Eco Leaderboard
            </h2>
            {leaders.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No eco activity yet</p>
            ) : (
              <div className="space-y-2">
                {leaders.slice(0, 10).map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <span className="text-xs font-bold text-slate-500 w-5">#{i+1}</span>
                    <p className="flex-1 font-mono text-xs text-slate-400">{s.studentId?.slice(0,12)}…</p>
                    <Badge label={`${s.totalPoints} pts`} color="green" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </RoleGate>
  );
}
