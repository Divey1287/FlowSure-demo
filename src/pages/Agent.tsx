// src/pages/Agent.tsx
import React, { useMemo, useState } from "react";
import { createInUp } from "../inupStore";

/** -------------------- Types -------------------- */
type Intake = {
clientName: string;
address: string;
meds: string;
notes: string;
diabetes: boolean | null;
copd: boolean | null;
heartAttack: boolean | null;
chf: boolean | null;
stroke: boolean | null;
cancer: boolean | null;
payment: "bank" | "dec" | null;
confirm: "in" | "na" | null;
};
type Tab = "intake" | "summary" | "map";
type Lead = { id: string; name: string; address: string; distanceMi?: number };

/** -------------------- Mock Leads -------------------- */
const MOCK_LEADS: Lead[] = [
{ id: "L1", name: "Jane Doe", address: "101 Pine St", distanceMi: 2.3 },
{ id: "L2", name: "Tom Doe", address: "22 Maple Ave", distanceMi: 5.1 },
{ id: "L3", name: "Tim Green", address: "889 Oak Circle", distanceMi: 7.8 },
];

const pillBase =
"px-2 py-1 rounded-md text-xs capitalize border border-white/10";
const yesNoBtn =
"px-3 py-1 rounded-md text-sm border border-white/15 transition-colors";
const yesCls = (on: boolean) =>
`${yesNoBtn} ${on ? "bg-green-600/80 text-white" : "bg-transparent text-white/80 hover:bg-white/10"}`;
const noCls = (on: boolean) =>
`${yesNoBtn} ${on ? "bg-red-600/80 text-white" : "bg-transparent text-white/80 hover:bg-white/10"}`;

/** -------------------- Component -------------------- */
export default function AgentPage() {
const [tab, setTab] = useState<Tab>("intake");
const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

const [intake, setIntake] = useState<Intake>({
clientName: "",
address: "",
meds: "",
notes: "",
diabetes: null,
copd: null,
heartAttack: null,
chf: null,
stroke: null,
cancer: null,
payment: null,
confirm: null,
});

/** Prefill intake when a lead is chosen */
function chooseLead(lead: Lead) {
setSelectedLead(lead);
setIntake((s) => ({
...s,
clientName: lead.name,
address: lead.address,
}));
setTab("intake"); // jump to intake to begin
}

const gateOk = useMemo(() => {
const flagsChosen =
intake.diabetes !== null &&
intake.copd !== null &&
intake.heartAttack !== null &&
intake.chf !== null &&
intake.stroke !== null &&
intake.cancer !== null;

return (
flagsChosen &&
!!intake.payment &&
(intake.confirm === "in" || intake.confirm === "na") &&
intake.clientName.trim().length > 0 &&
intake.address.trim().length > 0
);
}, [intake]);

function setFlag(
key: keyof Pick<
Intake,
"diabetes" | "copd" | "heartAttack" | "chf" | "stroke" | "cancer"
>,
val: boolean
) {
setIntake((s) => ({ ...s, [key]: val }));
}

function healthBadge(v: boolean | null) {
if (v === true) return `${pillBase} bg-green-600/70`;
if (v === false) return `${pillBase} bg-red-600/70`;
return `${pillBase} bg-white/10 text-white/70`;
}

async function sendInUp() {
if (!gateOk) return;

const medsArr =
intake.meds.trim().length > 0
? intake.meds.split(",").map((m) => m.trim()).filter(Boolean)
: [];

createInUp({
clientName: intake.clientName,
address: intake.address,
meds: medsArr,
notes: intake.notes,
payment: intake.payment,
confirm: intake.confirm,
health: {
diabetes: intake.diabetes ?? undefined,
copd: intake.copd ?? undefined,
heartAttack: intake.heartAttack ?? undefined,
chf: intake.chf ?? undefined,
stroke: intake.stroke ?? undefined,
cancer: intake.cancer ?? undefined,
},
});
}

return (
<div className="text-white">
<h1 className="text-2xl font-semibold mb-2">Agent</h1>

{/* Selected Lead */}
<div className="text-sm text-white/70 mb-4">
Selected Lead:{" "}
<span className="text-white/90">
{selectedLead ? `${selectedLead.name} • ${selectedLead.address}` : "—"}
</span>
</div>

{/* Sub-tabs */}
<div className="mb-5 flex gap-2">
{(["intake", "summary", "map"] as Tab[]).map((t) => (
<button
key={t}
onClick={() => setTab(t)}
className={`px-3 py-1.5 rounded-md text-sm ${
tab === t ? "bg-white/15" : "bg-white/5 hover:bg-white/10"
}`}
>
{t === "intake" ? "Lead Intake" : t === "summary" ? "Summary" : "Map"}
</button>
))}
</div>

{/* Panels */}
{tab === "intake" && (
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Intake Card */}
<div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
<h2 className="text-lg font-medium mb-4">
Lead Intake (required for In-&-Up)
</h2>

<div className="space-y-3">
<div className="grid grid-cols-2 gap-3">
<div>
<label className="block text-sm text-white/70 mb-1">
Client name
</label>
<input
className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none"
value={intake.clientName}
onChange={(e) =>
setIntake((s) => ({ ...s, clientName: e.target.value }))
}
/>
</div>
<div>
<label className="block text-sm text-white/70 mb-1">
Address
</label>
<input
className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none"
value={intake.address}
onChange={(e) =>
setIntake((s) => ({ ...s, address: e.target.value }))
}
/>
</div>
</div>

<div>
<label className="block text-sm text-white/70 mb-1">
Meds (comma separated)
</label>
<input
className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none"
placeholder="e.g., Metformin, Lisinopril"
value={intake.meds}
onChange={(e) =>
setIntake((s) => ({ ...s, meds: e.target.value }))
}
/>
</div>

<div>
<label className="block text-sm text-white/70 mb-1">
Notes (optional)
</label>
<input
className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none"
placeholder="Any details for upline"
value={intake.notes}
onChange={(e) =>
setIntake((s) => ({ ...s, notes: e.target.value }))
}
/>
</div>

{/* Health yes/no rows */}
{([
["diabetes", "Diabetes (insulin or not)"],
["copd", "COPD"],
["heartAttack", "Heart attack"],
["chf", "Congestive heart failure"],
["stroke", "Stroke"],
["cancer", "Cancer"],
] as const).map(([key, label]) => {
const val = intake[key];
return (
<div key={key} className="flex items-center justify-between">
<div className="text-sm">{label}</div>
<div className="space-x-2">
<button
className={yesCls(val === true)}
onClick={() => setFlag(key, true)}
>
Yes
</button>
<button
className={noCls(val === false)}
onClick={() => setFlag(key, false)}
>
No
</button>
</div>
</div>
);
})}
</div>
</div>

{/* Payment/Confirm + Send */}
<div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
<h2 className="text-lg font-medium mb-4">Payment & Confirmation</h2>

<div className="space-y-6">
<div>
<div className="text-sm text-white/70 mb-2">Payment method</div>
<div className="space-y-2">
<label className="flex items-center gap-2">
<input
type="radio"
name="pay"
checked={intake.payment === "bank"}
onChange={() =>
setIntake((s) => ({ ...s, payment: "bank" }))
}
/>
Bank account
</label>
<label className="flex items-center gap-2">
<input
type="radio"
name="pay"
checked={intake.payment === "dec"}
onChange={() =>
setIntake((s) => ({ ...s, payment: "dec" }))
}
/>
Direct Express (DEC)
</label>
</div>
</div>

<div>
<div className="text-sm text-white/70 mb-2">Confirmation</div>
<div className="space-y-2">
<label className="flex items-center gap-2">
<input
type="radio"
name="confirm"
checked={intake.confirm === "in"}
onChange={() =>
setIntake((s) => ({ ...s, confirm: "in" }))
}
/>
In with client
</label>
<label className="flex items-center gap-2">
<input
type="radio"
name="confirm"
checked={intake.confirm === "na"}
onChange={() =>
setIntake((s) => ({ ...s, confirm: "na" }))
}
/>
N/A
</label>
</div>
</div>

<div className="pt-2">
<button
disabled={!gateOk}
onClick={sendInUp}
className={`px-4 py-2 rounded-md font-medium ${
gateOk
? "bg-blue-600 hover:bg-blue-500"
: "bg-white/10 text-white/60 cursor-not-allowed"
}`}
>
Send In-&-Up
</button>
<div className="text-xs text-white/60 mt-2">
Required: Yes/No answered • Payment • Confirmation • Client
name • Address
</div>
</div>
</div>

{/* Health summary pills */}
<div className="mt-6">
<div className="text-sm text-white/70 mb-2">Health summary</div>
<div className="flex flex-wrap gap-2">
<span className={healthBadge(intake.diabetes)}>diabetes</span>
<span className={healthBadge(intake.copd)}>copd</span>
<span className={healthBadge(intake.heartAttack)}>heartAttack</span>
<span className={healthBadge(intake.chf)}>chf</span>
<span className={healthBadge(intake.stroke)}>stroke</span>
<span className={healthBadge(intake.cancer)}>cancer</span>
</div>
</div>
</div>
</div>
)}

{tab === "summary" && (
<div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
<h2 className="text-lg font-medium mb-3">Summary</h2>
<p className="text-white/80">
Quick demo summary: fill intake on the left, choose payment &
confirmation, then “Send In-&-Up” to push this case to Admin.
</p>
{selectedLead && (
<div className="mt-4 text-sm text-white/80">
Working lead: <b>{selectedLead.name}</b> • {selectedLead.address}
</div>
)}
</div>
)}

{tab === "map" && (
<div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
<h2 className="text-lg font-medium mb-4">Leads (Map Demo)</h2>

{/* For demo: list of leads; in a real build this is a map + pins */}
<div className="grid md:grid-cols-2 gap-3">
{MOCK_LEADS.map((lead) => (
<div
key={lead.id}
className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 p-3"
>
<div>
<div className="font-medium">{lead.name}</div>
<div className="text-white/70 text-sm">{lead.address}</div>
{lead.distanceMi !== undefined && (
<div className="text-white/60 text-xs mt-1">
~{lead.distanceMi.toFixed(1)} mi away
</div>
)}
</div>
<div className="flex gap-2">
<button
className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15"
onClick={() => alert("Opening in-app navigation (demo)")}
>
Go
</button>
<button
className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500"
onClick={() => chooseLead(lead)}
>
Start intake
</button>
</div>
</div>
))}
</div>

<p className="text-xs text-white/60 mt-4">
Demo note: “Start intake” prefills the client and address on the
Lead Intake tab. “Go” would open map navigation in production.
</p>
</div>
)}
</div>
);
}