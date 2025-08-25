// src/pages/Maps.tsx
import React from "react";
import {
useLeads,
selectLead,
setStatus,
simulateNavigate,
useMileage,
resetMileage,
logTravelTo,
} from "../leadStore";
import { useNavigate } from "react-router-dom";

export default function MapsPage() {
const leads = useLeads();
const nav = useNavigate();

return (
<div className="text-white">
<h1 className="text-2xl font-bold mb-4">Today’s Leads</h1>

{/* Two-column layout: left map + leads, right mileage */}
<div className="grid md:grid-cols-3 gap-4">
{/* Left: Map + Leads (span 2) */}
<div className="md:col-span-2 space-y-4">
{/* Map placeholder */}
<div className="rounded-xl border border-white/10 bg-white/5 p-4">
<div className="text-white/70 text-sm">Map (demo)</div>
<div className="mt-2 h-48 rounded bg-white/5 flex items-center justify-center">
<span className="text-white/50">Map preview placeholder</span>
</div>
</div>

{/* Lead list */}
<div className="rounded-xl border border-white/10 overflow-hidden">
<table className="w-full text-left text-sm">
<thead className="bg-white/5 text-white/80">
<tr>
<th className="px-3 py-2">Lead</th>
<th className="px-3 py-2">Address</th>
<th className="px-3 py-2">Status</th>
<th className="px-3 py-2">Actions</th>
</tr>
</thead>
<tbody>
{leads.map((l) => (
<tr key={l.id} className="border-t border-white/10">
<td className="px-3 py-2">{l.name}</td>
<td className="px-3 py-2">{l.address}</td>
<td className="px-3 py-2"><StatusPill status={l.status} /></td>
<td className="px-3 py-2">
<div className="flex flex-wrap gap-2">
<button
className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500"
onClick={() => simulateNavigate(l.id)}
>
Open in Maps
</button>
<button
className="px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-500"
onClick={() => setStatus(l.id, "knocked")}
>
Knocked
</button>
<button
className="px-3 py-1 rounded bg-green-600 hover:bg-green-500"
onClick={() => {
// Log travel if they jumped here directly
logTravelTo(l.id);
selectLead(l.id);
setStatus(l.id, "in");
nav("/agent");
}}
>
Got In (Start Intake)
</button>
</div>
</td>
</tr>
))}
{leads.length === 0 && (
<tr>
<td className="px-3 py-4 text-white/60" colSpan={4}>
No leads loaded.
</td>
</tr>
)}
</tbody>
</table>
</div>
</div>

{/* Right: Mileage panel */}
<div className="md:col-span-1">
<MileagePanel />
</div>
</div>
</div>
);
}

function StatusPill({ status }: { status: string }) {
const cls =
status === "new" ? "bg-white/10 text-white/70" :
status === "enroute" ? "bg-blue-500/20 text-blue-300" :
status === "knocked" ? "bg-yellow-500/20 text-yellow-300" :
status === "in" ? "bg-green-500/20 text-green-300" :
"bg-purple-500/20 text-purple-300"; // closed
return <span className={`px-2 py-1 rounded text-xs font-medium ${cls}`}>{status}</span>;
}

function MileagePanel() {
const m = useMileage();

return (
<div className="rounded-xl border border-white/10 bg-white/5 p-4 h-full">
<div className="flex items-center justify-between">
<h2 className="text-lg font-semibold">Mileage Tracker</h2>
<button
onClick={resetMileage}
className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20"
title="Reset demo mileage"
>
Reset
</button>
</div>

<div className="mt-3 rounded-lg bg-white/10 p-3">
<div className="text-white/70 text-sm">Total miles (demo)</div>
<div className="text-3xl font-bold">
{m.totalMiles.toFixed(1)} <span className="text-base font-medium">mi</span>
</div>
</div>

<div className="mt-4 text-white/80 text-sm">Recent trips</div>
<div className="mt-2 space-y-2 max-h-72 overflow-auto pr-1">
{m.trips.length === 0 ? (
<div className="text-white/50 text-sm">No trips yet. Use “Open in Maps” or “Got In”.</div>
) : (
m.trips.map((t) => (
<div key={t.at} className="rounded bg-white/10 p-2">
<div className="flex justify-between">
<div>
<div className="text-white/70 text-xs">
{t.fromId ? `From ${t.fromId}` : "From Start"} → {t.toId}
</div>
<div className="text-xs text-white/50">
{new Date(t.at).toLocaleTimeString()}
</div>
</div>
<div className="font-semibold">{t.distanceMiles.toFixed(2)} mi</div>
</div>
</div>
))
)}
</div>
</div>
);
}