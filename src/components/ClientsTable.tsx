import React from "react";
import { ClientPolicy } from "../types";

export default function ClientsTable({ rows }:{ rows: ClientPolicy[] }) {
const dot = (s:"Red"|"Yellow"|"Green") =>
s==="Red" ? "bg-red-500" : s==="Yellow" ? "bg-amber-400" : "bg-green-500";

return (
<div className="bg-[#0d1628] border border-white/10 rounded-xl overflow-hidden">
<div className="p-3 text-white/80 text-sm flex items-center gap-4">
<span>Pipeline Tracker:</span>
<span className="w-4 h-4 rounded-full bg-red-500" />
<span className="w-4 h-4 rounded-full bg-amber-400" />
<span className="w-4 h-4 rounded-full bg-green-500" />
</div>
<table className="w-full text-sm">
<thead className="text-white/60">
<tr>
<th className="text-left p-3">Client</th>
<th className="text-left p-3">Policy #</th>
<th className="text-left p-3">Premium</th>
<th className="text-left p-3">Start Date</th>
<th className="text-left p-3">Status</th>
</tr>
</thead>
<tbody>
{rows.map((r)=>(
<tr key={r.policyNumber} className="border-t border-white/10 hover:bg-white/5">
<td className="p-3 text-white">{r.client}</td>
<td className="p-3 text-white">{r.policyNumber}</td>
<td className="p-3 text-white">{r.premium}</td>
<td className="p-3 text-white">{r.startDate}</td>
<td className="p-3 text-white flex items-center gap-2">
<span className={`w-3 h-3 rounded-full ${dot(r.status)}`} /> {r.status}
</td>
</tr>
))}
</tbody>
</table>
</div>
);
}