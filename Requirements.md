# Requirements Document

## 1. Application Overview

**Application Name**: Yaatra

**Description**: Yaatra is a complete travel management ecosystem designed for Indian travelers. It acts as a personal travel manager that assists users from trip planning to safe return home. Users provide basic information (destination, budget, dates, travelers, preferences) and receive automatically generated complete travel plans. The platform includes AI-powered assistance, smart budget tracking, dynamic replanning, travel document storage, emergency support, personalized recommendations based on travel personas, destination exploration with detailed information, wishlist management, review system, Indian festival intelligence, booking status tracking, global search, recommendation scoring engine, and Travel Companion Mode.

**Supported Languages**: English, Hindi, Marathi, Tamil, Telugu, Kannada, Malayalam, Punjabi, Haryanvi. All UI elements, recommendations, notifications, and travel plans are available in user's preferred language.

## 2. Users and Usage Scenarios

**Target Users**:
- Indian tourists (solo, couples, families, friends, senior citizens)
- Students and budget travelers
- Business travelers
- Pilgrimage travelers
- Luxury travelers
- Adventure seekers and food explorers
- International tourists visiting India

**Core Usage Scenarios**:
- User wants to explore destinations with detailed information before planning
- User wants AI-powered trip planning with conversational assistance
- User needs to track expenses in real-time with visual budget breakdown
- User wants to store and access travel documents during journey
- User needs to modify trip dynamically and recalculate budget
- User requires emergency support information during travel
- User wants personalized recommendations based on travel persona
- User plans pilgrimage trips with specialized templates
- User wants to save favorite destinations for future planning
- User wants to review destinations and hotels after travel
- User wants to discover local experiences and festivals during travel
- User wants to search across destinations, attractions, experiences, festivals
- User wants to track booking status for flights, hotels, activities
- User wants real-time travel assistance during active trip (Travel Companion Mode)

## 3. Page Structure and Functionality

```
Yaatra Website
├── Landing/Home Page
├── Authentication Pages
│   ├── Register Page
│   ├── Login Page
│   └── Password Reset Page
├── Global Search Results Page
├── Explore Page
├── Destination Detail Page
├── Trip Planner Page
├── Dashboard (Planning Mode / Travel Mode)
├── Trip Detail Page
├── Travel Wallet Page
├── My Documents Page
├── AI Travel Assistant Page
├── Emergency Hub Page
├── Transportation Hub Page
├── Profile Page
│   └── Wishlist Section
└── Admin Panel
    ├── Admin Dashboard
    ├── User Management
    ├── Destination Management
    ├── Content Management
    └── Analytics
```

### 3.1 Landing/Home Page

**Key Elements**:
- Hero section with search functionality (destination/budget input)
- Featured destinations display
- How it works section
- Testimonials section
- Language selector
- Login/Register buttons
- Global search bar in header

**Functionality**:
- User enters destination or budget in search bar to initiate trip planning
- User selects preferred language
- User clicks featured destinations to view Destination Detail Page
- User clicks Login/Register to access account
- User uses global search bar to search destinations, attractions, experiences, festivals

### 3.2 Authentication Pages

#### 3.2.1 Register Page

**Functionality**:
- User enters personal details (name, email, password, preferred language)
- User completes registration
- System creates user account and profile

#### 3.2.2 Login Page

**Functionality**:
- User enters email and password to login
- User selects Google login option (OSS Google login method)
- System authenticates user and redirects to Dashboard

#### 3.2.3 Password Reset Page

**Functionality**:
- User enters registered email
- System sends password reset link
- User creates new password

### 3.3 Global Search Results Page

**Functionality**:
- User enters search query in global search bar (accessible from header on all pages)
- System searches across destinations, attractions, experiences, festivals
- System displays grouped results:
  + Destinations (with image, name, estimated cost, View Destination button, Plan Trip button, Save to Wishlist button)
  + Attractions (with name, destination, View Details button)
  + Experiences (with name, destination, duration, estimated cost, View Details button)
  + Festivals (with name, destination, dates, View Details button)
- User clicks action buttons to navigate to relevant pages
- Example: Searching \"Jaipur\" returns Jaipur destination, Amber Fort attraction, Camel Safari experience, Pushkar Fair festival

### 3.4 Explore Page

**Functionality**:
- User browses destination list
- User applies filters (budget range, travel type, season, region, trip type, category)
- User views destination cards (image, name, estimated cost, highlights, categories)
- User clicks destination card to view Destination Detail Page
- User clicks heart icon to save destination to Wishlist
- User initiates trip planning for selected destination

**Category Filter Options**:
- Beach
- Hill Station
- Pilgrimage
- Wildlife
- Adventure
- Heritage
- Food Tourism
- Luxury
- Weekend Getaway
- Family Friendly

### 3.5 Destination Detail Page

**Sections**:
- Destination overview (description, region, type, categories)
- Best time to visit (month-by-month guide)
- Budget range (budget, mid-range, luxury estimates)
- Top attractions (list with images, entry fees, timings)
- Food recommendations (local dishes, popular restaurants)
- Local transportation options (how to get around)
- Weather trends (seasonal chart)
- Safety tips
- User Reviews and Ratings
- Local Experiences (unique activities with name, description, duration, estimated cost, booking link)
- Festival Intelligence (nearby festivals during planned travel dates)
- Personalized Recommendations (You might also like section with similar destinations based on recommendation score)
- Plan My Trip button
- Save Destination button (heart icon)

**Functionality**:
- User views complete destination information
- User reads user reviews and ratings
- User views local experiences with details
- User views festival information for planned travel dates
- User views personalized destination recommendations
- User clicks Plan My Trip button, system redirects to Trip Planner Page with destination pre-filled
- User clicks Save Destination button, system adds destination to Wishlist
- User clicks booking link for local experiences, system redirects to external booking platform

### 3.6 Trip Planner Page

**Input Form Fields**:
- Destination (text input or selection, pre-filled if coming from Destination Detail Page)
- Budget (amount input)
- Travel dates (date range picker)
- Number of travelers (number input)
- Trip type (Solo, Couple, Family, Friends, Senior Citizens)
- Travel mode (Regular, Pilgrimage)
- Travel preferences (sightseeing, adventure, relaxation, cultural, pilgrimage, food, shopping)
- Local experiences selection (optional)

**Functionality**:
- User fills in trip planning form
- User selects trip type and travel mode
- User selects local experiences to add to itinerary
- User submits form
- System generates complete itinerary including transportation options, accommodation recommendations, sightseeing attractions, local experiences, daily schedule breakdown, estimated expenses breakdown
- System displays seasonal warnings if applicable
- System displays festival information if applicable
- System displays generated itinerary
- User can save itinerary to Dashboard
- User can modify itinerary details

**Pilgrimage Mode**:
- User selects pilgrimage destination (Vaishno Devi, Tirupati, Kedarnath, Kashi, Shirdi, Somnath)
- System applies specialized itinerary template for pilgrimage travel
- System generates pilgrimage-specific recommendations

**Alternative Planning Mode**:
- User enters budget only (without destination)
- System recommends suitable destinations within budget
- User selects destination from recommendations
- System generates itinerary for selected destination

### 3.7 Dashboard

**Two Modes**:

#### 3.7.1 Planning Mode (Default)

**Sections**:
- Upcoming trips list
- Budget overview (planned vs actual spending)
- Travel schedule summary
- Notifications panel
- Quick access to Travel Wallet, My Documents, AI Assistant, Emergency Hub, Wishlist
- Personalized recommendations based on travel persona and recommendation score

**Functionality**:
- User views all upcoming trips
- User clicks trip to view Trip Detail Page
- User monitors budget status
- User views notifications (booking confirmations, schedule updates, recommendations, trip reminders, budget alerts, weather warnings, festival alerts, review reminders)
- User accesses quick actions (create new trip, view profile, explore destinations, access wallet, documents, AI assistant, emergency hub, wishlist)

#### 3.7.2 Travel Mode (Travel Companion Mode)

**Activation**:
- Auto-activates when trip start date arrives
- User can manually activate via Start Trip button on Trip Detail Page

**Sections**:
- Today's Schedule (current day's itinerary with times)
- Nearby Attractions (based on current destination)
- Current Weather summary
- Live Expense Tracker (quick-add expenses)
- Emergency Hub quick access
- My Documents quick access
- AI Assistant quick access
- End Trip button

**Functionality**:
- User views today's schedule with times
- User views nearby attractions based on current destination
- User views current weather summary
- User quickly adds expenses via Live Expense Tracker
- User accesses Emergency Hub, My Documents, AI Assistant
- User clicks End Trip button to exit Travel Mode
- System records trip as completed and prompts review submission

**Three-Phase Lifecycle**:
1. Planning Phase: standard Dashboard (trips, planner, wallet, documents)
2. Travel Phase: Travel Companion Mode (today's schedule, nearby attractions, expenses, emergency)
3. Review Phase: post-trip summary, expense analysis, review submission prompts

### 3.8 Trip Detail Page

**Sections**:
- Trip overview (destination, dates, travelers, trip type, total budget)
- Day-by-day itinerary breakdown
- Transportation details with booking buttons and status indicators
- Accommodation details with booking buttons and status indicators
- Attraction list with booking buttons and status indicators
- Local experiences with booking buttons and status indicators
- Expense summary (transportation, accommodation, food, attractions, local travel, emergency)
- Travel checklist
- Modify Trip button
- Start Trip button (to activate Travel Companion Mode)

**Booking Status Display**:
- Flight: Booked ✓
- Hotel: Pending
- Activities: Not Started

**Booking Status Options**:
- Not Started
- Pending
- Booked
- Cancelled
- Completed

**Booking Buttons**:
- Book Flight: redirects to external flight booking platform with prefilled details
- Book Train: redirects to external train booking platform with prefilled details
- Book Hotel: redirects to external hotel booking platform with prefilled details
- Book Activity: redirects to external activity booking platform with prefilled details
- Book Experience: redirects to external booking platform with prefilled details

**Functionality**:
- User views complete day-by-day itinerary
- User clicks booking buttons to book transportation/accommodation/activities/experiences
- User manually updates booking status after returning from external booking platforms
- User tracks expenses (manual input for actual spending)
- User checks off completed checklist items
- User accesses real-time itinerary during travel
- User receives navigation assistance for attractions
- User clicks Modify Trip button to access dynamic replanning
- User clicks Start Trip button to activate Travel Companion Mode

**Dynamic Replanning**:
- User selects modification type (Add one more day, Remove attraction, Change hotel, Increase budget, Reduce budget, Add local experience)
- User provides modification details
- System automatically recalculates budget, schedule, recommendations
- System displays updated itinerary
- User saves modified itinerary

### 3.9 Travel Wallet Page

**Display Elements**:
- Total budget amount
- Paid amount
- Remaining amount
- Daily spend tracking
- Category-wise spend breakdown (Flights, Hotel, Food, Attractions, Local Travel, Experiences, Emergency)
- Visual charts showing expense distribution
- Budget alerts and warnings

**Functionality**:
- User views budget overview
- User inputs actual expenses by category
- System updates remaining budget in real-time
- System displays daily spend trends
- System shows category-wise spend charts
- System alerts user when budget exceeded

### 3.10 My Documents Page

**Document Categories**:
- Aadhaar
- PAN
- Passport
- Visa copies
- Hotel vouchers
- Flight tickets
- Train tickets
- Travel insurance

**Functionality**:
- User uploads PDF documents by category
- System stores documents securely
- User views document list
- User downloads documents
- User deletes documents
- User accesses documents during travel

### 3.11 AI Travel Assistant Page

**Interface**:
- Chat interface named Yaatra AI
- Conversation history display
- Text input field
- Send button

**Example Queries**:
- Plan a Goa trip for 5 days under ₹20,000
- Suggest local foods in Jaipur
- Which train is best from Nagpur to Mumbai?
- Reduce my trip budget by 15%
- Add one more day to my Manali trip
- Show me adventure activities in Rishikesh
- What festivals are happening in Rajasthan in November?

**Functionality**:
- User types travel-related query
- System processes query using AI
- System provides conversational response with travel recommendations (powered by recommendation score engine), budget adjustments, itinerary suggestions, local information, festival information
- User continues conversation for clarifications
- System understands travel context from user's profile and trip history
- System saves conversation history

### 3.12 Emergency Hub Page

**Information Display**:
- Nearby hospitals (name, address, phone, distance)
- Police stations (name, address, phone, distance)
- Embassies (for international travelers, name, address, phone)
- Emergency contacts (ambulance, police, fire, tourist helpline)

**Functionality**:
- User views emergency information based on current location or trip destination
- User clicks phone number for one-click calling
- User views map showing nearby emergency facilities
- User accesses emergency contacts quickly during travel

### 3.13 Transportation Hub Page

**Transportation Options Display**:
- Flights (airlines, departure/arrival times, estimated cost)
- Trains (train names, departure/arrival times, estimated cost)
- Buses (bus services, departure/arrival times, estimated cost)
- Metro (routes, estimated cost)
- Cab Services (service providers, estimated cost)

**Functionality**:
- User views all transportation options for trip route
- User compares estimated costs across options
- User clicks Book button to redirect to external booking platform with prefilled details
- System displays transportation recommendations based on budget and preferences

### 3.14 Profile Page

**Sections**:
- Personal details (name, email, phone, preferred language)
- Travel persona (Budget Traveler, Luxury Traveler, Adventure Traveler, Food Explorer, Religious Traveler, Family Traveler)
- Travel history (past trips with summaries)
- Favorite destinations
- Budget preferences
- Travel interests
- Saved itineraries
- Booking history
- Wishlist Section

**Wishlist Section**:
- List of saved destinations
- Destination cards with image, name, estimated cost
- Remove from Wishlist button
- Plan Trip button (one-click redirect to Trip Planner with destination pre-filled)

**Functionality**:
- User edits personal details
- User changes preferred language
- User views assigned travel persona
- User views past trips
- User reviews trip summaries and expense analysis
- User manages favorite destinations
- User updates travel preferences
- User accesses saved itineraries
- User views booking history
- User views Wishlist
- User clicks Plan Trip button from Wishlist, system redirects to Trip Planner with destination pre-filled
- User removes destinations from Wishlist

**Review Submission (After Trip Completion)**:
- User views completed trip in travel history
- User clicks Review Trip button
- User submits star rating and text review for:
  + Destination
  + Hotels
  + Attractions
  + Overall Trip
- System stores reviews in database
- System displays reviews on Destination Detail Page
- System updates recommendation engine with review data

### 3.15 Admin Panel

#### 3.15.1 Admin Dashboard

**Functionality**:
- Admin views platform statistics (total users, active trips, bookings, revenue, reviews)
- Admin views analytics charts (user growth, popular destinations, booking trends, review trends)
- Admin accesses quick links to management sections

#### 3.15.2 User Management

**Functionality**:
- Admin views user list
- Admin searches users by name, email, phone
- Admin views user details and trip history
- Admin activates/deactivates user accounts
- Admin resets user passwords

#### 3.15.3 Destination Management

**Functionality**:
- Admin views destination list
- Admin adds new destinations (name, description, images, estimated costs, highlights, season information, best time to visit, budget ranges, top attractions, food recommendations, local transportation, weather trends, safety tips, categories)
- Admin edits destination details
- Admin deletes destinations
- Admin marks destinations as featured
- Admin assigns categories to destinations (Beach, Hill Station, Pilgrimage, Wildlife, Adventure, Heritage, Food Tourism, Luxury, Weekend Getaway, Family Friendly)
- Admin manages local experiences for destinations (name, description, duration, estimated cost, booking link)
- Admin manages festival calendar and links festivals to destinations

#### 3.15.4 Content Management

**Functionality**:
- Admin manages attractions (add, edit, delete)
- Admin manages hotels (add, edit, delete)
- Admin manages transport options (add, edit, delete)
- Admin manages local experiences (add, edit, delete)
- Admin manages festivals (add, edit, delete)
- Admin manages language translations for UI elements
- Admin manages reviews and ratings (moderate, approve, delete)
- Admin manages search index for global search

#### 3.15.5 Analytics

**Functionality**:
- Admin views user behavior analytics
- Admin views destination popularity reports
- Admin views booking conversion rates
- Admin views revenue reports
- Admin views review analytics
- Admin views wishlist trends
- Admin views search analytics
- Admin views recommendation score performance
- Admin exports analytics data

## 4. Business Rules and Logic

### 4.1 Complete User Journey Flow

**End-to-End Journey**:
1. Home → User searches destination or browses featured destinations
2. Explore → User applies filters (including category filter) and browses destination cards
3. Destination Detail → User views complete destination information, reviews, local experiences, festivals, personalized recommendations
4. Plan Trip → User fills trip planning form (destination pre-filled), selects local experiences
5. Itinerary → User views generated itinerary, saves to Dashboard
6. Booking → User clicks booking buttons, completes bookings on external platforms, updates booking status
7. Travel → User activates Travel Companion Mode, accesses today's schedule, tracks expenses, uses Emergency Hub, AI Assistant
8. Return → User clicks End Trip button, completes trip, returns home
9. Review → User submits reviews for destination, hotels, attractions, overall trip

### 4.2 Itinerary Generation Logic

**Destination-Based Planning**:
- System receives destination, budget, dates, travelers, trip type, travel mode, preferences, selected local experiences
- System calculates trip duration from dates
- System retrieves destination information (attractions, hotels, transportation options, local experiences)
- System applies trip type filters (family-friendly for Family, senior-friendly for Senior Citizens)
- System applies pilgrimage template if travel mode is Pilgrimage
- System generates day-by-day schedule based on preferences and selected local experiences
- System estimates expenses for each category including local experiences
- System ensures total estimated cost aligns with user budget
- System checks seasonal conditions and displays warnings if applicable
- System checks festival calendar and displays festival information if applicable

**Budget-Based Planning**:
- System receives budget, dates, travelers, trip type, preferences
- System calculates available budget per day
- System queries destinations within budget range
- System ranks destinations by recommendation score (preferences, season, popularity, trip type, travel persona)
- System presents top recommendations
- User selects destination, system generates itinerary

### 4.3 Expense Calculation and Tracking

**Expense Categories**:
- Transportation (flights, trains, buses, local travel)
- Accommodation (hotels, guesthouses)
- Food (meals, snacks)
- Attractions (entry fees, activities)
- Local travel (taxis, auto-rickshaws, metro)
- Experiences (local experiences)
- Emergency fund (10% of total budget)

**Calculation Process**:
- System estimates each category based on destination, duration, travelers, trip type, selected local experiences
- System provides daily spending estimates
- System displays budget breakdown in Travel Wallet
- During trip, user inputs actual expenses
- System updates Travel Wallet in real-time
- System compares actual vs planned spending
- System alerts user when budget exceeded

### 4.4 Travel Persona Assignment

**Persona Types**:
- Budget Traveler
- Luxury Traveler
- Adventure Traveler
- Food Explorer
- Religious Traveler
- Family Traveler

**Assignment Logic**:
- System tracks user's trip history (destinations, budgets, preferences, trip types, reviews)
- After user completes multiple trips, system analyzes patterns
- System assigns persona based on dominant travel behavior
- System uses persona to drive personalized recommendations in Dashboard, Explore Page, AI Assistant, Destination Detail Page

### 4.5 Dynamic Replanning Logic

**Modification Types**:
- Add one more day: System extends itinerary, adds attractions, recalculates budget
- Remove attraction: System removes attraction from schedule, adjusts daily plan, recalculates budget
- Change hotel: System replaces hotel, updates accommodation cost, recalculates budget
- Increase budget: System suggests upgraded options (better hotels, additional attractions, premium local experiences)
- Reduce budget: System suggests budget-friendly alternatives, removes optional activities
- Add local experience: System adds experience to itinerary, recalculates budget

**Recalculation Process**:
- System receives modification request
- System updates itinerary structure
- System recalculates total budget
- System adjusts daily schedule
- System updates recommendations
- System displays modified itinerary for user approval

### 4.6 AI Travel Assistant Logic

**Query Processing**:
- System receives user query in natural language
- System identifies query intent (trip planning, budget adjustment, local information, transportation advice, itinerary modification, festival information, local experiences)
- System retrieves relevant data from user profile, trip history, destination database, festival calendar
- System applies recommendation score engine to rank suggestions
- System generates conversational response
- System provides actionable recommendations

**Context Awareness**:
- System accesses user's active trips, saved trips, travel persona, wishlist
- System understands follow-up questions in conversation
- System maintains conversation history for context

### 4.7 Smart Notification System

**Notification Types**:
- Trip starts in 3 days
- Check-in tomorrow
- Attraction closed today
- Budget exceeded by ₹2,000
- Weather warning
- Booking confirmation
- Schedule update
- Personalized recommendation
- Festival alert (Festival happening during your travel dates)
- Review reminder (after trip completion)
- Booking status update reminder

**Trigger Logic**:
- System monitors trip dates and sends reminders
- System tracks budget status and sends alerts when exceeded
- System checks attraction status and notifies closures
- System monitors weather conditions and sends warnings
- System sends booking confirmations when user updates status
- System checks festival calendar and sends alerts for nearby festivals
- System sends review reminder after trip completion
- System reminds user to update booking status

### 4.8 Seasonal Intelligence

**Warning System**:
- System maintains seasonal data for destinations (monsoon, extreme heat, festivals, peak season)
- When user selects destination and dates, system checks seasonal conditions
- System displays warnings for unfavorable conditions (e.g., Heavy monsoon season in Goa in July. Consider October–February)
- System suggests alternative travel periods

### 4.9 Indian Festival Intelligence

**Festival Calendar**:
- System maintains calendar of major Indian festivals: Kumbh Mela, Ganesh Festival, Durga Puja, Pushkar Fair, Hornbill Festival, Holi, Diwali, etc.
- Each festival linked to relevant destinations and dates

**Festival Detection Logic**:
- When user plans trip, system checks festival calendar for destination and travel dates
- System identifies nearby festivals during travel period
- System displays contextual suggestions on Destination Detail Page and Trip Planner Page
- Example: You're planning Jaipur in November. Pushkar Fair is happening nearby.

**Festival Display**:
- Destination Detail Page shows festivals for relevant months
- Trip Planner Page shows festival alerts during itinerary generation
- AI Assistant provides festival information when queried
- Global Search returns festival results

### 4.10 Wishlist Management

**Save Destination**:
- User clicks heart icon on destination card (Explore Page) or Save Destination button (Destination Detail Page)
- System adds destination to user's Wishlist
- System stores entry in SavedDestinations database table

**Wishlist Access**:
- User navigates to Profile Page → Wishlist Section
- System displays saved destinations with image, name, estimated cost
- User clicks Plan Trip button, system redirects to Trip Planner with destination pre-filled
- User clicks Remove button, system removes destination from Wishlist

### 4.11 Review System

**Review Submission**:
- After trip completion, system sends review reminder notification
- User navigates to Profile Page → Travel History
- User clicks Review Trip button for completed trip
- User submits star rating (1-5 stars) and text review for:
  + Destination
  + Hotels
  + Attractions
  + Overall Trip
- System stores reviews in Reviews, Ratings, DestinationReviews database tables

**Review Display**:
- System displays user reviews on Destination Detail Page
- Reviews include star rating, text review, user name, travel date
- System calculates average rating for destinations, hotels, attractions

**Review Impact**:
- System feeds review data into recommendation engine
- System uses reviews to improve travel persona assignment
- System uses reviews to enhance personalized recommendations
- System updates recommendation scores based on review data

### 4.12 Local Experiences Management

**Experience Definition**:
- Each destination has curated list of unique local experiences
- Each experience includes: name, description, duration, estimated cost, booking link

**Experience Display**:
- Destination Detail Page shows local experiences for destination
- Trip Planner Page allows user to select local experiences to add to itinerary
- Global Search returns experience results

**Experience Integration**:
- User selects local experiences during trip planning
- System adds experiences to day-by-day itinerary
- System includes experience costs in budget calculation
- User clicks booking link, system redirects to external booking platform

### 4.13 Booking Status Management

**Status Lifecycle**:
- Not Started → Pending → Booked → Cancelled → Completed

**Status Tracking**:
- Each booking item (flight, train, hotel, activity, experience) has independent status
- User manually updates booking status after returning from external booking platforms
- System stores status in Bookings database table

**Status Display**:
- Trip Detail Page displays booking status for each item
- Example: Flight: Booked ✓, Hotel: Pending, Activities: Not Started

**Status Update**:
- User clicks booking item on Trip Detail Page
- User selects new status from dropdown
- System updates status in database
- System sends notification confirming status update

### 4.14 Destination Categories

**Category Taxonomy**:
- Beach
- Hill Station
- Pilgrimage
- Wildlife
- Adventure
- Heritage
- Food Tourism
- Luxury
- Weekend Getaway
- Family Friendly

**Category Assignment**:
- Each destination can have multiple categories
- Admin assigns categories during destination creation/editing
- System stores categories in DestinationCategories database table

**Category Usage**:
- Explore Page: User applies category filter to browse destinations
- Recommendation Engine: System uses categories to match user preferences and travel persona
- Global Search: System includes category information in search results

### 4.15 Global Search System

**Search Scope**:
- Destinations
- Attractions
- Experiences
- Festivals

**Search Process**:
- User enters search query in global search bar (accessible from header on all pages)
- System searches across all indexed content
- System groups results by type (Destinations, Attractions, Experiences, Festivals)
- System displays grouped results on Global Search Results Page

**Search Results Display**:
- Destinations: image, name, estimated cost, categories, View Destination button, Plan Trip button, Save to Wishlist button
- Attractions: name, destination, View Details button
- Experiences: name, destination, duration, estimated cost, View Details button
- Festivals: name, destination, dates, View Details button

**Search Actions**:
- User clicks View Destination button, system redirects to Destination Detail Page
- User clicks Plan Trip button, system redirects to Trip Planner with destination pre-filled
- User clicks Save to Wishlist button, system adds destination to Wishlist
- User clicks View Details button, system redirects to relevant detail page

### 4.16 Recommendation Score Engine

**Scoring Factors**:
- Travel Persona match (Budget/Luxury/Adventure/Food Explorer/Religious/Family)
- Budget alignment (destination estimated cost vs user budget preference)
- Previous Trips (destinations visited, repeat interests)
- Wishlist (saved destinations indicate interest)
- Reviews written (destinations reviewed show engagement)
- Season match (current/planned season vs best time to visit)
- Trip Type match (Solo/Family/Couple etc.)
- Popularity (number of trips planned, reviews, wishlist saves)
- Category match (destination categories vs user preferences)

**Score Calculation**:
- System calculates recommendation score for each destination based on weighted factors
- System stores scores in RecommendationScores database table
- System updates scores when user behavior changes (new trip, review, wishlist save)

**Score Application**:
- Dashboard: System displays personalized recommendations ranked by score
- Explore Page: System ranks destinations by score when no filters applied
- Destination Detail Page: System displays \"You might also like\" section with high-scoring similar destinations
- AI Travel Assistant: System uses scores to rank suggestions in conversational responses
- Trip Planner (Budget-Based Planning): System ranks destination recommendations by score

### 4.17 Travel Companion Mode

**Activation**:
- Auto-activates when trip start date arrives (system checks daily)
- User can manually activate via Start Trip button on Trip Detail Page

**Travel Mode Dashboard**:
- Today's Schedule: System displays current day's itinerary with times
- Nearby Attractions: System displays attractions based on current destination
- Current Weather: System displays weather summary for current destination
- Live Expense Tracker: User quickly adds expenses, system updates Travel Wallet in real-time
- Quick Access: Emergency Hub, My Documents, AI Assistant

**Deactivation**:
- User clicks End Trip button
- System records trip as completed
- System prompts user to submit reviews
- System switches Dashboard back to Planning Mode

**Three-Phase Lifecycle**:
1. Planning Phase: User plans trip, saves itinerary, books travel, uploads documents
2. Travel Phase: User activates Travel Companion Mode, accesses today's schedule, tracks expenses, uses emergency support
3. Review Phase: User completes trip, submits reviews, views expense analysis, system updates travel persona and recommendation scores

### 4.18 Booking Integration

**Process**:
- System displays available travel options (flights, trains, hotels, activities, local experiences) with estimated costs
- System provides booking recommendations
- User clicks booking button
- System redirects to trusted external platform with prefilled details (destination, dates, travelers)
- User completes booking on external platform
- User returns to Yaatra and updates booking status

### 4.19 Language Support

**Multilingual Content**:
- All UI elements display in user's preferred language
- Destination information available in selected language
- Itinerary details presented in selected language
- Notifications sent in selected language
- AI Assistant responds in selected language
- Reviews displayed in original language with translation option
- User can change language anytime from settings

### 4.20 Trip Lifecycle Management

**Before Travel**:
- User explores destinations on Explore Page
- User views Destination Detail Page
- User saves destinations to Wishlist
- User creates trip plan from Destination Detail Page or Wishlist
- User receives budget estimation
- User accesses travel checklist
- User views booking suggestions
- User uploads travel documents
- User receives trip reminders
- User receives festival alerts

**During Travel**:
- User activates Travel Companion Mode
- User accesses today's schedule
- User views nearby attractions
- User tracks expenses in Live Expense Tracker
- User views attraction information
- User receives navigation assistance
- User accesses travel documents
- User accesses Emergency Hub
- User updates schedule if needed
- User uses AI Assistant for queries
- User participates in local experiences

**After Travel**:
- User clicks End Trip button
- User views trip summary
- User reviews expense analysis
- User accesses travel history
- User submits reviews and ratings for destination, hotels, attractions, overall trip
- System updates travel persona based on trip data and reviews
- System updates recommendation scores
- System sends review reminder notification

## 5. Exceptions and Edge Cases

| Scenario | Handling |
|----------|----------|
| User enters budget lower than minimum trip cost | System displays message indicating minimum budget required for destination |
| User selects dates in the past | System shows error and prompts user to select future dates |
| No destinations match user's budget | System suggests nearby budget ranges or alternative destinations |
| User tries to save itinerary without login | System prompts user to login or register |
| External booking platform unavailable | System displays error message and suggests alternative booking options |
| User enters invalid travel dates (end before start) | System shows validation error |
| User's preferred language not yet supported | System defaults to English and notifies user |
| User forgets to input required field | System highlights missing field and prevents form submission |
| User uploads non-PDF file to My Documents | System shows error and prompts user to upload PDF only |
| User exceeds budget during travel | System sends alert notification and displays warning in Travel Wallet |
| AI Assistant cannot understand query | System asks user to rephrase or provides general travel tips |
| User tries to modify trip without saved itinerary | System prompts user to save trip first |
| Emergency Hub cannot detect user location | System prompts user to manually select destination |
| User tries to access Admin Panel without admin privileges | System denies access and redirects to Dashboard |
| User tries to save destination already in Wishlist | System displays message: Already in Wishlist |
| User tries to submit review without completing trip | System displays message: Trip not yet completed |
| No festivals found for destination and travel dates | System displays: No festivals during your travel dates |
| User selects local experience exceeding budget | System displays warning and suggests budget adjustment |
| External booking link for local experience unavailable | System displays error and suggests contacting support |
| User tries to activate Travel Companion Mode before trip start date | System displays message: Trip has not started yet |
| User tries to update booking status without saved trip | System prompts user to save trip first |
| Global search returns no results | System displays: No results found. Try different keywords |
| User applies multiple category filters with no matching destinations | System displays: No destinations match selected categories. Try fewer filters |
| Recommendation score calculation fails | System falls back to popularity-based ranking |
| User tries to end trip without activating Travel Companion Mode | System prompts user to confirm trip completion |

## 6. Acceptance Criteria

1. User registers account with email and password, system creates user profile
2. User logs in successfully and lands on Dashboard (Planning Mode)
3. User uses global search bar, enters \"Jaipur\", system displays grouped results (Jaipur destination, Amber Fort attraction, Camel Safari experience, Pushkar Fair festival)
4. User navigates to Explore Page, applies category filter (Beach), clicks destination card, system displays Destination Detail Page with overview, categories, best time to visit, budget ranges, top attractions, food recommendations, local experiences, festival information, user reviews, personalized recommendations (You might also like section)
5. User clicks Save Destination button on Destination Detail Page, system adds destination to Wishlist
6. User navigates to Profile Page → Wishlist Section, clicks Plan Trip button for saved destination, system redirects to Trip Planner with destination pre-filled
7. User fills trip planning form (dates: 2026-11-15 to 2026-11-20, travelers: 2, trip type: Couple, travel mode: Regular, preferences: cultural), selects local experience (Camel Safari), submits form, system generates itinerary with festival alert (Pushkar Fair is happening nearby), displays day-by-day schedule including Camel Safari, estimated expenses breakdown
8. User saves itinerary, system stores it in Dashboard
9. User navigates to Trip Detail Page, clicks Book Flight button, completes booking on external platform, returns to Yaatra, updates booking status to Booked, system displays Flight: Booked ✓
10. User clicks Start Trip button on Trip Detail Page, system activates Travel Companion Mode, Dashboard switches to Travel Mode displaying today's schedule, nearby attractions, current weather, Live Expense Tracker, quick access to Emergency Hub/My Documents/AI Assistant
11. User inputs actual expense via Live Expense Tracker (Experiences ₹2,500), system updates Travel Wallet in real-time
12. User clicks End Trip button, system records trip as completed, prompts review submission, switches Dashboard back to Planning Mode
13. User navigates to Profile Page → Travel History, clicks Review Trip button, submits star rating (5 stars) and text review for destination, hotels, attractions, overall trip, system stores reviews and updates recommendation scores
14. User navigates to Destination Detail Page for reviewed destination, views own review displayed with star rating and text, views updated personalized recommendations based on new recommendation score

## 7. Out of Scope for Current Version

- In-app booking and payment processing (users redirected to external platforms)
- Real-time flight/train/hotel price comparison engine
- Social features (sharing trips, following travelers, commenting)
- Travel insurance integration
- Visa application assistance
- Currency conversion calculator
- Weather forecasts integration
- Offline mode for itinerary access
- Mobile app version (iOS/Android)
- Travel community forum
- Loyalty points or rewards program
- Integration with travel agencies for package deals
- Multi-city trip planning in single itinerary
- Group trip collaboration tools
- Travel blog or content creation features
- Advanced AI features (image recognition, voice assistant)
- Real-time location tracking during travel
- Integration with wearable devices
- Augmented reality features for attractions
- Blockchain-based travel verification
- Cryptocurrency payment options
- User-generated content for local experiences
- Live chat support
- Video reviews for destinations
- Travel photography contests
- Gamification features (badges, achievements)
- Integration with social media platforms for trip sharing
- Automatic booking status sync with external platforms
- Predictive analytics for trip planning
- Dynamic pricing recommendations
- Carbon footprint tracking
- Travel insurance claims processing

## 8. Database Tables

**Core Tables**:
- Users
- Trips
- Destinations
- DestinationCategories
- Itineraries
- Expenses
- Bookings (with status field: not_started/pending/booked/cancelled/completed)
- Notifications
- TravelDocuments
- SavedDestinations (Wishlist)
- Reviews
- Ratings
- DestinationReviews
- Hotels
- TransportOptions
- Attractions
- Experiences
- EmergencyContacts
- Languages
- UserPreferences
- TravelHistory
- TravelWallet
- AIConversations
- TripUpdates
- Festivals
- DestinationFestivals
- RecommendationScores
- SearchIndex
- TravelModeStatus

## 9. Design Style

**Design Principles**:
- Minimal design with airiness and whitespace
- Clear font hierarchy
- Restrained decorations
- Gentle contrast
- Fine typefaces
- Clean and production-ready Web application
- Focus on content readability and user experience