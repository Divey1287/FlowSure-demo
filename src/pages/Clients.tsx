import React, { useEffect, useMemo, useState } from "react";
import { db, auth } from "../firebase";
import {
addDoc,
collection,
onSnapshot,
orderBy,
query,
serverTimestamp,
Timestamp,
} from "firebase/firestore";
import { Card, Field, Button } from "../ui";

/** ---- Types ---- */
type Client = {
id: string;
uid?: string;
name: string;
policy: string;
start: number; // epoch ms (policy start date)
premium: number; // monthly premium
createdAt?: number;
};

/** ---- Helpers ---- */
function monthsBetween(aMs: number, bMs: number) {
const a = new Date(aMs);
const b = new Date(bMs);
let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
// if b's day is before a's day, we haven't completed the current month
if (b.getDate() < a.getDate()) months -= 1;
return Math.max(0, months);
}

function trackerColor(ageMonths: number) {
if (ageMonths < 3) return "red";
if (ageMonths < 6) return "yellow";
if (ageMonths < 12) return "yellow";
return "green";
}

function fmtDate(ms: number) {
const d = new Date(ms);
return d.toLocaleDateString();
}

/** ---- Component ---- */
export default function Clients() {
// form state
const [name, setName] = useState("");
const [policy, setPolicy] = useState("");
const [start, setStart] = useState<string>(""); // yyyy-mm-dd (from <input type="date">)
const [premium, setPremium] = useState("");

// list
const [items, setItems] = useState<Client[]>([]);

// LIVE QUERY
useEffect(() => {
const q = query(collection(db, "clients"), orderBy("start", "desc"));
return onSnapshot(q, (snap) =>
setItems(
snap.docs.map((d) => {
const data = d.data() as any;
return {
id: d.id,
name: data.name ?? "",
policy: data.policy ?? "",
start: (data.start instanceof Timestamp ? data.start.toMillis() : data.start) ?? Date.now(),
premium: Number(data.premium ?? 0),
uid: data.uid,
createdAt:
(data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt) ??
undefined,
} as Client;
})
)
);
}, []);

const save = async () => {
if (!name.trim() || !policy.trim() || !start) {
alert("Please fill name, policy, and start date.");
return;
}
const prem = Number(premium);
if (Number.isNaN(prem)) {
alert("Premium must be a number.");
return;
}
const startMs = new Date(start).getTime();

await addDoc(collection(db, "clients"), {
uid: auth.currentUser?.uid ?? null,
name: name.trim(),
policy: policy.trim(),
start: startMs,
premium: prem,
createdAt: serverTimestamp(),
});

setName("");
setPolicy("");
setStart("");
setPremium("");
};

return (
<div className="space">
<h2 className="section-title">Clients</h2>

<Card>
<div className="row">
<Field label="Client name">
<input className="input" value={name} onChange={(e) => setName(e.target.value)} />
</Field>

<Field label="Policy #">
<input className="input" value={policy} onChange={(e) => setPolicy(e.target.value)} />
</Field>

<Field label="Start date">
<input
className="input"
type="date"
value={start}
onChange={(e) => setStart(e.target.value)}
/>
</Field>

<Field label="Monthly premium ($)">
<input
className="input"
value={premium}
onChange={(e) => setPremium(e.target.value)}
placeholder="e.g. 49.99"
/>
</Field>

<div style={{ alignSelf: "end" }}>
<Button variant="primary" onClick={save}>
Save
</Button>
</div>
</div>
</Card>

<Card>
<div className="row" style={{ justifyContent: "space-between" }}>
<strong>Recent Clients</strong>
<span style={{ fontSize: 12, color: "var(--muted)" }}>
Legend: <Dot c="red" /> 0–3m <Dot c="yellow" /> 3–12m <Dot c="green" /> 12m+
</span>
</div>

<ul className="list" style={{ marginTop: 10 }}>
{items.map((c) => {
const ageM = monthsBetween(c.start, Date.now());
const color = trackerColor(ageM);

return (
<li key={c.id} className="kpi" style={{ alignItems: "center", gap: 14 }}>
<div style={{ minWidth: 220 }}>
<div style={{ fontWeight: 600 }}>{c.name}</div>
<div style={{ fontSize: 12, color: "var(--muted)" }}>
Policy {c.policy} • Started {fmtDate(c.start)} • ${c.premium.toFixed(2)}/mo
</div>
</div>

{/* Tracker */}
<Tracker ageMonths={ageM} />

<div style={{ fontSize: 12, color: "var(--muted)" }}>
Age: {ageM} mo • Status:{" "}
<span style={{ fontWeight: 600, color: colorMap[color] }}>{color.toUpperCase()}</span>
</div>
</li>
);
})}
{items.length === 0 && <li style={{ color: "var(--muted)" }}>No clients yet.</li>}
</ul>
</Card>
</div>
);
}

/** ---- Small visual bits (local, no CSS file changes needed) ---- */

const colorMap: Record<string, string> = {
red: "#ef4444",
yellow: "#eab308",
green: "#22c55e",
gray: "rgba(255,255,255,.25)",
};

function Dot({ c }: { c: keyof typeof colorMap }) {
return (
<span
style={{
display: "inline-block",
width: 10,
height: 10,
borderRadius: 999,
background: colorMap[c],
margin: "0 6px 0 2px",
verticalAlign: "middle",
}}
/>
);
}

function Pill({
label,
activeColor,
isActive,
}: {
label: string;
activeColor: keyof typeof colorMap;
isActive: boolean;
}) {
return (
<div
title={label}
style={{
minWidth: 56,
padding: "8px 10px",
borderRadius: 10,
textAlign: "center",
fontWeight: 700,
letterSpacing: 0.5,
border: `1px solid var(--stroke)`,
background: isActive ? colorMap[activeColor] : "rgba(255,255,255,.06)",
color: isActive ? "#0b0f1a" : "var(--text)",
boxShadow: "var(--shadow)",
}}
>
{label}
</div>
);
}

/** The three-stage tracker (3 / 6 / 12). Exactly one stage is “active” color.
* - <3 months: RED on "3m"
* - 3–6 months: YELLOW on "6m"
* - 6–12 months: YELLOW on "12m"
* - >=12 months: GREEN on "12m" (agent out of window)
*/
function Tracker({ ageMonths }: { ageMonths: number }) {
const stage = useMemo(() => {
if (ageMonths < 3) return "3";
if (ageMonths < 6) return "6";
if (ageMonths < 12) return "12";
return "safe";
}, [ageMonths]);

const is3 = stage === "3";
const is6 = stage === "6";
const is12 = stage === "12" || stage === "safe";

const color3: "red" = "red";
const color6: "yellow" = "yellow";
const color12: "yellow" | "green" = stage === "safe" ? "green" : "yellow";

return (
<div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1, maxWidth: 360 }}>
<Pill label="3m" activeColor={color3} isActive={is3} />
<div style={{ height: 1, flex: 1, background: "var(--stroke)", opacity: 0.6 }} />
<Pill label="6m" activeColor={color6} isActive={is6} />
<div style={{ height: 1, flex: 1, background: "var(--stroke)", opacity: 0.6 }} />
<Pill label="12m" activeColor={color12} isActive={is12} />
</div>
);
}