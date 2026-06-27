import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getDestinations, getDestinationsByCategory, saveDestination, unsaveDestination, getSavedDestinations } from '@/lib/api';
import type { Destination, DestinationCategory } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Search, Star, MapPin, Heart, ArrowRight, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES: { value: string; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '🗺' },
  { value: 'beach', label: 'Beach', emoji: '🏖' },
  { value: 'hill_station', label: 'Hill Station', emoji: '⛰' },
  { value: 'pilgrimage', label: 'Pilgrimage', emoji: '🛕' },
  { value: 'wildlife', label: 'Wildlife', emoji: '🐯' },
  { value: 'adventure', label: 'Adventure', emoji: '🧗' },
  { value: 'heritage', label: 'Heritage', emoji: '🏛' },
  { value: 'food_tourism', label: 'Food & Culture', emoji: '🍛' },
  { value: 'luxury', label: 'Luxury', emoji: '✨' },
  { value: 'weekend_getaway', label: 'Weekend Getaway', emoji: '🌅' },
  { value: 'family_friendly', label: 'Family', emoji: '👨‍👩‍👧' },
];

const BUDGET_FILTERS = [
  { value: 'all', label: 'Any budget' },
  { value: 'budget', label: 'Budget (< ₹10K)' },
  { value: 'mid', label: 'Mid-range (₹10K–₹30K)' },
  { value: 'luxury', label: 'Luxury (₹30K+)' },
];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'budget_low', label: 'Price: Low to High' },
  { value: 'budget_high', label: 'Price: High to Low' },
  { value: 'reviews', label: 'Most Reviewed' },
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const initCategory = searchParams.get('category') || 'all';
  const initSearch = searchParams.get('search') || '';
  const [category, setCategory] = useState(initCategory);
  const [search, setSearch] = useState(initSearch);
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let data: Destination[] = [];
      if (category && category !== 'all') {
        data = await getDestinationsByCategory(category);
      } else {
        data = await getDestinations({ limit: 50 });
      }
      setDestinations(data);
      setLoading(false);
    };
    fetchData();
  }, [category]);

  useEffect(() => {
    if (user) {
      getSavedDestinations(user.id).then(saved => {
        setSavedIds(new Set(saved.map(s => s.destination_id)));
      });
    }
  }, [user]);

  const handleSave = async (e: React.MouseEvent, destId: string) => {
    e.preventDefault();
    if (!user) { toast.error('Sign in to save destinations.'); return; }
    if (savedIds.has(destId)) {
      await unsaveDestination(user.id, destId);
      setSavedIds(prev => { const n = new Set(prev); n.delete(destId); return n; });
      toast.success('Removed from wishlist.');
    } else {
      await saveDestination(user.id, destId);
      setSavedIds(prev => new Set(prev).add(destId));
      toast.success('Added to wishlist!');
    }
  };

  const filteredDests = destinations
    .filter(d => {
      if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.state?.toLowerCase().includes(search.toLowerCase())) return false;
      if (budgetFilter === 'budget' && d.budget_min >= 10000) return false;
      if (budgetFilter === 'mid' && (d.budget_min < 10000 || d.budget_min > 30000)) return false;
      if (budgetFilter === 'luxury' && d.budget_mid <= 30000) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'budget_low') return a.budget_min - b.budget_min;
      if (sortBy === 'budget_high') return b.budget_luxury - a.budget_luxury;
      if (sortBy === 'reviews') return b.review_count - a.review_count;
      return 0;
    });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-semibold text-balance">Explore India</h1>
            <p className="text-sm text-muted-foreground">Discover incredible destinations across the country.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowFilters(v => !v)}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </Button>
        </div>

        {/* Search bar */}
        <div className="flex items-center border border-border rounded-md px-4 h-11 focus-within:border-primary transition-colors">
          <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search destinations by name or state…"
            className="flex-1 text-sm bg-transparent outline-none min-w-0"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground ml-2">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter row */}
        {showFilters && (
          <div className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-md bg-muted/30">
            <div className="space-y-1.5 flex-1">
              <p className="text-xs font-medium text-muted-foreground">Budget</p>
              <div className="flex flex-wrap gap-2">
                {BUDGET_FILTERS.map(b => (
                  <button key={b.value} onClick={() => setBudgetFilter(b.value)}
                    className={cn('text-xs px-3 py-1.5 rounded-full border transition-colors',
                      budgetFilter === b.value ? 'border-primary text-primary bg-primary/5' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground')}>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Sort By</p>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map(s => (
                  <button key={s.value} onClick={() => setSortBy(s.value)}
                    className={cn('text-xs px-3 py-1.5 rounded-full border transition-colors',
                      sortBy === s.value ? 'border-primary text-primary bg-primary/5' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground')}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 whitespace-nowrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => { setCategory(cat.value); setSearchParams(cat.value !== 'all' ? { category: cat.value } : {}); }}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-colors shrink-0',
                category === cat.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
              )}
            >
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-muted-foreground">
            {filteredDests.length} destination{filteredDests.length !== 1 ? 's' : ''} found
            {category !== 'all' && ` in ${CATEGORIES.find(c => c.value === category)?.label}`}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg border border-border overflow-hidden">
                <Skeleton className="aspect-[4/3]" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredDests.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Search className="h-10 w-10 text-muted-foreground mx-auto" strokeWidth={1.5} />
            <p className="text-muted-foreground">No destinations match your filters. Try adjusting them.</p>
            <Button variant="outline" onClick={() => { setCategory('all'); setSearch(''); setBudgetFilter('all'); }}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDests.map(dest => (
              <Link key={dest.id} to={`/destination/${dest.slug}`}>
                <Card className="group overflow-hidden border border-border hover:border-primary/30 transition-colors cursor-pointer h-full flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={dest.image_url || ''}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Wishlist button */}
                    <button
                      onClick={e => handleSave(e, dest.id)}
                      className={cn(
                        'absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition-colors',
                        savedIds.has(dest.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white/20 backdrop-blur-sm text-white hover:bg-primary hover:text-primary-foreground'
                      )}
                    >
                      <Heart className={cn('h-4 w-4', savedIds.has(dest.id) ? 'fill-current' : '')} />
                    </button>

                    {dest.is_pilgrimage && (
                      <Badge className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white border-0 text-xs">
                        Pilgrimage
                      </Badge>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-lg text-balance">{dest.name}</h3>
                        <p className="text-white/80 text-xs flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{dest.state}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded px-2 py-1">
                        <Star className="h-3 w-3 text-yellow-300 fill-yellow-300" />
                        <span className="text-white text-xs font-medium">{dest.rating}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col justify-between">
                    <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{dest.description}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div>
                        <span className="text-xs text-muted-foreground block">From</span>
                        <span className="text-sm font-medium">₹{dest.budget_min.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {dest.best_months?.slice(0, 2).map(m => (
                          <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-3 h-8 text-xs"
                      onClick={e => { e.preventDefault(); navigate(`/planner?destination=${dest.slug}`); }}
                    >
                      Plan this trip <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
