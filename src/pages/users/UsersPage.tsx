import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Search, UserX, CheckCircle, X } from 'lucide-react';
import { Card, Badge, Button, Input, Table } from '../../components/ui';
import api from '../../api/client';

const ROLES = ['student','lecturer','registrar','librarian','dean','admin','super_admin'];
const ROLE_COLORS: Record<string, string> = { student:'green', lecturer:'blue', registrar:'orange', librarian:'orange', dean:'purple', admin:'purple', super_admin:'red' };
const BLANK = { email:'', firstName:'', lastName:'', phone:'', role:'student', studentNo:'', password:'CampoVibe123x' };

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['all-users', roleFilter],
    queryFn: () => api.get('/users', { params: { role: roleFilter || undefined } }) as any,
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: () => api.post('/users', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['all-users'] }); setShowForm(false); setForm({ ...BLANK }); },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/users/${id}/deactivate`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['all-users'] }),
  });

  const users = (data?.users ?? []) as any[];
  const filtered = search ? users.filter((u: any) => `${u.firstName} ${u.lastName} ${u.email} ${u.studentNo ?? ''}`.toLowerCase().includes(search.toLowerCase())) : users;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Users</h1>
          <p className="text-slate-500 text-sm mt-1">{data?.total ?? 0} total accounts</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><UserPlus size={14} /> Add User</Button>
      </div>

      {showForm && (
        <Card className="mb-6 border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Create User Account</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <Input label="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <Input label="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone" placeholder="+254..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Student No. (optional)" value={form.studentNo} onChange={(e) => setForm({ ...form, studentNo: e.target.value })} />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Role</label>
              <select className="bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#00C896]/50" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => createMutation.mutate()} loading={createMutation.isPending} disabled={!form.email || !form.firstName}>Create User</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
          {createMutation.isSuccess && <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><CheckCircle size={12} /> User created</p>}
          {createMutation.isError && <p className="text-xs text-red-400 mt-2">Failed — email may already exist</p>}
        </Card>
      )}

      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-[#00C896]/50 transition-all" placeholder="Search by name, email, or student number…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#00C896]/50 min-w-[120px]" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <Card className="p-0 overflow-hidden">
        {isLoading ? <p className="text-sm text-slate-500 p-6">Loading users…</p> : (
          <Table
            headers={['Name', 'Email', 'Student No.', 'Role', 'Status', '']}
            rows={filtered.map((u: any) => [
              <span className="font-medium text-white">{u.firstName} {u.lastName}</span>,
              <span className="text-slate-400 text-xs">{u.email}</span>,
              <span className="font-mono text-xs text-slate-500">{u.studentNo ?? '—'}</span>,
              <Badge label={u.role} color={ROLE_COLORS[u.role] ?? 'gray'} />,
              <Badge label={u.isActive ? 'Active' : 'Inactive'} color={u.isActive ? 'green' : 'red'} />,
              u.isActive ? (
                <Button size="sm" variant="danger" onClick={() => deactivateMutation.mutate(u.id)} loading={deactivateMutation.isPending}>
                  <UserX size={11} /> Deactivate
                </Button>
              ) : null,
            ])}
          />
        )}
      </Card>
    </div>
  );
}
