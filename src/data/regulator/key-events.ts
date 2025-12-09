// =============================================================================
// KEY HARM EVENTS TIMELINE DATA
// =============================================================================
// Synthetic chronological sequence of significant harm events including
// volatility spikes, herding surges, offshore leakage incidents, and
// other notable patterns in NZ retail trading.

export type EventCategory = 
  | "volatility"
  | "herding"
  | "prop-firm"
  | "leakage"
  | "cluster"
  | "regulatory";

export interface KeyHarmEvent {
  id: string;
  timestamp: string;
  label: string;
  category: EventCategory;
  rhiAtTime: number;
  rhiChange: number; // Change from previous day
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  affectedTraders?: number;
  relatedAssets?: string[];
  linkedModule?: string; // Link to another module for drill-down
}

// Category configuration
export const EVENT_CATEGORY_CONFIG: Record<EventCategory, {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}> = {
  volatility: {
    label: "Volatility Spike",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.15)",
    icon: "Zap",
  },
  herding: {
    label: "Herding Surge",
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.15)",
    icon: "Users",
  },
  "prop-firm": {
    label: "Prop Firm Event",
    color: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.15)",
    icon: "Building2",
  },
  leakage: {
    label: "Offshore Leakage",
    color: "#ec4899",
    bgColor: "rgba(236, 72, 153, 0.15)",
    icon: "Globe",
  },
  cluster: {
    label: "Loss Cluster",
    color: "#fbbf24",
    bgColor: "rgba(251, 191, 36, 0.15)",
    icon: "Grid3X3",
  },
  regulatory: {
    label: "Regulatory Flag",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.15)",
    icon: "Shield",
  },
};

// Severity configuration
export const SEVERITY_CONFIG: Record<string, { color: string; label: string }> = {
  low: { color: "#53f6c5", label: "Low" },
  medium: { color: "#fbbf24", label: "Medium" },
  high: { color: "#f97316", label: "High" },
  critical: { color: "#ef4444", label: "Critical" },
};

// =============================================================================
// SYNTHETIC EVENTS DATA (6 months of events)
// =============================================================================

export const KEY_HARM_EVENTS: KeyHarmEvent[] = [
  // November 2024
  {
    id: "evt-001",
    timestamp: "2024-11-13T13:30:00Z",
    label: "US CPI Shock Response",
    category: "volatility",
    rhiAtTime: 724,
    rhiChange: 182,
    description: "Higher-than-expected CPI triggered mass leverage spike; 847 traders affected with avg loss $1,240",
    severity: "critical",
    affectedTraders: 847,
    relatedAssets: ["NAS100", "EURUSD", "XAUUSD"],
    linkedModule: "/regulator/volatility-shocks",
  },
  {
    id: "evt-002",
    timestamp: "2024-11-12T09:15:00Z",
    label: "Coordinated Short Cluster",
    category: "cluster",
    rhiAtTime: 542,
    rhiChange: 28,
    description: "89 traders entered synchronized short positions within 120-second window following signal provider",
    severity: "high",
    affectedTraders: 89,
    relatedAssets: ["EURUSD"],
    linkedModule: "/regulator/influence-pathways",
  },
  {
    id: "evt-003",
    timestamp: "2024-11-08T14:00:00Z",
    label: "Prop Firm Cascade Failure",
    category: "prop-firm",
    rhiAtTime: 598,
    rhiChange: 45,
    description: "FTMO challenge deadline triggered 156 simultaneous high-risk trades; 78% failure rate",
    severity: "high",
    affectedTraders: 156,
    relatedAssets: ["NAS100", "BTCUSD"],
    linkedModule: "/regulator/broker-leakage",
  },
  {
    id: "evt-004",
    timestamp: "2024-11-05T08:30:00Z",
    label: "Herding Score Spike",
    category: "herding",
    rhiAtTime: 612,
    rhiChange: 68,
    description: "Herding synchronisation score reached 780; social media-driven coordinated entries detected",
    severity: "high",
    affectedTraders: 428,
    linkedModule: "/regulator/influence-detection",
  },

  // October 2024
  {
    id: "evt-005",
    timestamp: "2024-10-27T22:00:00Z",
    label: "FOMC Rate Decision Impact",
    category: "volatility",
    rhiAtTime: 668,
    rhiChange: 150,
    description: "Fed 'higher for longer' signal caused rapid USD moves; 723 traders with elevated losses",
    severity: "critical",
    affectedTraders: 723,
    relatedAssets: ["EURUSD", "GBPUSD", "USDJPY"],
    linkedModule: "/regulator/volatility-shocks",
  },
  {
    id: "evt-006",
    timestamp: "2024-10-15T10:00:00Z",
    label: "Offshore Platform Migration",
    category: "leakage",
    rhiAtTime: 558,
    rhiChange: 32,
    description: "Detected 124 traders shifting activity to Vanuatu-licensed platforms following margin call events",
    severity: "medium",
    affectedTraders: 124,
    linkedModule: "/regulator/broker-leakage",
  },
  {
    id: "evt-007",
    timestamp: "2024-10-07T08:15:00Z",
    label: "Geopolitical Risk Cascade",
    category: "volatility",
    rhiAtTime: 782,
    rhiChange: 254,
    description: "Middle East escalation triggered gold rush and risk-off cascade; highest RHI spike of quarter",
    severity: "critical",
    affectedTraders: 912,
    relatedAssets: ["XAUUSD", "USDJPY", "NAS100"],
    linkedModule: "/regulator/volatility-shocks",
  },
  {
    id: "evt-008",
    timestamp: "2024-10-02T16:30:00Z",
    label: "Copy Trading Cascade",
    category: "herding",
    rhiAtTime: 545,
    rhiChange: 22,
    description: "Single signal provider loss cascaded to 234 copiers; avg loss 2.8x higher than non-copiers",
    severity: "medium",
    affectedTraders: 234,
    linkedModule: "/regulator/cohorts",
  },

  // September 2024
  {
    id: "evt-009",
    timestamp: "2024-09-18T14:00:00Z",
    label: "Tech Earnings Volatility",
    category: "volatility",
    rhiAtTime: 632,
    rhiChange: 127,
    description: "Major tech miss triggered NASDAQ selloff; volatility chasers over-leveraged during event",
    severity: "high",
    affectedTraders: 634,
    relatedAssets: ["NAS100", "US500"],
    linkedModule: "/regulator/volatility-shocks",
  },
  {
    id: "evt-010",
    timestamp: "2024-09-10T11:00:00Z",
    label: "Unlicensed Platform Alert",
    category: "regulatory",
    rhiAtTime: 512,
    rhiChange: 15,
    description: "FMA flagged 3 unlicensed platforms actively marketing to NZ traders via social media",
    severity: "medium",
    linkedModule: "/regulator/nz-brokers",
  },
  {
    id: "evt-011",
    timestamp: "2024-09-05T09:00:00Z",
    label: "New Trader Cohort Surge",
    category: "cluster",
    rhiAtTime: 498,
    rhiChange: -8,
    description: "85 new accounts opened following viral TikTok trading content; elevated risk profile detected",
    severity: "medium",
    affectedTraders: 85,
    linkedModule: "/regulator/cohorts",
  },

  // August 2024
  {
    id: "evt-012",
    timestamp: "2024-08-05T04:30:00Z",
    label: "JPY Carry Trade Unwind",
    category: "volatility",
    rhiAtTime: 845,
    rhiChange: 311,
    description: "BoJ policy shift caused massive carry trade unwind; worst single-day harm event in dataset",
    severity: "critical",
    affectedTraders: 1024,
    relatedAssets: ["USDJPY", "EURJPY", "NAS100"],
    linkedModule: "/regulator/volatility-shocks",
  },
  {
    id: "evt-013",
    timestamp: "2024-08-01T12:00:00Z",
    label: "Prop Firm Marketing Surge",
    category: "prop-firm",
    rhiAtTime: 534,
    rhiChange: 18,
    description: "Detected 34% increase in NZ traders signing up for offshore prop firm challenges",
    severity: "medium",
    affectedTraders: 245,
    linkedModule: "/regulator/broker-leakage",
  },

  // July 2024
  {
    id: "evt-014",
    timestamp: "2024-07-22T16:45:00Z",
    label: "Crypto ETF Outflow Cascade",
    category: "volatility",
    rhiAtTime: 798,
    rhiChange: 186,
    description: "Large BTC ETF redemptions triggered crypto market cascade; extreme leverage losses observed",
    severity: "critical",
    affectedTraders: 456,
    relatedAssets: ["BTCUSD", "ETHUSD"],
    linkedModule: "/regulator/volatility-shocks",
  },
  {
    id: "evt-015",
    timestamp: "2024-07-15T08:00:00Z",
    label: "Weekend Gap Losses",
    category: "cluster",
    rhiAtTime: 548,
    rhiChange: 35,
    description: "178 traders holding leveraged positions over weekend experienced gap losses at market open",
    severity: "medium",
    affectedTraders: 178,
    relatedAssets: ["EURUSD", "GBPUSD"],
  },
  {
    id: "evt-016",
    timestamp: "2024-07-08T14:30:00Z",
    label: "Influencer Disclosure Breach",
    category: "regulatory",
    rhiAtTime: 502,
    rhiChange: 5,
    description: "FMA identified 5 NZ-based trading influencers failing to disclose platform affiliations",
    severity: "low",
    linkedModule: "/regulator/influence-pathways",
  },

  // June 2024
  {
    id: "evt-017",
    timestamp: "2024-06-12T10:00:00Z",
    label: "Offshore Leakage Milestone",
    category: "leakage",
    rhiAtTime: 518,
    rhiChange: 12,
    description: "Offshore-linked trading activity crossed 65% threshold for first time; regulatory concern raised",
    severity: "medium",
    linkedModule: "/regulator/broker-leakage",
  },
  {
    id: "evt-018",
    timestamp: "2024-06-01T09:00:00Z",
    label: "Q2 Baseline Established",
    category: "regulatory",
    rhiAtTime: 506,
    rhiChange: 0,
    description: "RHI baseline of 506 established for Q2 2024; used as reference point for subsequent analysis",
    severity: "low",
  },
];

// Sort events by timestamp (most recent first)
export const EVENTS_BY_DATE = [...KEY_HARM_EVENTS].sort(
  (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
);

// Get events by category
export function getEventsByCategory(category: EventCategory): KeyHarmEvent[] {
  return KEY_HARM_EVENTS.filter((e) => e.category === category);
}

// Get events by severity
export function getEventsBySeverity(severity: string): KeyHarmEvent[] {
  return KEY_HARM_EVENTS.filter((e) => e.severity === severity);
}

// Get events in date range
export function getEventsInRange(startDate: string, endDate: string): KeyHarmEvent[] {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return KEY_HARM_EVENTS.filter((e) => {
    const eventTime = new Date(e.timestamp).getTime();
    return eventTime >= start && eventTime <= end;
  });
}

// Summary statistics
export const EVENT_SUMMARY = {
  totalEvents: KEY_HARM_EVENTS.length,
  criticalEvents: KEY_HARM_EVENTS.filter((e) => e.severity === "critical").length,
  highEvents: KEY_HARM_EVENTS.filter((e) => e.severity === "high").length,
  avgRHIAtEvent: Math.round(
    KEY_HARM_EVENTS.reduce((sum, e) => sum + e.rhiAtTime, 0) / KEY_HARM_EVENTS.length
  ),
  maxRHI: Math.max(...KEY_HARM_EVENTS.map((e) => e.rhiAtTime)),
  totalAffectedTraders: KEY_HARM_EVENTS.reduce((sum, e) => sum + (e.affectedTraders || 0), 0),
  eventsByCategory: Object.fromEntries(
    Object.keys(EVENT_CATEGORY_CONFIG).map((cat) => [
      cat,
      KEY_HARM_EVENTS.filter((e) => e.category === cat).length,
    ])
  ),
};
