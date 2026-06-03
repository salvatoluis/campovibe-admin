import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/auth';
import { LayoutDashboard, Users, Building2, BarChart3, ScrollText, Settings, Activity, LogOut, Shield } from 'lucide-react';
import { clsx } from 'clsx';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Overview', roles: ['admin','dean','super_admin'] },
  { to: '/health', icon: Activity, label: 'System Health', roles: ['super_admin'] },
  { to: '/tenants', icon: Building2, label: 'Universities', roles: ['super_admin'] },
  { to: '/users', icon: Users, label: 'Users', roles: ['admin','dean','super_admin'] },
  { to: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['admin','dean','super_admin'] },
  { to: '/logs', icon: ScrollText, label: 'Activity Logs', roles: ['super_admin'] },
  { to: '/settings', icon: Settings, label: 'Settings', roles: ['admin','dean','super_admin'] },
];

const ROLE_COLOR: Record<string, string> = {
  super_admin: 'bg-red-500/20 text-red-400',
  admin: 'bg-purple-500/20 text-purple-400',
  dean: 'bg-blue-500/20 text-blue-400',
};

export function Shell() {
  const { user, can, clearAuth } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#0D1829] border-r border-white/6 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-white/6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#00C896] flex items-center justify-center">
              <Shield size={14} className="text-[#080F1E]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                Campo<span className="text-[#00C896]">Admin</span>
              </p>
              <p className="text-[10px] text-slate-500">System Control</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.filter(n => can(n.roles as any)).map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => clsx(
                'flex items-center gap-2.5 px-4 py-2.5 text-sm border-l-2 transition-all',
                isActive
                  ? 'text-[#00C896] border-[#00C896] bg-[#00C896]/8'
                  : 'text-slate-400 border-transparent hover:text-white hover:bg-white/4'
              )}
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/6">
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/4 cursor-pointer" onClick={logout}>
            <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold', ROLE_COLOR[user?.role ?? 'admin'])}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <LogOut size={13} className="text-slate-500" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-[#080F1E]">
        <Outlet />
      </main>
    </div>
  );
}

export function RoleGate({ roles, children }: { roles: string[]; children: React.ReactNode }) {
  const { can } = useAuth();
  if (!can(roles as any)) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Shield size={32} className="mx-auto mb-3 text-slate-600" />
        <p className="text-sm text-slate-500">Access restricted</p>
        <p className="text-xs text-slate-600 mt-1">You don't have permission to view this page</p>
      </div>
    </div>
  );
  return <>{children}</>;
}
