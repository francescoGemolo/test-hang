import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventsProvider } from './context/EventsContext';
import { AppRoutes } from './router';

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <EventsProvider>
          <AppRoutes />
        </EventsProvider>
      </AuthProvider>
    </HashRouter>
  );
}