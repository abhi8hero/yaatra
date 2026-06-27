import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSavedDestinations, unsaveDestination, updateProfile } from '@/lib/api';
import type { SavedDestination } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, LANGUAGES } from '@/contexts/LanguageContext';
import type { LanguageCode } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { ThemeMode } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { User, Heart, MapPin, Star, ArrowRight, Settings, LogOut, Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

const PERSONAS = [
  { value: 'budget',       labelKey: 'persona.budget'       },
  { value: 'luxury',       labelKey: 'persona.luxury'       },
  { value: 'adventure',    labelKey: 'persona.adventure'    },
  { value: 'food_explorer',labelKey: 'persona.food_explorer'},
  { value: 'religious',    labelKey: 'persona.religious'    },
  { value: 'family',       labelKey: 'persona.family'       },
] as const;

export default function ProfilePage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<SavedDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [persona, setPersona] = useState(profile?.travel_persona || '');
  const [budgetPref, setBudgetPref] = useState(profile?.budget_preference || 20000);
  const [lang, setLang] = useState<LanguageCode>((profile?.preferred_language as LanguageCode) || 'en');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setBio(profile.bio || '');
      setPersona(profile.travel_persona || '');
      setBudgetPref(profile.budget_preference || 20000);
      const profileLang = profile.preferred_language as LanguageCode;
      setLang(profileLang || 'en');
      // Sync LanguageContext with saved profile preference
      setLanguage(profileLang || 'en');
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    getSavedDestinations(user.id).then(data => { setWishlist(data); setLoading(false); });
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const ok = await updateProfile(user.id, {
      full_name: fullName,
      bio: bio || null,
      travel_persona: persona as any || null,
      budget_preference: budgetPref,
      preferred_language: lang,
    });
    setSaving(false);
    if (ok) {
      setLanguage(lang); // sync context on save
      await refreshProfile();
      toast.success('Profile updated!');
    } else {
      toast.error('Failed to save profile.');
    }
  };

  const handleRemoveWishlist = async (destId: string) => {
    if (!user) return;
    await unsaveDestination(user.id, destId);
    setWishlist(prev => prev.filter(w => w.destination_id !== destId));
    toast.success('Removed from wishlist.');
  };

  // Theme option config
  const THEME_OPTIONS: { value: ThemeMode; icon: React.ElementType; labelKey: 'theme.light' | 'theme.dark' | 'theme.system' }[] = [
    { value: 'light',  icon: Sun,     labelKey: 'theme.light'  },
    { value: 'dark',   icon: Moon,    labelKey: 'theme.dark'   },
    { value: 'system', icon: Monitor, labelKey: 'theme.system' },
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">{profile?.full_name || t('auth.traveller')}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              {profile?.role === 'admin' && <Badge variant="secondary" className="mt-1">Admin</Badge>}
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={() => { signOut(); navigate('/'); }}>
            <LogOut className="h-4 w-4" />{t('auth.signOut')}
          </Button>
        </div>

        <Tabs defaultValue="settings">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">{t('profile.settings')}</TabsTrigger>
            <TabsTrigger value="wishlist">{t('profile.wishlist')} ({wishlist.length})</TabsTrigger>
          </TabsList>

          {/* SETTINGS */}
          <TabsContent value="settings" className="space-y-6 pt-4">
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-normal">{t('profile.fullName')}</Label>
                  <Input value={fullName} onChange={e => setFullName(e.target.value)} className="px-3" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-normal">{t('profile.travelPersona')}</Label>
                  <Select value={persona} onValueChange={setPersona}>
                    <SelectTrigger className="px-3"><SelectValue placeholder={t('persona.selectPersona')} /></SelectTrigger>
                    <SelectContent>
                      {PERSONAS.map(p => (
                        <SelectItem key={p.value} value={p.value}>{t(p.labelKey)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-normal">{t('profile.bio')}</Label>
                <Textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder={t('profile.bioPlaceholder')}
                  className="px-3 resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-normal">{t('profile.budgetPreference')}</Label>
                  <Input
                    type="number"
                    min={0}
                    step={1000}
                    value={budgetPref}
                    onChange={e => setBudgetPref(parseInt(e.target.value) || 0)}
                    className="px-3"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-normal">{t('profile.preferredLanguage')}</Label>
                  <Select
                    value={lang}
                    onValueChange={val => {
                      setLang(val as LanguageCode);
                      setLanguage(val as LanguageCode); // live preview
                    }}
                  >
                    <SelectTrigger className="px-3"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(l => (
                        <SelectItem key={l.code} value={l.code}>
                          <span>{l.label}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{l.englishLabel}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Appearance / Theme selection */}
              <div className="space-y-2">
                <Label className="text-sm font-normal">{t('profile.appearance')}</Label>
                <div className="flex items-center gap-2">
                  {THEME_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setTheme(opt.value)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-2 rounded-md border text-sm transition-colors',
                          theme === opt.value
                            ? 'border-primary bg-primary/10 text-primary font-medium'
                            : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {t(opt.labelKey)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? t('profile.saving') : t('profile.saveProfile')}
              </Button>
            </div>
          </TabsContent>

          {/* WISHLIST */}
          <TabsContent value="wishlist" className="pt-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />)}
              </div>
            ) : wishlist.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Heart className="h-10 w-10 text-muted-foreground mx-auto" strokeWidth={1.5} />
                <p className="text-muted-foreground">{t('common.empty.wishlist')}</p>
                <Link to="/explore"><Button variant="outline">{t('common.discover')}</Button></Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlist.map(item => {
                  const dest = item.destination;
                  if (!dest) return null;
                  return (
                    <div key={item.id} className="border border-border rounded-lg overflow-hidden flex h-full">
                      <div className="w-28 shrink-0">
                        <img src={dest.image_url || ''} alt={dest.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 p-3 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-sm">{dest.name}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" />{dest.state}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-primary fill-primary" />
                            <span className="text-xs">{dest.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Link to={`/destination/${dest.slug}`} className="flex-1">
                            <Button size="sm" variant="outline" className="w-full h-7 text-xs">{t('common.view')}</Button>
                          </Link>
                          <button onClick={() => handleRemoveWishlist(dest.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Heart className="h-4 w-4 fill-current" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
