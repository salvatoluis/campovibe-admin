import { useQuery } from '@tanstack/react-query';
import { Users, GraduationCap, AlertTriangle, Leaf, Trophy } from 'lucide-react';
import { Card, Stat, Badge } from '../../components/ui';
import { useAuth } from '../../store/auth';
import api from '../../api/client';

export function OverviewPage() {
  const { user } = useAuth();

  const { data: kpis } = useQuery({ queryKey: ['kpis'], queryFn: () => api.get('/analytics/dashboard') as any, staleTime: 60_000 });
  const { data: pending } = useQuery({ queryKey: ['pending'], queryFn: () => api.get('/analytics/pending-actions') as any, staleTime: 60_000 });
  const { data: lecturers } = useQuery({ queryKey: ['top-lecturers'], queryFn: () => api.get('/analytics/top-lecturers') as any, staleTime: 300_000 });
  const { data: impact } = useQuery({ queryKey: ['eco-impact'], queryFn: () => api.get('/eco/campus-impact') as any, staleTime: 120_000 });

  const now = new Date();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>System Overview</h1>
        <p className="text-slate-500 text-sm mt-1">
          {user?.tenantId?.toUpperCase()} · {now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Students" value={kpis?.totalStudents?.toLocaleString() ?? '—'} icon={<Users size={16} />} color="text-white" />
        <Stat label="Avg. Attendance" value={kpis?.avgAttendancePct != null ? `${kpis.avgAttendancePct}%` : '—'} color={kpis?.avgAttendancePct > 0 ? 'text-emerald-400' : 'text-slate-400'} sub="GPS verified" />
        <Stat label="Avg. GPA" value={kpis?.avgGpa ? Number(kpis.avgGpa).toFixed(2) : '—'} color="text-amber-400" icon={<Trophy size={16} />} />
        <Stat label="At-Risk Students" value={kpis?.atRiskStudents ?? '—'} color={kpis?.atRiskStudents > 0 ? 'text-red-400' : 'text-emerald-400'} sub="Attendance < 70%" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="CO₂ Avoided" value={impact?.co2AvoidedG ? `${(Number(impact.co2AvoidedG)/1_000_000).toFixed(2)}t` : '—'} color="text-emerald-400" icon={<Leaf size={16} />} />
        <Stat label="Digital Actions" value={impact?.totalDigitalActions?.toLocaleString() ?? '0'} color="text-blue-400" />
        <Stat label="Enrollment Pending" value={pending?.enrollmentsPending ?? '0'} color={pending?.enrollmentsPending > 0 ? 'text-amber-400' : 'text-slate-400'} />
        <Stat label="Exams Without Marks" value={pending?.examsWithoutMarks ?? '0'} color={pending?.examsWithoutMarks > 0 ? 'text-red-400' : 'text-slate-400'} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Actions */}
        <Card>
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-400" />
            Pending Actions
          </h2>
          {[
            { label: 'Enrollment Approvals', value: pending?.enrollmentsPending ?? 0, color: 'orange', urgent: pending?.enrollmentsPending > 0 },
            { label: 'Exams Without Marks', value: pending?.examsWithoutMarks ?? 0, color: 'red', urgent: pending?.examsWithoutMarks > 0 },
            { label: 'Result Appeals', value: pending?.resultAppeals ?? 0, color: 'purple', urgent: pending?.resultAppeals > 0 },
            { label: 'Library Fines Overdue', value: pending?.overdueLibraryFinesKes > 0 ? `KES ${Number(pending.overdueLibraryFinesKes).toLocaleString()}` : 0, color: 'orange', urgent: pending?.overdueLibraryFinesKes > 0 },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
              <p className="text-sm text-slate-300">{item.label}</p>
              <Badge label={String(item.value)} color={item.urgent ? item.color : 'green'} />
            </div>
          ))}
        </Card>

        {/* Top Lecturers */}
        <Card>
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <GraduationCap size={14} className="text-blue-400" />
            Top Rated Lecturers
          </h2>
          {Array.isArray(lecturers) && lecturers.length > 0 ? (
            (lecturers as any[]).slice(0, 5).map((l: any, i: number) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                  {l.first_name?.[0]}{l.last_name?.[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{l.first_name} {l.last_name}</p>
                  <p className="text-xs text-slate-500">{l.total_ratings} student ratings</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-amber-400 text-xs">★</span>
                  <span className="text-sm font-semibold text-amber-400">{l.avg_rating}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">No ratings recorded yet</p>
          )}
        </Card>
      </div>
    </div>
  );
}
