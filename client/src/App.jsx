import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import StudentDashboard from "./pages/StudentDashboard";
import MyRegistrationsPage from "./pages/MyRegistrationsPage";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import ManageEvents from "./pages/ManageEvents";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />

          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-registrations"
            element={
              <ProtectedRoute>
                <MyRegistrationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/organizer-dashboard"
            element={
              <RoleRoute allowedRoles={["organizer"]}>
                <OrganizerDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <RoleRoute allowedRoles={["organizer"]}>
                <CreateEvent />
              </RoleRoute>
            }
          />
          <Route
            path="/manage-events"
            element={
              <RoleRoute allowedRoles={["organizer"]}>
                <ManageEvents />
              </RoleRoute>
            }
          />

          <Route path="/dashboard" element={<Navigate to="/student-dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
