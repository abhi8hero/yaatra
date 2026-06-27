import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { getTrips, getExpenses, getBookings, getNotifications, updateTrip } from '@/lib/api';
import type { Trip, Expense, Booking, Notification } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Briefcase, Plus, Calendar, IndianRupee, ArrowRight, MapPin,
  Zap, Bell, CheckCircle, AlertCircle, Clock, Star, Navigation,
  Wallet, FileText, MessageSquare, Shield, Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PHASE_COLORS: Record<string, string> = {
  planning: 'text-info',
  traveling: 'text-success',
  completed: 'text-muted-foreground',
  cancelled: 'text-destructive',
};

const BOOKING_STATUS_ICONS: Record<string, any> = {
  not_started: Clock,
  pending: AlertCircle,
  booked: CheckCircle,
  cancelled: AlertCircle,
  completed: CheckCircle,
};

const BOOKING_STATUS_COLORS: Record<string, string> = {
  not_started: 'text-muted-foreground',
  pending: 'text-warning',
  booked: 'text-success',
  cancelled: 'text-destructive',
  completed: 'text-info',
};

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTripData, setActiveTripData] = useState<{
    expenses: Expense[];
    bookings: Booking[];
  }>({ expenses: [], bookings: [] });
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([getTrips(user.id), getNotifications(user.id)]).then(([t, n]) => {
      setTrips(t);
      setNotifications(n.filter(notif => !notif.is_read).slice(0, 5));
      const activeTrip = t.find(trip => trip.phase === 'traveling') || t.find(trip => trip.phase === 'planning');
      if (activeTrip) {
        Promise.all([getExpenses(activeTrip.id), getBookings(activeTrip.id)]).then(([exps, bks]) => {
          setActiveTripData({ expenses: exps.slice(0, 5), bookings: bks.slice(0, 5) });
        });
      }
      setLoading(false);
    });
  }, [user]);

  const activeTrip = trips.find(t => t.phase === 'traveling') || trips.find(t => t.phase === 'planning');
  const upcomingTrips = trips.filter(t => t.phase === 'planning' || t.phase === 'traveling');
  const pastTrips = trips.filter(t => t.phase === 'completed').slice(0, 3);

  const totalSpent = activeTripData.expenses.reduce((s, e) => s + e.amount, 0);
  const budgetPct = activeTrip ? Math.min(100, Math.round((totalSpent / activeTrip.total_budget) * 100)) : 0;

  const handleToggleCompanionMode = async (trip: Trip) => {
    setTogglingId(trip.id);
    const newVal = !trip.travel_mode_active;
    const ok = await updateTrip(trip.id, { travel_mode_active: newVal, phase: newVal ? 'traveling' : 'planning' });
    if (ok) {
      setTrips(prev => prev.map(t => t.id === trip.id ? { ...t, travel_mode_active: newVal, phase: newVal ? 'traveling' : 'planning' } : t));
      toast.success(newVal ? 'Travel Companion Mode activated! 🌟' : 'Switched back to planning mode.');
    } else {
      toast.error('Failed to update trip mode.');
    }
    setTogglingId(null);
  };

  const getDaysUntil = (dateStr: string) => {
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Past';
    if (diff === 0) return 'Today!';
    if (diff === 1) return 'Tomorrow';
    return `${diff} days away`;
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-semibold text-balance">
              {activeTrip?.travel_mode_active ? '🧭 Travel Mode' : 'Dashboard'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {activeTrip?.travel_mode_active
                ? `You're travelling to ${activeTrip.destination_name}. Safe travels!`
                : `Welcome back, ${profile?.full_name?.split(' ')[0] || 'Traveller'}!`
              }
            </p>
          </div>
          <Link to="/planner">
            <Button className="gap-2"><Plus className="h-4 w-4" /> New trip</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
          </div>
        ) : (
          <>
            {/* TRAVEL COMPANION MODE BANNER */}
            {activeTrip && (
              <Card className={cn('border-2', activeTrip.travel_mode_active ? 'border-primary bg-primary/5' : 'border-border')}>
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center shrink-0', activeTrip.travel_mode_active ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                        <Navigation className={cn('h-6 w-6', activeTrip.travel_mode_active ? '' : 'text-muted-foreground')} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-semibold text-sm">Travel Companion Mode</h2>
                          {activeTrip.travel_mode_active && <Badge className="bg-primary text-primary-foreground text-xs">Active</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 text-pretty">
                          {activeTrip.travel_mode_active
                            ? `Showing real-time assistance for your ${activeTrip.destination_name} trip.`
                            : `Activate when you start travelling to ${activeTrip.destination_name} for real-time assistance.`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Label className="text-sm cursor-pointer">
                        {activeTrip.travel_mode_active ? 'On' : 'Off'}
                      </Label>
                      <Switch
                        checked={activeTrip.travel_mode_active}
                        onCheckedChange={() => handleToggleCompanionMode(activeTrip)}
                        disabled={!!togglingId}
                      />
                    </div>
                  </div>

                  {/* Companion Mode Quick Actions */}
                  {activeTrip.travel_mode_active && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 pt-4 border-t border-primary/20">
                      {[
                        { icon: Wallet, label: 'Track Expense', href: '/wallet' },
                        { icon: FileText, label: 'My Documents', href: '/documents' },
                        { icon: Shield, label: 'Emergency', href: '/emergency' },
                        { icon: MessageSquare, label: 'AI Help', href: '/ai-assistant' },
                      ].map(action => (
                        <Link key={action.href} to={action.href}>
                          <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-background border border-primary/20 hover:border-primary transition-colors cursor-pointer">
                            <action.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                            <span className="text-xs text-center">{action.label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* STATS ROW */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Trips', value: trips.length, icon: Briefcase },
                { label: 'Upcoming', value: upcomingTrips.length, icon: Calendar },
                { label: 'Completed', value: pastTrips.length, icon: CheckCircle },
                { label: 'Notifications', value: notifications.length, icon: Bell },
              ].map(stat => (
                <div key={stat.label} className="border border-border rounded-lg p-4 space-y-2 h-full">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <stat.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left col (2/3) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Active trip budget */}
                {activeTrip && (
                  <Card className="h-full flex flex-col">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        {activeTrip.title}
                      </CardTitle>
                      <Link to={`/trips/${activeTrip.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          View <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1">
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />{activeTrip.destination_name}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />{getDaysUntil(activeTrip.start_date)}
                        </span>
                        <Badge variant="secondary" className={cn('text-xs', PHASE_COLORS[activeTrip.phase])}>
                          {activeTrip.phase}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Budget used</span>
                          <span className="font-medium">₹{totalSpent.toLocaleString('en-IN')} / ₹{activeTrip.total_budget.toLocaleString('en-IN')}</span>
                        </div>
                        <Progress value={budgetPct} className="h-2" />
                        <p className="text-xs text-muted-foreground">{budgetPct}% of total budget used</p>
                      </div>

                      {/* Booking status summary */}
                      {activeTripData.bookings.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Bookings</p>
                          <div className="space-y-1.5">
                            {activeTripData.bookings.slice(0, 4).map(bk => {
                              const Icon = BOOKING_STATUS_ICONS[bk.status] || Clock;
                              return (
                                <div key={bk.id} className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground truncate flex-1 min-w-0 mr-3">{bk.title}</span>
                                  <span className={cn('flex items-center gap-1 text-xs shrink-0', BOOKING_STATUS_COLORS[bk.status])}>
                                    <Icon className="h-3.5 w-3.5" />
                                    {bk.status.replace('_', ' ')}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Upcoming trips list */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-sm">Upcoming Trips</h2>
                    <Link to="/trips"><Button variant="ghost" size="sm" className="h-7 text-xs">View all</Button></Link>
                  </div>
                  {upcomingTrips.length === 0 ? (
                    <div className="border border-dashed border-border rounded-lg p-8 text-center space-y-3">
                      <Briefcase className="h-8 w-8 text-muted-foreground mx-auto" strokeWidth={1.5} />
                      <p className="text-muted-foreground text-sm">No upcoming trips yet.</p>
                      <Link to="/planner"><Button size="sm" variant="outline">Plan your first trip</Button></Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {upcomingTrips.slice(0, 4).map(trip => (
                        <Link key={trip.id} to={`/trips/${trip.id}`}>
                          <div className="flex items-center justify-between border border-border rounded-lg p-4 hover:border-primary/30 transition-colors cursor-pointer">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{trip.title}</p>
                              <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-xs text-muted-foreground">{trip.destination_name}</span>
                                <span className="text-xs text-muted-foreground">·</span>
                                <span className="text-xs text-muted-foreground">{getDaysUntil(trip.start_date)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant="secondary" className={cn('text-xs', PHASE_COLORS[trip.phase])}>
                                {trip.phase}
                              </Badge>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right col (1/3) */}
              <div className="space-y-6">
                {/* Notifications */}
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      Notifications
                    </CardTitle>
                    <Link to="/notifications">
                      <Button variant="ghost" size="sm" className="h-8 text-xs">All</Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 space-y-2">
                        <Bell className="h-8 w-8 text-muted-foreground mx-auto" strokeWidth={1.5} />
                        <p className="text-xs text-muted-foreground">You're all caught up!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map(n => (
                          <div key={n.id} className="flex gap-3">
                            <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium">{n.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick links */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Quick Access</p>
                  {[
                    { icon: Wallet, label: 'Travel Wallet', href: '/wallet', desc: 'Track expenses' },
                    { icon: FileText, label: 'My Documents', href: '/documents', desc: 'Store travel docs' },
                    { icon: Shield, label: 'Emergency Hub', href: '/emergency', desc: 'SOS contacts' },
                    { icon: MessageSquare, label: 'AI Assistant', href: '/ai-assistant', desc: 'Get travel help' },
                  ].map(link => (
                    <Link key={link.href} to={link.href}>
                      <div className="flex items-center gap-3 border border-border rounded-lg px-4 py-3 hover:border-primary/30 transition-colors cursor-pointer">
                        <link.icon className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{link.label}</p>
                          <p className="text-xs text-muted-foreground">{link.desc}</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
