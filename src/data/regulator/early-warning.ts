// =============================================================================
// REGULATORY EARLY WARNING INDICATORS
// =============================================================================
// Computes status levels for key harm indicators based on synthetic metrics.
// Provides at-a-glance view for supervisors with colour-coded risk levels.

import { CURRENT_RHI, RHI_DELTA_30D } from "./retail-harm-index";
import { CURRENT_HERDING_RESULT } from "./herding-score";
import { EVENT_SUMMARY } from "./key-events";

export type IndicatorStatus = "low" | "medium" | "high" | "critical";

export interface EarlyWarningIndicator {
  id: string;
  title: string;
  subtitle: string;
  status: IndicatorStatus;
  value: number;
  unit: string;
  threshold: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  trend?: "up" | "down" | "stable";
  lastUpdated: string;
}

// Status configuration
export const STATUS_CONFIG: Record<IndicatorStatus, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  low: {
    label: "Low",
    color: "#53f6c5",
    bgColor: "rgba(83, 246, 197, 0.15)",
    borderColor: "rgba(83, 246, 197, 0.4)",
  },
  medium: {
    label: "Medium",
    color: "#fbbf24",
    bgColor: "rgba(251, 191, 36, 0.15)",
    borderColor: "rgba(251, 191, 36, 0.4)",
  },
  high: {
    label: "High",
    color: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.15)",
    borderColor: "rgba(249, 115, 22, 0.4)",
  },
  critical: {
    label: "Critical",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
};

// Helper to determine status from value and thresholds
function computeStatus(
  value: number,
  thresholds: { low: number; medium: number; high: number; critical: number }
): IndicatorStatus {
  if (value >= thresholds.critical) return "critical";
  if (value >= thresholds.high) return "high";
  if (value >= thresholds.medium) return "medium";
  return "low";
}

// =============================================================================
// INDICATOR DEFINITIONS
// =============================================================================

// 1. Retail Harm Index Level
const rhiValue = CURRENT_RHI;
const rhiIndicator: EarlyWarningIndicator = {
  id: "rhi-level",
  title: "Retail Harm Index",
  subtitle: "Composite harm score across all factors",
  value: rhiValue,
  unit: "/ 1000",
  threshold: { low: 0, medium: 400, high: 550, critical: 700 },
  status: computeStatus(rhiValue, { low: 0, medium: 400, high: 550, critical: 700 }),
  trend: RHI_DELTA_30D > 0 ? "up" : RHI_DELTA_30D < 0 ? "down" : "stable",
  lastUpdated: new Date().toISOString(),
};

// 2. Offshore Leakage Level
const offshoreValue = 67.2; // Percentage of trading through offshore platforms
const offshoreIndicator: EarlyWarningIndicator = {
  id: "offshore-leakage",
  title: "Offshore Leakage",
  subtitle: "Trading volume via offshore platforms",
  value: offshoreValue,
  unit: "%",
  threshold: { low: 0, medium: 40, high: 55, critical: 70 },
  status: computeStatus(offshoreValue, { low: 0, medium: 40, high: 55, critical: 70 }),
  trend: "up",
  lastUpdated: new Date().toISOString(),
};

// 3. Herding Score Level
const herdingValue = CURRENT_HERDING_RESULT.score;
const herdingIndicator: EarlyWarningIndicator = {
  id: "herding-score",
  title: "Herding Score",
  subtitle: "Trading synchronisation intensity",
  value: herdingValue,
  unit: "/ 1000",
  threshold: { low: 0, medium: 350, high: 500, critical: 650 },
  status: computeStatus(herdingValue, { low: 0, medium: 350, high: 500, critical: 650 }),
  trend: "stable", // Would be computed from time series in production
  lastUpdated: new Date().toISOString(),
};

// 4. Early-Failure Concentration
const earlyFailureValue = 31.4; // % of new traders failing within 30 days
const earlyFailureIndicator: EarlyWarningIndicator = {
  id: "early-failure",
  title: "Early Failure Rate",
  subtitle: "New traders failing within 30 days",
  value: earlyFailureValue,
  unit: "%",
  threshold: { low: 0, medium: 20, high: 30, critical: 45 },
  status: computeStatus(earlyFailureValue, { low: 0, medium: 20, high: 30, critical: 45 }),
  trend: "stable",
  lastUpdated: new Date().toISOString(),
};

// 5. Broker Risk Dispersion
const brokerRiskValue = 78; // Max broker risk score (out of 1000) indicating concentration
const brokerRiskIndicator: EarlyWarningIndicator = {
  id: "broker-risk",
  title: "Broker Risk Dispersion",
  subtitle: "Peak individual broker risk score",
  value: brokerRiskValue,
  unit: "/ 100",
  threshold: { low: 0, medium: 50, high: 70, critical: 85 },
  status: computeStatus(brokerRiskValue, { low: 0, medium: 50, high: 70, critical: 85 }),
  trend: "up",
  lastUpdated: new Date().toISOString(),
};

// 6. Volatility Shock Activity
const volatilityValue = EVENT_SUMMARY.eventsByCategory["volatility"] || 0;
const volatilityIndicator: EarlyWarningIndicator = {
  id: "volatility-shocks",
  title: "Volatility Shocks",
  subtitle: "High-impact events in last 6 months",
  value: volatilityValue,
  unit: "events",
  threshold: { low: 0, medium: 3, high: 5, critical: 8 },
  status: computeStatus(volatilityValue, { low: 0, medium: 3, high: 5, critical: 8 }),
  trend: "stable",
  lastUpdated: new Date().toISOString(),
};

// =============================================================================
// EXPORTS
// =============================================================================

export const EARLY_WARNING_INDICATORS: EarlyWarningIndicator[] = [
  rhiIndicator,
  offshoreIndicator,
  herdingIndicator,
  earlyFailureIndicator,
  brokerRiskIndicator,
  volatilityIndicator,
];

// Summary statistics
export const EWI_SUMMARY = {
  totalIndicators: EARLY_WARNING_INDICATORS.length,
  criticalCount: EARLY_WARNING_INDICATORS.filter((i) => i.status === "critical").length,
  highCount: EARLY_WARNING_INDICATORS.filter((i) => i.status === "high").length,
  mediumCount: EARLY_WARNING_INDICATORS.filter((i) => i.status === "medium").length,
  lowCount: EARLY_WARNING_INDICATORS.filter((i) => i.status === "low").length,
  overallStatus: (() => {
    const critical = EARLY_WARNING_INDICATORS.filter((i) => i.status === "critical").length;
    const high = EARLY_WARNING_INDICATORS.filter((i) => i.status === "high").length;
    if (critical >= 2) return "critical" as IndicatorStatus;
    if (critical >= 1 || high >= 3) return "high" as IndicatorStatus;
    if (high >= 1) return "medium" as IndicatorStatus;
    return "low" as IndicatorStatus;
  })(),
};
