export type UserRole = 'user' | 'admin';
export type TravelPersona = 'budget' | 'luxury' | 'adventure' | 'food_explorer' | 'religious' | 'family';
export type TripType = 'solo' | 'couple' | 'family' | 'friends' | 'senior_citizens';
export type BookingStatus = 'not_started' | 'pending' | 'booked' | 'cancelled' | 'completed';
export type TripPhase = 'planning' | 'traveling' | 'completed' | 'cancelled';
export type DestinationCategory = 'beach' | 'hill_station' | 'pilgrimage' | 'wildlife' | 'adventure' | 'heritage' | 'food_tourism' | 'luxury' | 'weekend_getaway' | 'family_friendly';
export type TravelMode = 'regular' | 'pilgrimage';
export type DocumentType = 'aadhaar' | 'pan' | 'passport' | 'visa' | 'hotel_voucher' | 'flight_ticket' | 'train_ticket' | 'travel_insurance' | 'other';
export type NotificationType = 'trip_reminder' | 'budget_alert' | 'booking_update' | 'weather_warning' | 'festival_alert' | 'review_reminder' | 'recommendation' | 'general';

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  preferred_language: string;
  travel_persona: TravelPersona | null;
  budget_preference: number;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  state: string | null;
  region: string | null;
  image_url: string | null;
  gallery_urls: string[];
  budget_min: number;
  budget_mid: number;
  budget_luxury: number;
  rating: number;
  review_count: number;
  best_months: string[];
  safety_tips: string | null;
  local_transport: string | null;
  food_highlights: string[];
  highlights: string[];
  is_featured: boolean;
  is_pilgrimage: boolean;
  lat: number | null;
  lng: number | null;
  created_at: string;
  categories?: DestinationCategory[];
}

export interface Attraction {
  id: string;
  destination_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  entry_fee: number;
  timings: string | null;
  duration_hours: number;
  category: string | null;
  created_at: string;
}

export interface Experience {
  id: string;
  destination_id: string;
  name: string;
  description: string | null;
  duration_hours: number;
  estimated_cost: number;
  booking_link: string | null;
  image_url: string | null;
  category: string | null;
  created_at: string;
}

export interface Festival {
  id: string;
  name: string;
  description: string | null;
  month_start: number;
  month_end: number;
  image_url: string | null;
  created_at: string;
}

export interface Hotel {
  id: string;
  destination_id: string;
  name: string;
  type: string;
  price_per_night: number;
  rating: number;
  image_url: string | null;
  booking_link: string | null;
  amenities: string[];
  created_at: string;
}

export interface TransportOption {
  id: string;
  from_city: string;
  to_city: string;
  mode: string;
  provider: string | null;
  estimated_cost: number;
  duration_hours: number;
  booking_link: string | null;
  created_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  destination_id: string | null;
  title: string;
  destination_name: string;
  trip_type: TripType;
  travel_mode: TravelMode;
  start_date: string;
  end_date: string;
  num_travelers: number;
  total_budget: number;
  spent_amount: number;
  phase: TripPhase;
  travel_mode_active: boolean;
  preferences: string[];
  checklist: ChecklistItem[];

  travel_plan?: any;
  generation_status?: string;

  created_at: string;
  updated_at: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ItineraryItem {
  id: string;
  trip_id: string;
  day_number: number;
  time_slot: string | null;
  item_type: string;
  title: string;
  description: string | null;
  location: string | null;
  estimated_cost: number;
  duration_hours: number;
  booking_link: string | null;
  notes: string | null;
  is_completed: boolean;
  sort_order: number;
  created_at: string;
}

export interface Booking {
  id: string;
  trip_id: string;
  user_id: string;
  booking_type: string;
  title: string;
  provider: string | null;
  status: BookingStatus;
  estimated_cost: number;
  actual_cost: number | null;
  booking_reference: string | null;
  booking_link: string | null;
  travel_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  trip_id: string;
  user_id: string;
  category: string;
  title: string;
  amount: number;
  expense_date: string;
  notes: string | null;
  created_at: string;
}

export interface SavedDestination {
  id: string;
  user_id: string;
  destination_id: string;
  created_at: string;
  destination?: Destination;
}

export interface Review {
  id: string;
  trip_id: string | null;
  destination_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  content: string | null;
  created_at: string;
  profiles?: { full_name: string | null; avatar_url: string | null };
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export interface TravelDocument {
  id: string;
  user_id: string;
  trip_id: string | null;
  document_type: DocumentType;
  name: string;
  file_url: string | null;
  file_size: number | null;
  expiry_date: string | null;
  notes: string | null;
  created_at: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface EmergencyContact {
  id: string;
  destination_id: string | null;
  name: string;
  type: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  is_national: boolean;
  created_at: string;
}
