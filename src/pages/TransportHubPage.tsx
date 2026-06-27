import { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getTransportOptions } from '@/lib/api';
import type { TransportOption } from '@/types/types';
import { Train, Search, IndianRupee, Clock, ExternalLink, Bus } from 'lucide-react';
import { cn } from '@/lib/utils';

const MODE_COLORS: Record<string, string> = {
  train: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  bus: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  flight: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  ferry: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  car: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

const QUICK_ROUTES = [
  { from: 'Delhi', to: 'Jaipur' },
  { from: 'Mumbai', to: 'Goa' },
  { from: 'Bangalore', to: 'Coorg' },
  { from: 'Chennai', to: 'Kerala' },
];

export default function TransportHubPage() {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [options, setOptions] = useState<TransportOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    const data = await getTransportOptions(fromCity || undefined, toCity || undefined);
    setOptions(data);
    setLoading(false);
  };

  const handleQuickRoute = (from: string, to: string) => {
    setFromCity(from); setToCity(to);
    setLoading(true);
    setSearched(true);
    getTransportOptions(from, to).then(data => { setOptions(data); setLoading(false); });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
            <Train className="h-6 w-6 text-primary" strokeWidth={1.5} />
            Transportation Hub
          </h1>
          <p className="text-sm text-muted-foreground">Discover transport options between any two cities in India.</p>
        </div>

        {/* Search */}
        <div className="border border-border rounded-lg p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">From</label>
              <Input value={fromCity} onChange={e => setFromCity(e.target.value)} placeholder="e.g. Delhi, Mumbai" className="px-3"
                onKeyDown={e => e.key === 'Enter' && handleSearch()} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">To</label>
              <Input value={toCity} onChange={e => setToCity(e.target.value)} placeholder="e.g. Jaipur, Goa" className="px-3"
                onKeyDown={e => e.key === 'Enter' && handleSearch()} />
            </div>
          </div>
          <Button onClick={handleSearch} className="gap-2">
            <Search className="h-4 w-4" />Search Transport
          </Button>
        </div>

        {/* Quick routes */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Popular routes</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_ROUTES.map(r => (
              <button key={`${r.from}-${r.to}`} onClick={() => handleQuickRoute(r.from, r.to)}
                className="text-xs px-4 py-2 border border-border rounded-full hover:border-primary hover:text-primary transition-colors">
                {r.from} → {r.to}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />)}
          </div>
        )}

        {!loading && searched && options.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <Bus className="h-10 w-10 text-muted-foreground mx-auto" strokeWidth={1.5} />
            <p className="text-muted-foreground">No transport options found. Try different cities.</p>
          </div>
        )}

        {!loading && options.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-medium">{options.length} option{options.length !== 1 ? 's' : ''} found</p>
            <div className="space-y-3">
              {options.map(opt => (
                <div key={opt.id} className="border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs px-2 py-0.5 rounded capitalize font-medium', MODE_COLORS[opt.mode] || MODE_COLORS.car)}>{opt.mode}</span>
                      {opt.provider && <span className="text-sm font-medium">{opt.provider}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {opt.from_city} → {opt.to_city}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />₹{opt.estimated_cost.toLocaleString('en-IN')} approx.</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{opt.duration_hours}h travel time</span>
                    </div>
                  </div>
                  {opt.booking_link && (
                    <a href={opt.booking_link} target="_blank" rel="noopener noreferrer" className="shrink-0">
                      <Button variant="outline" size="sm" className="gap-2 h-9 text-sm">
                        <ExternalLink className="h-3.5 w-3.5" />Book Now
                      </Button>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!searched && (
          <div className="text-center py-12 space-y-3">
            <Train className="h-10 w-10 text-muted-foreground mx-auto" strokeWidth={1.5} />
            <p className="text-muted-foreground text-sm">Search for trains, buses, flights between any Indian cities.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
