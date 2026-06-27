import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Map, Briefcase, Wallet, FileText,
  MessageSquare, AlertTriangle, Train, User, Settings, Compass
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Map, label: 'Explore', href: '/explore' },
  { icon: Briefcase, label: 'My Trips', href: '/trips' },
  { icon: Wallet, label: 'Travel Wallet', href: '/wallet' },
  { icon: FileText, label: 'My Documents', href: '/documents' },
  { icon: MessageSquare, label: 'AI Assistant', href: '/ai-assistant' },
  { icon: AlertTriangle, label: 'Emergency Hub', href: '/emergency' },
  { icon: Train, label: 'Transport Hub', href: '/transport' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export default function Sidebar() {
  const location = useLocation();
  const { profile } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-sidebar-border bg-sidebar min-h-screen sticky top-14 h-[calc(100vh-3.5rem)]">
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.href ||
            (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
          return (
            <Link key={item.href} to={item.href}>
              <div className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                active
                  ? 'bg-sidebar-accent text-primary font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}>
                <item.icon className={cn('h-4 w-4 shrink-0', active ? 'text-primary' : '')} />
                <span className="truncate">{item.label}</span>
              </div>
            </Link>
          );
        })}

        {profile?.role === 'admin' && (
          <>
            <div className="pt-3 pb-1 px-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Admin</p>
            </div>
            <Link to="/admin">
              <div className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                location.pathname.startsWith('/admin')
                  ? 'bg-sidebar-accent text-primary font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}>
                <Settings className="h-4 w-4 shrink-0" />
                <span>Admin Panel</span>
              </div>
            </Link>
          </>
        )}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate text-sidebar-foreground">{profile?.full_name || 'Traveller'}</p>
            {profile?.role === 'admin' && (
              <Badge variant="secondary" className="text-xs px-1 py-0 h-4">Admin</Badge>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
