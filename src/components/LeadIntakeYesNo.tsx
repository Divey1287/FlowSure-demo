// src/components/LeadIntakeYesNo.tsx
import React from "react";
import type { LeadIntake } from "../types";

type Props = {
intake: LeadIntake; // guaranteed object
onChange: (next: LeadIntake) => void;
};

const fieldBox = "text-sm text-white/80";
const inputBox =
"w-full bg-white/5 text-white placeholder-white/40 rounded-md px-3 py-2 outline-none border border-white/10 focus:border-white/20";
const ynBtnBase =
"px-3 py-1 rounded-md text-sm border border-white/15 transition-colors";
const yesOn = "bg-green-600/80 text-white";
const yesOff = "bg-transparent text-white/80 hover:bg-white/10";
const noOn = "bg-red-600/80 text-white";
const noOff = "bg-transparent text-white/80 hover:bg-white/10";

function YNRow({
label,
value,
onSet,
}: {
label: string;
value: boolean | null;
onSet: (v: boolean) => void;
}) {
return (
<div className="flex items-center justify-between py-2">
<div className={fieldBox}>{label}</div>
<div className="flex gap-2">
<button
type="button"
className={`${ynBtnBase} ${value === true ? yesOn : yesOff}`}
onClick={() => onSet(true)}
>
Yes
</button>
<button
type="button"
className={`${ynBtnBase} ${value === false ? noOn : noOff}`}
onClick={() => onSet(false)}
>
No
</button>
</div>
</div>
);
}

export default function LeadIntakeYesNo({ intake, onChange }: Props) {
const safe = intake ?? {
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
confirm: "na",
};

const set = (patch: Partial<LeadIntake>) => onChange({ ...safe, ...patch });

return (
<section className="rounded-xl border border-white/10 bg-white/5 p-4">
<h3 className="text-white font-semibold mb-4">
Lead Intake (required for In-&-Up)
</h3>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
<div>
<div className={fieldBox}>Client name</div>
<input
className={inputBox}
value={safe.clientName || ""}
onChange={(e) => set({ clientName: e.target.value })}
/>
</div>
<div>
<div className={fieldBox}>Address</div>
<input
className={inputBox}
value={safe.address || ""}
onChange={(e) => set({ address: e.target.value })}
/>
</div>
<div className="md:col-span-2">
<div className={fieldBox}>Meds (comma separated)</div>
<input
className={inputBox}
placeholder="e.g., Metformin, Lisinopril"
value={safe.meds || ""}
onChange={(e) => set({ meds: e.target.value })}
/>
</div>
<div className="md:col-span-2">
<div className={fieldBox}>Notes (optional)</div>
<input
className={inputBox}
placeholder="Any details for upline"
value={safe.notes || ""}
onChange={(e) => set({ notes: e.target.value })}
/>
</div>
</div>

<div className="divide-y divide-white/10">
<YNRow
label="Diabetes (insulin or not)"
value={safe.diabetes}
onSet={(v) => set({ diabetes: v })}
/>
<YNRow label="COPD" value={safe.copd} onSet={(v) => set({ copd: v })} />
<YNRow
label="Heart attack"
value={safe.heartAttack}
onSet={(v) => set({ heartAttack: v })}
/>
<YNRow
label="Congestive heart failure"
value={safe.chf}
onSet={(v) => set({ chf: v })}
/>
<YNRow
label="Stroke"
value={safe.stroke}
onSet={(v) => set({ stroke: v })}
/>
<YNRow
label="Cancer"
value={safe.cancer}
onSet={(v) => set({ cancer: v })}
/>
</div>
</section>
);
}