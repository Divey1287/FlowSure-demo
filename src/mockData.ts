import { ClientPolicy, NetRow } from "./types";

export const SAMPLE_POLICIES: ClientPolicy[] = [
{ client: "Jane Doe", policyNumber: "WL-250K-8492", premium: "$132.40/mo", startDate: "2025-08-22", status: "Green" },
{ client: "Robert King",policyNumber: "WL-150K-3910", premium: "$98.15/mo", startDate: "2025-08-21", status: "Green" },
];

export const SAMPLE_NET_ROWS: NetRow[] = [
{ agent:"Jasmine Rivera", aigNew:12000, aigCb:-1500, mutNew:9800, mutCb:-300, ameNew:7200, ameCb:-600 },
{ agent:"Arjun Patel", aigNew: 8400, aigCb:-1200, mutNew:10100, mutCb:-700, ameNew:5300, ameCb:-400 },
{ agent:"Mia Thompson", aigNew: 6200, aigCb: 0, mutNew:5000, mutCb:-200, ameNew:4600, ameCb:-100 },
];