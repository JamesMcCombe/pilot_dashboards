export type RiskFlag = "none" | "highLeverage" | "oversized" | "slippage";

export interface NavigatorTrendPoint {
  day: string;
  value: number;
}

export interface NavigatorCopierStats {
  registered: number;
  firstCopy: number;
  active: number;
  retained30d: number;
  conversionRegisteredToFirstCopy: number;
  conversionFirstCopyToActive: number;
  conversionActiveToRetained30d: number;
}

export interface NavigatorEconomics {
  brokerRevenue30d: number;
  navigatorRevenue30d: number;
  growthRate30d: number;
  churnRate30d: number;
  avgCopierLifetimeDays: number;
  avgCopierRevenue: number;
  avgCopierProfit: number;
}

export interface Navigator {
  id: string;
  name: string;
  pilotScore: number;
  sharpe: number;
  winRate: number;
  followers: number;
  groupVolume: number;
  brokerRevenueShare: number;
  trend: NavigatorTrendPoint[];
  valueScore?: number;
  valueTier?: "high" | "medium" | "watch";
  brokerValue?: {
    dailyRevenue: number;
    monthlyRevenue: number;
    revenueSharePct: number;
    copiedVolumeDaily: number;
    copiedVolumeMonthly: number;
    copiers: number;
  };
  revenueTrend?: number[];
  copierStats?: NavigatorCopierStats;
  navigatorEconomics?: NavigatorEconomics;
  totalCopiers?: number;
  newCopiers30d?: number;
  lostCopiers30d?: number;
  retention30d?: number;
}

export interface Pilot {
  id: string;
  name: string;
  pilotScore: number;
  copiedVolume: number;
  tradesCopied: number;
  profit: number;
  brokerRevenueShare: number;
  navigatorIds: string[];
  valueScore?: number;
  valueTier?: "high" | "medium" | "watch";
  brokerValue?: {
    dailyRevenue: number;
    monthlyRevenue: number;
    revenueSharePct: number;
    copiedVolumeDaily: number;
    copiedVolumeMonthly: number;
    copiers: number;
  };
  revenueTrend?: number[];
  pilotEconomics?: PilotEconomics;
}

export interface Group {
  id: string;
  name: string;
  navigatorId: string;
  pilots: string[];
  groupScore: number;
  avgPilotScore: number;
  totalVolume: number;
  avgProfitPerPilot: number;
  brokerRevenueShare: number;
  consistencyScore: number;
  groupEconomics?: GroupEconomics;
}

export interface GroupEconomics {
  brokerRevenue30d: number;
  growthRate30d: number;
  churnRate30d: number;
  retention30d: number;
  copiers: number;
  newCopiers30d: number;
}

export interface PilotEconomics {
  daysActive: number;
  copierProfit: number;
  copierRevenueContributed: number;
  copyFrequency: number;
  lifetimeValue: number;
}

export interface Trade {
  id: string;
  instrument: string;
  side: "Buy" | "Sell";
  notional: number;
  profit: number;
  entryPrice: number;
  exitPrice: number;
  entryTime: string;
  exitTime: string;
  navigatorId: string;
  pilotId: string;
  groupId?: string;
  riskFlag?: RiskFlag;
}

export interface PilotScoreBreakdown {
  category: string;
  score: number;
  description?: string;
}

export interface ComplianceAlert {
  id: string;
  severity: "low" | "medium" | "high";
  type: string;
  description: string;
  navigatorId?: string;
  pilotId?: string;
  tradeId?: string;
  createdAt: string;
}

export interface MetricSparkline {
  value: number;
  trend: number[];
  label?: string;
  deltaAbs?: number;
  deltaPct?: number;
}

export interface TopNavigatorSparkline extends MetricSparkline {
  navigatorId: string;
  navigatorName: string;
}

export interface DashboardMetricsSnapshot {
  brokerRevenueToday: MetricSparkline;
  volumeLiftPercent: MetricSparkline;
  activeCopiers: MetricSparkline;
  topNavigatorRevenueToday: TopNavigatorSparkline;
  totalBlueprintSales: MetricSparkline;
}
