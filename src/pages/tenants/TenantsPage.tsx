import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Plus, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Card, Badge, Button, Input } from '../../components/ui';
import { RoleGate } from '../../components/layout/Shell';
import api from '../../api/client';

export function TenantsPage() {
  const [form, setForm] = useState({ name: '', academicYear: '2025/26', startDate: '', endDate: '' });
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data: semesters = [] } = useQuery({ queryKey: ['semesters-list'], queryFn: () => api.get('/semesters') as any, staleTime: 60_000 });
  const { data: faculties = [] } = useQuery({ queryKey: ['faculties-list'], queryFn: () => api.get('/faculties') as any, staleTime: 60_000 });

  const createSemMutation = useMutation({
    mutationFn: () => api.post('/semesters', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['semesters-list'] }); setShowForm(false); setForm({ name: '', academicYear: '2025/26', startDate: '', endDate: '' }); },
  });

  const setCurrentMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/semesters/${id}/set-current`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['semesters-list'] }),
  });

  const semList = Array.isArray(semesters) ? semesters as any[] : [];
  const facList = Array.isArray(faculties) ? faculties as any[] : [];

  return (
    <RoleGate roles={['super_admin']}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>University Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage tenants, semesters, and faculties</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Semesters */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Academic Semesters</h2>
              <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus size={12} /> New</Button>
            </div>

            {showForm && (
              <Card className="mb-4 border-emerald-500/20">
                <h3 className="text-sm font-semibold text-white mb-3">New Semester</h3>
                <div className="flex flex-col gap-3">
                  <Input label="Name" placeholder="Semester 2 2025/26" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <Input label="Academic Year" value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                    <Input label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => createSemMutation.mutate()} loading={createSemMutation.isPending} disabled={!form.name || !form.startDate}>Create</Button>
                    <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                  {createSemMutation.isSuccess && <p className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle size={11} /> Created</p>}
                </div>
              </Card>
            )}

            <div className="flex flex-col gap-2">
              {semList.length === 0 ? (
                <Card><p className="text-sm text-slate-500 text-center py-4">No semesters yet</p></Card>
              ) : semList.map((s: any) => (
                <Card key={s.id} className={s.isCurrent ? 'border-emerald-500/30' : ''}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-white">{s.name}</p>
                        {s.isCurrent && <Badge label="● Active" color="green" />}
                      </div>
                      <p className="text-xs text-slate-500">{s.academicYear} · {s.startDate} → {s.endDate}</p>
                    </div>
                    {!s.isCurrent && (
                      <Button size="sm" variant="secondary" onClick={() => setCurrentMutation.mutate(s.id)} loading={setCurrentMutation.isPending}>
                        Set Active
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Faculties */}
          <div>
            <h2 className="text-sm font-semibold text-white mb-4">Faculties</h2>
            <div className="flex flex-col gap-2">
              {facList.length === 0 ? (
                <Card><p className="text-sm text-slate-500 text-center py-4">No faculties configured</p></Card>
              ) : facList.map((f: any) => (
                <Card key={f.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center">
                      <Building2 size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{f.name}</p>
                      {f.code && <p className="text-xs text-slate-500">{f.code}</p>}
                    </div>
                  </div>
                  <Badge label="Active" color="green" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
