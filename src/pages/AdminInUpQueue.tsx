// src/pages/AdminInUpQueue.tsx
import React from "react";
import { listInUps, updateStatus } from "../inupStore";

// little colored pill that matches agent side semantics
function HealthBadge({
label,
value,
}: {
label: string;
value: boolean | undefined;
}) {
// green if YES/true, red if NO/false, gray if not answered
const colors = value === true
? "bg-green-600/15 text-green-300 border-green-500/30"
: value === false
? "bg-red-600/15 text-red-300 border-red-500/30"
: "bg-slate-600/15 text-slate-300 border-slate-500/30";

return (
<span
className={`inline-block px-2 py-0.5 rounded-md text-xs border ${colors}`}
title={`${label}: ${value === true ? "Yes" : value === false ? "No" : "N/A"}`}
>
{label}
</span>
);
}

function RowActions({
id,
status,
onChange,
}: {
id: string;
status: string;
onChange: () => void;
}) {
const btn =
"px-3 py-1 rounded-md text-sm border border-white/15 transition-colors";
const blue = "bg-blue-600 hover:bg-blue-500 text-white";
const gray = "bg-white/5 text-white/80 hover:bg-white/10";
const warn = "bg-amber-600/20 text-amber-300 hover:bg-amber-600/30";
const danger = "bg-red-600/20 text-red-300 hover:bg-red-600/30";

return (
<div className="flex gap-2">
<button
disabled={status !== "pending"}
className={`${btn} ${status === "pending" ? blue : gray}`}
onClick={() => {
updateStatus(id, "accepted");
onChange();
}}
>
Accept
</button>

<button
disabled={status !== "accepted"}
className={`${btn} ${status === "accepted" ? warn : gray}`}
onClick={() => {
updateStatus(id, "completed");
onChange();
}}
>
Complete 🥂
</button>

<button
disabled={status === "noapp"}
className={`${btn} ${status === "noapp" ? gray : danger}`}
onClick={() => {
updateStatus(id, "noapp");
onChange();
}}
>
No App
</button>
</div>
);
}

export default function AdminInUpQueue() {
// re-render after any action
const [, force] = React.useReducer((x) => x + 1, 0);
const rows = listInUps();

return (
<div className="text-white">
<h1 className="text-2xl font-bold mb-4">Admin • In-&-Up Queue</h1>

<div className="overflow-x-auto rounded-lg border border-white/10">
<table className="min-w-full text-sm">
<thead className="bg-white/5 text-white/70">
<tr>
<th className="px-3 py-2 text-left">#</th>
<th className="px-3 py-2 text-left">Lead</th>
<th className="px-3 py-2 text-left">Address</th>
<th className="px-3 py-2 text-left">Meds</th>
<th className="px-3 py-2 text-left">Notes</th>
<th className="px-3 py-2 text-left">Health</th>
<th className="px-3 py-2 text-left">Payment</th>
<th className="px-3 py-2 text-left">Confirm</th>
<th className="px-3 py-2 text-left">Status</th>
<th className="px-3 py-2 text-left">Actions</th>
</tr>
</thead>

<tbody>
{rows.map((r) => (
<tr key={r.id} className="border-t border-white/10">
<td className="px-3 py-2 font-mono text-xs text-white/70">
{r.id}
</td>
<td className="px-3 py-2">{r.clientName ?? "—"}</td>
<td className="px-3 py-2">{r.address ?? "—"}</td>
<td className="px-3 py-2">
{r.meds?.length ? r.meds.join(", ") : "—"}
</td>
<td className="px-3 py-2">{r.notes || "—"}</td>

{/* Color-coded health badges */}
<td className="px-3 py-2">
<div className="flex flex-wrap gap-1">
<HealthBadge label="diabetes" value={r.health?.diabetes} />
<HealthBadge label="copd" value={r.health?.copd} />
<HealthBadge label="heartAttack" value={r.health?.heartAttack} />
<HealthBadge label="chf" value={r.health?.chf} />
<HealthBadge label="stroke" value={r.health?.stroke} />
<HealthBadge label="cancer" value={r.health?.cancer} />
</div>
</td>

<td className="px-3 py-2">
{r.payment === "bank"
? "Bank account"
: r.payment === "dec"
? "Direct Express (DEC)"
: "—"}
</td>

<td className="px-3 py-2">
{r.confirm === "in" ? "In with client" : r.confirm === "na" ? "N/A" : "—"}
</td>

<td className="px-3 py-2 capitalize">{r.status}</td>

<td className="px-3 py-2">
<RowActions id={r.id} status={r.status} onChange={force} />
</td>
</tr>
))}

{rows.length === 0 && (
<tr>
<td colSpan={10} className="px-3 py-6 text-center text-white/60">
No requests yet. When the agent taps <em>Send In-&-Up</em>, they’ll appear here.
</td>
</tr>
)}
</tbody>
</table>
</div>
</div>
);
}