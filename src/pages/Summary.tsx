import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Card, Field, Button } from "../ui.tsx";

type Goals = { door: number; sit: number; close: number };
type Done = { door: number; sit: number; close: number };

export default function Summary() {
const uid = auth.currentUser?.uid;
const [goals, setGoals] = useState<Goals>({ door: 50, sit: 20, close: 8 });
const [done, setDone] = useState<Done>({ door: 0, sit: 0, close: 0 });

useEffect(() => {
if (!uid) return;
(async () => {
const ref = doc(db, "summary", uid);
const snap = await getDoc(ref);
if (snap.exists()) {
const data = snap.data() as any;
if (data.goals) setGoals(data.goals);
if (data.done) setDone(data.done);
}
})();
}, [uid]);

const save = async () => {
if (!uid) return alert("Not signed in");
await setDoc(
doc(db, "summary", uid),
{ goals, done, ts: Date.now() },
{ merge: true }
);
alert("Saved ✓");
};

const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);

return (
<div className="space">
<Card className="card">
<h2 className="section-title">Production Summary (Weekly)</h2>

<div className="row">
<Field label="Door goal">
<input
className="input"
type="number"
value={goals.door}
onChange={(e) => setGoals({ ...goals, door: Number(e.target.value) })}
/>
</Field>
<Field label="Sit goal">
<input
className="input"
type="number"
value={goals.sit}
onChange={(e) => setGoals({ ...goals, sit: Number(e.target.value) })}
/>
</Field>
<Field label="Close goal">
<input
className="input"
type="number"
value={goals.close}
onChange={(e) => setGoals({ ...goals, close: Number(e.target.value) })}
/>
</Field>
</div>

<div className="row" style={{ marginTop: 10 }}>
<Field label="Doors done">
<input
className="input"
type="number"
value={done.door}
onChange={(e) => setDone({ ...done, door: Number(e.target.value) })}
/>
</Field>
<Field label="Sits done">
<input
className="input"
type="number"
value={done.sit}
onChange={(e) => setDone({ ...done, sit: Number(e.target.value) })}
/>
</Field>
<Field label="Closes done">
<input
className="input"
type="number"
value={done.close}
onChange={(e) => setDone({ ...done, close: Number(e.target.value) })}
/>
</Field>
<Button onClick={save}>Save progress</Button>
</div>

<p className="time" style={{ marginTop: 12 }}>
<strong>Progress</strong> — Door: {pct(done.door, goals.door)}% |
{" "}Sit: {pct(done.sit, goals.sit)}% | Close: {pct(done.close, goals.close)}%
</p>
</Card>
</div>
);
}