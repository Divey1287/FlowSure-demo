// src/medsMap.ts
export type MedInfo = {
name: string;
aka?: string[];
conditions: string[];
hints?: string[]; // underwriting flags to consider
};

const M = (name: string, conditions: string[], aka: string[] = [], hints: string[] = []): MedInfo => ({
name, aka, conditions, hints
});

// Curated demo list — add/remove as you like.
export const MEDS: MedInfo[] = [
M("Metformin", ["Type 2 diabetes"], [], ["A1C trend", "Insulin use?", "Neuropathy?"]),
M("Insulin", ["Diabetes (Type 1 or advanced Type 2)"], [], ["Hypoglycemia risk", "Recent hospitalizations"]),
M("Lisinopril", ["Hypertension", "Heart failure (possible)"], [], ["Kidney function", "Dizziness/falls"]),
M("Amlodipine", ["Hypertension"], [], ["Edema?"]),
M("Furosemide", ["Congestive heart failure", "Edema"], ["Lasix"], ["Weight changes", "Oxygen use?"]),
M("Atorvastatin", ["Hyperlipidemia"], ["Lipitor"], ["CAD history?"]),
M("Clopidogrel", ["Coronary stent / CAD / stroke prevention"], ["Plavix"], ["Recent MI/stent?", "Bleeding risk"]),
M("Warfarin", ["Atrial fibrillation", "DVT/PE history", "Valve replacement"], ["Coumadin"], ["INR control", "Bleeding"]),
M("Apixaban", ["Atrial fibrillation", "DVT/PE"], ["Eliquis"], ["Bleeding risk"]),
M("Amiodarone", ["Arrhythmia (AFib, VT)"], [], ["Thyroid/lung monitoring", "Recent syncope?"]),
M("Nitroglycerin", ["Angina / Coronary artery disease"], ["Nitrostat"], ["Unstable chest pain?"]),
M("Albuterol", ["Asthma/COPD"], [], ["Frequent use? Exacerbations?"]),
M("Tiotropium", ["COPD"], ["Spiriva"], ["Oxygen use?", "Hospitalizations"]),
M("Prednisone", ["Autoimmune flare", "COPD/Asthma exacerbation"], [], ["Chronic steroid? Infections?"]),
M("Levothyroxine", ["Hypothyroidism"], ["Synthroid"], []),
M("Sertraline", ["Depression/anxiety"], ["Zoloft"], ["Recent hospitalizations?"]),
M("Donepezil", ["Alzheimer’s / Dementia"], ["Aricept"], ["ADLs, supervision, falls"]),
M("Gabapentin", ["Neuropathy", "Chronic pain"], [], ["Sedation, falls"]),
M("Omeprazole", ["GERD"], ["Prilosec"], []),
M("Tamsulosin", ["BPH / urinary symptoms"], ["Flomax"], ["Dizziness/falls"]),
];

export function findMeds(query: string): MedInfo[] {
const q = query.trim().toLowerCase();
if (!q) return [];
return MEDS.filter(m =>
m.name.toLowerCase().includes(q) ||
(m.aka ?? []).some(a => a.toLowerCase().includes(q))
);
}

export function lookupByNames(names: string[]): MedInfo[] {
const set = new Set(names.map(n => n.trim().toLowerCase()).filter(Boolean));
return MEDS.filter(m =>
set.has(m.name.toLowerCase()) ||
(m.aka ?? []).some(a => set.has(a.toLowerCase()))
);
}