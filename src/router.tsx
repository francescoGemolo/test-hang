import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthGate } from './components/layout/AuthGate';
import { RequireAuth } from './components/layout/RequireAuth';
import { RequireGuestOnly } from './components/layout/RequireGuestOnly';
import { RequireNeedsProfile } from './components/layout/RequireNeedsProfile';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import EventFormPage from './pages/EventFormPage';
import ProfilePage from './pages/ProfilePage';

export function AppRoutes() {
  return (
    <AuthGate>
      <Routes>
        <Route
          path="/"
          element={
            <RequireGuestOnly>
              <HomePage />
            </RequireGuestOnly>
          }
        />
        <Route
          path="/login"
          element={
            <RequireGuestOnly>
              <LoginPage />
            </RequireGuestOnly>
          }
        />
        <Route
          path="/register"
          element={
            <RequireNeedsProfile>
              <RegisterPage />
            </RequireNeedsProfile>
          }
        />
        <Route path="/events" element={<EventsPage />} />
        <Route
          path="/events/new"
          element={
            <RequireAuth>
              <EventFormPage />
            </RequireAuth>
          }
        />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route
          path="/events/:id/edit"
          element={
            <RequireAuth>
              <EventFormPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/events" replace />} />
      </Routes>
    </AuthGate>
  );
}