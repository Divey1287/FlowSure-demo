// src/App.tsx
import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";

// PAGES (make sure these files exist at these paths)
import AuthScreen from "./AuthScreen"; // lives directly in src/
import AgentPage from "./pages/Agent";
import ClientsPage from "./pages/Clients";
import SummaryPage from "./pages/Summary";
import MileagePage from "./pages/MileagePage"; // <— your small placeholder file
import MapsPage from "./pages/Maps";
import AdminNetReports from "./pages/AdminNetReports";

// small helper for active link styling
const linkBase = "px-3 py-1.5 rounded-md text-sm transition-colors";
const active = "bg-white/10 text-white";
const inactive = "text-white/70 hover:text-white hover:bg-white/5";

export default function App() {
return (
<>
{/* Top Nav */}
<div className="p-3 bg-[#0d1628] text-white border-b border-white/10">
<div className="max-w-6xl mx-auto flex items-center gap-2">
<div className="font-extrabold mr-2">FlowSure</div>
<NavLink to="/auth" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Login</NavLink>
<NavLink to="/agent" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Agent</NavLink>
<NavLink to="/clients" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Clients</NavLink>
<NavLink to="/summary" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Summary</NavLink>
<NavLink to="/miles" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Miles</NavLink>
<NavLink to="/maps" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Maps</NavLink>
<NavLink to="/admin/net" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Admin</NavLink>
</div>
</div>

{/* Page content */}
<main className="p-4">
<div className="max-w-6xl mx-auto">
<Routes>
{/* Default route (change to <AgentPage/> if you prefer) */}
<Route path="/" element={<AuthScreen />} />

<Route path="/auth" element={<AuthScreen />} />
<Route path="/agent" element={<AgentPage />} />
<Route path="/clients" element={<ClientsPage />} />
<Route path="/summary" element={<SummaryPage />} />
<Route path="/miles" element={<MileagePage />} />
<Route path="/maps" element={<MapsPage />} />
<Route path="/admin/net" element={<AdminNetReports />} />

{/* 404 */}
<Route
path="*"
element={
<div className="text-white">
<div className="text-2xl font-bold mb-2">Page not found</div>
<p>Use the nav above to pick a section.</p>
</div>
}
/>
</Routes>
</div>
</main>
</>
);
}