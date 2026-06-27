import { supabase } from '@/db/supabase';
import type {
  Destination, Attraction, Experience, Festival, Hotel,
  TransportOption, Trip, ItineraryItem, Booking, Expense,
  SavedDestination, Review, Notification, TravelDocument,
  EmergencyContact, Profile
} from '@/types/types';

// =====================
// DESTINATIONS
// =====================
export async function getDestinations(options?: {
  featured?: boolean;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('destinations')
    .select('*')
    .order('rating', { ascending: false });

  if (options?.featured) query = query.eq('is_featured', true);
  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  if (options?.search) query = query.ilike('name', `%${options.search}%`);

  const { data, error } = await query;
  if (error) { console.error('getDestinations error:', error); return []; }
  return Array.isArray(data) ? data as Destination[] : [];
}

export async function getDestinationBySlug(slug: string) {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) { console.error('getDestinationBySlug error:', error); return null; }
  return data as Destination | null;
}

export async function getDestinationById(id: string) {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) { console.error('getDestinationById error:', error); return null; }
  return data as Destination | null;
}

export async function getDestinationCategories(destinationId: string) {
  const { data, error } = await supabase
    .from('destination_categories')
    .select('category')
    .eq('destination_id', destinationId);
  if (error) { console.error('getDestinationCategories error:', error); return []; }
  return (data || []).map(r => r.category);
}

export async function getDestinationsByCategory(category: string) {
  const { data, error } = await supabase
    .from('destination_categories')
    .select('destination_id')
    .eq('category', category);
  if (error) { console.error('getDestinationsByCategory error:', error); return []; }
  const ids = (data || []).map(r => r.destination_id);
  if (!ids.length) return [];
  const { data: dests, error: e2 } = await supabase
    .from('destinations')
    .select('*')
    .in('id', ids)
    .order('rating', { ascending: false });
  if (e2) return [];
  return Array.isArray(dests) ? dests as Destination[] : [];
}

// =====================
// ATTRACTIONS
// =====================
export async function getAttractions(destinationId: string) {
  const { data, error } = await supabase
    .from('attractions')
    .select('*')
    .eq('destination_id', destinationId)
    .order('name');
  if (error) { console.error('getAttractions error:', error); return []; }
  return Array.isArray(data) ? data as Attraction[] : [];
}

// =====================
// EXPERIENCES
// =====================
export async function getExperiences(destinationId: string) {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('destination_id', destinationId)
    .order('name');
  if (error) { console.error('getExperiences error:', error); return []; }
  return Array.isArray(data) ? data as Experience[] : [];
}

// =====================
// FESTIVALS
// =====================
export async function getDestinationFestivals(destinationId: string) {
  const { data, error } = await supabase
    .from('destination_festivals')
    .select('festival_id')
    .eq('destination_id', destinationId);
  if (error) { console.error('getDestinationFestivals error:', error); return []; }
  const ids = (data || []).map(r => r.festival_id);
  if (!ids.length) return [];
  const { data: festData } = await supabase
    .from('festivals')
    .select('*')
    .in('id', ids);
  return Array.isArray(festData) ? festData as Festival[] : [];
}

// =====================
// HOTELS
// =====================
export async function getHotels(destinationId: string) {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('destination_id', destinationId)
    .order('price_per_night');
  if (error) { console.error('getHotels error:', error); return []; }
  return Array.isArray(data) ? data as Hotel[] : [];
}

// =====================
// TRANSPORT
// =====================
export async function getTransportOptions(fromCity?: string, toCity?: string) {
  let query = supabase.from('transport_options').select('*').order('mode');
  if (fromCity) query = query.ilike('from_city', `%${fromCity}%`);
  if (toCity) query = query.ilike('to_city', `%${toCity}%`);
  const { data, error } = await query.limit(50);
  if (error) { console.error('getTransportOptions error:', error); return []; }
  return Array.isArray(data) ? data as TransportOption[] : [];
}

// =====================
// TRIPS
// =====================
export async function getTrips(userId: string) {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: true })
    .limit(50);
  if (error) { console.error('getTrips error:', error); return []; }
  return Array.isArray(data) ? data as Trip[] : [];
}

export async function getTripById(tripId: string) {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .maybeSingle();
  if (error) { console.error('getTripById error:', error); return null; }
  return data as Trip | null;
}

export async function createTrip(trip: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase.from('trips').insert(trip).select().maybeSingle();
  if (error) { console.error('createTrip error:', error); return null; }
  return data as Trip | null;
}

export async function updateTrip(tripId: string, updates: Partial<Trip>) {
  const { error } = await supabase.from('trips').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', tripId);
  if (error) { console.error('updateTrip error:', error); return false; }
  return true;
}

export async function deleteTrip(tripId: string) {
  const { error } = await supabase.from('trips').delete().eq('id', tripId);
  return !error;
}

// =====================
// ITINERARY ITEMS
// =====================
export async function getItineraryItems(tripId: string) {
  const { data, error } = await supabase
    .from('itinerary_items')
    .select('*')
    .eq('trip_id', tripId)
    .order('day_number')
    .order('sort_order');
  if (error) { console.error('getItineraryItems error:', error); return []; }
  return Array.isArray(data) ? data as ItineraryItem[] : [];
}

export async function createItineraryItem(item: Omit<ItineraryItem, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('itinerary_items').insert(item).select().maybeSingle();
  if (error) { console.error('createItineraryItem error:', error); return null; }
  return data as ItineraryItem | null;
}

export async function updateItineraryItem(id: string, updates: Partial<ItineraryItem>) {
  const { error } = await supabase.from('itinerary_items').update(updates).eq('id', id);
  return !error;
}

// =====================
// BOOKINGS
// =====================
export async function getBookings(tripId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('trip_id', tripId)
    .order('created_at');
  if (error) { console.error('getBookings error:', error); return []; }
  return Array.isArray(data) ? data as Booking[] : [];
}

export async function createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase.from('bookings').insert(booking).select().maybeSingle();
  if (error) { console.error('createBooking error:', error); return null; }
  return data as Booking | null;
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const { error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bookingId);
  return !error;
}

// =====================
// EXPENSES
// =====================
export async function getExpenses(tripId: string) {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('trip_id', tripId)
    .order('expense_date', { ascending: false })
    .limit(100);
  if (error) { console.error('getExpenses error:', error); return []; }
  return Array.isArray(data) ? data as Expense[] : [];
}

export async function createExpense(expense: Omit<Expense, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('expenses').insert(expense).select().maybeSingle();
  if (error) { console.error('createExpense error:', error); return null; }
  return data as Expense | null;
}

export async function deleteExpense(expenseId: string) {
  const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
  return !error;
}

// =====================
// WISHLIST
// =====================
export async function getSavedDestinations(userId: string) {
  const { data, error } = await supabase
    .from('saved_destinations')
    .select('*, destination:destinations(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) { console.error('getSavedDestinations error:', error); return []; }
  return Array.isArray(data) ? data as SavedDestination[] : [];
}

export async function saveDestination(userId: string, destinationId: string) {
  const { error } = await supabase.from('saved_destinations').insert({ user_id: userId, destination_id: destinationId });
  return !error;
}

export async function unsaveDestination(userId: string, destinationId: string) {
  const { error } = await supabase.from('saved_destinations').delete().eq('user_id', userId).eq('destination_id', destinationId);
  return !error;
}

export async function isDestinationSaved(userId: string, destinationId: string) {
  const { data } = await supabase.from('saved_destinations').select('id').eq('user_id', userId).eq('destination_id', destinationId).maybeSingle();
  return !!data;
}

// =====================
// REVIEWS
// =====================
export async function getReviews(destinationId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles!reviews_user_id_fkey(full_name, avatar_url)')
    .eq('destination_id', destinationId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) { console.error('getReviews error:', error); return []; }
  return Array.isArray(data) ? data as Review[] : [];
}

export async function createReview(review: Omit<Review, 'id' | 'created_at'>) {
  const { error } = await supabase.from('reviews').insert(review);
  return !error;
}

// =====================
// NOTIFICATIONS
// =====================
export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) { console.error('getNotifications error:', error); return []; }
  return Array.isArray(data) ? data as Notification[] : [];
}

export async function markNotificationRead(notificationId: string) {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
  return !error;
}

export async function markAllNotificationsRead(userId: string) {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
  return !error;
}

// =====================
// DOCUMENTS
// =====================
export async function getTravelDocuments(userId: string) {
  const { data, error } = await supabase
    .from('travel_documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) { console.error('getTravelDocuments error:', error); return []; }
  return Array.isArray(data) ? data as TravelDocument[] : [];
}

export async function createTravelDocument(doc: Omit<TravelDocument, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('travel_documents').insert(doc).select().maybeSingle();
  if (error) { console.error('createTravelDocument error:', error); return null; }
  return data as TravelDocument | null;
}

export async function deleteTravelDocument(docId: string) {
  const { error } = await supabase.from('travel_documents').delete().eq('id', docId);
  return !error;
}

// =====================
// EMERGENCY CONTACTS
// =====================
export async function getEmergencyContacts(destinationId?: string) {
  let query = supabase.from('emergency_contacts').select('*').order('type');
  if (destinationId) {
    query = supabase.from('emergency_contacts').select('*').or(`is_national.eq.true,destination_id.eq.${destinationId}`).order('type');
  } else {
    query = query.eq('is_national', true);
  }
  const { data, error } = await query.limit(50);
  if (error) { console.error('getEmergencyContacts error:', error); return []; }
  return Array.isArray(data) ? data as EmergencyContact[] : [];
}

// =====================
// PROFILES (admin)
// =====================
export async function getAllProfiles(limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) { console.error('getAllProfiles error:', error); return []; }
  return Array.isArray(data) ? data as Profile[] : [];
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { error } = await supabase.from('profiles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', userId);
  return !error;
}

// =====================
// DESTINATIONS (admin CRUD)
// =====================
export async function createDestination(dest: Omit<Destination, 'id' | 'created_at' | 'gallery_urls' | 'review_count' | 'best_months' | 'food_highlights' | 'highlights' | 'is_featured' | 'lat' | 'lng'>) {
  const { data, error } = await supabase.from('destinations').insert({
    ...dest,
    gallery_urls: [],
    review_count: 0,
    best_months: [],
    food_highlights: [],
    highlights: [],
    is_featured: false,
  }).select().maybeSingle();
  if (error) { console.error('createDestination error:', error); return null; }
  return data as Destination | null;
}

export async function updateDestination(id: string, updates: Partial<Destination>) {
  const { error } = await supabase.from('destinations').update(updates).eq('id', id);
  if (error) { console.error('updateDestination error:', error); return false; }
  return true;
}

export async function deleteDestination(id: string) {
  const { error } = await supabase.from('destinations').delete().eq('id', id);
  return !error;
}

// =====================
// GLOBAL SEARCH
// =====================
export async function globalSearch(query: string) {
  const q = `%${query}%`;
  const [dests, attrs, exps, fests] = await Promise.all([
    supabase.from('destinations').select('id,name,slug,image_url,budget_min,rating').ilike('name', q).limit(5),
    supabase.from('attractions').select('id,name,destination_id,destinations(name,slug)').ilike('name', q).limit(5),
    supabase.from('experiences').select('id,name,destination_id,estimated_cost,destinations(name,slug)').ilike('name', q).limit(5),
    supabase.from('festivals').select('id,name,description,month_start,month_end').ilike('name', q).limit(5),
  ]);
  return {
    destinations: Array.isArray(dests.data) ? dests.data : [],
    attractions: Array.isArray(attrs.data) ? attrs.data : [],
    experiences: Array.isArray(exps.data) ? exps.data : [],
    festivals: Array.isArray(fests.data) ? fests.data : [],
  };
}
