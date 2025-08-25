// src/leadStore.ts
// Day-of leads + demo mileage tracking (persists to localStorage)

import { useEffect, useState } from "react";

export type LeadStatus = "new" | "enroute" | "knocked" | "in" | "closed";

export interface Lead {
id: string;
name: string;
address: string;
lat: number;
lng: number;
status: LeadStatus;
}

export interface Trip {
fromId: string | null; // null = starting point
toId: string;
distanceMiles: number;
at: number; // timestamp
}

const LEADS_KEY = "demo_leads_v1";
const SELECTED_KEY = "demo_selected_lead";
const MILES_KEY = "demo_mileage_v1";

/** ---- Demo starting location (e.g., home/office). Adjust if you want. ---- */
const START_LAT = 36.1600;
const START_LNG = -86.7800;

function haversineMiles(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
const toRad = (d: number) => (d * Math.PI) / 180;
const R = 3958.7613; // Earth radius in miles
const dLat = toRad(b.lat - a.lat);
const dLng = toRad(b.lng - a.lng);
const lat1 = toRad(a.lat);
const lat2 = toRad(b.lat);
const x =
Math.sin(dLat / 2) ** 2 +
Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
return 2 * R * Math.asin(Math.min(1, Math.sqrt(x)));
}

function loadLeads(): Lead[] {
try {
const raw = localStorage.getItem(LEADS_KEY);
if (raw) return JSON.parse(raw) as Lead[];
} catch {}
const seed: Lead[] = [
{ id: "L-1001", name: "Jane Doe", address: "101 Pine St", lat: 36.16, lng: -86.78, status: "new" },
{ id: "L-1002", name: "Robert King", address: "22 Oak Ave", lat: 36.15, lng: -86.81, status: "new" },
{ id: "L-1003", name: "Mia Thompson",address: "7 Cedar Ct", lat: 36.18, lng: -86.75, status: "new" },
];
localStorage.setItem(LEADS_KEY, JSON.stringify(seed));
return seed;
}
function saveLeads(list: Lead[]) { localStorage.setItem(LEADS_KEY, JSON.stringify(list)); }

function loadSelected(): string | null { return localStorage.getItem(SELECTED_KEY); }
function saveSelected(id: string | null) {
if (id) localStorage.setItem(SELECTED_KEY, id);
else localStorage.removeItem(SELECTED_KEY);
}

type MileageState = {
totalMiles: number;
trips: Trip[];
lastPoint: { lat: number; lng: number };
lastLeadId: string | null;
};

function loadMileage(): MileageState {
try {
const raw = localStorage.getItem(MILES_KEY);
if (raw) return JSON.parse(raw) as MileageState;
} catch {}
const init: MileageState = {
totalMiles: 0,
trips: [],
lastPoint: { lat: START_LAT, lng: START_LNG },
lastLeadId: null,
};
localStorage.setItem(MILES_KEY, JSON.stringify(init));
return init;
}
function saveMileage(m: MileageState) { localStorage.setItem(MILES_KEY, JSON.stringify(m)); }

/** --- pub/sub --- */
type Listener = () => void;
const listeners = new Set<Listener>();
function notify() { for (const l of listeners) l(); }
export function subscribe(fn: Listener) { listeners.add(fn); return () => listeners.delete(fn); }

/** --- internal state --- */
const _state: { leads: Lead[]; selectedId: string | null; miles: MileageState } = {
leads: loadLeads(),
selectedId: loadSelected(),
miles: loadMileage(),
};

/** --- API: Leads --- */
export function getLeads() { return _state.leads; }
export function getSelectedLead(): Lead | null {
return _state.leads.find(l => l.id === _state.selectedId) ?? null;
}
export function selectLead(id: string | null) { _state.selectedId = id; saveSelected(id); notify(); }

export function setStatus(id: string, status: LeadStatus) {
_state.leads = _state.leads.map(l => (l.id === id ? { ...l, status } : l));
saveLeads(_state.leads);
notify();
}

/** --- API: Mileage --- */
export function getMileage() { return _state.miles; }

/** Log a travel segment from the last point to this lead, update totals. */
export function logTravelTo(leadId: string) {
const lead = _state.leads.find(l => l.id === leadId);
if (!lead) return;
const from = _state.miles.lastPoint;
const to = { lat: lead.lat, lng: lead.lng };
const dist = haversineMiles(from, to);
_state.miles = {
totalMiles: _state.miles.totalMiles + dist,
trips: [
{ fromId: _state.miles.lastLeadId, toId: leadId, distanceMiles: dist, at: Date.now() },
..._state.miles.trips,
],
lastPoint: to,
lastLeadId: leadId,
};
saveMileage(_state.miles);
notify();
}

/** Helper “open in maps” demo action */
export function simulateNavigate(leadId: string) {
setStatus(leadId, "enroute");
logTravelTo(leadId);
}

/** hooks */
export function useLeads() {
const [list, setList] = useState<Lead[]>(getLeads());
useEffect(() => subscribe(() => setList(getLeads())), []);
return list;
}
export function useSelectedLead() {
const [lead, setLead] = useState<Lead | null>(getSelectedLead());
useEffect(() => subscribe(() => setLead(getSelectedLead())), []);
return lead;
}
export function useMileage() {
const [m, setM] = useState<MileageState>(getMileage());
useEffect(() => subscribe(() => setM(getMileage())), []);
return m;
}

/** Utilities for demo */
export function resetMileage() {
_state.miles = {
totalMiles: 0,
trips: [],
lastPoint: { lat: START_LAT, lng: START_LNG },
lastLeadId: null,
};
saveMileage(_state.miles);
notify();
}