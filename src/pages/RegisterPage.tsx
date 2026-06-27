import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Compass, Eye, EyeOff } from 'lucide-react';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi (हिन्दी)' },
  { value: 'mr', label: 'Marathi (मराठी)' },
  { value: 'ta', label: 'Tamil (தமிழ்)' },
  { value: 'te', label: 'Telugu (తెలుగు)' },
  { value: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
  { value: 'ml', label: 'Malayalam (മലയാളം)' },
  { value: 'pa', label: 'Punjabi (ਪੰਜਾਬੀ)' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUpWithEmail } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [language, setLanguage] = useState('en');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { toast.error('Please accept the User Agreement to continue.'); return; }
    if (!fullName.trim() || !email.trim() || !password) { toast.error('Please fill in all required fields.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error('Please enter a valid email address.'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const result = await signUpWithEmail(email.trim(), password);
    if (result.error) {
      setLoading(false);
      toast.error(result.error.message || 'Registration failed.');
      return;
    }

    // Update profile with full name and language
    // Skip profile update here because user is not logged in yet
    // when email confirmation is enabled.
    /*const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session?.user) {
      await supabase.from('profiles').update({
        full_name: fullName.trim(),
        preferred_language: language,
        updated_at: new Date().toISOString(),
      }).eq('id', sessionData.session.user.id);
    } */
     setLoading(false);

      toast.success(
        `Verification email sent to ${email}. Please check your inbox and spam folder.`
      );

      navigate('/verify-email', {
        state: { email }
      });

      return;
        };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 bg-secondary flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-primary" strokeWidth={1.5} />
          <span className="font-semibold text-lg tracking-tight">yaatra</span>
        </Link>
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight text-balance">
            Start your journey<br />with India's smartest<br />travel ecosystem.
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm text-pretty">
            Join thousands of travellers who plan smarter, spend wiser, and discover more with Yaatra.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">© Yaatra. Promoting Indian Tourism.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="md:hidden flex items-center gap-2 mb-4">
            <Compass className="h-5 w-5 text-primary" strokeWidth={1.5} />
            <span className="font-semibold tracking-tight">yaatra</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Create account</h2>
            <p className="text-sm text-muted-foreground">Join Yaatra and start exploring India.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm font-normal">Full Name</Label>
              <Input id="fullName" placeholder="Rahul Sharma" value={fullName} onChange={e => setFullName(e.target.value)} className="px-3" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-normal">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className="px-3" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-normal">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="px-3 pr-10"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-normal">Preferred Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="px-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(l => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox id="agree" checked={agreed} onCheckedChange={v => setAgreed(!!v)} className="mt-0.5" />
              <label htmlFor="agree" className="text-xs text-muted-foreground leading-relaxed">
                I agree to the{' '}
                <span className="text-foreground underline underline-offset-2 cursor-pointer">User Agreement</span>
                {' '}and{' '}
                <span className="text-foreground underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-foreground font-medium hover:text-primary transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
