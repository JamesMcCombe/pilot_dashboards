// =============================================================================
// NZ BROKER EXPOSURE DATA
// =============================================================================
// Synthetic dataset for comparing NZ-licensed brokers on risk metrics.
// All data is fictional and for demonstration purposes only.

export interface NZBrokerData {
  id: string;
  name: string;
  // Risk metrics
  pctHighRiskUsers: number;         // % of users with PilotScore < 400
  avgPilotScore: number;            // Average PilotScore (0-1000)
  pctOffshoreLinkedBehaviour: number; // % showing offshore platform activity
  avgLeverage: number;              // Average leverage used
  // Additional metrics
  totalActiveTraders: number;
  avgAccountAge: number;            // Days
  pctUsingStopLoss: number;         // % with stop-loss orders
  avgTimeToFirstLoss: number;       // Days until first significant loss
  monthlyChurnRate: number;         // % monthly account closures
  avgLossPerTrader: number;         // NZD
  // Computed risk score (weighted composite)
  brokerRiskScore: number;          // 0-1000 scale
  riskBand: "low" | "medium" | "high" | "critical";
  // Trend data (last 6 months)
  riskTrend: number[];
}

export interface BrokerMetricDefinition {
  key: keyof NZBrokerData;
  label: string;
  description: string;
  format: (value: number) => string;
  higherIsBetter: boolean;
  weight: number; // For risk score calculation
}

// Metric definitions for table columns
export const BROKER_METRICS: BrokerMetricDefinition[] = [
  {
    key: "pctHighRiskUsers",
    label: "High-Risk Users",
    description: "Percentage of users with PilotScore below 400, indicating elevated harm risk",
    format: (v) => `${v.toFixed(1)}%`,
    higherIsBetter: false,
    weight: 0.25,
  },
  {
    key: "avgPilotScore",
    label: "Avg PilotScore",
    description: "Average PilotScore across all active traders (0-1000, higher = healthier)",
    format: (v) => v.toFixed(0),
    higherIsBetter: true,
    weight: 0.20,
  },
  {
    key: "pctOffshoreLinkedBehaviour",
    label: "Offshore-Linked",
    description: "Percentage of traders showing activity patterns linked to offshore platforms",
    format: (v) => `${v.toFixed(1)}%`,
    higherIsBetter: false,
    weight: 0.20,
  },
  {
    key: "avgLeverage",
    label: "Avg Leverage",
    description: "Average leverage ratio used across all positions",
    format: (v) => `${v.toFixed(1)}x`,
    higherIsBetter: false,
    weight: 0.15,
  },
  {
    key: "pctUsingStopLoss",
    label: "Stop-Loss Usage",
    description: "Percentage of traders regularly using stop-loss orders",
    format: (v) => `${v.toFixed(0)}%`,
    higherIsBetter: true,
    weight: 0.10,
  },
  {
    key: "monthlyChurnRate",
    label: "Monthly Churn",
    description: "Percentage of accounts closed or abandoned each month",
    format: (v) => `${v.toFixed(1)}%`,
    higherIsBetter: false,
    weight: 0.10,
  },
];

// Risk band thresholds
export const BROKER_RISK_BANDS = {
  low: { min: 0, max: 299, label: "Low Risk", color: "#53f6c5" },
  medium: { min: 300, max: 499, label: "Medium Risk", color: "#fbbf24" },
  high: { min: 500, max: 699, label: "High Risk", color: "#f97316" },
  critical: { min: 700, max: 1000, label: "Critical Risk", color: "#ef4444" },
};

function getBrokerRiskBand(score: number): "low" | "medium" | "high" | "critical" {
  if (score >= 700) return "critical";
  if (score >= 500) return "high";
  if (score >= 300) return "medium";
  return "low";
}

// Calculate composite broker risk score
function calculateBrokerRiskScore(broker: Omit<NZBrokerData, "brokerRiskScore" | "riskBand">): number {
  // Normalize each metric to 0-1000 scale where higher = more risk
  const highRiskScore = (broker.pctHighRiskUsers / 50) * 1000; // 50% = max
  const pilotScoreRisk = ((1000 - broker.avgPilotScore) / 1000) * 1000; // Invert
  const offshoreScore = (broker.pctOffshoreLinkedBehaviour / 40) * 1000; // 40% = max
  const leverageScore = Math.min(1000, ((broker.avgLeverage - 2) / 8) * 1000); // 2x = min, 10x = max
  const stopLossRisk = ((100 - broker.pctUsingStopLoss) / 100) * 1000; // Invert
  const churnScore = (broker.monthlyChurnRate / 15) * 1000; // 15% = max
  
  // Weighted average
  const score = 
    highRiskScore * 0.25 +
    pilotScoreRisk * 0.20 +
    offshoreScore * 0.20 +
    leverageScore * 0.15 +
    stopLossRisk * 0.10 +
    churnScore * 0.10;
  
  return Math.round(Math.min(1000, Math.max(0, score)));
}

// Synthetic NZ broker data using real NZ-licensed broker names
// All metrics are SYNTHETIC and for demonstration purposes only
const rawBrokerData: Omit<NZBrokerData, "brokerRiskScore" | "riskBand">[] = [
  {
    id: "blackbull",
    name: "BlackBull Markets",
    pctHighRiskUsers: 16.8,
    avgPilotScore: 658,
    pctOffshoreLinkedBehaviour: 7.2,
    avgLeverage: 3.6,
    totalActiveTraders: 4850,
    avgAccountAge: 298,
    pctUsingStopLoss: 62,
    avgTimeToFirstLoss: 48,
    monthlyChurnRate: 3.8,
    avgLossPerTrader: 1680,
    riskTrend: [268, 275, 282, 278, 285, 292],
  },
  {
    id: "ig-markets",
    name: "IG Markets NZ",
    pctHighRiskUsers: 15.2,
    avgPilotScore: 672,
    pctOffshoreLinkedBehaviour: 5.8,
    avgLeverage: 3.2,
    totalActiveTraders: 5420,
    avgAccountAge: 356,
    pctUsingStopLoss: 68,
    avgTimeToFirstLoss: 56,
    monthlyChurnRate: 3.2,
    avgLossPerTrader: 1520,
    riskTrend: [242, 248, 255, 252, 248, 258],
  },
  {
    id: "cmc-markets",
    name: "CMC Markets NZ",
    pctHighRiskUsers: 17.4,
    avgPilotScore: 645,
    pctOffshoreLinkedBehaviour: 6.8,
    avgLeverage: 3.8,
    totalActiveTraders: 4680,
    avgAccountAge: 312,
    pctUsingStopLoss: 58,
    avgTimeToFirstLoss: 44,
    monthlyChurnRate: 4.1,
    avgLossPerTrader: 1780,
    riskTrend: [285, 292, 298, 305, 312, 318],
  },
  {
    id: "thinkmarkets",
    name: "ThinkMarkets NZ",
    pctHighRiskUsers: 19.2,
    avgPilotScore: 628,
    pctOffshoreLinkedBehaviour: 9.4,
    avgLeverage: 4.2,
    totalActiveTraders: 3250,
    avgAccountAge: 245,
    pctUsingStopLoss: 54,
    avgTimeToFirstLoss: 38,
    monthlyChurnRate: 4.8,
    avgLossPerTrader: 1920,
    riskTrend: [328, 342, 355, 362, 375, 385],
  },
  {
    id: "axi",
    name: "Axi (AxiCorp)",
    pctHighRiskUsers: 22.4,
    avgPilotScore: 598,
    pctOffshoreLinkedBehaviour: 12.6,
    avgLeverage: 4.8,
    totalActiveTraders: 2840,
    avgAccountAge: 198,
    pctUsingStopLoss: 48,
    avgTimeToFirstLoss: 32,
    monthlyChurnRate: 5.6,
    avgLossPerTrader: 2180,
    riskTrend: [385, 398, 412, 425, 438, 452],
  },
  {
    id: "zero-markets",
    name: "Zero Markets",
    pctHighRiskUsers: 28.6,
    avgPilotScore: 542,
    pctOffshoreLinkedBehaviour: 18.4,
    avgLeverage: 5.8,
    totalActiveTraders: 2180,
    avgAccountAge: 165,
    pctUsingStopLoss: 38,
    avgTimeToFirstLoss: 24,
    monthlyChurnRate: 7.2,
    avgLossPerTrader: 2680,
    riskTrend: [485, 512, 538, 562, 588, 612],
  },
  {
    id: "pfd",
    name: "PFD",
    pctHighRiskUsers: 12.8,
    avgPilotScore: 712,
    pctOffshoreLinkedBehaviour: 4.2,
    avgLeverage: 2.8,
    totalActiveTraders: 1850,
    avgAccountAge: 425,
    pctUsingStopLoss: 74,
    avgTimeToFirstLoss: 68,
    monthlyChurnRate: 2.4,
    avgLossPerTrader: 1280,
    riskTrend: [195, 202, 198, 205, 212, 218],
  },
  {
    id: "plus500",
    name: "Plus500",
    pctHighRiskUsers: 32.4,
    avgPilotScore: 498,
    pctOffshoreLinkedBehaviour: 24.8,
    avgLeverage: 6.2,
    totalActiveTraders: 4120,
    avgAccountAge: 142,
    pctUsingStopLoss: 32,
    avgTimeToFirstLoss: 18,
    monthlyChurnRate: 9.8,
    avgLossPerTrader: 3420,
    riskTrend: [598, 625, 652, 678, 705, 728],
  },
];

// Generate full broker data with computed scores
export const NZ_BROKERS: NZBrokerData[] = rawBrokerData.map((broker) => {
  const brokerRiskScore = calculateBrokerRiskScore(broker);
  return {
    ...broker,
    brokerRiskScore,
    riskBand: getBrokerRiskBand(brokerRiskScore),
  };
});

// Sort by risk score (highest first) for default display
export const NZ_BROKERS_BY_RISK = [...NZ_BROKERS].sort(
  (a, b) => b.brokerRiskScore - a.brokerRiskScore
);

// Industry averages for comparison
export const INDUSTRY_AVERAGES = {
  pctHighRiskUsers: NZ_BROKERS.reduce((sum, b) => sum + b.pctHighRiskUsers, 0) / NZ_BROKERS.length,
  avgPilotScore: NZ_BROKERS.reduce((sum, b) => sum + b.avgPilotScore, 0) / NZ_BROKERS.length,
  pctOffshoreLinkedBehaviour: NZ_BROKERS.reduce((sum, b) => sum + b.pctOffshoreLinkedBehaviour, 0) / NZ_BROKERS.length,
  avgLeverage: NZ_BROKERS.reduce((sum, b) => sum + b.avgLeverage, 0) / NZ_BROKERS.length,
  pctUsingStopLoss: NZ_BROKERS.reduce((sum, b) => sum + b.pctUsingStopLoss, 0) / NZ_BROKERS.length,
  monthlyChurnRate: NZ_BROKERS.reduce((sum, b) => sum + b.monthlyChurnRate, 0) / NZ_BROKERS.length,
  brokerRiskScore: NZ_BROKERS.reduce((sum, b) => sum + b.brokerRiskScore, 0) / NZ_BROKERS.length,
  totalTraders: NZ_BROKERS.reduce((sum, b) => sum + b.totalActiveTraders, 0),
};

// Chart data for grouped bar comparison
export const BROKER_COMPARISON_CHART_DATA = NZ_BROKERS.map((broker) => ({
  name: broker.name.split(" ").slice(0, 2).join(" "), // Shortened name
  fullName: broker.name,
  highRisk: broker.pctHighRiskUsers,
  offshore: broker.pctOffshoreLinkedBehaviour,
  leverage: broker.avgLeverage,
  pilotScore: broker.avgPilotScore,
  riskScore: broker.brokerRiskScore,
  riskBand: broker.riskBand,
}));

// Risk score chart data (for horizontal bar)
export const BROKER_RISK_CHART_DATA = NZ_BROKERS_BY_RISK.map((broker) => ({
  name: broker.name,
  shortName: broker.name.split(" ").slice(0, 2).join(" "),
  riskScore: broker.brokerRiskScore,
  riskBand: broker.riskBand,
  color: BROKER_RISK_BANDS[broker.riskBand].color,
}));
