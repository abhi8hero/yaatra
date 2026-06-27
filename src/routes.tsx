import type { ReactNode } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ExplorePage from './pages/ExplorePage';
import SearchResultsPage from './pages/SearchResultsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import TripPlannerPage from './pages/TripPlannerPage';
import DashboardPage from './pages/DashboardPage';
import TripDetailPage from './pages/TripDetailPage';
import MyTripsPage from './pages/MyTripsPage';
import TravelWalletPage from './pages/TravelWalletPage';
import MyDocumentsPage from './pages/MyDocumentsPage';
import EmergencyHubPage from './pages/EmergencyHubPage';
import TransportHubPage from './pages/TransportHubPage';
import AIAssistantPage from './pages/AIAssistantPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanelPage from './pages/admin/AdminPanelPage';
import VerifyEmailPage from './pages/VerifyEmailPage';



export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  /** Accessible without login. Routes without this flag require authentication. Has no effect when RouteGuard is not in use. */
  public?: boolean;
}

export const routes: RouteConfig[] = [
  { name: 'Home', path: '/', element: <HomePage />, public: true },
  { name: 'Login', path: '/login', element: <LoginPage />, public: true },
  { name: 'Register', path: '/register', element: <RegisterPage />, public: true },
  { name: 'Reset Password', path: '/reset-password', element: <ResetPasswordPage />, public: true },
  { name: 'Explore', path: '/explore', element: <ExplorePage />, public: true },
  { name: 'Search', path: '/search', element: <SearchResultsPage />, public: true },
  { name: 'Destination', path: '/destination/:slug', element: <DestinationDetailPage />, public: true },
  { name: 'Trip Planner', path: '/planner', element: <TripPlannerPage /> },
  { name: 'Dashboard', path: '/dashboard', element: <DashboardPage /> },
  { name: 'My Trips', path: '/trips', element: <MyTripsPage /> },
  { name: 'Trip Detail', path: '/trips/:id', element: <TripDetailPage /> },
  { name: 'Travel Wallet', path: '/wallet', element: <TravelWalletPage /> },
  { name: 'My Documents', path: '/documents', element: <MyDocumentsPage /> },
  { name: 'Emergency Hub', path: '/emergency', element: <EmergencyHubPage /> },
  { name: 'Transport Hub', path: '/transport', element: <TransportHubPage /> },
  { name: 'AI Assistant', path: '/ai-assistant', element: <AIAssistantPage /> },
  { name: 'Profile', path: '/profile', element: <ProfilePage /> },
  { name: 'Admin', path: '/admin', element: <AdminPanelPage /> },
  { name: 'Verify Email', path: '/verify-email', element: <VerifyEmailPage />, public: true, },
];
