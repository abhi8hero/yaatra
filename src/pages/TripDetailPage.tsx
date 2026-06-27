import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  getTripById, getBookings, getExpenses, getItineraryItems,
  updateBookingStatus, createBooking, createExpense, deleteExpense,
  createItineraryItem, updateItineraryItem, deleteTrip
} from '@/lib/api';
import type { Trip, Booking, Expense, ItineraryItem, BookingStatus } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Calendar, MapPin, Users, IndianRupee, CheckCircle, Clock, AlertCircle,
  Plus, Trash2, ChevronLeft, Pencil, ExternalLink, ArrowRight, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS: { value: BookingStatus; label: string; color: string }[] = [
  { value: 'not_started', label: 'Not Started', color: 'text-muted-foreground' },
  { value: 'pending', label: 'Pending', color: 'text-warning' },
  { value: 'booked', label: 'Booked', color: 'text-success' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-destructive' },
  { value: 'completed', label: 'Completed', color: 'text-info' },
];

const BOOKING_TYPES = ['flight', 'train', 'bus', 'hotel', 'activity', 'transfer', 'other'];
const EXPENSE_CATS = ['accommodation', 'transport', 'food', 'activities', 'shopping', 'medical', 'other'];

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Add booking form
  const [addBookingOpen, setAddBookingOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({ title: '', booking_type: 'hotel', status: 'not_started' as BookingStatus, estimated_cost: 0, booking_reference: '', notes: '' });

  // Add expense form
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: '', category: 'food', amount: 0, expense_date: new Date().toISOString().slice(0, 10) });

  // Add itinerary item form
  const [addItinOpen, setAddItinOpen] = useState(false);
  const [newItin, setNewItin] = useState({ day_number: 1, time_slot: '', title: '', description: '', estimated_cost: 0, duration_hours: 1 });

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getTripById(id),
      getBookings(id),
      getExpenses(id),
      getItineraryItems(id)
    ]).then(([t, b, e, it]) => {

      console.log("URL ID:", id);
      console.log("TRIP FROM DB:", t);
      console.log("CURRENT USER:", user);

      if (!t) {
        console.log("Trip not found");
        navigate('/trips');
        return;
      }

      if (t.user_id !== user?.id) {
        console.log("User mismatch");
        console.log("Trip user:", t.user_id);
        console.log("Logged user:", user?.id);

        navigate('/trips');
        return;
      }

      setTrip(t);
      setBookings(b);
      setExpenses(e);
      setItinerary(it);
      setLoading(false);
    });
  }, [id, user]);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const budgetPct = trip ? Math.min(100, Math.round((totalExpenses / trip.total_budget) * 100)) : 0;

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    await updateBookingStatus(bookingId, status);
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: status as BookingStatus } : b));
    toast.success('Booking status updated.');
  };

  const handleAddBooking = async () => {
    if (!user || !trip || !newBooking.title) { toast.error('Please fill in the booking title.'); return; }
    const result = await createBooking({
      trip_id: trip.id, user_id: user.id, ...newBooking,
      provider: null, actual_cost: null, booking_link: null, travel_date: null
    });
    if (result) { setBookings(prev => [...prev, result]); setAddBookingOpen(false); setNewBooking({ title: '', booking_type: 'hotel', status: 'not_started', estimated_cost: 0, booking_reference: '', notes: '' }); toast.success('Booking added.'); }
    else toast.error('Failed to add booking.');
  };

  const handleAddExpense = async () => {
    if (!user || !trip || !newExpense.title || !newExpense.amount) { toast.error('Please fill in all fields.'); return; }
    const result = await createExpense({ trip_id: trip.id, user_id: user.id, title: newExpense.title, category: newExpense.category, amount: newExpense.amount, expense_date: newExpense.expense_date, notes: null });
    if (result) { setExpenses(prev => [result, ...prev]); setAddExpenseOpen(false); setNewExpense({ title: '', category: 'food', amount: 0, expense_date: new Date().toISOString().slice(0, 10) }); toast.success('Expense added.'); }
    else toast.error('Failed to add expense.');
  };

  const handleDeleteExpense = async (expId: string) => {
    await deleteExpense(expId);
    setExpenses(prev => prev.filter(e => e.id !== expId));
    toast.success('Expense removed.');
  };

  const handleAddItinItem = async () => {
    if (!trip || !newItin.title) { toast.error('Please enter a title.'); return; }
    const result = await createItineraryItem({
      trip_id: trip.id, ...newItin, item_type: 'activity',
      location: null, booking_link: null, notes: null, is_completed: false, sort_order: itinerary.filter(i => i.day_number === newItin.day_number).length
    });
    if (result) { setItinerary(prev => [...prev, result]); setAddItinOpen(false); setNewItin({ day_number: 1, time_slot: '', title: '', description: '', estimated_cost: 0, duration_hours: 1 }); toast.success('Itinerary item added.'); }
    else toast.error('Failed to add item.');
  };

  const toggleItinItem = async (item: ItineraryItem) => {
    await updateItineraryItem(item.id, { is_completed: !item.is_completed });
    setItinerary(prev => prev.map(i => i.id === item.id ? { ...i, is_completed: !i.is_completed } : i));
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (!trip) return null;
  const aiPlan = trip?.travel_plan || null;

  console.log("TRIP", trip);
  console.log("AI PLAN", aiPlan);

  const totalDays = Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const dayGroups: Record<number, ItineraryItem[]> = {};
  itinerary.forEach(item => {
    if (!dayGroups[item.day_number]) dayGroups[item.day_number] = [];
    dayGroups[item.day_number].push(item);
  });

  const expByCategory: Record<string, number> = {};
  expenses.forEach(e => { expByCategory[e.category] = (expByCategory[e.category] || 0) + e.amount; });

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-8">
        {/* Back + Header */}
        <div className="space-y-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />Back to Dashboard
          </button>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-semibold text-balance">{trip.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{trip.destination_name}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(trip.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – {new Date(trip.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{trip.num_travelers} traveller{trip.num_travelers !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <Badge className={cn('shrink-0 capitalize', trip.phase === 'traveling' ? 'bg-success text-success-foreground' : '')} variant="secondary">
              {trip.phase}
            </Badge>
          </div>
        </div>

        {/* Budget overview */}
        <div className="border border-border rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-sm">Budget Tracker</h2>
            <span className="text-sm font-medium">₹{totalExpenses.toLocaleString('en-IN')} / ₹{trip.total_budget.toLocaleString('en-IN')}</span>
          </div>
          <Progress value={budgetPct} className={cn('h-2', budgetPct >= 90 ? '[&>div]:bg-destructive' : budgetPct >= 70 ? '[&>div]:bg-warning' : '')} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{budgetPct}% used</span>
            <span>₹{(trip.total_budget - totalExpenses).toLocaleString('en-IN')} remaining</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ai-plan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai-plan">yaatra Plan</TabsTrigger>
            <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>

          {/* AI Tab */}
          <TabsContent value="ai-plan" className="space-y-4">
            {!aiPlan ? (
              <Card>
                <CardContent className="pt-6">
                  <p>Generating your travel plan...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {aiPlan.tripSummary.destination}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p>{aiPlan.tripSummary.overview}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Day Wise Itinerary</CardTitle>
                  </CardHeader>

                  <CardContent>
                    {aiPlan.itinerary?.map((day: any) => (
                      <div
                        key={day.day}
                        className="mb-6 border-b pb-4"
                      >
                        <h3 className="font-semibold">
                          Day {day.day} - {day.title}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {day.summary}
                        </p>

                        {day.activities?.map(
                          (activity: any, index: number) => (
                            <div
                              key={index}
                              className="mt-2"
                            >
                              <strong>{activity.time}</strong>
                              <p>{activity.activity}</p>
                            </div>
                          )
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Places to Visit</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {aiPlan.places?.map((place: any, index: number) => (
                        <div
                          key={index}
                          className="border rounded-lg p-3"
                        >
                          <h3 className="font-medium">
                            {place.name}
                          </h3>

                          <p className="text-sm text-muted-foreground">
                            {place.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Budget Breakdown</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    {Object.entries(aiPlan.budgetBreakdown || {})
                      .filter(([key]) => key !== "total")
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between"
                        >
                          <span className="capitalize">
                            {key}
                          </span>

                          <span>
                            ₹{Number(value).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}

                    <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-lg">
                      <span>Total</span>

                      <span>
                        ₹{Number(aiPlan.budgetBreakdown?.total || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Food & Culinary</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2">
                      {aiPlan.food?.map((food: any, index: number) => (
                        <li key={index}>
                          • {food.name}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>  

                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Stays</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {aiPlan.accommodations?.map(
                        (hotel: any, index: number) => (
                          <div
                            key={index}
                            className="border rounded-lg p-3"
                          >
                            <h3 className="font-medium">
                              {hotel.name}
                            </h3>

                            {hotel.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {hotel.description}
                              </p>
                            )}

                            {hotel.priceRange && (
                              <p className="text-xs text-muted-foreground mt-2">
                                {hotel.priceRange}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Transportation</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">

                    {aiPlan.transportation?.arrival && (
                      <div>
                        <h3 className="font-medium mb-2">
                          How to Reach
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {aiPlan.transportation.arrival.mode}
                        </p>

                        {aiPlan.transportation.arrival.details && (
                          <p className="text-sm mt-1">
                            {aiPlan.transportation.arrival.details}
                          </p>
                        )}
                      </div>
                    )}

                    {aiPlan.transportation?.local?.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">
                          Local Transport
                        </h3>

                        <ul className="space-y-1">
                          {aiPlan.transportation.local.map(
                            (item: any, index: number) => (
                              <li
                                key={index}
                                className="border rounded-lg p-3"
                              >
                                <p className="font-medium">
                                  {item.type}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                  {item.details}
                                </p>

                                {item.estimatedCost && (
                                  <p className="text-xs mt-2">
                                    ₹{item.estimatedCost.toLocaleString("en-IN")}
                                  </p>
                                )}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  </CardContent>
                </Card>   

                <Card>
                  <CardHeader>
                    <CardTitle>Safety Tips</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <ul className="list-disc ml-5 space-y-2">
                      {aiPlan.safetyTips?.map(
                        (tip: string, index: number) => (
                          <li key={index}>
                            {tip}
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>        

                <Card>
                  <CardHeader>
                    <CardTitle>Travel Tips</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <ul className="list-disc ml-5 space-y-2">
                      {aiPlan.travelTips?.map(
                        (tip: string, index: number) => (
                          <li key={index}>
                            {tip}
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>   
              </>
            )}
          </TabsContent>

          {/* BOOKINGS TAB */}
          <TabsContent value="bookings" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={addBookingOpen} onOpenChange={setAddBookingOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2"><Plus className="h-4 w-4" />Add Booking</Button>
                </DialogTrigger>
                <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg">
                  <DialogHeader><DialogTitle>Add Booking</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5"><Label className="text-sm font-normal">Title</Label><Input value={newBooking.title} onChange={e => setNewBooking(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Hotel Sarovar, Jaipur" className="px-3" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5"><Label className="text-sm font-normal">Type</Label>
                        <Select value={newBooking.booking_type} onValueChange={v => setNewBooking(p => ({ ...p, booking_type: v }))}>
                          <SelectTrigger className="px-3"><SelectValue /></SelectTrigger>
                          <SelectContent>{BOOKING_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5"><Label className="text-sm font-normal">Status</Label>
                        <Select value={newBooking.status} onValueChange={v => setNewBooking(p => ({ ...p, status: v as BookingStatus }))}>
                          <SelectTrigger className="px-3"><SelectValue /></SelectTrigger>
                          <SelectContent>{STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5"><Label className="text-sm font-normal">Estimated Cost (₹)</Label><Input type="number" min={0} value={newBooking.estimated_cost} onChange={e => setNewBooking(p => ({ ...p, estimated_cost: parseFloat(e.target.value) || 0 }))} className="px-3" /></div>
                      <div className="space-y-1.5"><Label className="text-sm font-normal">Booking Ref</Label><Input value={newBooking.booking_reference} onChange={e => setNewBooking(p => ({ ...p, booking_reference: e.target.value }))} placeholder="PNR, order ID…" className="px-3" /></div>
                    </div>
                    <Button onClick={handleAddBooking} className="w-full">Add Booking</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg space-y-3">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto" strokeWidth={1.5} />
                <p className="text-muted-foreground text-sm">No bookings yet. Add your flights, hotels, and more.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map(bk => {
                  return (
                    <div key={bk.id} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm">{bk.title}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="secondary" className="text-xs capitalize">{bk.booking_type}</Badge>
                            {bk.booking_reference && <span className="text-xs text-muted-foreground">Ref: {bk.booking_reference}</span>}
                          </div>
                        </div>
                        <div className="shrink-0 space-y-1 text-right">
                          <p className="text-sm font-medium">₹{bk.estimated_cost.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <Select value={bk.status} onValueChange={v => handleUpdateStatus(bk.id, v)}>
                          <SelectTrigger className="h-8 w-44 px-3 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map(s => (
                              <SelectItem key={s.value} value={s.value}>
                                <span className={cn('text-xs', s.color)}>{s.label}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {bk.booking_link && (
                          <a href={bk.booking_link} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="h-8 text-xs gap-1"><ExternalLink className="h-3.5 w-3.5" />Open</Button>
                          </a>
                        )}
                      </div>
                      {bk.notes && <p className="text-xs text-muted-foreground">{bk.notes}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ITINERARY TAB */}
          <TabsContent value="itinerary" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={addItinOpen} onOpenChange={setAddItinOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2"><Plus className="h-4 w-4" />Add Item</Button>
                </DialogTrigger>
                <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg">
                  <DialogHeader><DialogTitle>Add Itinerary Item</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5"><Label className="text-sm font-normal">Day</Label><Input type="number" min={1} max={totalDays} value={newItin.day_number} onChange={e => setNewItin(p => ({ ...p, day_number: parseInt(e.target.value) || 1 }))} className="px-3" /></div>
                      <div className="space-y-1.5"><Label className="text-sm font-normal">Time</Label><Input type="time" value={newItin.time_slot} onChange={e => setNewItin(p => ({ ...p, time_slot: e.target.value }))} className="px-3" /></div>
                    </div>
                    <div className="space-y-1.5"><Label className="text-sm font-normal">Title</Label><Input value={newItin.title} onChange={e => setNewItin(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Visit Amber Fort" className="px-3" /></div>
                    <div className="space-y-1.5"><Label className="text-sm font-normal">Description (optional)</Label><Input value={newItin.description} onChange={e => setNewItin(p => ({ ...p, description: e.target.value }))} className="px-3" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5"><Label className="text-sm font-normal">Cost (₹)</Label><Input type="number" min={0} value={newItin.estimated_cost} onChange={e => setNewItin(p => ({ ...p, estimated_cost: parseFloat(e.target.value) || 0 }))} className="px-3" /></div>
                      <div className="space-y-1.5"><Label className="text-sm font-normal">Duration (hrs)</Label><Input type="number" min={0.5} step={0.5} value={newItin.duration_hours} onChange={e => setNewItin(p => ({ ...p, duration_hours: parseFloat(e.target.value) || 1 }))} className="px-3" /></div>
                    </div>
                    <Button onClick={handleAddItinItem} className="w-full">Add to Itinerary</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {Object.keys(dayGroups).length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg space-y-3">
                <Calendar className="h-8 w-8 text-muted-foreground mx-auto" strokeWidth={1.5} />
                <p className="text-muted-foreground text-sm">No itinerary items yet. Build your day-by-day plan.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.keys(dayGroups).sort((a, b) => parseInt(a) - parseInt(b)).map(day => {
                  const dayNum = parseInt(day);
                  const dayDate = new Date(trip.start_date);
                  dayDate.setDate(dayDate.getDate() + dayNum - 1);
                  const items = dayGroups[dayNum];
                  return (
                    <div key={day}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shrink-0">
                          {dayNum}
                        </div>
                        <div>
                          <p className="font-medium text-sm">Day {dayNum}</p>
                          <p className="text-xs text-muted-foreground">{dayDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="ml-4 pl-7 border-l border-border space-y-3">
                        {items.map(item => (
                          <div key={item.id} className={cn('border rounded-lg p-3 transition-colors', item.is_completed ? 'border-border bg-muted/30 opacity-60' : 'border-border')}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2 min-w-0">
                                <button onClick={() => toggleItinItem(item)} className={cn('h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors', item.is_completed ? 'border-primary bg-primary' : 'border-muted-foreground')}>
                                  {item.is_completed && <CheckCircle className="h-3 w-3 text-white" />}
                                </button>
                                <div className="min-w-0">
                                  <p className={cn('text-sm font-medium', item.is_completed && 'line-through text-muted-foreground')}>{item.title}</p>
                                  {item.time_slot && <p className="text-xs text-muted-foreground">{item.time_slot}</p>}
                                  {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
                                </div>
                              </div>
                              <div className="text-right shrink-0 space-y-0.5">
                                {item.estimated_cost > 0 && <p className="text-xs text-muted-foreground">₹{item.estimated_cost.toLocaleString('en-IN')}</p>}
                                {item.duration_hours > 0 && <p className="text-xs text-muted-foreground">{item.duration_hours}h</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* EXPENSES TAB */}
          <TabsContent value="expenses" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2"><Plus className="h-4 w-4" />Add Expense</Button>
                </DialogTrigger>
                <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg">
                  <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5"><Label className="text-sm font-normal">Description</Label><Input value={newExpense.title} onChange={e => setNewExpense(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Dinner at local restaurant" className="px-3" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5"><Label className="text-sm font-normal">Category</Label>
                        <Select value={newExpense.category} onValueChange={v => setNewExpense(p => ({ ...p, category: v }))}>
                          <SelectTrigger className="px-3"><SelectValue /></SelectTrigger>
                          <SelectContent>{EXPENSE_CATS.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5"><Label className="text-sm font-normal">Amount (₹)</Label><Input type="number" min={0} value={newExpense.amount} onChange={e => setNewExpense(p => ({ ...p, amount: parseFloat(e.target.value) || 0 }))} className="px-3" /></div>
                    </div>
                    <div className="space-y-1.5"><Label className="text-sm font-normal">Date</Label><Input type="date" value={newExpense.expense_date} onChange={e => setNewExpense(p => ({ ...p, expense_date: e.target.value }))} className="px-3" /></div>
                    <Button onClick={handleAddExpense} className="w-full">Add Expense</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Category breakdown */}
            {Object.keys(expByCategory).length > 0 && (
              <div className="border border-border rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium">Spending by category</p>
                <div className="space-y-2">
                  {Object.entries(expByCategory).sort(([, a], [, b]) => b - a).map(([cat, amt]) => (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground capitalize w-24 shrink-0">{cat}</span>
                      <div className="flex-1">
                        <Progress value={Math.round((amt / totalExpenses) * 100)} className="h-1.5" />
                      </div>
                      <span className="text-xs font-medium w-20 text-right">₹{amt.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {expenses.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg space-y-3">
                <IndianRupee className="h-8 w-8 text-muted-foreground mx-auto" strokeWidth={1.5} />
                <p className="text-muted-foreground text-sm">No expenses logged yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs text-muted-foreground font-normal py-2 px-3 whitespace-nowrap">Description</th>
                      <th className="text-left text-xs text-muted-foreground font-normal py-2 px-3 whitespace-nowrap">Category</th>
                      <th className="text-left text-xs text-muted-foreground font-normal py-2 px-3 whitespace-nowrap">Date</th>
                      <th className="text-right text-xs text-muted-foreground font-normal py-2 px-3 whitespace-nowrap">Amount</th>
                      <th className="py-2 px-3 whitespace-nowrap"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(exp => (
                      <tr key={exp.id} className="border-b border-border">
                        <td className="py-2.5 px-3 whitespace-nowrap">{exp.title}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap"><Badge variant="secondary" className="text-xs capitalize">{exp.category}</Badge></td>
                        <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">{new Date(exp.expense_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                        <td className="py-2.5 px-3 font-medium text-right whitespace-nowrap">₹{exp.amount.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <button onClick={() => handleDeleteExpense(exp.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-border font-medium">
                      <td colSpan={3} className="py-2.5 px-3 whitespace-nowrap">Total</td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">₹{totalExpenses.toLocaleString('en-IN')}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
