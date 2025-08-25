// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import BrandHeader from "./components/BrandHeader";

// ===== Pages you have =====
import Dashboard from "./Dashboard";
import Agent from "./pages/Agent";
import Clients from "./pages/Clients";
import Maps from "./pages/Maps";
import MileagePage from "./pages/MileagePage";
import Summary from "./pages/Summary";
import Admin from "./pages/Admin"; // ✅ now a stable name
import AdminInUp from "./pages/AdminInUpQueue";

export default function App() {
return (
<Router>
<div style={styles.app}>
{/* FlowSure logo + tagline (top-right overlay; doesn’t block clicks) */}
<BrandHeader />

{/* Global nav on all routes */}
<div style={{ height: 8 }} />
<nav style={styles.nav}>
<Nav to="/" end>Dashboard</Nav>
<Nav to="/agent">Agent</Nav>
<Nav to="/clients">Clients</Nav>
<Nav to="/maps">Maps</Nav>
<Nav to="/mileage">Mileage</Nav>
<Nav to="/summary">Summary</Nav>
<Nav to="/admin">Admin</Nav>
<Nav to="/admin-inup">Admin In-&-Up</Nav>
</nav>

{/* Routed pages */}
<main style={styles.main}>
<Routes>
<Route path="/" element={<Dashboard />} />
<Route path="/agent" element={<Agent />} />
<Route path="/clients" element={<Clients />} />
<Route path="/maps" element={<Maps />} />
<Route path="/mileage" element={<MileagePage />} />
<Route path="/summary" element={<Summary />} />
<Route path="/admin" element={<Admin />} />
<Route path="/admin-inup" element={<AdminInUp />} />
<Route path="*" element={<Dashboard />} />
</Routes>
</main>
</div>
</Router>
);
}

/* Reusable NavLink with active styling */
function Nav({ to, end, children }: { to: string; end?: boolean; children: React.ReactNode }) {
return (
<NavLink
to={to}
end={end}
style={({ isActive }) => ({
...styles.link,
borderBottom: isActive ? "2px solid #5ea0ff" : "2px solid transparent",
color: isActive ? "#ffffff" : "rgba(255,255,255,0.85)",
})}
>
{children}
</NavLink>
);
}

const styles: Record<string, React.CSSProperties> = {
app: {
fontFamily: "Arial, sans-serif",
minHeight: "100vh",
display: "flex",
flexDirection: "column",
},
nav: {
position: "sticky",
top: 0,
zIndex: 900,
display: "flex",
gap: 16,
padding: "10px 16px",
background: "linear-gradient(180deg, #0b3e99 0%, #0a2f74 100%)",
borderBottom: "1px solid rgba(255,255,255,0.08)",
},
link: {
textDecoration: "none",
padding: "6px 2px",
fontWeight: 700,
letterSpacing: 0.2,
transition: "color 120ms ease, border-color 120ms ease",
},
main: { flex: 1 },
};