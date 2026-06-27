import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getDestinationBySlug, getAttractions, getExperiences,
  getDestinationFestivals, getDestinationCategories,
  getReviews, saveDestination, unsaveDestination, isDestinationSaved
} from '@/lib/api';
import type { Destination, Attraction, Experience, Festival, Review } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  MapPin, Star, Heart, ArrowRight, Clock, IndianRupee, Calendar,
  Shield, Bus, Utensils, ChevronLeft, Ticket, Backpack, Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MONTHS = ['', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export default function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dest, setDest] = useState<Destination | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      getDestinationBySlug(slug),
    ]).then(([d]) => {
      if (!d) { navigate('/explore'); return; }
      setDest(d);
      Promise.all([
        getAttractions(d.id),
        getExperiences(d.id),
        getDestinationFestivals(d.id),
        getReviews(d.id),
        getDestinationCategories(d.id),
        user ? isDestinationSaved(user.id, d.id) : Promise.resolve(false),
      ]).then(([attrs, exps, fests, revs, cats, isSaved]) => {
        setAttractions(attrs);
        setExperiences(exps);
        setFestivals(fests);
        setReviews(revs);
        setCategories(cats);
        setSaved(isSaved as boolean);
        setLoading(false);
      });
    });
  }, [slug, user]);

  const handleSave = async () => {
    if (!user) { toast.error('Sign in to save destinations.'); return; }
    if (!dest) return;
    if (saved) {
      await unsaveDestination(user.id, dest.id);
      setSaved(false);
      toast.success('Removed from wishlist.');
    } else {
      await saveDestination(user.id, dest.id);
      setSaved(true);
      toast.success('Added to wishlist!');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (!dest) return null;

  const budgetTiers = [
    { label: 'Budget', value: dest.budget_min, suffix: '/person/week' },
    { label: 'Mid-range', value: dest.budget_mid, suffix: '/person/week' },
    { label: 'Luxury', value: dest.budget_luxury, suffix: '/person/week' },
  ];

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-8">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to Explore
        </button>

        {/* Hero */}
        <div className="relative rounded-xl overflow-hidden aspect-[16/7] min-h-52">
          <img src={dest.image_url || ''} alt={dest.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-3">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {categories.map(cat => (
                  <Badge key={cat} className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">
                    {cat.replace('_', ' ')}
                  </Badge>
                ))}
                {dest.is_pilgrimage && (
                  <Badge className="bg-primary text-primary-foreground text-xs">Pilgrimage</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-white text-balance">{dest.name}</h1>
              <p className="text-white/80 flex items-center gap-1 mt-1">
                <MapPin className="h-4 w-4" />{dest.state}, India
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                <span className="text-white font-semibold">{dest.rating}</span>
                <span className="text-white/70 text-sm">({dest.review_count} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate(`/planner?destination=${dest.slug}`)} className="gap-2">
            <Backpack className="h-4 w-4" /> Plan this trip
          </Button>
          <Button variant="outline" onClick={handleSave} className={cn('gap-2', saved && 'text-primary border-primary')}>
            <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
            {saved ? 'Saved' : 'Save to wishlist'}
          </Button>
        </div>

        {/* Description */}
        <div className="max-w-3xl space-y-3">
          <p className="text-muted-foreground leading-relaxed text-pretty">{dest.description}</p>
          {dest.best_months?.length > 0 && (
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-medium">Best time to visit: </span>
                <span className="text-sm text-muted-foreground">{dest.best_months.join(', ')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Budget summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {budgetTiers.map(tier => (
            <div key={tier.label} className="border border-border rounded-lg p-4 space-y-1">
              <p className="text-xs text-muted-foreground font-medium">{tier.label}</p>
              <p className="text-xl font-semibold">₹{tier.value.toLocaleString('en-IN')}</p>
              <p className="text-xs text-muted-foreground">{tier.suffix}</p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Tabs */}
        <Tabs defaultValue="attractions" className="space-y-6">
          <TabsList className="flex flex-wrap gap-1 h-auto bg-transparent border-b border-border rounded-none p-0 w-full">
            {['attractions', 'experiences', 'festivals', 'food', 'safety', 'reviews'].map(tab => (
              <TabsTrigger key={tab} value={tab} className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-4 pb-3 text-sm capitalize whitespace-nowrap">
                {tab === 'food' ? 'Food & Transport' : tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Attractions */}
          <TabsContent value="attractions">
            {attractions.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">No attractions data available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attractions.map(attr => (
                  <div key={attr.id} className="border border-border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-medium text-sm">{attr.name}</h3>
                      {attr.category && <Badge variant="secondary" className="text-xs shrink-0">{attr.category}</Badge>}
                    </div>
                    {attr.description && <p className="text-sm text-muted-foreground text-pretty">{attr.description}</p>}
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
                      {attr.timings && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{attr.timings}</span>}
                      {attr.duration_hours && <span className="flex items-center gap-1"><Camera className="h-3 w-3" />{attr.duration_hours}h recommended</span>}
                      <span className="flex items-center gap-1">
                        <Ticket className="h-3 w-3" />
                        {attr.entry_fee > 0 ? `₹${attr.entry_fee.toLocaleString('en-IN')}` : 'Free entry'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Experiences */}
          <TabsContent value="experiences">
            {experiences.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">No experiences data available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {experiences.map(exp => (
                  <div key={exp.id} className="border border-border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-medium text-sm">{exp.name}</h3>
                      {exp.category && <Badge variant="secondary" className="text-xs shrink-0">{exp.category}</Badge>}
                    </div>
                    {exp.description && <p className="text-sm text-muted-foreground text-pretty">{exp.description}</p>}
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{exp.duration_hours}h</span>
                      <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />₹{exp.estimated_cost.toLocaleString('en-IN')} approx.</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Festivals */}
          <TabsContent value="festivals">
            {festivals.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">No festival data available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {festivals.map(f => (
                  <div key={f.id} className="border border-border rounded-lg p-4 space-y-2">
                    <h3 className="font-medium">{f.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {MONTHS[f.month_start]}{f.month_start !== f.month_end ? ` – ${MONTHS[f.month_end]}` : ''}
                    </p>
                    {f.description && <p className="text-sm text-muted-foreground text-pretty">{f.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Food & Transport */}
          <TabsContent value="food" className="space-y-6">
            {dest.food_highlights?.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-primary" /> Must-Try Food
                </h2>
                <div className="flex flex-wrap gap-2">
                  {dest.food_highlights.map(food => (
                    <div key={food} className="border border-border rounded-full px-4 py-2 text-sm">{food}</div>
                  ))}
                </div>
              </div>
            )}
            {dest.local_transport && (
              <div className="space-y-3">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <Bus className="h-4 w-4 text-primary" /> Local Transport
                </h2>
                <p className="text-sm text-muted-foreground text-pretty">{dest.local_transport}</p>
              </div>
            )}
          </TabsContent>

          {/* Safety */}
          <TabsContent value="safety">
            {dest.safety_tips ? (
              <div className="space-y-3">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" /> Safety Tips
                </h2>
                <div className="border border-border rounded-lg p-4 bg-muted/30">
                  <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{dest.safety_tips}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm py-8 text-center">No safety tips available.</p>
            )}
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews">
            {reviews.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Star className="h-8 w-8 text-muted-foreground mx-auto" strokeWidth={1.5} />
                <p className="text-muted-foreground text-sm">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="border border-border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{(review as any).profiles?.full_name || 'Anonymous'}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={cn('h-3 w-3', j < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground')} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{new Date(review.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}</span>
                    </div>
                    {review.title && <p className="text-sm font-medium">{review.title}</p>}
                    {review.content && <p className="text-sm text-muted-foreground text-pretty">{review.content}</p>}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Bottom CTA */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-medium">Ready to visit {dest.name}?</p>
            <p className="text-sm text-muted-foreground">Let Yaatra plan your perfect itinerary.</p>
          </div>
          <Button onClick={() => navigate(`/planner?destination=${dest.slug}`)} className="gap-2">
            Start planning <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
