import React, { useMemo, useState } from "react";

/** FlowSure – Full demo mock (single-file, Vite + TS + Tailwind) */

type Lead = {
id: string;
name: string;
stage: "New" | "Sit-down" | "Closed";
phone: string;
city: string;
source: string;
premium?: number;
ratePct?: number;
lat: number;
lon: number;
};

type Agent = {
id: string;
name: string;
email: string;
doors: number;
sits: number;
closes: number;
premium: number;
commissionPct?: number;
};

/* ---------- small helpers ---------- */
const usd = (n: number) =>
n.toLocaleString(undefined, { style: "currency", currency: "USD" });

function ProgressBar({
value,
max,
className = "",
}: {
value: number;
max: number;
className?: string;
}) {
const pct = Math.max(0, Math.min(100, Math.round((max > 0 ? value / max : 0) * 100)));
return (
<div className={`w-full h-2 bg-slate-200 rounded-full overflow-hidden ${className}`}>
<div className="h-2 bg-blue-600" style={{ width: `${pct}%` }} />
</div>
);
}

/* distance + quick route (nearest neighbor) */
const toRad = (v: number) => (v * Math.PI) / 180;
function miles(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
const R = 3958.7613;
const dLat = toRad(b.lat - a.lat);
const dLon = toRad(b.lon - a.lon);
const lat1 = toRad(a.lat),
lat2 = toRad(b.lat);
const h =
Math.sin(dLat / 2) ** 2 +
Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
return 2 * R * Math.asin(Math.sqrt(h));
}
function routeFrom(
start: { lat: number; lon: number },
points: { id: string; name: string; lat: number; lon: number }[]
) {
const left = [...points];
const seq: typeof left = [];
let cur = { id: "start", name: "Start", ...start };
let total = 0;
while (left.length) {
let bi = 0,
bd = Infinity;
for (let i = 0; i < left.length; i++) {
const d = miles(cur, left[i]);
if (d < bd) {
bd = d;
bi = i;
}
}
total += bd === Infinity ? 0 : bd;
cur = left.splice(bi, 1)[0];
seq.push(cur);
}
return { seq, total };
}

/* ---------- demo data ---------- */
const seedLeads: Lead[] = [
{
id: "l1",
name: "John Smith",
stage: "Sit-down",
phone: "(919) 555-1234",
city: "Durham, NC",
source: "EverQuote",
premium: 4200,
lat: 35.994,
lon: -78.898,
},
{
id: "l2",
name: "Jane Doe",
stage: "New",
phone: "(984) 555-8899",
city: "Raleigh, NC",
source: "Referral",
lat: 35.779,
lon: -78.638,
},
{
id: "l3",
name: "Mike T.",
stage: "Closed",
phone: "(984) 222-1111",
city: "Chapel Hill, NC",
source: "Door Knock",
premium: 6000,
ratePct: 25,
lat: 35.913,
lon: -79.056,
},
{
id: "l4",
name: "Ava R.",
stage: "Closed",
phone: "(919) 111-2222",
city: "Cary, NC",
source: "SmartFinancial",
premium: 4800,
lat: 35.791,
lon: -78.781,
},
{
id: "l5",
name: "Ben C.",
stage: "Sit-down",
phone: "(980) 333-4444",
city: "Apex, NC",
source: "QuoteWizard",
premium: 3600,
lat: 35.732,
lon: -78.851,
},
];

const seedAgents: Agent[] = [
{
id: "a1",
name: "Daniel I.",
email: "daniel@flowsure.app",
doors: 62,
sits: 18,
closes: 6,
premium: 23800,
},
{
id: "a2",
name: "Lisa M.",
email: "lisa@flowsure.app",
doors: 51,
sits: 14,
closes: 4,
premium: 16800,
},
{
id: "a3",
name: "Mark R.",
email: "mark@flowsure.app",
doors: 44,
sits: 12,
closes: 3,
premium: 12600,
},
];

/* ---------- main app ---------- */
export default function App() {
const [tab, setTab] = useState<
"dashboard" | "leads" | "hot" | "commissions" | "admin" | "work"
>("dashboard");
const [leads] = useState<Lead[]>(seedLeads);
const [agents] = useState<Agent[]>(seedAgents);
const [defaultRate, setDefaultRate] = useState<number>(30);

/* Work Mode state */
const [todayDoors, setTodayDoors] = useState(0);
const [todaySits, setTodaySits] = useState(0);
const [todayCloses, setTodayCloses] = useState(0);
const [onDuty, setOnDuty] = useState(false);
const weeklyGoal = { doors: 50, sits: 15, closes: 10 };

const closedLeads = leads.filter((l) => l.stage === "Closed");
const totalClosedPremium = closedLeads.reduce((s, l) => s + (l.premium || 0), 0);
const totalExpected = closedLeads.reduce(
(s, l) => s + Math.round(((l.premium || 0) * ((l.ratePct ?? defaultRate) / 100))),
0
);

const adminTotals = useMemo(() => {
return agents.reduce(
(acc, a) => {
const pct = a.commissionPct ?? defaultRate;
acc.doors += a.doors;
acc.sits += a.sits;
acc.closes += a.closes;
acc.premium += a.premium;
acc.commission += Math.round(a.premium * (pct / 100));
return acc;
},
{ doors: 0, sits: 0, closes: 0, premium: 0, commission: 0 }
);
}, [agents, defaultRate]);

return (
<div className="min-h-screen bg-slate-50 py-8 px-4 flex justify-center">
<div className="w-full max-w-5xl">
{/* Header */}
<div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-2xl p-5 shadow mb-4">
<div className="flex items-center justify-between">
<div>
<div className="text-xl font-semibold">FlowSure</div>
<div className="text-white/70 text-sm">From lead to policy — all in one flow</div>
</div>
<div className="text-sm flex items-center gap-3">
<label className="opacity-80">Default commission %</label>
<input
className="w-16 px-2 py-1 rounded bg-white/20 border border-white/30"
type="number"
min={0}
max={100}
value={defaultRate}
onChange={(e) => setDefaultRate(Number(e.target.value || 0))}
/>
</div>
</div>
</div>

{/* Tabs */}
<div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-4">
{[
["dashboard", "Dashboard"],
["leads", "Leads + Map"],
["hot", "Hot Zones"],
["commissions", "Commissions"],
["admin", "Admin"],
["work", "Work Mode"],
].map(([k, label]) => (
<button
key={k}
className={`px-3 py-2 rounded-xl border text-sm ${
tab === k
? "bg-slate-900 text-white border-slate-900"
: "bg-white border-slate-200 hover:bg-slate-50"
}`}
onClick={() => setTab(k as any)}
>
{label}
</button>
))}
</div>

{/* Body */}
<div className="bg-white rounded-2xl border border-slate-200 shadow p-4">
{/* Dashboard */}
{tab === "dashboard" && (
<div className="space-y-4">
<div className="grid sm:grid-cols-4 gap-3">
<Stat title="Closed Policies" value={String(closedLeads.length)} />
<Stat title="Closed Premium" value={usd(totalClosedPremium)} />
<Stat title="Expected Commission" value={usd(totalExpected)} />
<Stat
title="Active Leads"
value={String(leads.filter((l) => l.stage !== "Closed").length)}
/>
</div>

<div className="grid sm:grid-cols-2 gap-4">
<div className="p-4 rounded-xl border">
<div className="text-sm font-semibold mb-2">Weekly Progress</div>
<Row label="Doors" value={todayDoors} goal={weeklyGoal.doors} />
<Row label="Sit-downs" value={todaySits} goal={weeklyGoal.sits} />
<Row label="Policies" value={todayCloses} goal={weeklyGoal.closes} />
</div>

<div className="p-4 rounded-xl border">
<div className="text-sm font-semibold mb-2">Expected Commission (Closed)</div>
<div className="grid grid-cols-3 text-xs font-medium text-slate-500 gap-2">
<div>Client</div>
<div className="text-right">Premium</div>
<div className="text-right">Expected</div>
</div>
<div className="divide-y">
{closedLeads.map((l) => (
<div key={l.id} className="py-2 grid grid-cols-3 gap-2 text-sm">
<div>{l.name}</div>
<div className="text-right">{usd(l.premium || 0)}</div>
<div className="text-right">
{usd(
Math.round(
((l.premium || 0) * ((l.ratePct ?? defaultRate) / 100))
)
)}
{l.ratePct ? ` (${l.ratePct}%)` : ""}
</div>
</div>
))}
</div>
<div className="mt-2 text-sm font-semibold flex justify-between">
<span>Total</span>
<span>
{usd(totalClosedPremium)} • {usd(totalExpected)}
</span>
</div>
</div>
</div>
</div>
)}

{/* Leads + Map */}
{tab === "leads" && (
<div className="space-y-4">
<div className="p-4 rounded-xl border">
<div className="text-sm font-semibold mb-2">Pipeline</div>
<div className="divide-y">
{leads.map((l) => (
<div
key={l.id}
className="py-2 flex items-center justify-between text-sm"
>
<div>
<div className="font-medium">{l.name}</div>
<div className="text-xs text-slate-500">
{l.city} • {l.phone} • {l.source}
</div>
</div>
<div className="text-right">
<span
className={`text-xs px-2 py-1 rounded-lg inline-block ${
l.stage === "Closed"
? "bg-green-100 text-green-700"
: l.stage === "Sit-down"
? "bg-amber-100 text-amber-700"
: "bg-slate-100 text-slate-700"
}`}
>
{l.stage}
</span>
{l.premium && (
<div className="text-[11px] text-slate-500">Prem {usd(l.premium)}</div>
)}
</div>
</div>
))}
</div>
</div>

<RouteCard leads={leads} />
</div>
)}

{/* Hot Zones */}
{tab === "hot" && (
<div className="space-y-4">
<div className="p-4 rounded-xl border">
<div className="flex items-center gap-2 mb-2">
<div
className="text-lg font-semibold bg-clip-text text-transparent"
style={{ backgroundImage: "linear-gradient(135deg,#06b6d4,#22c55e)" }}
>
Hot Zones
</div>
<span className="text-xs px-2 py-1 rounded-full border text-slate-700">
Signature Feature
</span>
</div>
<div className="grid grid-cols-2 gap-3 mb-3">
<MiniStat label="Closed Policies" value={String(closedLeads.length)} />
<MiniStat
label="Active Leads"
value={String(leads.filter((l) => l.stage !== "Closed").length)}
/>
</div>

{/* heatmap-style backdrop (demo) */}
<div
className="h-64 rounded-xl relative overflow-hidden border"
style={{
background:
"radial-gradient(120px 120px at 30% 35%, rgba(6,182,212,.25), transparent), radial-gradient(140px 140px at 70% 60%, rgba(34,197,94,.25), transparent), radial-gradient(160px 160px at 50% 55%, rgba(15,23,42,.55), transparent), linear-gradient(180deg,#EEF2FF,#F8FAFC)",
}}
>
<div className="absolute inset-x-3 top-3 flex items-center gap-2 text-xs">
<span className="px-2 py-1 rounded-full border bg-white/80">Heatmap (demo)</span>
<span className="px-2 py-1 rounded-full border bg-white/80">Lead Density</span>
<span className="px-2 py-1 rounded-full border bg-white/80">Conversion Zones</span>
</div>
<div className="absolute left-3 bottom-3 bg-white/85 rounded-xl border p-2 text-[11px] text-slate-700">
<div className="font-medium mb-1">Legend</div>
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-slate-900" /> High conversion
</div>
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-cyan-500" /> Lead density
</div>
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-green-500" /> Closed clusters
</div>
</div>
</div>
</div>

<div className="grid grid-cols-2 gap-2">
<button className="py-3 rounded-xl text-white font-medium bg-green-600">
Export Map
</button>
<button className="py-3 rounded-xl text-white font-medium bg-cyan-600">
Suggest Next Area
</button>
</div>
</div>
)}

{/* Commissions */}
{tab === "commissions" && (
<div className="space-y-3">
<div className="p-4 rounded-xl border">
<div className="text-sm font-semibold mb-2">Commission Sold (Expected)</div>
<div className="grid grid-cols-5 gap-2 text-xs font-medium text-slate-500">
<div>Client</div>
<div>Source</div>
<div className="text-right">Premium</div>
<div className="text-right">Rate</div>
<div className="text-right">Expected</div>
</div>
<div className="divide-y">
{closedLeads.map((l) => (
<div key={l.id} className="py-2 grid grid-cols-5 gap-2 text-sm">
<div>{l.name}</div>
<div className="text-xs text-slate-500">{l.source}</div>
<div className="text-right">{usd(l.premium || 0)}</div>
<div className="text-right">{(l.ratePct ?? defaultRate)}%</div>
<div className="text-right font-medium">
{usd(Math.round(((l.premium || 0) * ((l.ratePct ?? defaultRate) / 100))))}
</div>
</div>
))}
</div>
<div className="mt-3 flex items-center justify-between text-sm font-semibold">
<div>Totals</div>
<div>
{usd(totalClosedPremium)} • {usd(totalExpected)}
</div>
</div>
</div>
</div>
)}

{/* Admin */}
{tab === "admin" && (
<div className="space-y-4">
<div className="p-4 rounded-xl border">
<div className="text-sm font-semibold mb-2">Admin Dashboard</div>
<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
<MiniStat label="Total Doors" value={String(adminTotals.doors)} />
<MiniStat label="Total Sit-downs" value={String(adminTotals.sits)} />
<MiniStat label="Policies Sold" value={String(adminTotals.closes)} />
<MiniStat label="Premium (Total)" value={usd(adminTotals.premium)} />
</div>
</div>

<div className="p-4 rounded-xl border">
<div className="grid grid-cols-6 gap-2 text-[11px] font-medium text-slate-500">
<div>Agent</div>
<div className="text-right">Doors</div>
<div className="text-right">Sits</div>
<div className="text-right">Policies</div>
<div className="text-right">Premium</div>
<div className="text-right">Commission*</div>
</div>
<div className="divide-y">
{agents.map((a) => {
const pct = a.commissionPct ?? defaultRate;
const comm = Math.round(a.premium * (pct / 100));
return (
<div
key={a.id}
className="py-2 grid grid-cols-6 gap-2 text-sm items-center"
>
<div>
<div className="font-medium">{a.name}</div>
<div className="text-[11px] text-slate-500">{a.email}</div>
</div>
<div className="text-right">{a.doors}</div>
<div className="text-right">{a.sits}</div>
<div className="text-right">{a.closes}</div>
<div className="text-right">{usd(a.premium)}</div>
<div className="text-right">
{usd(comm)} ({pct}%)
</div>
</div>
);
})}
</div>
<div className="mt-2 text-[11px] text-slate-500">
* Commission uses default rate {defaultRate}% unless overridden per agent.
</div>
</div>

<div className="p-4 rounded-xl border">
<div className="text-sm font-semibold mb-2">Privacy Guard (Demo Setting)</div>
<div className="text-sm text-slate-600">
Location tracking is captured only during on-duty hours or when an agent taps{" "}
<span className="font-medium">Start Work</span>. Off-hours data is not logged.
</div>
<div className="mt-2 grid grid-cols-2 gap-2 text-sm">
<button className="px-3 py-2 rounded-xl border">Work Window: 9am–6pm</button>
<button className="px-3 py-2 rounded-xl border">Stop Tracking After Shift</button>
</div>
</div>
</div>
)}

{/* Work Mode */}
{tab === "work" && (
<div className="space-y-4">
<div className="p-4 rounded-xl border">
<div className="flex items-center justify-between">
<div className="text-lg font-semibold">Work Mode</div>
<button
className={`px-3 py-1 rounded-xl text-white ${
onDuty ? "bg-red-600" : "bg-green-600"
}`}
onClick={() => setOnDuty((v) => !v)}
>
{onDuty ? "Stop Work" : "Start Work"}
</button>
</div>
<p className="text-sm text-slate-600 mt-1">
Stay focused with goals: doors knocked, sit-downs, and closed deals.
</p>

<div className="grid sm:grid-cols-3 gap-3 mt-4">
<div className="p-3 rounded-xl border">
<div className="text-xs text-slate-500">Doors knocked</div>
<div className="flex items-center gap-2 mt-1">
<input
type="number"
className="w-24 border rounded-lg px-2 py-1"
value={todayDoors}
min={0}
onChange={(e) => setTodayDoors(Number(e.target.value || 0))}
/>
<button
className="px-2 py-1 rounded-lg border"
onClick={() => setTodayDoors((n) => n + 1)}
>
+1
</button>
</div>
<ProgressBar value={todayDoors} max={weeklyGoal.doors} className="mt-2" />
</div>

<div className="p-3 rounded-xl border">
<div className="text-xs text-slate-500">Sit-downs</div>
<div className="flex items-center gap-2 mt-1">
<input
type="number"
className="w-24 border rounded-lg px-2 py-1"
value={todaySits}
min={0}
onChange={(e) => setTodaySits(Number(e.target.value || 0))}
/>
<button
className="px-2 py-1 rounded-lg border"
onClick={() => setTodaySits((n) => n + 1)}
>
+1
</button>
</div>
<ProgressBar value={todaySits} max={weeklyGoal.sits} className="mt-2" />
</div>

<div className="p-3 rounded-xl border">
<div className="text-xs text-slate-500">Policies closed</div>
<div className="flex items-center gap-2 mt-1">
<input
type="number"
className="w-24 border rounded-lg px-2 py-1"
value={todayCloses}
min={0}
onChange={(e) => setTodayCloses(Number(e.target.value || 0))}
/>
<button
className="px-2 py-1 rounded-lg border"
onClick={() => setTodayCloses((n) => n + 1)}
>
+1
</button>
</div>
<ProgressBar value={todayCloses} max={weeklyGoal.closes} className="mt-2" />
</div>
</div>

<div className="mt-4 text-sm">
<span className="font-semibold">Status:</span>{" "}
{onDuty ? (
<span className="text-green-700">On duty — tracking enabled</span>
) : (
<span className="text-slate-500">Off duty — tracking paused</span>
)}
</div>
</div>
</div>
)}
</div>
</div>
</div>
);
}

/* ---------- small presentational blocks ---------- */
function Stat({ title, value }: { title: string; value: string }) {
return (
<div className="bg-white rounded-xl border p-4 shadow-sm">
<div className="text-xs text-slate-500">{title}</div>
<div className="text-lg font-semibold">{value}</div>
</div>
);
}
function MiniStat({ label, value }: { label: string; value: string }) {
return (
<div className="bg-gradient-to-br from-white to-slate-50 border rounded-xl p-3">
<div className="text-xs text-slate-500">{label}</div>
<div className="text-lg font-semibold">{value}</div>
</div>
);
}
function Row({ label, value, goal }: { label: string; value: number; goal: number }) {
return (
<div className="mb-2">
<div className="flex items-center justify-between text-sm">
<span>{label}</span>
<span>
{value} / {goal}
</span>
</div>
<ProgressBar value={value} max={goal} />
</div>
);
}

/* ---------- map/route card ---------- */
function RouteCard({ leads }: { leads: Lead[] }) {
const start = { lat: 35.994, lon: -78.898 }; // Durham
const visitables = leads.filter((l) => l.stage !== "Closed");
const points = visitables.map((l) => ({ id: l.id, name: l.name, lat: l.lat, lon: l.lon }));
const { seq, total } = routeFrom(start, points);

const lats = [start.lat, ...seq.map((p) => p.lat)];
const lons = [start.lon, ...seq.map((p) => p.lon)];
const minLat = Math.min(...lats),
maxLat = Math.max(...lats);
const minLon = Math.min(...lons),
maxLon = Math.max(...lons);
const pad = 16,
W = 560,
H = 260;
const xy = (p: { lat: number; lon: number }) => {
const x = pad + ((p.lon - minLon) / (maxLon - minLon || 1)) * (W - pad * 2);
const y = pad + ((maxLat - p.lat) / (maxLat - minLat || 1)) * (H - pad * 2);
return { x, y };
};
const startXY = xy(start);
const seqXY = seq.map(xy);

return (
<div className="p-4 rounded-xl border">
<div className="text-sm font-semibold mb-2 flex items-center justify-between">
<span>Map & Route Planner</span>
<span className="text-xs text-slate-500">Auto-optimized (demo)</span>
</div>

<svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-slate-100 rounded-xl border">
{seqXY.length > 0 && (
<polyline
fill="none"
stroke="#1e293b"
strokeWidth={2}
points={[startXY, ...seqXY].map((p) => `${p.x},${p.y}`).join(" ")}
/>
)}
<circle cx={startXY.x} cy={startXY.y} r={5} fill="#06b6d4" />
<text x={startXY.x + 8} y={startXY.y - 8} fontSize="10" fill="#0f172a">
Start
</text>
{seqXY.map((p, i) => (
<g key={i}>
<circle cx={p.x} cy={p.y} r={5} fill="#22c55e" />
<text x={p.x + 8} y={p.y - 8} fontSize="10" fill="#0f172a">
{i + 1}. {seq[i].name}
</text>
</g>
))}
</svg>

<div className="mt-2 text-sm flex items-center justify-between">
<div>Stops: {seq.length}</div>
<div className="font-medium">Est. route: {total.toFixed(1)} mi</div>
</div>
<div className="mt-2 text-xs text-slate-500">
Demo uses nearest-neighbor heuristic. For production, use Google Directions API or Mapbox
Optimization API for traffic-aware routing and turn-by-turn.
</div>
</div>
);
}