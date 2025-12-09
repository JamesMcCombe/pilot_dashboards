// Regulator Mode Data Types
// All data is synthetic for FMA SupTech demonstration purposes

export interface PilotScoreBin {
  range: string;
  min: number;
  max: number;
  count: number;
  percentage: number;
}

export interface SurvivalDataPoint {
  day: number;
  nzSurvival: number;
  globalSurvival: number;
}

export interface BlowupPattern {
  traderId: string;
  blowupCount: number;
  avgDaysBetween: number;
  totalLoss: number;
  riskCategory: "extreme" | "high" | "moderate";
}

export interface TradingClusterEvent {
  traderId: string;
  timestamp: string;
  instrument: string;
  clusterId: string;
}

export interface HerdingCell {
  hour: number;
  dayOfWeek: number;
  intensity: number;
  traderCount: number;
}

export interface LossClusterCell {
  traderId: string;
  timeSlot: string;
  loss: number;
  isCoordinated: boolean;
}

export interface BrokerExposureData {
  category: "propFirm" | "offshoreBroker" | "unlicensed" | "regulated";
  name: string;
  percentage: number;
  traderCount: number;
  trend: number[];
  riskLevel: "high" | "medium" | "low";
}

export interface BrokerExposureTrend {
  month: string;
  propFirm: number;
  offshoreBroker: number;
  unlicensed: number;
  regulated: number;
}

export interface BehaviouralMetric {
  value: number;
  label: string;
  count: number;
  percentage: number;
}

export interface PlatformUsage {
  platform: "MT4" | "MT5" | "NinjaTrader" | "IBKR" | "Other";
  percentage: number;
  traderCount: number;
  avgPilotScore: number;
  riskProfile: "high" | "medium" | "low";
}

export interface RegulatorKPI {
  label: string;
  value: number;
  unit: string;
  trend: number[];
  delta?: number;
  deltaLabel?: string;
  severity?: "danger" | "warning" | "neutral" | "good";
}

export interface RiskFlag {
  id: string;
  type: string;
  description: string;
  severity: "high" | "medium" | "low";
  affectedTraders: number;
  detectedAt: string;
}

export interface VolatilityTrigger {
  timestamp: string;
  event: string;
  traderReactions: number;
  avgLoss: number;
  clusterSize: number;
}
