// =============================================================================
// NZ BROKER CONNECTIVITY & READINESS DATA
// =============================================================================
// Real NZ-licensed broker connectivity information for PilotBridge integration.
// This dataset is SEPARATE from the synthetic risk-scoring brokers and focuses
// solely on platform connectivity and integration readiness.
//
// Note: All connectivity and readiness indicators are illustrative and synthetic
// for demonstration purposes only.

export type PilotBridgeReadiness = "A – Native Ready" | "B – Add-On Possible" | "C – Limited";

export interface NZBrokerConnectivity {
  id: string;
  broker: string;
  connectivity: string;
  pilotBridgeReadiness: PilotBridgeReadiness;
  insightPotential: string;
}

export const NZ_BROKER_CONNECTIVITY: NZBrokerConnectivity[] = [
  {
    id: "blackbull",
    broker: "BlackBull Markets",
    connectivity: "MT4/MT5, cTrader, TradingView, FIX",
    pilotBridgeReadiness: "A – Native Ready",
    insightPotential: "Rich multi-platform flow; strong FX/CFD behaviour visibility",
  },
  {
    id: "ig-markets",
    broker: "IG Markets NZ",
    connectivity: "MT4, ProRealTime, TradingView, REST/Streaming API",
    pilotBridgeReadiness: "A – Native Ready",
    insightPotential: "Large, diverse CFD user base; high analytical coverage potential",
  },
  {
    id: "cmc-markets",
    broker: "CMC Markets NZ",
    connectivity: "MT4 + NextGen + TradingView",
    pilotBridgeReadiness: "B – Add-On Possible",
    insightPotential: "Significant market presence; proprietary stack limits real-time feed",
  },
  {
    id: "thinkmarkets",
    broker: "ThinkMarkets NZ",
    connectivity: "MT4/MT5, TradingView",
    pilotBridgeReadiness: "A – Native Ready",
    insightPotential: "TV-centric cluster lends itself to influence-pattern analysis",
  },
  {
    id: "axi",
    broker: "Axi (AxiCorp)",
    connectivity: "MT4/MT5, ZuluTrade, Myfxbook",
    pilotBridgeReadiness: "A – Native Ready",
    insightPotential: "EA/automation-heavy flows ideal for behavioural scoring",
  },
  {
    id: "zero-markets",
    broker: "Zero Markets",
    connectivity: "MT4/MT5",
    pilotBridgeReadiness: "A – Native Ready",
    insightPotential: "High-velocity offshore-style retail flow profile",
  },
  {
    id: "pfd",
    broker: "PFD",
    connectivity: "MT4 + FIX API",
    pilotBridgeReadiness: "A – Native Ready",
    insightPotential: "Sophisticated algotrading signals useful for regulator insights",
  },
  {
    id: "plus500",
    broker: "Plus500",
    connectivity: "Proprietary-only",
    pilotBridgeReadiness: "C – Limited",
    insightPotential: "No real-time trade stream or bridge capability",
  },
];

// Readiness tier configuration
export const READINESS_TIERS: Record<PilotBridgeReadiness, { label: string; color: string; bgColor: string; description: string }> = {
  "A – Native Ready": {
    label: "A",
    color: "#53f6c5",
    bgColor: "rgba(83, 246, 197, 0.15)",
    description: "Platform supports native integration with PilotBridge via standard protocols",
  },
  "B – Add-On Possible": {
    label: "B",
    color: "#fbbf24",
    bgColor: "rgba(251, 191, 36, 0.15)",
    description: "Integration possible with additional development or third-party connectors",
  },
  "C – Limited": {
    label: "C",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.15)",
    description: "Proprietary platform with limited or no integration pathway",
  },
};

// Summary statistics
export const CONNECTIVITY_SUMMARY = {
  totalBrokers: NZ_BROKER_CONNECTIVITY.length,
  tierA: NZ_BROKER_CONNECTIVITY.filter((b) => b.pilotBridgeReadiness === "A – Native Ready").length,
  tierB: NZ_BROKER_CONNECTIVITY.filter((b) => b.pilotBridgeReadiness === "B – Add-On Possible").length,
  tierC: NZ_BROKER_CONNECTIVITY.filter((b) => b.pilotBridgeReadiness === "C – Limited").length,
};
