import { NavLink, Outlet } from "react-router-dom";

function navClass({ isActive }: { isActive: boolean }) {
return [
"px-3 py-1.5 rounded-md font-semibold",
isActive ? "bg-blue-600 text-white" : "text-gray-200 hover:text-white hover:bg-white/10",
].join(" ");
}

export default function Dashboard() {
return (
<div className="min-h-screen bg-[#0b1220] text-white">
{/* Top bar */}
<header className="w-full border-b border-white/10">
<div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-6">
<div className="text-lg font-bold">FlowSure Demo</div>
{/* GLOBAL NAV (only keep Maps, Miles, Summary, Agent) */}
<nav className="flex items-center gap-2">
<NavLink to="/maps" className={navClass}>Maps</NavLink>
<NavLink to="/miles" className={navClass}>Miles</NavLink>
<NavLink to="/summary" className={navClass}>Summary</NavLink>
<NavLink to="/agent" className={navClass}>Agent</NavLink>
</nav>
</div>
</header>

{/* Page content */}
<main className="max-w-6xl mx-auto px-4 py-6">
{/* Where the current route (Maps/Miles/Summary/Agent) renders */}
<Outlet />
</main>
</div>
);
}