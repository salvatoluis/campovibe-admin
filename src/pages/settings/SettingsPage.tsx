import { Card, Input, Badge } from '../../components/ui';
import { useAuth } from '../../store/auth';

export function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Platform configuration and API keys</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">Account Details</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-sm text-slate-400">Name</span>
              <span className="text-sm text-white">{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-sm text-slate-400">Email</span>
              <span className="text-sm text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-sm text-slate-400">Role</span>
              <Badge label={user?.role ?? '—'} color={user?.role === 'super_admin' ? 'red' : 'purple'} />
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-slate-400">Tenant</span>
              <span className="font-mono text-sm text-white">{user?.tenantId}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">API Configuration</h3>
          <div className="flex flex-col gap-3">
            <Input label="API Base URL" value={import.meta.env.VITE_API_URL ?? '/v1'} readOnly />
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-1.5">Environment</label>
              <Badge label="Production" color="green" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-1.5">AI Assistant</label>
              <Badge label="Requires ANTHROPIC_API_KEY" color="orange" />
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-4">Feature Flags</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'GPS Attendance', on: true },
              { label: 'AI Assistant', on: false },
              { label: 'Eco Tracker', on: true },
              { label: 'Marketplace', on: true },
              { label: 'Live Quizzes', on: true },
              { label: 'M-Pesa Payments', on: false },
              { label: 'SMS Notifications', on: false },
              { label: 'PDF Transcripts', on: false },
            ].map((f) => (
              <div key={f.label} className="flex items-center justify-between bg-white/3 border border-white/6 rounded-lg px-3 py-2.5">
                <span className="text-xs text-slate-300">{f.label}</span>
                <Badge label={f.on ? 'ON' : 'OFF'} color={f.on ? 'green' : 'gray'} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
