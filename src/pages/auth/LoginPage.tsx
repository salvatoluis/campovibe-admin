import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../store/auth';
import { Input, Button } from '../../components/ui';
import api from '../../api/client';

const ALLOWED_ROLES = ['admin', 'dean', 'super_admin'];

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password }) as any;
      const user = res.user ?? res;
      const token = res.accessToken;
      if (!ALLOWED_ROLES.includes(user.role)) {
        setError('Access denied. Admin, Dean, or Super Admin account required.');
        setLoading(false);
        return;
      }
      setAuth(user, token);
      navigate('/');
    } catch (err: any) {
      setError(err?.message?.message ?? err?.message ?? 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080F1E] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#00C896]/15 border border-[#00C896]/25 flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-[#00C896]" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            CampoVibe Admin
          </h1>
          <p className="text-sm text-slate-500 mt-1">System Administration Panel</p>
        </div>

        <div className="bg-[#0D1829] border border-white/7 rounded-2xl p-6">
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@university.ac.ke"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 pr-10 text-sm text-white placeholder-slate-500 outline-none focus:border-[#00C896]/50 transition-all"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

            <Button type="submit" loading={loading} className="w-full mt-1">
              Sign In to Admin Panel
            </Button>
          </form>
        </div>

        <div className="mt-4 p-3 bg-amber-500/8 border border-amber-500/15 rounded-xl">
          <p className="text-xs text-amber-400/80 text-center">
            🔒 Restricted access — Admin, Dean, and Super Admin roles only
          </p>
        </div>
      </div>
    </div>
  );
}
