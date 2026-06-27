import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getDestinations, getDestinationBySlug, createTrip } from '@/lib/api';
import type { Destination, TripType, TravelMode } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { MapPin, Calendar, Users, IndianRupee, ArrowRight, Sparkles, CheckCircle, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const TRIP_TYPES: { value: TripType; label: string }[] = [
  { value: 'solo', label: 'Solo' },
  { value: 'couple', label: 'Couple' },
  { value: 'family', label: 'Family' },
  { value: 'friends', label: 'Friends Group' },
  { value: 'senior_citizens', label: 'Senior Citizens' },
];

const PREFERENCES = [
  'Sightseeing', 'Adventure Sports', 'Heritage & History', 'Food & Culinary',
  'Wildlife Safari', 'Beach & Water Sports', 'Spiritual & Meditation',
  'Shopping', 'Nightlife', 'Photography', 'Trekking & Hiking', 'Wellness & Spa',
];

const BUDGET_PROFILES = [
  { label: 'Budget Traveller', desc: '₹5,000–₹10,000/person', icon: '🎒', days: [3, 5], value: 'budget' },
  { label: 'Mid-range Explorer', desc: '₹15,000–₹30,000/person', icon: '🗺', days: [5, 7], value: 'mid' },
  { label: 'Luxury Voyager', desc: '₹40,000+/person', icon: '✨', days: [7, 10], value: 'luxury' },
];

export default function TripPlannerPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const destSlug = searchParams.get('destination') || '';

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [destSearch, setDestSearch] = useState('');

  // Form state
  const [tripTitle, setTripTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numTravelers, setNumTravelers] = useState(1);
  const [tripType, setTripType] = useState<TripType>('solo');
  const [travelMode, setTravelMode] = useState<TravelMode>('regular');
  const [totalBudget, setTotalBudget] = useState(15000);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [budgetProfile, setBudgetProfile] = useState('mid');
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("destination");

  useEffect(() => {
    getDestinations({ limit: 50 }).then(setDestinations);
  }, []);

  useEffect(() => {
    if (destSlug) {
      getDestinationBySlug(destSlug).then(d => {
        if (d) { setSelectedDest(d); setTripTitle(`Trip to ${d.name}`); }
      });
    }
  }, [destSlug]);

  const filteredDests = destinations.filter(d =>
    d.name.toLowerCase().includes(destSearch.toLowerCase()) ||
    d.state?.toLowerCase().includes(destSearch.toLowerCase())
  );

  const togglePref = (pref: string) => {
    setSelectedPrefs(prev => prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]);
  };

  const handleBudgetProfile = (profile: string) => {
    setBudgetProfile(profile);
    const bp = BUDGET_PROFILES.find(b => b.value === profile);
    if (bp) {
      const mid = bp.label.includes('Budget') ? 7500 : bp.label.includes('Mid') ? 20000 : 50000;
      setTotalBudget(mid * numTravelers);
    }
  };

  const handleCreate = async () => {
    if (!user) { toast.error('Sign in to create a trip.'); navigate('/login'); return; }
    if (!selectedDest) { toast.error('Please select a destination.'); return; }
    if (!startDate || !endDate) { toast.error('Please select travel dates.'); return; }
    if (new Date(endDate) < new Date(startDate)) { toast.error('End date must be after start date.'); return; }

    setCreating(true);
    const trip = await createTrip({
      user_id: user.id,
      destination_id: selectedDest.id,
      title: tripTitle || `Trip to ${selectedDest.name}`,
      destination_name: selectedDest.name,
      trip_type: tripType,
      travel_mode: travelMode,
      start_date: startDate,
      end_date: endDate,
      num_travelers: numTravelers,
      total_budget: totalBudget,
      spent_amount: 0,
      phase: 'planning',
      travel_mode_active: false,
      preferences: selectedPrefs,
      checklist: [],
    });

    if (trip) {
      console.log("N8N TRIGGER START");

      try {
        const response = await fetch(
          import.meta.env.VITE_N8N_TRIP_CREATION_WEBHOOK,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tripId: trip.id,
              destination: selectedDest.name,
              startDate,
              endDate,
              travelers: numTravelers,
              budget: totalBudget,
              preferences: selectedPrefs,
              tripType,
              travelMode,
            }),
          }
        );

        const result = await response.text();

        console.log("N8N Status:", response.status);
        console.log("N8N Response:", result);
      } catch (error) {
        console.error("N8N Error:", error);
      }
    }
    setCreating(false);
    if (trip) {
      toast.success('Trip created successfully!');
      navigate(`/trips/${trip.id}`);
    } else {
      toast.error('Failed to create trip. Please try again.');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-balance">Plan your trip</h1>
          <p className="text-sm text-muted-foreground">Fill in your details to create a personalised Indian travel itinerary.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="destination">Destination</TabsTrigger>
            <TabsTrigger value="details">Trip Details</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Tab 1: Destination */}
          <TabsContent value="destination" className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-normal">Search & select your destination</Label>
              <div className="flex items-center border border-border rounded-md px-3 h-11 focus-within:border-primary transition-colors">
                <MapPin className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Type a destination name or state…"
                  className="flex-1 text-sm bg-transparent outline-none min-w-0"
                  value={destSearch}
                  onChange={e => setDestSearch(e.target.value)}
                />
              </div>
            </div>

            {selectedDest && (
              <div className="flex items-center gap-3 border border-primary/40 rounded-lg p-4 bg-primary/5">
                <img src={selectedDest.image_url || ''} alt={selectedDest.name} className="h-12 w-16 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{selectedDest.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedDest.state}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {filteredDests.map(d => (
                <button
                  key={d.id}
                  onClick={() => { setSelectedDest(d); setTripTitle(`Trip to ${d.name}`); setDestSearch(''); }}
                  className={cn(
                    'flex items-center gap-3 border rounded-lg p-3 text-left transition-colors hover:border-primary/40',
                    selectedDest?.id === d.id ? 'border-primary bg-primary/5' : 'border-border'
                  )}
                >
                  <img src={d.image_url || ''} alt={d.name} className="h-10 w-14 object-cover rounded shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{d.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{d.state}</p>
                    <p className="text-xs text-muted-foreground">From ₹{d.budget_min.toLocaleString('en-IN')}</p>
                  </div>
                  {d.is_pilgrimage && <Badge variant="secondary" className="text-xs shrink-0">Pilgrimage</Badge>}
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setActiveTab("details")}
                disabled={!selectedDest}
              >
                Next
              </Button>
            </div>
          </TabsContent>

          {/* Tab 2: Trip Details */}
          <TabsContent value="details" className="space-y-6">
            <div className="space-y-1.5">
              <Label className="text-sm font-normal">Trip title</Label>
              <Input value={tripTitle} onChange={e => setTripTitle(e.target.value)} placeholder="e.g. Rajasthan Heritage Tour" className="px-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-normal">Start date</Label>
                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-3" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-normal">End date</Label>
                <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-3" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-normal">Number of travellers</Label>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={numTravelers}
                  onChange={e => setNumTravelers(parseInt(e.target.value) || 1)}
                  className="px-3"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-normal">Trip type</Label>
                <Select value={tripType} onValueChange={v => setTripType(v as TripType)}>
                  <SelectTrigger className="px-3"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TRIP_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-normal">Travel mode</Label>
              <div className="grid grid-cols-2 gap-3">
                {[{ value: 'regular', label: 'Regular Travel', desc: 'Standard sightseeing & leisure' },
                  { value: 'pilgrimage', label: 'Pilgrimage Mode', desc: 'Sacred sites & spiritual journey' }].map(m => (
                  <button
                    key={m.value}
                    onClick={() => setTravelMode(m.value as TravelMode)}
                    className={cn('border rounded-lg p-4 text-left transition-colors', travelMode === m.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40')}
                  >
                    <p className="text-sm font-medium">{m.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-sm font-normal">Budget profile</Label>
                <p className="text-xs text-muted-foreground">Select a budget tier to auto-fill your budget estimate.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {BUDGET_PROFILES.map(bp => (
                  <button
                    key={bp.value}
                    onClick={() => handleBudgetProfile(bp.value)}
                    className={cn('border rounded-lg p-4 text-left transition-colors', budgetProfile === bp.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40')}
                  >
                    <span className="text-2xl">{bp.icon}</span>
                    <p className="text-sm font-medium mt-2">{bp.label}</p>
                    <p className="text-xs text-muted-foreground">{bp.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-normal">Total budget (₹)</Label>
              <Input
                type="number"
                min={0}
                step={500}
                value={totalBudget}
                onChange={e => setTotalBudget(parseInt(e.target.value) || 0)}
                className="px-3"
              />
              <p className="text-xs text-muted-foreground">
                ₹{Math.round(totalBudget / numTravelers).toLocaleString('en-IN')} per person
              </p>
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab("destination")}
              >
                Previous
              </Button>

              <Button
                onClick={() => setActiveTab("preferences")}
              >
                Next
              </Button>
            </div>
          </TabsContent>

          {/* Tab 3: Preferences */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-normal">Travel preferences</Label>
              <p className="text-xs text-muted-foreground">Select activities and interests to personalise your itinerary.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {PREFERENCES.map(pref => (
                <button
                  key={pref}
                  onClick={() => togglePref(pref)}
                  className={cn(
                    'px-4 py-2 rounded-full border text-sm transition-colors',
                    selectedPrefs.includes(pref) ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  {pref}
                </button>
              ))}
            </div>

            {selectedPrefs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Selected:</span>
                {selectedPrefs.map(p => <Badge key={p} variant="secondary">{p}</Badge>)}
              </div>
            )}

            <Separator />

            {/* Trip Summary */}
            <Card className="border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Trip Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Destination</div>
                  <div className="font-medium">{selectedDest?.name || 'Not selected'}</div>
                  <div className="text-muted-foreground">Title</div>
                  <div className="font-medium truncate">{tripTitle || 'Not set'}</div>
                  <div className="text-muted-foreground">Dates</div>
                  <div className="font-medium">{startDate && endDate ? `${startDate} → ${endDate}` : 'Not set'}</div>
                  <div className="text-muted-foreground">Travellers</div>
                  <div className="font-medium">{numTravelers} {TRIP_TYPES.find(t => t.value === tripType)?.label}</div>
                  <div className="text-muted-foreground">Budget</div>
                  <div className="font-medium">₹{totalBudget.toLocaleString('en-IN')} total</div>
                  <div className="text-muted-foreground">Mode</div>
                  <div className="font-medium capitalize">{travelMode}</div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleCreate} disabled={creating || !selectedDest || !startDate || !endDate} className="w-full gap-2 h-12">
              <Sparkles className="h-4 w-4" />
              {creating ? 'Creating your trip…' : 'Create Trip'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
