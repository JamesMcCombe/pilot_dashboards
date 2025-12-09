import type { BrokerExposureData, BrokerExposureTrend, RiskFlag } from "./types";

// Offshore broker exposure breakdown
export const brokerExposureData: BrokerExposureData[] = [
  {
    category: "propFirm",
    name: "Offshore Prop Firms",
    percentage: 34.2,
    traderCount: 594,
    trend: [28, 30, 31, 32, 33, 34, 34],
    riskLevel: "high",
  },
  {
    category: "offshoreBroker",
    name: "Offshore CFD Brokers",
    percentage: 22.8,
    traderCount: 396,
    trend: [25, 24, 24, 23, 23, 23, 23],
    riskLevel: "high",
  },
  {
    category: "unlicensed",
    name: "Unlicensed Platforms",
    percentage: 8.4,
    traderCount: 146,
    trend: [6, 7, 7, 8, 8, 8, 8],
    riskLevel: "high",
  },
  {
    category: "regulated",
    name: "NZ/AU Regulated Brokers",
    percentage: 34.6,
    traderCount: 601,
    trend: [41, 39, 38, 37, 36, 35, 35],
    riskLevel: "low",
  },
];

// Total offshore exposure (prop + offshore + unlicensed)
export const OFFSHORE_EXPOSURE_PCT = brokerExposureData
  .filter((d) => d.category !== "regulated")
  .reduce((sum, d) => sum + d.percentage, 0)
  .toFixed(1);

export const OFFSHORE_TRADER_COUNT = brokerExposureData
  .filter((d) => d.category !== "regulated")
  .reduce((sum, d) => sum + d.traderCount, 0);

// Monthly trend data
export const brokerExposureTrend: BrokerExposureTrend[] = [
  { month: "Jun 2024", propFirm: 26, offshoreBroker: 24, unlicensed: 5, regulated: 45 },
  { month: "Jul 2024", propFirm: 28, offshoreBroker: 24, unlicensed: 6, regulated: 42 },
  { month: "Aug 2024", propFirm: 30, offshoreBroker: 24, unlicensed: 6, regulated: 40 },
  { month: "Sep 2024", propFirm: 31, offshoreBroker: 23, unlicensed: 7, regulated: 39 },
  { month: "Oct 2024", propFirm: 33, offshoreBroker: 23, unlicensed: 7, regulated: 37 },
  { month: "Nov 2024", propFirm: 34, offshoreBroker: 23, unlicensed: 8, regulated: 35 },
];

// Prop firm specific data
export const propFirmBreakdown = [
  { name: "FTMO", percentage: 42, avgTimeToFail: 22 },
  { name: "MyForexFunds", percentage: 18, avgTimeToFail: 18 },
  { name: "The Funded Trader", percentage: 15, avgTimeToFail: 26 },
  { name: "True Forex Funds", percentage: 12, avgTimeToFail: 20 },
  { name: "Others", percentage: 13, avgTimeToFail: 24 },
];

// =============================================================================
// OFFSHORE LEAKAGE FLOW DATA
// =============================================================================

// Offshore destination categories with detailed metadata
export interface OffshoreDestination {
  id: string;
  name: string;
  shortName: string;
  percentage: number;
  traderCount: number;
  description: string;
  riskLevel: "critical" | "high" | "medium" | "low";
  color: string;
  examples: string[];
  avgLossPerTrader: number;
  growthRate: number; // % change over 6 months
}

export const offshoreLeakageDestinations: OffshoreDestination[] = [
  {
    id: "prop-firms",
    name: "Prop Trading Firms",
    shortName: "Prop Firms",
    percentage: 38,
    traderCount: 432,
    description: "Prop firm challenge accounts operating outside NZ's regulatory perimeter. Traders pay fees to attempt funded account challenges with high failure rates.",
    riskLevel: "critical",
    color: "#ef4444",
    examples: ["FTMO", "MyForexFunds", "The Funded Trader", "True Forex Funds"],
    avgLossPerTrader: 2840,
    growthRate: 34,
  },
  {
    id: "offshore-cfd",
    name: "Offshore CFD Brokers",
    shortName: "Offshore CFDs",
    percentage: 27,
    traderCount: 307,
    description: "Unregulated or loosely regulated CFD brokers based in jurisdictions with minimal oversight. Often offer extreme leverage and limited client protections.",
    riskLevel: "high",
    color: "#f97316",
    examples: ["Various Cyprus-based", "Vanuatu-licensed", "SVG-registered"],
    avgLossPerTrader: 3120,
    growthRate: 8,
  },
  {
    id: "unlicensed-fx",
    name: "Unlicensed FX/CFD Platforms",
    shortName: "Unlicensed FX",
    percentage: 16,
    traderCount: 182,
    description: "Completely unlicensed platforms with no regulatory oversight. High risk of fraud, manipulation, and inability to withdraw funds.",
    riskLevel: "critical",
    color: "#dc2626",
    examples: ["Various unregistered platforms", "Social media promoted schemes"],
    avgLossPerTrader: 4560,
    growthRate: 22,
  },
  {
    id: "crypto-derivatives",
    name: "Crypto Derivatives Platforms",
    shortName: "Crypto Derivs",
    percentage: 12,
    traderCount: 136,
    description: "Offshore cryptocurrency derivatives exchanges offering perpetual futures and options with extreme leverage (up to 125x).",
    riskLevel: "high",
    color: "#8b5cf6",
    examples: ["Binance Futures", "Bybit", "BitMEX", "OKX"],
    avgLossPerTrader: 2180,
    growthRate: 45,
  },
  {
    id: "other-unknown",
    name: "Other / Unknown",
    shortName: "Other",
    percentage: 7,
    traderCount: 80,
    description: "Unclassified offshore trading activity detected through behavioural patterns but not attributable to specific platform categories.",
    riskLevel: "medium",
    color: "#6b7280",
    examples: ["Unknown platforms", "Private dealing", "OTC arrangements"],
    avgLossPerTrader: 1890,
    growthRate: 5,
  },
];

// Total offshore leakage statistics
export const TOTAL_OFFSHORE_TRADERS = offshoreLeakageDestinations.reduce(
  (sum, d) => sum + d.traderCount,
  0
);

export const TOTAL_OFFSHORE_LOSSES = offshoreLeakageDestinations.reduce(
  (sum, d) => sum + d.traderCount * d.avgLossPerTrader,
  0
);

export const AVG_OFFSHORE_LOSS = Math.round(TOTAL_OFFSHORE_LOSSES / TOTAL_OFFSHORE_TRADERS);

// Flow data for Sankey-style visualization
export interface LeakageFlowNode {
  id: string;
  label: string;
  value: number;
}

export interface LeakageFlowLink {
  source: string;
  target: string;
  value: number;
  color: string;
}

export const leakageFlowNodes: LeakageFlowNode[] = [
  { id: "nz-traders", label: "NZ Retail Traders", value: 100 },
  ...offshoreLeakageDestinations.map((d) => ({
    id: d.id,
    label: d.shortName,
    value: d.percentage,
  })),
];

export const leakageFlowLinks: LeakageFlowLink[] = offshoreLeakageDestinations.map((d) => ({
  source: "nz-traders",
  target: d.id,
  value: d.percentage,
  color: d.color,
}));

// Risk flags
export const riskFlags: RiskFlag[] = [
  {
    id: "RF001",
    type: "Prop Firm Surge",
    description: "34% increase in NZ traders joining offshore prop firms in past 6 months",
    severity: "high",
    affectedTraders: 594,
    detectedAt: "2024-11-01T00:00:00Z",
  },
  {
    id: "RF002",
    type: "Unlicensed Platform Activity",
    description: "146 traders identified using unlicensed trading platforms",
    severity: "high",
    affectedTraders: 146,
    detectedAt: "2024-11-05T00:00:00Z",
  },
  {
    id: "RF003",
    type: "Rapid Account Cycling",
    description: "Pattern of rapid prop firm account failures and re-purchases detected",
    severity: "medium",
    affectedTraders: 87,
    detectedAt: "2024-11-08T00:00:00Z",
  },
  {
    id: "RF004",
    type: "High Leverage Cluster",
    description: "Coordinated high-leverage trading during volatility events",
    severity: "medium",
    affectedTraders: 124,
    detectedAt: "2024-11-10T00:00:00Z",
  },
  {
    id: "RF005",
    type: "Copy Trading Cascade",
    description: "Multiple traders following same offshore signal provider",
    severity: "low",
    affectedTraders: 56,
    detectedAt: "2024-11-12T00:00:00Z",
  },
];
