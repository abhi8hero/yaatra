
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- ENUMS
-- =====================
CREATE TYPE public.user_role AS ENUM ('user', 'admin');
CREATE TYPE public.travel_persona AS ENUM ('budget', 'luxury', 'adventure', 'food_explorer', 'religious', 'family');
CREATE TYPE public.trip_type AS ENUM ('solo', 'couple', 'family', 'friends', 'senior_citizens');
CREATE TYPE public.booking_status AS ENUM ('not_started', 'pending', 'booked', 'cancelled', 'completed');
CREATE TYPE public.trip_phase AS ENUM ('planning', 'traveling', 'completed', 'cancelled');
CREATE TYPE public.destination_category AS ENUM ('beach', 'hill_station', 'pilgrimage', 'wildlife', 'adventure', 'heritage', 'food_tourism', 'luxury', 'weekend_getaway', 'family_friendly');
CREATE TYPE public.travel_mode AS ENUM ('regular', 'pilgrimage');
CREATE TYPE public.document_type AS ENUM ('aadhaar', 'pan', 'passport', 'visa', 'hotel_voucher', 'flight_ticket', 'train_ticket', 'travel_insurance', 'other');
CREATE TYPE public.notification_type AS ENUM ('trip_reminder', 'budget_alert', 'booking_update', 'weather_warning', 'festival_alert', 'review_reminder', 'recommendation', 'general');

-- =====================
-- PROFILES
-- =====================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  phone text,
  full_name text,
  avatar_url text,
  role public.user_role NOT NULL DEFAULT 'user',
  preferred_language text NOT NULL DEFAULT 'en',
  travel_persona public.travel_persona,
  budget_preference integer DEFAULT 20000,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, role)
  VALUES (NEW.id, NEW.email, NEW.phone, 'user'::public.user_role);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.get_user_role(uid uuid)
RETURNS public.user_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = uid;
$$;

CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM public.get_user_role(auth.uid()));

CREATE VIEW public.public_profiles AS
  SELECT id, full_name, avatar_url, role, travel_persona FROM public.profiles;

-- =====================
-- DESTINATIONS
-- =====================
CREATE TABLE public.destinations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  state text,
  region text,
  image_url text,
  gallery_urls text[] DEFAULT '{}',
  budget_min integer DEFAULT 5000,
  budget_mid integer DEFAULT 15000,
  budget_luxury integer DEFAULT 40000,
  rating numeric(3,1) DEFAULT 4.0,
  review_count integer DEFAULT 0,
  best_months text[] DEFAULT '{}',
  safety_tips text,
  local_transport text,
  food_highlights text[] DEFAULT '{}',
  highlights text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_pilgrimage boolean DEFAULT false,
  lat numeric(10,6),
  lng numeric(10,6),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view destinations" ON public.destinations
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage destinations" ON public.destinations
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- Destination Categories (many-to-many)
CREATE TABLE public.destination_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id uuid NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  category public.destination_category NOT NULL,
  UNIQUE(destination_id, category)
);

ALTER TABLE public.destination_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view destination categories" ON public.destination_categories
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage destination categories" ON public.destination_categories
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- =====================
-- ATTRACTIONS
-- =====================
CREATE TABLE public.attractions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id uuid NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  entry_fee integer DEFAULT 0,
  timings text,
  duration_hours numeric(4,1) DEFAULT 2,
  category text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.attractions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view attractions" ON public.attractions
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage attractions" ON public.attractions
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- =====================
-- EXPERIENCES
-- =====================
CREATE TABLE public.experiences (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id uuid NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  duration_hours numeric(4,1) DEFAULT 2,
  estimated_cost integer DEFAULT 500,
  booking_link text,
  image_url text,
  category text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view experiences" ON public.experiences
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage experiences" ON public.experiences
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- =====================
-- FESTIVALS
-- =====================
CREATE TABLE public.festivals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  month_start integer NOT NULL,
  month_end integer NOT NULL,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.festivals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view festivals" ON public.festivals
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage festivals" ON public.festivals
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

CREATE TABLE public.destination_festivals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id uuid NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  festival_id uuid NOT NULL REFERENCES public.festivals(id) ON DELETE CASCADE,
  UNIQUE(destination_id, festival_id)
);

ALTER TABLE public.destination_festivals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view destination festivals" ON public.destination_festivals
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage destination festivals" ON public.destination_festivals
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- =====================
-- HOTELS
-- =====================
CREATE TABLE public.hotels (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id uuid NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text DEFAULT 'budget',
  price_per_night integer DEFAULT 1000,
  rating numeric(3,1) DEFAULT 4.0,
  image_url text,
  booking_link text,
  amenities text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hotels" ON public.hotels
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage hotels" ON public.hotels
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- =====================
-- TRANSPORT OPTIONS
-- =====================
CREATE TABLE public.transport_options (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_city text NOT NULL,
  to_city text NOT NULL,
  mode text NOT NULL,
  provider text,
  estimated_cost integer DEFAULT 500,
  duration_hours numeric(4,1) DEFAULT 2,
  booking_link text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.transport_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view transport options" ON public.transport_options
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage transport options" ON public.transport_options
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- =====================
-- TRIPS
-- =====================
CREATE TABLE public.trips (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination_id uuid REFERENCES public.destinations(id),
  title text NOT NULL,
  destination_name text NOT NULL,
  trip_type public.trip_type NOT NULL DEFAULT 'solo',
  travel_mode public.travel_mode NOT NULL DEFAULT 'regular',
  start_date date NOT NULL,
  end_date date NOT NULL,
  num_travelers integer NOT NULL DEFAULT 1,
  total_budget integer NOT NULL DEFAULT 10000,
  spent_amount integer DEFAULT 0,
  phase public.trip_phase NOT NULL DEFAULT 'planning',
  travel_mode_active boolean DEFAULT false,
  preferences text[] DEFAULT '{}',
  checklist jsonb DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own trips" ON public.trips
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trips" ON public.trips
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips" ON public.trips
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips" ON public.trips
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage trips" ON public.trips
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- =====================
-- ITINERARY ITEMS
-- =====================
CREATE TABLE public.itinerary_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number integer NOT NULL DEFAULT 1,
  time_slot text,
  item_type text NOT NULL DEFAULT 'attraction',
  title text NOT NULL,
  description text,
  location text,
  estimated_cost integer DEFAULT 0,
  duration_hours numeric(4,1) DEFAULT 1,
  booking_link text,
  notes text,
  is_completed boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own itinerary items" ON public.itinerary_items
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can view all itinerary items" ON public.itinerary_items
  FOR SELECT TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- =====================
-- BOOKINGS
-- =====================
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_type text NOT NULL,
  title text NOT NULL,
  provider text,
  status public.booking_status NOT NULL DEFAULT 'not_started',
  estimated_cost integer DEFAULT 0,
  actual_cost integer,
  booking_reference text,
  booking_link text,
  travel_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings" ON public.bookings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings" ON public.bookings
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage bookings" ON public.bookings
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- =====================
-- EXPENSES
-- =====================
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'other',
  title text NOT NULL,
  amount integer NOT NULL,
  expense_date date DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own expenses" ON public.expenses
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all expenses" ON public.expenses
  FOR SELECT TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- =====================
-- SAVED DESTINATIONS (WISHLIST)
-- =====================
CREATE TABLE public.saved_destinations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination_id uuid NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, destination_id)
);

ALTER TABLE public.saved_destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wishlist" ON public.saved_destinations
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all saved destinations" ON public.saved_destinations
  FOR SELECT TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- =====================
-- REVIEWS
-- =====================
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  destination_id uuid NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text,
  content text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, destination_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Users can insert their own reviews" ON public.reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage reviews" ON public.reviews
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- =====================
-- NOTIFICATIONS
-- =====================
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL DEFAULT 'general',
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  link text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage notifications" ON public.notifications
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- =====================
-- TRAVEL DOCUMENTS
-- =====================
CREATE TABLE public.travel_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  document_type public.document_type NOT NULL,
  name text NOT NULL,
  file_url text,
  file_size integer,
  expiry_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.travel_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own documents" ON public.travel_documents
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- =====================
-- AI CONVERSATIONS
-- =====================
CREATE TABLE public.ai_conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  messages jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own conversations" ON public.ai_conversations
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- =====================
-- EMERGENCY CONTACTS
-- =====================
CREATE TABLE public.emergency_contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id uuid REFERENCES public.destinations(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  phone text,
  address text,
  city text,
  is_national boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view emergency contacts" ON public.emergency_contacts
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage emergency contacts" ON public.emergency_contacts
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- =====================
-- RECOMMENDATION SCORES
-- =====================
CREATE TABLE public.recommendation_scores (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination_id uuid NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  score numeric(5,2) DEFAULT 0,
  factors jsonb DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, destination_id)
);

ALTER TABLE public.recommendation_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recommendation scores" ON public.recommendation_scores
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own scores" ON public.recommendation_scores
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all scores" ON public.recommendation_scores
  FOR SELECT TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);
