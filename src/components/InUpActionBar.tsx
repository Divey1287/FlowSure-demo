// src/components/InUpActionBar.tsx
import React from "react";
import type { LeadIntake } from "../types";

type Props = {
intake: LeadIntake;
disabled?: boolean;
onSend: () => void;
onChange?: (next: LeadIntake) => void;
};

const card = "rounded-xl border border-white/10 bg-white/5 p-4";
const label = "text-sm text-white/80 mb-2";

export default function InUpActionBar({ intake, disabled, onSend, onChange }: Props) {
const safe = intake ?? ({} as LeadIntake);

const set = (patch: Partial<LeadIntake>) => {
onChange?.({ ...safe, ...patch });
};

return (
<section className={card}>
<h3 className="text-white font-semibold mb-4">In-&-Up Action</h3>

{/* Payment method */}
<div className="mb-6">
<div className={label}>Payment Method</div>
<div className="flex items-center gap-4">
<label className="flex items-center gap-2">
<input
type="radio"
name="pay"
checked={safe.payment === "bank"}
onChange={() => set({ payment: "bank" })}
/>
<span>Bank account</span>
</label>
<label className="flex items-center gap-2">
<input
type="radio"
name="pay"
checked={safe.payment === "dec"}
onChange={() => set({ payment: "dec" })}
/>
<span>Direct Express (DEC)</span>
</label>
</div>
</div>

{/* Confirmation */}
<div className="mb-6">
<div className={label}>Confirmation (must pick one)</div>
<div className="flex items-center gap-4">
<label className="flex items-center gap-2">
<input
type="radio"
name="confirm"
checked={safe.confirm === "in"}
onChange={() => set({ confirm: "in" })}
/>
<span>In with client</span>
</label>
<label className="flex items-center gap-2">
<input
type="radio"
name="confirm"
checked={safe.confirm === "na"}
onChange={() => set({ confirm: "na" })}
/>
<span>N/A</span>
</label>
</div>
</div>

<div className="text-xs text-white/70 mb-3">
Required: Yes/No answered • Payment • Confirmation
</div>
<button
onClick={onSend}
disabled={!!disabled}
className={`px-4 py-2 rounded-md text-sm font-medium ${
disabled ? "bg-white/10 text-white/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
}`}
>
Send In-&-Up
</button>
</section>
);
}