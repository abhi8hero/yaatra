
-- =====================
-- SEED: DESTINATIONS
-- =====================
INSERT INTO public.destinations (name, slug, description, state, region, image_url, budget_min, budget_mid, budget_luxury, rating, review_count, best_months, highlights, food_highlights, safety_tips, local_transport, is_featured, is_pilgrimage, lat, lng)
VALUES
(
  'Jaipur', 'jaipur',
  'The Pink City of India, known for its stunning Rajput-era architecture, vibrant bazaars, and golden desert sunsets. Jaipur is a city where every corner tells a story of royal heritage.',
  'Rajasthan', 'North India',
  'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_77cb0c82-462b-433e-b0f1-db4871e27860.jpg',
  8000, 18000, 45000, 4.6, 1243,
  ARRAY['October', 'November', 'December', 'January', 'February', 'March'],
  ARRAY['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort'],
  ARRAY['Dal Baati Churma', 'Laal Maas', 'Ghewar', 'Pyaaz Kachori', 'Mawa Kachori'],
  'Carry cash for local bazaars. Negotiate prices for auto-rickshaws. Keep an eye on belongings in crowds.',
  'Auto-rickshaws, cycle rickshaws, hired taxis, city buses',
  true, false, 26.9124, 75.7873
),
(
  'Goa', 'goa',
  'India''s beach paradise, famous for its sun-kissed shores, vibrant nightlife, Portuguese heritage, and the laid-back Susegad lifestyle that makes it truly unique.',
  'Goa', 'West India',
  'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_19234edd-fd55-45b1-930c-be54e9be3cef.jpg',
  10000, 25000, 60000, 4.7, 2187,
  ARRAY['October', 'November', 'December', 'January', 'February', 'March'],
  ARRAY['Baga Beach', 'Old Goa Churches', 'Dudhsagar Falls', 'Anjuna Flea Market', 'Fort Aguada'],
  ARRAY['Goan Fish Curry', 'Bebinca', 'Xacuti', 'Vindaloo', 'Prawn Balchao'],
  'Be cautious about beach scams. Rent scooters only from licensed dealers. Avoid isolated beaches at night.',
  'Scooter rentals, Goa Miles taxi app, local buses, kadamba bus service',
  true, false, 15.2993, 74.1240
),
(
  'Kerala Backwaters', 'kerala-backwaters',
  'A serene network of lagoons, lakes, canals and rivers stretching parallel to the Arabian Sea. Experience the unique houseboat culture and lush tropical beauty of God''s Own Country.',
  'Kerala', 'South India',
  'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_ec7be2c2-6c19-4ec3-b576-76d2ce403c53.jpg',
  12000, 28000, 65000, 4.8, 987,
  ARRAY['September', 'October', 'November', 'December', 'January', 'February'],
  ARRAY['Alleppey Backwaters', 'Kumarakom Bird Sanctuary', 'Marari Beach', 'Vembanad Lake', 'Pathiramanal Island'],
  ARRAY['Karimeen Pollichathu', 'Puttu Kadala', 'Kerala Prawn Curry', 'Appam with Stew', 'Ela Sadhya'],
  'Houseboat conditions vary; check reviews before booking. Carry mosquito repellent. Rainy season may disrupt travel.',
  'Houseboats, canoes, local ferries, taxis, auto-rickshaws',
  true, false, 9.4981, 76.3388
),
(
  'Manali', 'manali',
  'The Snow-kissed jewel of the Himalayas, offering breathtaking mountain vistas, adventure sports, ancient temples, and a perfect escape into nature''s grandeur.',
  'Himachal Pradesh', 'North India',
  'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_f98c9951-1e68-4511-9900-65ac09f7ddf9.jpg',
  10000, 22000, 50000, 4.5, 1456,
  ARRAY['March', 'April', 'May', 'June', 'October', 'November'],
  ARRAY['Rohtang Pass', 'Solang Valley', 'Hadimba Temple', 'Old Manali', 'Beas River'],
  ARRAY['Sidu', 'Babru', 'Patande', 'Chha Ghost', 'Aktori'],
  'Altitude sickness is possible; acclimatize properly. Roads may close in heavy snow. Carry warm clothes.',
  'Local buses, hired taxis, shared cabs, bike rentals',
  true, false, 32.2396, 77.1887
),
(
  'Varanasi', 'varanasi',
  'One of the world''s oldest living cities, Varanasi is the spiritual heart of India. Witness the eternal Ganga Aarti, explore ancient temples, and experience the profound cycle of life.',
  'Uttar Pradesh', 'North India',
  'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_e1d68ae0-1ea7-464b-a279-a494949bc539.jpg',
  5000, 12000, 30000, 4.7, 1876,
  ARRAY['October', 'November', 'December', 'January', 'February', 'March'],
  ARRAY['Dashashwamedh Ghat', 'Kashi Vishwanath Temple', 'Sarnath', 'Assi Ghat', 'Manikarnika Ghat'],
  ARRAY['Malaiyo', 'Baati Chokha', 'Tamatar Chaat', 'Chena Dahi Vada', 'Lassì'],
  'Respect religious sentiments near temples and ghats. Beware of touts near the ghats. Photography restrictions apply at some temples.',
  'Cycle rickshaws, e-rickshaws, boats on Ganga, local autos',
  true, true, 25.3176, 82.9739
),
(
  'Coorg', 'coorg',
  'The Scotland of India, Coorg enchants with its aromatic coffee and spice plantations, rolling green hills, misty waterfalls, and the warm hospitality of the Kodava people.',
  'Karnataka', 'South India',
  'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_3015a578-8dcd-4023-b368-7a0b5db25935.jpg',
  8000, 20000, 48000, 4.6, 743,
  ARRAY['October', 'November', 'December', 'January', 'February'],
  ARRAY['Abbey Falls', 'Dubare Elephant Camp', 'Talacauvery', 'Madikeri Fort', 'Nagarhole National Park'],
  ARRAY['Pandi Curry', 'Nool Puttu', 'Bamboo Shoot Curry', 'Kodava Puttu', 'Rice Akki Rotti'],
  'Mountain roads can be steep. Check for leeches in monsoon. Carry rainwear.',
  'Private taxis, self-drive options, KSRTC buses',
  true, false, 12.3375, 75.8069
),
(
  'Ranthambore', 'ranthambore',
  'Home to the majestic Bengal Tiger, Ranthambore National Park is India''s premier wildlife sanctuary nestled among the rugged Aravallis, where history and wilderness merge.',
  'Rajasthan', 'North India',
  'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_1e6d9da3-ad8f-48ac-bd15-61aabf91ddb3.jpg',
  12000, 28000, 70000, 4.8, 634,
  ARRAY['October', 'November', 'December', 'January', 'February', 'March', 'April', 'May'],
  ARRAY['Tiger Safari', 'Ranthambore Fort', 'Padam Lake', 'Jogi Mahal', 'Raj Bagh Ruins'],
  ARRAY['Dal Baati Churma', 'Laal Maas', 'Ker Sangri', 'Bajre ki Roti', 'Rajasthani Thali'],
  'Book safari permits well in advance. Follow jungle rules strictly. No plastic inside the park.',
  'Jeep and Canter safaris, hired taxis from Sawai Madhopur',
  false, false, 25.9752, 76.5026
),
(
  'Mumbai', 'mumbai',
  'The City of Dreams, Mumbai is India''s financial and entertainment capital—a city that never sleeps, blending colonial grandeur with modern ambitions on a stunning coastline.',
  'Maharashtra', 'West India',
  'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_ea49a71d-1703-463d-9209-73fd80b70e8a.jpg',
  12000, 30000, 80000, 4.5, 2341,
  ARRAY['October', 'November', 'December', 'January', 'February'],
  ARRAY['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Bollywood Tour', 'Dharavi'],
  ARRAY['Vada Pav', 'Pav Bhaji', 'Bombay Sandwich', 'Modak', 'Mumbai Biryani'],
  'Use local trains during off-peak hours. Carry hotel ID. Avoid isolated areas at night.',
  'Local trains (lifeline), BEST buses, Metro, taxis, auto-rickshaws',
  false, false, 19.0760, 72.8777
),
(
  'Vaishno Devi', 'vaishno-devi',
  'One of the holiest Hindu shrines, the Vaishno Devi temple nestled in the Trikuta Mountains draws millions of devotees annually on a sacred yatra through breathtaking mountain terrain.',
  'Jammu & Kashmir', 'North India',
  'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_e1d68ae0-1ea7-464b-a279-a494949bc539.jpg',
  6000, 14000, 35000, 4.9, 3421,
  ARRAY['March', 'April', 'May', 'August', 'September', 'October'],
  ARRAY['Vaishno Devi Shrine', 'Bhairon Baba Temple', 'Banganga', 'Ardhkuwari Cave', 'Shiv Khori'],
  ARRAY['Prasad Halwa', 'Rajma Chawal', 'Makki di Roti', 'Saag', 'Kheer'],
  'Register online before yatra. Carry warm clothes. Follow all shrine guidelines.',
  'Helicopters, ponies, palki, battery cars, walking',
  false, true, 33.0258, 74.9526
);

-- =====================
-- SEED: DESTINATION CATEGORIES
-- =====================
INSERT INTO public.destination_categories (destination_id, category)
SELECT d.id, 'heritage'::public.destination_category FROM public.destinations d WHERE d.slug = 'jaipur'
UNION ALL
SELECT d.id, 'adventure'::public.destination_category FROM public.destinations d WHERE d.slug = 'jaipur'
UNION ALL
SELECT d.id, 'food_tourism'::public.destination_category FROM public.destinations d WHERE d.slug = 'jaipur'
UNION ALL
SELECT d.id, 'beach'::public.destination_category FROM public.destinations d WHERE d.slug = 'goa'
UNION ALL
SELECT d.id, 'food_tourism'::public.destination_category FROM public.destinations d WHERE d.slug = 'goa'
UNION ALL
SELECT d.id, 'luxury'::public.destination_category FROM public.destinations d WHERE d.slug = 'goa'
UNION ALL
SELECT d.id, 'luxury'::public.destination_category FROM public.destinations d WHERE d.slug = 'kerala-backwaters'
UNION ALL
SELECT d.id, 'weekend_getaway'::public.destination_category FROM public.destinations d WHERE d.slug = 'kerala-backwaters'
UNION ALL
SELECT d.id, 'family_friendly'::public.destination_category FROM public.destinations d WHERE d.slug = 'kerala-backwaters'
UNION ALL
SELECT d.id, 'adventure'::public.destination_category FROM public.destinations d WHERE d.slug = 'manali'
UNION ALL
SELECT d.id, 'hill_station'::public.destination_category FROM public.destinations d WHERE d.slug = 'manali'
UNION ALL
SELECT d.id, 'weekend_getaway'::public.destination_category FROM public.destinations d WHERE d.slug = 'manali'
UNION ALL
SELECT d.id, 'pilgrimage'::public.destination_category FROM public.destinations d WHERE d.slug = 'varanasi'
UNION ALL
SELECT d.id, 'heritage'::public.destination_category FROM public.destinations d WHERE d.slug = 'varanasi'
UNION ALL
SELECT d.id, 'food_tourism'::public.destination_category FROM public.destinations d WHERE d.slug = 'varanasi'
UNION ALL
SELECT d.id, 'hill_station'::public.destination_category FROM public.destinations d WHERE d.slug = 'coorg'
UNION ALL
SELECT d.id, 'weekend_getaway'::public.destination_category FROM public.destinations d WHERE d.slug = 'coorg'
UNION ALL
SELECT d.id, 'family_friendly'::public.destination_category FROM public.destinations d WHERE d.slug = 'coorg'
UNION ALL
SELECT d.id, 'wildlife'::public.destination_category FROM public.destinations d WHERE d.slug = 'ranthambore'
UNION ALL
SELECT d.id, 'adventure'::public.destination_category FROM public.destinations d WHERE d.slug = 'ranthambore'
UNION ALL
SELECT d.id, 'heritage'::public.destination_category FROM public.destinations d WHERE d.slug = 'mumbai'
UNION ALL
SELECT d.id, 'food_tourism'::public.destination_category FROM public.destinations d WHERE d.slug = 'mumbai'
UNION ALL
SELECT d.id, 'luxury'::public.destination_category FROM public.destinations d WHERE d.slug = 'mumbai'
UNION ALL
SELECT d.id, 'pilgrimage'::public.destination_category FROM public.destinations d WHERE d.slug = 'vaishno-devi'
UNION ALL
SELECT d.id, 'adventure'::public.destination_category FROM public.destinations d WHERE d.slug = 'vaishno-devi';

-- =====================
-- SEED: ATTRACTIONS
-- =====================
INSERT INTO public.attractions (destination_id, name, description, entry_fee, timings, duration_hours, category)
SELECT d.id, 'Amber Fort', 'Majestic hilltop fort with ornate mirror work and stunning views', 200, '8:00 AM - 5:30 PM', 3.0, 'fort'
FROM public.destinations d WHERE d.slug = 'jaipur'
UNION ALL
SELECT d.id, 'Hawa Mahal', 'The Palace of Winds with 953 windows, icon of Jaipur', 50, '9:00 AM - 5:00 PM', 1.5, 'palace'
FROM public.destinations d WHERE d.slug = 'jaipur'
UNION ALL
SELECT d.id, 'City Palace', 'Royal residence housing museums with royal artifacts', 200, '9:30 AM - 5:00 PM', 2.0, 'palace'
FROM public.destinations d WHERE d.slug = 'jaipur'
UNION ALL
SELECT d.id, 'Baga Beach', 'Vibrant beach famous for water sports and shacks', 0, 'Open 24 hours', 4.0, 'beach'
FROM public.destinations d WHERE d.slug = 'goa'
UNION ALL
SELECT d.id, 'Old Goa Churches', 'UNESCO World Heritage churches of Portuguese era', 0, '9:00 AM - 5:30 PM', 3.0, 'heritage'
FROM public.destinations d WHERE d.slug = 'goa'
UNION ALL
SELECT d.id, 'Alleppey Houseboat', 'Iconic houseboat cruise through backwater canals', 0, 'All day', 8.0, 'nature'
FROM public.destinations d WHERE d.slug = 'kerala-backwaters'
UNION ALL
SELECT d.id, 'Rohtang Pass', 'Himalayan mountain pass with snow year-round', 0, '6:00 AM - 5:00 PM', 4.0, 'nature'
FROM public.destinations d WHERE d.slug = 'manali'
UNION ALL
SELECT d.id, 'Dashashwamedh Ghat', 'The most spectacular Ganga Aarti happens here at sunrise/sunset', 0, 'All day', 2.0, 'spiritual'
FROM public.destinations d WHERE d.slug = 'varanasi'
UNION ALL
SELECT d.id, 'Kashi Vishwanath Temple', 'One of the 12 Jyotirlingas, the most sacred Shiva temple', 0, '4:00 AM - 11:00 PM', 1.5, 'temple'
FROM public.destinations d WHERE d.slug = 'varanasi'
UNION ALL
SELECT d.id, 'Tiger Safari Zone 1', 'Best zone for tiger sightings with Ranthambore Fort backdrop', 1000, '6:00 AM - 10:00 AM, 2:30 PM - 6:30 PM', 3.5, 'wildlife'
FROM public.destinations d WHERE d.slug = 'ranthambore';

-- =====================
-- SEED: EXPERIENCES
-- =====================
INSERT INTO public.experiences (destination_id, name, description, duration_hours, estimated_cost, category)
SELECT d.id, 'Camel Safari', 'Ride through the desert dunes around Jaipur under golden skies', 3.0, 1200, 'adventure'
FROM public.destinations d WHERE d.slug = 'jaipur'
UNION ALL
SELECT d.id, 'Puppet Show & Craft Workshop', 'Learn traditional Rajasthani puppet making and see live performances', 2.0, 800, 'cultural'
FROM public.destinations d WHERE d.slug = 'jaipur'
UNION ALL
SELECT d.id, 'Block Printing Workshop', 'Create your own fabric designs using traditional Jaipur block printing', 3.0, 1500, 'cultural'
FROM public.destinations d WHERE d.slug = 'jaipur'
UNION ALL
SELECT d.id, 'Scuba Diving', 'Explore the underwater world off Goa''s coast with certified instructors', 3.0, 3500, 'adventure'
FROM public.destinations d WHERE d.slug = 'goa'
UNION ALL
SELECT d.id, 'Dolphin Watching Cruise', 'Early morning cruise to spot bottlenose dolphins in the Arabian Sea', 2.0, 800, 'nature'
FROM public.destinations d WHERE d.slug = 'goa'
UNION ALL
SELECT d.id, 'Ganga Aarti & Boat Ride', 'Witness the mesmerizing aarti ceremony from a boat on the sacred Ganga', 2.0, 600, 'spiritual'
FROM public.destinations d WHERE d.slug = 'varanasi'
UNION ALL
SELECT d.id, 'Houseboat Stay', '24-hour houseboat experience through Kerala backwater channels', 24.0, 8000, 'nature'
FROM public.destinations d WHERE d.slug = 'kerala-backwaters'
UNION ALL
SELECT d.id, 'Skiing & Snowboarding', 'Learn skiing or snowboard on the slopes of Solang Valley', 4.0, 2500, 'adventure'
FROM public.destinations d WHERE d.slug = 'manali'
UNION ALL
SELECT d.id, 'Coffee Plantation Tour', 'Walk through aromatic coffee estates and learn the harvest process', 3.0, 1000, 'nature'
FROM public.destinations d WHERE d.slug = 'coorg'
UNION ALL
SELECT d.id, 'Tiger Tracking Walk', 'Early morning guided walk to track tiger pug marks and wildlife', 3.0, 2000, 'wildlife'
FROM public.destinations d WHERE d.slug = 'ranthambore';

-- =====================
-- SEED: FESTIVALS
-- =====================
INSERT INTO public.festivals (name, description, month_start, month_end)
VALUES
('Pushkar Fair', 'The world''s largest camel fair and one of India''s most vibrant cultural festivals', 11, 11),
('Holi', 'The festival of colors celebrated across India with great joy and colors', 3, 3),
('Diwali', 'The festival of lights, celebrated with firecrackers, sweets, and family gatherings', 10, 11),
('Goa Carnival', 'Portuguese-influenced carnival with floats, music, and dancing in Goa streets', 2, 3),
('Onam', 'Kerala''s harvest festival with grand Onam Sadya feast and snake boat races', 8, 9),
('Kumbh Mela', 'The world''s largest religious gathering held at sacred river confluences', 1, 4),
('Hornbill Festival', 'Nagaland''s spectacular festival showcasing tribal culture, music and dance', 12, 12),
('Jaipur Literature Festival', 'The world''s largest free literary festival held in Jaipur', 1, 2);

-- Link festivals to destinations
INSERT INTO public.destination_festivals (destination_id, festival_id)
SELECT d.id, f.id FROM public.destinations d, public.festivals f
WHERE d.slug = 'jaipur' AND f.name IN ('Pushkar Fair', 'Holi', 'Jaipur Literature Festival')
UNION ALL
SELECT d.id, f.id FROM public.destinations d, public.festivals f
WHERE d.slug = 'goa' AND f.name IN ('Goa Carnival', 'Diwali')
UNION ALL
SELECT d.id, f.id FROM public.destinations d, public.festivals f
WHERE d.slug = 'kerala-backwaters' AND f.name IN ('Onam')
UNION ALL
SELECT d.id, f.id FROM public.destinations d, public.festivals f
WHERE d.slug = 'varanasi' AND f.name IN ('Kumbh Mela', 'Diwali', 'Holi');

-- =====================
-- SEED: NATIONAL EMERGENCY CONTACTS
-- =====================
INSERT INTO public.emergency_contacts (name, type, phone, is_national)
VALUES
('Police', 'police', '100', true),
('Ambulance', 'ambulance', '102', true),
('Fire', 'fire', '101', true),
('National Emergency Number', 'emergency', '112', true),
('Tourist Helpline', 'helpline', '1800-111-363', true),
('Women Helpline', 'helpline', '181', true),
('Child Helpline', 'helpline', '1098', true),
('Railway Enquiry', 'transport', '139', true);
