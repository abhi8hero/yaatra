import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { globalSearch } from '@/lib/api';
import { Search, Map, Briefcase, Calendar, Star, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { saveDestination } from '@/lib/api';
import { toast } from 'sonner';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const query = searchParams.get('q') || '';
  const [input, setInput] = useState(query);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    globalSearch(query).then(r => { setResults(r); setLoading(false); });
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) setSearchParams({ q: input });
  };

  const handleSave = async (destId: string) => {
    if (!user) { toast.error('Sign in to save destinations.'); return; }
    await saveDestination(user.id, destId);
    toast.success('Added to wishlist!');
  };

  const total = results
    ? (results.destinations?.length || 0) + (results.attractions?.length || 0) +
      (results.experiences?.length || 0) + (results.festivals?.length || 0)
    : 0;

  const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 flex items-center border border-border rounded-md px-4 h-11 focus-within:border-primary transition-colors">
            <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Search destinations, experiences, festivals…"
              className="flex-1 text-sm bg-transparent outline-none min-w-0"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </div>
          <Button type="submit" className="h-11 px-5">Search</Button>
        </form>

        {query && (
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">
              {loading ? 'Searching…' : `${total} result${total !== 1 ? 's' : ''} for "${query}"`}
            </h1>
            {!loading && total === 0 && (
              <p className="text-muted-foreground text-sm">No results found. Try different keywords.</p>
            )}
          </div>
        )}

        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map(j => <Skeleton key={j} className="h-24 rounded-lg" />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && results && (
          <div className="space-y-10">
            {/* Destinations */}
            {results.destinations?.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Map className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Destinations</h2>
                  <Badge variant="secondary">{results.destinations.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.destinations.map((d: any) => (
                    <div key={d.id} className="border border-border rounded-lg p-4 flex gap-4 hover:border-primary/30 transition-colors">
                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="font-medium text-sm">{d.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-primary fill-primary" />
                          <span className="text-xs text-muted-foreground">{d.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">From ₹{d.budget_min?.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button size="sm" className="h-7 text-xs" onClick={() => navigate(`/destination/${d.slug}`)}>
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => navigate(`/planner?destination=${d.slug}`)}>
                          Plan Trip
                        </Button>
                        <button onClick={() => handleSave(d.id)} className="h-7 w-7 flex items-center justify-center border border-border rounded-md hover:text-primary transition-colors self-end">
                          <Heart className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Attractions */}
            {results.attractions?.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Map className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Attractions</h2>
                  <Badge variant="secondary">{results.attractions.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.attractions.map((a: any) => (
                    <div key={a.id} className="border border-border rounded-lg p-4 flex justify-between items-start hover:border-primary/30 transition-colors">
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm">{a.name}</h3>
                        {a.destinations && (
                          <p className="text-xs text-muted-foreground mt-0.5">in {(a.destinations as any).name}</p>
                        )}
                      </div>
                      {a.destinations && (
                        <Button size="sm" variant="outline" className="h-7 text-xs shrink-0 ml-3"
                          onClick={() => navigate(`/destination/${(a.destinations as any).slug}`)}>
                          View <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experiences */}
            {results.experiences?.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Experiences</h2>
                  <Badge variant="secondary">{results.experiences.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.experiences.map((e: any) => (
                    <div key={e.id} className="border border-border rounded-lg p-4 flex justify-between items-start hover:border-primary/30 transition-colors">
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm">{e.name}</h3>
                        {e.destinations && (
                          <p className="text-xs text-muted-foreground mt-0.5">in {(e.destinations as any).name}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5">₹{e.estimated_cost?.toLocaleString('en-IN')} · {e.duration_hours}h</p>
                      </div>
                      {e.destinations && (
                        <Button size="sm" variant="outline" className="h-7 text-xs shrink-0 ml-3"
                          onClick={() => navigate(`/destination/${(e.destinations as any).slug}`)}>
                          Details
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Festivals */}
            {results.festivals?.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Festivals</h2>
                  <Badge variant="secondary">{results.festivals.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.festivals.map((f: any) => (
                    <div key={f.id} className="border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
                      <h3 className="font-medium text-sm">{f.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {MONTHS[f.month_start]}{f.month_start !== f.month_end ? ` – ${MONTHS[f.month_end]}` : ''}
                      </p>
                      {f.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{f.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {!query && (
          <div className="text-center py-16 space-y-3">
            <Search className="h-10 w-10 text-muted-foreground mx-auto" strokeWidth={1.5} />
            <p className="text-muted-foreground">Enter a search term to discover destinations, experiences, and more.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
