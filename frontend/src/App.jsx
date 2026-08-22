import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import BeatGenerator from "./pages/BeatGenerator";
import Dashboard from "./pages/Dashboard";
import Ledger from "./pages/Ledger";
import SettingsModal from "./components/SettingsModal";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("jwt_token", tokenFromUrl);
      // Remove token from URL without reloading the page
      window.history.replaceState({}, document.title, location.pathname);
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      const storedToken = localStorage.getItem("jwt_token");
      if (storedToken) {
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        setIsLoading(false); // done loading — not authenticated
      }
    }
  }, [location.search]);

  if (isLoading) {
    return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", fontFamily:"sans-serif", color:"#64748b" }}>Loading…</div>;
  }

  if (!isAuthenticated) {
    // Not authenticated — send back to Expo login portal
    window.location.href = "http://localhost:8081/";
    return null;
  }

  return (
    <Routes>
      {/* Settings page — for new distributor signup onboarding */}
      <Route
        path="/settings"
        element={<SettingsPage />}
      />

      {/* Main app shell */}
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/beat" replace />} />
        <Route path="/beat" element={<BeatGenerator />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ledger" element={<Ledger />} />
      </Route>
    </Routes>
  );
}

// Minimal settings page that immediately opens the SettingsModal
// so new distributors can configure their business on first login.
function SettingsPage() {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    // After closing settings, go to dashboard
    window.location.href = "/dashboard";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {open && <SettingsModal onClose={handleClose} />}
    </div>
  );
}
