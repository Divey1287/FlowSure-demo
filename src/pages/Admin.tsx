import React, {useMemo, useState} from "react";
import type { NetRow } from "../types";
import { SAMPLE_NET_ROWS } from "../mockData";

const SAMPLE_FILES = [
{ name:"AIG_Aug-2025.xlsx", type:"excel", count:42 },
{ name:"Mutual_Aug-2025.csv", type:"csv", count:61 },
{ name:"Americo_Aug-2025.pdf", type:"pdf", count:81 },
];

export default function AdminNetReports(){
const [parsed, setParsed] = useState(false);
const [rows, setRows] = useState<NetRow[]>([]);

function parseNow(){
setTimeout(()=>{
setRows(SAMPLE_NET_ROWS);
setParsed(true);
}, 500);
}

const totals = useMemo(()=>{
const sum = (f:(r:NetRow)=>number) => rows.reduce((s,r)=>s+f(r),0);
const newBiz = sum(r=>r.aigNew+r.mutNew+r.ameNew);
const cbs = sum(r=>r.aigCb+r.mutCb+r.ameCb);
return { newBiz, cbs, net: newBiz + cbs, agents: rows.length };
}, [rows]);

return (
<div className="text-white space-y-4">
<div className="flex items-center justify-between">
<div className="text-2xl font-extrabold">Automated Carrier Net Reports</div>
<button onClick={parseNow} className="px-3 py-2 rounded-md bg-green-600 hover:bg-green-500">
{parsed? "Re-parse sample files":"Import sample carrier files"}
</button>
</div>

<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
<Kpi title="New Business" value={`$${totals.newBiz.toLocaleString()}`} />
<Kpi title="Chargebacks" value={`$${totals.cbs.toLocaleString()}`} />
<Kpi title="Net Production" value={`$${totals.net.toLocaleString()}`} />
<Kpi title="Agents Reporting" value={String(totals.agents)} />
</div>

<div className="bg-[#0d1628] border border-white/10 rounded-xl p-3">
<div className="text-white/70 text-sm mb-2">Carrier Report Inbox</div>
<div className="space-y-2">
{SAMPLE_FILES.map(f=>(
<div key={f.name} className="flex items-center justify-between bg-[#0b1220] border border-white/10 rounded-md px-3 py-2">
<div>{f.name} <span className="text-white/50">• {f.count} agents</span></div>
<span className={`text-xs px-2 py-1 rounded-full border ${parsed?"border-green-500/40 text-green-300":"border-white/20 text-white/70"}`}>
{parsed? "Parsed":"Waiting"}
</span>
</div>
))}
</div>
</div>

<div className="bg-[#0d1628] border border-white/10 rounded-xl overflow-hidden">
<table className="w-full text-sm">
<thead className="text-white/60">
<tr>
<th className="text-left p-3">Agent</th>
<th className="text-right p-3">AIG New</th>
<th className="text-right p-3">AIG CB</th>
<th className="text-right p-3">Mutual New</th>
<th className="text-right p-3">Mutual CB</th>
<th className="text-right p-3">Americo New</th>
<th className="text-right p-3">Americo CB</th>
<th className="text-right p-3">Net Total</th>
</tr>
</thead>
<tbody>
{rows.map(r=>{
const net = r.aigNew+r.aigCb+r.mutNew+r.mutCb+r.ameNew+r.ameCb;
return (
<tr key={r.agent} className="border-t border-white/10 hover:bg-white/5">
<td className="p-3">{r.agent}</td>
<td className="p-3 text-right">${r.aigNew.toLocaleString()}</td>
<td className="p-3 text-right">${r.aigCb.toLocaleString()}</td>
<td className="p-3 text-right">${r.mutNew.toLocaleString()}</td>
<td className="p-3 text-right">${r.mutCb.toLocaleString()}</td>
<td className="p-3 text-right">${r.ameNew.toLocaleString()}</td>
<td className="p-3 text-right">${r.ameCb.toLocaleString()}</td>
<td className="p-3 text-right font-bold">${net.toLocaleString()}</td>
</tr>
);
})}
</tbody>
</table>
</div>
</div>
);
}

function Kpi({title, value}:{title:string;value:string}) {
return (
<div className="bg-[#0d1628] border border-white/10 rounded-xl p-4">
<div className="text-white/70 text-sm">{title}</div>
<div className="text-2xl font-extrabold mt-1">{value}</div>
</div>
);
}