import React from "react";

export default function RoleToggle({
role, onChange,
}:{ role:"agent"|"coach"|"admin"; onChange:(r:"agent"|"coach"|"admin")=>void }) {
const Btn = ({r,label}:{r:"agent"|"coach"|"admin";label:string}) => (
<button onClick={()=>onChange(r)}
className={`px-3 py-1.5 rounded-md border ${role===r?"bg-blue-600 border-blue-600 text-white":"border-white/20 text-white/80"}`}>
{label}
</button>
);
return (
<div className="flex gap-2 bg-[#0d1628] border border-white/10 rounded-xl p-2">
<Btn r="agent" label="Agent"/>
<Btn r="coach" label="Coach"/>
<Btn r="admin" label="Admin"/>
</div>
);
}