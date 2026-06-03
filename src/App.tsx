import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './store/auth';
import { Shell } from './components/layout/Shell';
import { LoginPage } from './pages/auth/LoginPage';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { HealthPage } from './pages/health/HealthPage';
import { TenantsPage } from './pages/tenants/TenantsPage';
import { UsersPage } from './pages/users/UsersPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { LogsPage } from './pages/logs/LogsPage';
import { SettingsPage } from './pages/settings/SettingsPage';

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } });

function Guard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Guard><Shell /></Guard>}>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/health" element={<HealthPage />} />
            <Route path="/tenants" element={<TenantsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
