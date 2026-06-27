import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getDestinations } from '@/lib/api';
import type { Destination } from '@/types/types';
import {
  Search, MapPin, ArrowRight, Star, Compass, Shield, Zap, Users, Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_BADGES = [
  { label: 'Beach', emoji: '🏖' },
  { label: 'Hill Station', emoji: '⛰' },
  { label: 'Pilgrimage', emoji: '🛕' },
  { label: 'Wildlife', emoji: '🐯' },
  { label: 'Adventure', emoji: '🧗' },
  { label: 'Heritage', emoji: '🏛' },
];

const HOW_IT_WORKS = [
  { icon: Search, title: 'Tell us your plans', desc: 'Share your destination, budget, dates and preferences.' },
  { icon: Zap, title: 'Get your itinerary', desc: 'Receive a complete day-by-day travel plan in seconds.' },
  { icon: Compass, title: 'Travel with confidence', desc: 'Track expenses, access documents, use AI support — all in one place.' },
];

const TESTIMONIALS = [
  {
    name: 'Prabha', location: 'Bangalore', persona: 'Family Traveller',
    text: 'Yaatra planned our entire Rajasthan trip with budget breakdowns and pilgrimage mode. My parents loved it.',
    rating: 5,
  },
  {
    name: 'Aditya', location: 'Mumbai', persona: 'Solo Adventurer',
    text: 'The Travel Companion Mode is a game changer. Having my schedule, expenses and emergency contacts in one dashboard while travelling was brilliant.',
    rating: 5,
  },
  {
    name: 'Neha', location: 'Hyderabad', persona: 'Budget Traveller',
    text: 'I found destinations I never knew existed within my budget. The recommendation engine understands exactly what I like.',
    rating: 5,
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredDests, setFeaturedDests] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDestinations({ featured: true, limit: 6 }).then(data => {
      setFeaturedDests(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
    else navigate('/explore');
  };

  return (
    <MainLayout showSidebar={false}>
      {/* Hero */}
      <section className="relative bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-20 md:py-32 text-center space-y-8">
          <div className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-2">
            <Compass className="h-3.5 w-3.5 text-primary" />
            India's intelligent travel ecosystem
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-balance leading-[1.15] opacity-0 intersect:opacity-100 transition duration-700">
            Plan your perfect<br />journey across<br />
            <span className="text-primary">India</span>.
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto text-pretty">
            From the Himalayas to the backwaters — Yaatra creates personalised travel plans,
            manages your budget, and guides you every step of the way.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 max-w-xl mx-auto mt-6">
            <div className="flex-1 flex items-center border border-border rounded-md px-4 h-12 focus-within:border-primary transition-colors bg-background">
              <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Where would you like to go?"
                className="flex-1 text-sm bg-transparent outline-none"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="h-12 px-6">
              Explore <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          {/* Category quick filters */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {CATEGORY_BADGES.map(c => (
              <button
                key={c.label}
                onClick={() => navigate(`/explore?category=${c.label.toLowerCase().replace(' ', '_')}`)}
                className="inline-flex items-center gap-1.5 border border-border rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <span>{c.emoji}</span> {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-semibold text-balance">Featured destinations</h2>
            <p className="text-muted-foreground text-sm text-pretty">Hand-picked experiences across India's most beloved places.</p>
          </div>
          <Link to="/explore">
            <Button variant="ghost" size="sm" className="text-sm text-muted-foreground hover:text-foreground">
              View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg border border-border overflow-hidden">
                <div className="aspect-[4/3] bg-muted animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDests.map((dest, i) => (
              <Link key={dest.id} to={`/destination/${dest.slug}`}>
                <Card className="group overflow-hidden border border-border hover:border-primary/30 transition-colors cursor-pointer h-full flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={dest.image_url || ''}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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
                      <span className="text-xs text-muted-foreground">From</span>
                      <span className="text-sm font-medium">₹{dest.budget_min.toLocaleString('en-IN')}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="border-t border-border" />

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-center space-y-2 mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold text-balance">How Yaatra works</h2>
          <p className="text-muted-foreground text-sm text-pretty">Three steps to your perfect Indian journey.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="space-y-4 opacity-0 intersect:opacity-100 transition duration-700" style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="h-10 w-10 rounded-lg border border-border flex items-center justify-center">
                <step.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground font-medium">Step {i + 1}</span>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground text-pretty">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Stats strip */}
      <section className="bg-secondary">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Destinations', value: '200+' },
            { label: 'Happy Travellers', value: '50K+' },
            { label: 'Trip Plans Generated', value: '1.2L+' },
            { label: 'Languages Supported', value: '9' },
          ].map(s => (
            <div key={s.label} className="space-y-1">
              <p className="text-2xl md:text-3xl font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-center space-y-2 mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold text-balance">What travellers say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="border border-border rounded-lg p-6 space-y-4 opacity-0 intersect:opacity-100 transition duration-700">
              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed text-pretty">"{t.text}"</p>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.location} · {t.persona}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-border" />

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-20 md:py-28 text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-balance">Ready to explore India?</h2>
        <p className="text-muted-foreground text-pretty">
          Join thousands of travellers who plan smarter with Yaatra's intelligent travel ecosystem.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/register"><Button size="lg" className="px-8">Start planning — it's free</Button></Link>
          <Link to="/explore"><Button variant="outline" size="lg" className="px-8">Browse destinations</Button></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <span className="font-semibold text-sm tracking-tight">yaatra</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © Yaatra. India's intelligent travel companion. Promoting Indian Tourism. &nbsp;&nbsp;&nbsp;<a href="https://abhi8hero.github.io/portfolio-abhishek_ugare/ ">- Abhi The Great</a> 
          </p>
          <div className="flex gap-4">
            <Link to="/explore" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
            <Link to="/planner" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Plan Trip</Link>
            <Link to="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </MainLayout>
  );
}
