import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Compass, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { toast.error('Please accept the User Agreement to continue.'); return; }
    if (!email.trim() || !password) { toast.error('Please fill in all fields.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error('Please enter a valid email address.'); return; }
    setLoading(true);
    const { error } = await signInWithEmail(email.trim(), password);
    setLoading(false);
    if (error) { toast.error(error.message || 'Login failed. Please check your credentials.'); return; }
    toast.success('Welcome back!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden md:flex md:w-1/2 bg-secondary flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-primary" strokeWidth={1.5} />
          <span className="font-semibold text-lg tracking-tight">yaatra</span>
        </Link>
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight text-balance">
            Your intelligent<br />travel companion<br />for India.
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm text-pretty">
            Plan trips, track budgets, discover experiences, and travel with confidence — all in one place.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">© Yaatra. Promoting Indian Tourism.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="md:hidden flex items-center gap-2 mb-4">
            <Compass className="h-5 w-5 text-primary" strokeWidth={1.5} />
            <span className="font-semibold tracking-tight">yaatra</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="text-sm text-muted-foreground">Enter your email and password to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-normal">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                className="px-3"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-normal">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="px-3 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link to="/reset-password" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="agree"
                checked={agreed}
                onCheckedChange={v => setAgreed(!!v)}
                className="mt-0.5"
              />
              <label htmlFor="agree" className="text-xs text-muted-foreground leading-relaxed">
                I agree to the{' '}
                <span className="text-foreground underline underline-offset-2 cursor-pointer">User Agreement</span>
                {' '}and{' '}
                <span className="text-foreground underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-foreground font-medium hover:text-primary transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
