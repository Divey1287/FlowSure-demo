// src/inupStore.ts
export type InUpStatus = "pending" | "accepted" | "completed" | "noapp";

export type HealthFlags = {
diabetes?: boolean;
copd?: boolean;
heartAttack?: boolean;
chf?: boolean;
stroke?: boolean;
cancer?: boolean;
};

export type InUpRequest = {
id: string;
clientName?: string;
address?: string;
meds?: string[]; // comma-split list from agent form
notes?: string;
health?: HealthFlags;
payment?: "bank" | "dec" | null;
confirm?: "in" | "na" | null;
status: InUpStatus;
createdAt: number;
};

// --- simple localStorage-backed store for the demo ---
const KEY = "flowsure_inups_v1";

function load(): InUpRequest[] {
try {
const raw = localStorage.getItem(KEY);
return raw ? (JSON.parse(raw) as InUpRequest[]) : [];
} catch {
return [];
}
}

function save(list: InUpRequest[]) {
try {
localStorage.setItem(KEY, JSON.stringify(list));
} catch {
// ignore for demo
}
}

let cache: InUpRequest[] = load();

function nextId() {
// short, readable id
return "INUP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

// --- API exported to pages ---

export function listInUps(): InUpRequest[] {
// newest first
return [...cache].sort((a, b) => b.createdAt - a.createdAt);
}

export function createInUp(payload: Omit<InUpRequest, "id" | "status" | "createdAt"> & {
status?: InUpStatus;
}): InUpRequest {
const req: InUpRequest = {
id: nextId(),
status: payload.status ?? "pending",
createdAt: Date.now(),
clientName: payload.clientName,
address: payload.address,
meds: payload.meds ?? [],
notes: payload.notes ?? "",
health: payload.health ?? {},
payment: payload.payment ?? null,
confirm: payload.confirm ?? null,
};

cache.push(req);
save(cache);
return req;
}

export function updateStatus(id: string, status: InUpStatus) {
const hit = cache.find((r) => r.id === id);
if (hit) {
hit.status = status;
save(cache);
}
}

// helper for demos / resets (optional)
export function clearInUps() {
cache = [];
save(cache);
}