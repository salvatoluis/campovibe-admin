import { useQuery } from '@tanstack/react-query';
import { BarChart3 } from "lucide-react";
import { Card, Stat } from '../../components/ui';
import api from '../../api/client';

export function AnalyticsPage() {
  const { data: kpis } = useQuery({ queryKey: ['kpis'], queryFn: () => api.get('/analytics/dashboard') as any, staleTime: 60_000 });
  const { data: facAtt } = useQuery({ queryKey: ['fac-att'], queryFn: () => api.get('/analytics/attendance-by-faculty') as any, staleTime: 120_000 });
  const { data: gradeDist } = useQuery({ queryKey: ['grade-dist'], queryFn: () => api.get('/analytics/grade-distribution') as any, staleTime: 120_000 });

  const gradeColors: Record<string, string> = { A: 'bg-emerald-400', B: 'bg-blue-400', C: 'bg-amber-400', D: 'bg-orange-400', F: 'bg-red-400' };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Platform-wide performance metrics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Total Students" value={kpis?.totalStudents?.toLocaleString() ?? '—'} />
        <Stat label="Avg. Attendance" value={kpis?.avgAttendancePct != null ? `${kpis.avgAttendancePct}%` : '—'} color={kpis?.avgAttendancePct > 70 ? 'text-emerald-400' : 'text-amber-400'} />
        <Stat label="Avg. GPA" value={kpis?.avgGpa ? Number(kpis.avgGpa).toFixed(2) : '—'} color="text-amber-400" />
        <Stat label="At-Risk Students" value={kpis?.atRiskStudents ?? '—'} color={kpis?.atRiskStudents > 0 ? 'text-red-400' : 'text-emerald-400'} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Faculty Attendance */}
        <Card>
          <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <BarChart3 size={14} className="text-blue-400" /> Attendance by Faculty
          </h2>
          {Array.isArray(facAtt) && facAtt.length > 0 ? (
            (facAtt as any[]).map((f: any, i: number) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">{f.faculty}</span>
                  <span className={Number(f.attendance_pct) >= 70 ? 'text-emerald-400' : 'text-amber-400'}>
                    {f.attendance_pct ?? 0}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/6 rounded-full">
                  <div className={`h-full rounded-full transition-all ${Number(f.attendance_pct) >= 70 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    style={{ width: `${Math.max(Number(f.attendance_pct) ?? 0, 0)}%` }} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">No session data yet</p>
          )}
        </Card>

        {/* Grade Distribution */}
        <Card>
          <h2 className="text-sm font-semibold text-white mb-5">Grade Distribution</h2>
          {Array.isArray(gradeDist) && gradeDist.length > 0 ? (
            <div className="space-y-3">
              {(gradeDist as any[]).map((g: any) => {
                const pct = Number(g.pct ?? 0);
                const colorKey = g.letter_grade?.[0] ?? 'F';
                const bgColor = gradeColors[colorKey] ?? 'bg-slate-400';
                return (
                  <div key={g.letter_grade} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white w-8">{g.letter_grade}</span>
                    <div className="flex-1 h-2 bg-white/6 rounded-full">
                      <div className={`h-full rounded-full ${bgColor} opacity-80`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 w-10 text-right">{pct}%</span>
                    <span className="text-xs text-slate-500 w-12 text-right">{g.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">No results released yet</p>
          )}
        </Card>
      </div>
    </div>
  );
}
