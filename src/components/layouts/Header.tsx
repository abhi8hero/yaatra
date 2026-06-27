import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGES } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Compass, Search, Bell, User, Menu, X, LogOut,
  LayoutDashboard, Map, Briefcase, Wallet, FileText,
  MessageSquare, AlertTriangle, Train, Settings, ChevronRight,
  Globe
} from 'lucide-react';
import { globalSearch } from '@/lib/api';
import { cn } from '@/lib/utils';

const NAV_LINK_KEYS = [
  { key: 'nav.explore' as const, href: '/explore' },
  { key: 'nav.planTrip' as const, href: '/planner' },
  { key: 'nav.dashboard' as const, href: '/dashboard', auth: true },
];

const SIDEBAR_ITEM_KEYS = [
  { icon: LayoutDashboard, key: 'nav.dashboard' as const, href: '/dashboard' },
  { icon: Map,             key: 'nav.explore' as const,   href: '/explore' },
  { icon: Briefcase,       key: 'nav.myTrips' as const,   href: '/trips' },
  { icon: Wallet,          key: 'nav.travelWallet' as const, href: '/wallet' },
  { icon: FileText,        key: 'nav.myDocuments' as const,  href: '/documents' },
  { icon: MessageSquare,   key: 'nav.aiAssistant' as const,  href: '/ai-assistant' },
  { icon: AlertTriangle,   key: 'nav.emergencyHub' as const, href: '/emergency' },
  { icon: Train,           key: 'nav.transportHub' as const, href: '/transport' },
  { icon: User,            key: 'nav.profile' as const,   href: '/profile' },
];

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const { language, setLanguage, t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    clearTimeout(searchTimeout.current);
    if (!q.trim()) { setSearchResults(null); setSearchOpen(false); return; }
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      const results = await globalSearch(q);
      setSearchResults(results);
      setSearchOpen(true);
      setSearching(false);
    }, 350);
  };

  const goToSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  const hasResults = searchResults && (
    searchResults.destinations?.length || searchResults.attractions?.length ||
    searchResults.experiences?.length || searchResults.festivals?.length
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Compass className="h-5 w-5 text-primary" strokeWidth={1.5} />
          <span className="font-semibold text-base tracking-tight">yaatra</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {NAV_LINK_KEYS.map(link => (
            (!link.auth || user) && (
              <Link key={link.href} to={link.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn('text-sm font-normal', location.pathname.startsWith(link.href) && link.href !== '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}
                >
                  {t(link.key)}
                </Button>
              </Link>
            )
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div ref={searchRef} className="relative hidden md:block">
          <div className="flex items-center gap-2 border border-border rounded-md px-3 h-9 w-60 focus-within:border-primary transition-colors">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder={t('search.placeholder')}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground min-w-0"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && goToSearch()}
            />
            {searching && <span className="text-xs text-muted-foreground">…</span>}
          </div>

          {/* Inline search dropdown */}
          {searchOpen && hasResults && (
            <div className="absolute top-full mt-1 w-80 bg-popover border border-border rounded-md shadow-md overflow-hidden z-50">
              {searchResults.destinations?.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-xs text-muted-foreground font-medium border-b border-border">{t('search.destinations')}</div>
                  {searchResults.destinations.slice(0, 3).map((d: any) => (
                    <button key={d.id} onClick={() => { navigate(`/destination/${d.slug}`); setSearchOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left">
                      <Map className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{d.name}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground ml-auto shrink-0" />
                    </button>
                  ))}
                </div>
              )}
              {searchResults.experiences?.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-xs text-muted-foreground font-medium border-b border-border">{t('search.experiences')}</div>
                  {searchResults.experiences.slice(0, 2).map((e: any) => (
                    <button key={e.id} onClick={() => { navigate(`/search?q=${searchQuery}`); setSearchOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{e.name}</span>
                    </button>
                  ))}
                </div>
              )}
              <button onClick={goToSearch}
                className="w-full px-3 py-2 text-xs text-primary hover:bg-muted transition-colors text-left border-t border-border">
                {t('search.viewAllResults')} "{searchQuery}"
              </button>
            </div>
          )}
        </div>

        {/* Language selector — desktop */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1.5 h-9 px-2 text-muted-foreground hover:text-foreground">
              <Globe className="h-4 w-4 shrink-0" />
              <span className="text-xs font-medium">{currentLanguage.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 max-h-72 overflow-y-auto">
            {LANGUAGES.map(lang => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={cn('cursor-pointer justify-between', language === lang.code && 'text-primary font-medium')}
              >
                <span>{lang.label}</span>
                <span className="text-xs text-muted-foreground">{lang.englishLabel}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Auth actions */}
        {user ? (
          <div className="flex items-center gap-1">
            <Link to="/notifications">
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Bell className="h-4 w-4" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium truncate">{profile?.full_name || t('auth.traveller')}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile?.email || user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer"><LayoutDashboard className="h-4 w-4 mr-2" />{t('nav.dashboard')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer"><User className="h-4 w-4 mr-2" />{t('nav.profile')}</Link>
                </DropdownMenuItem>
                {profile?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer"><Settings className="h-4 w-4 mr-2" />{t('common.adminPanel')}</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { signOut(); navigate('/'); }} className="text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />{t('auth.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm" className="text-sm font-normal">{t('auth.signIn')}</Button></Link>
            <Link to="/register"><Button size="sm" className="text-sm">{t('auth.getStarted')}</Button></Link>
          </div>
        )}

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-sidebar">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                <Link to="/" className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  <span className="font-semibold tracking-tight text-sidebar-foreground">yaatra</span>
                </Link>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile search */}
              <div className="p-4 border-b border-sidebar-border">
                <div className="flex items-center gap-2 border border-sidebar-border rounded-md px-3 h-9">
                  <Search className="h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t('search.placeholder')}
                    className="flex-1 text-sm bg-transparent outline-none"
                    onKeyDown={e => { if (e.key === 'Enter') { navigate(`/search?q=${(e.target as HTMLInputElement).value}`); setMobileOpen(false); } }}
                  />
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
                {user ? SIDEBAR_ITEM_KEYS.map(item => (
                  <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}>
                    <div className={cn('flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors',
                      location.pathname === item.href ? 'bg-sidebar-accent text-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    )}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {t(item.key)}
                    </div>
                  </Link>
                )) : (
                  <>
                    {NAV_LINK_KEYS.filter(l => !l.auth).map(link => (
                      <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}>
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                          {t(link.key)}
                        </div>
                      </Link>
                    ))}
                  </>
                )}
              </nav>

              <div className="p-4 border-t border-sidebar-border space-y-3">
                {/* Mobile language selector */}
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 flex flex-wrap gap-1">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full border transition-colors',
                          language === lang.code
                            ? 'border-primary bg-primary/10 text-primary font-medium'
                            : 'border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent'
                        )}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate text-sidebar-foreground">{profile?.full_name || t('auth.traveller')}</p>
                        {profile?.role === 'admin' && <Badge variant="secondary" className="text-xs">Admin</Badge>}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={() => { signOut(); navigate('/'); setMobileOpen(false); }}>
                      <LogOut className="h-4 w-4 mr-2" />{t('auth.signOut')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)}><Button className="w-full" size="sm">{t('auth.signIn')}</Button></Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}><Button variant="outline" className="w-full" size="sm">{t('auth.createAccount')}</Button></Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
