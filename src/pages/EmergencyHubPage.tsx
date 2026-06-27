import { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getEmergencyContacts, getTrips } from '@/lib/api';
import type { EmergencyContact, Trip } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, Phone, MapPin, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPE_COLORS: Record<string, string> = {
  police: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  ambulance: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  fire: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  emergency: 'bg-destructive/10 text-destructive',
  helpline: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  transport: 'bg-muted text-muted-foreground',
};

export default function EmergencyHubPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string>('national');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const destId = trips.find(t => t.id === selectedTrip)?.destination_id;
    getEmergencyContacts(destId || undefined).then(c => { setContacts(c); setLoading(false); });
  }, [selectedTrip, trips]);

  useEffect(() => {
    if (!user) return;
    getTrips(user.id).then(setTrips);
  }, [user]);

  const grouped: Record<string, EmergencyContact[]> = {};
  contacts.forEach(c => { if (!grouped[c.type]) grouped[c.type] = []; grouped[c.type].push(c); });

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" strokeWidth={1.5} />
            Emergency Hub
          </h1>
          <p className="text-sm text-muted-foreground">Critical contacts and safety information, always accessible.</p>
        </div>

        {/* SOS banner */}
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-5 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h2 className="font-semibold text-destructive">Emergency? Call 112</h2>
          </div>
          <p className="text-sm text-muted-foreground">India's unified emergency number works for police, ambulance, and fire across all states.</p>
          <a href="tel:112">
            <Button variant="destructive" className="gap-2 mt-1">
              <Phone className="h-4 w-4" /> Call 112 (National Emergency)
            </Button>
          </a>
        </div>

        {/* Trip filter */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Filter by location</p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedTrip('national')}
              className={cn('px-4 py-1.5 rounded-full border text-xs transition-colors shrink-0',
                selectedTrip === 'national' ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-foreground')}
            >
              National Numbers
            </button>
            {trips.filter(t => t.destination_id).map(t => (
              <button key={t.id} onClick={() => setSelectedTrip(t.id)}
                className={cn('px-4 py-1.5 rounded-full border text-xs transition-colors shrink-0',
                  selectedTrip === t.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-foreground')}>
                {t.destination_name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([type, items]) => (
              <div key={type} className="space-y-3">
                <h2 className="text-sm font-medium capitalize text-muted-foreground uppercase tracking-wider">{type}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {items.map(c => (
                    <div key={c.id} className="border border-border rounded-lg p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn('text-xs px-2 py-0.5 rounded capitalize', TYPE_COLORS[c.type] || TYPE_COLORS.transport)}>{c.type}</span>
                          {c.is_national && <Badge variant="secondary" className="text-xs">National</Badge>}
                        </div>
                        <p className="font-medium text-sm mt-1">{c.name}</p>
                        {c.city && <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{c.city}</p>}
                      </div>
                      {c.phone && (
                        <a href={`tel:${c.phone}`} className="shrink-0">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Phone className="h-4 w-4" />{c.phone}
                          </Button>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
