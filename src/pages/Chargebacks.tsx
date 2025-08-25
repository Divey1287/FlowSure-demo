import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
collection,
addDoc,
query,
orderBy,
onSnapshot,
Timestamp,
} from "firebase/firestore";
import { Card, Field, Button } from "../ui";

// Currency formatter
const moneyFmt = new Intl.NumberFormat(undefined, {
style: "currency",
currency: "USD",
});

// Clean + normalize user typing into a money string
function toMoney(v: string) {
const cleaned = v.replace(/[^\d.]/g, "");
const parts = cleaned.split(".");
return parts.length > 1
? parts[0] + "." + parts[1].slice(0, 2)
: parts[0];
}

export default function Chargebacks() {
const [client, setClient] = useState("");
const [policy, setPolicy] = useState("");
const [amount, setAmount] = useState("");
const [notes, setNotes] = useState("");
const [items, setItems] = useState<any[]>([]);

// Load chargebacks in real-time
useEffect(() => {
const q = query(collection(db, "chargebacks"), orderBy("ts", "desc"));
const unsub = onSnapshot(q, (snap) => {
setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
});
return () => unsub();
}, []);

async function save() {
const amt = Number(amount || "0");

if (!client.trim()) return alert("Please enter the client name.");
if (!policy.trim()) return alert("Please enter the policy #.");
if (!isFinite(amt) || amt <= 0)
return alert("Please enter a valid amount.");

await addDoc(collection(db, "chargebacks"), {
client,
policy,
amount: amt,
notes,
ts: Timestamp.now(),
});

setClient("");
setPolicy("");
setAmount("");
setNotes("");
}

return (
<div className="space">
<h2 className="section-title">Chargebacks</h2>

<Card>
<Field label="Client">
<input
className="input"
value={client}
onChange={(e) => setClient(e.target.value)}
/>
</Field>
<Field label="Policy #">
<input
className="input"
value={policy}
onChange={(e) => setPolicy(e.target.value)}
/>
</Field>
<Field label="Amount">
<input
className="input"
inputMode="decimal"
placeholder="0.00"
value={amount}
onChange={(e) => setAmount(toMoney(e.target.value))}
/>
</Field>
<Field label="Notes">
<input
className="input"
value={notes}
onChange={(e) => setNotes(e.target.value)}
placeholder="Optional details..."
/>
</Field>

<Button onClick={save}>Save</Button>
</Card>

<h3 style={{ marginTop: 24 }}>Recent</h3>
<div className="space">
{items.map((it) => (
<Card key={it.id} className="kpi">
<div>
<strong>{it.client}</strong>
<span style={{ marginLeft: 8 }}>Policy: {it.policy}</span>
<span style={{ marginLeft: 8 }}>
Amount: {moneyFmt.format(Number(it.amount || 0))}
</span>
</div>
<div className="time">
{new Date(it.ts.seconds * 1000).toLocaleString()}
</div>
{it.notes && <div style={{ marginTop: 4 }}>{it.notes}</div>}
</Card>
))}
</div>
</div>
);
}