// Retail Harm Index (RHI) - Composite indicator of NZ retail trading harm
// Scale: 0-1000 (0 = no harm, 1000 = extreme harm)
// All data is synthetic for FMA SupTech demonstration purposes

// Seeded random number generator for deterministic values (prevents hydration mismatch)
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// RHI Thresholds
export const RHI_THRESHOLDS = {
  LOW: { min: 0, max: 299, label: "Low", color: "#53f6c5" },
  MEDIUM: { min: 300, max: 599, label: "Medium", color: "#fbbf24" },
  HIGH: { min: 600, max: 799, label: "High", color: "#f97316" },
  CRITICAL: { min: 800, max: 1000, label: "Critical", color: "#ef4444" },
} as const;

export type RHIBand = keyof typeof RHI_THRESHOLDS;

// Input metrics for RHI calculation
export interface RHIInputMetrics {
  avgLeverage: number; // Average leverage level (e.g., 52 for 1:52)
  highHarmPilotScorePct: number; // % of traders with PilotScore 0-400 (scaled to 0-40 in our 0-100 system)
  medianTimeToFailure: number; // Days until median account failure
  herdingScore: number; // Herding/synchronization score (0-1000)
  stopLossUsageRate: number; // % of traders who use stop-losses consistently
  volatilityExposurePct: number; // % of traders with high volatility exposure
  offshoreExposurePct: number; // % of traders using offshore/unregulated platforms
}

// Default current synthetic metrics
export const CURRENT_RHI_METRICS: RHIInputMetrics = {
  avgLeverage: 52,
  highHarmPilotScorePct: 37.5, // ~37.5% in 0-40 PilotScore range
  medianTimeToFailure: 28, // Days
  herdingScore: 580, // Moderate-high herding
  stopLossUsageRate: 42.7, // % who always or usually use stop-loss
  volatilityExposurePct: 44.4, // % with high or very high exposure
  offshoreExposurePct: 65.4, // % on offshore/unregulated platforms
};

/**
 * Calculate the Retail Harm Index from input metrics
 * Each component contributes to the final 0-1000 score
 */
export function calculateRetailHarmIndex(metrics: RHIInputMetrics): number {
  // Weight factors for each component (sum to 1.0)
  const weights = {
    leverage: 0.15,
    pilotScore: 0.20,
    timeToFailure: 0.15,
    herding: 0.15,
    stopLoss: 0.15,
    volatility: 0.10,
    offshore: 0.10,
  };

  // Normalize each metric to 0-1000 scale where higher = more harm

  // Leverage: 1:10 = 0 harm, 1:200+ = 1000 harm
  const leverageScore = Math.min(1000, Math.max(0, ((metrics.avgLeverage - 10) / 190) * 1000));

  // High-harm PilotScore %: 0% = 0 harm, 100% = 1000 harm
  const pilotScoreScore = Math.min(1000, Math.max(0, metrics.highHarmPilotScorePct * 10));

  // Time-to-failure: 180 days = 0 harm, 7 days = 1000 harm (inverted)
  const ttfScore = Math.min(1000, Math.max(0, ((180 - metrics.medianTimeToFailure) / 173) * 1000));

  // Herding score: direct pass-through (already 0-1000)
  const herdingScore = Math.min(1000, Math.max(0, metrics.herdingScore));

  // Stop-loss usage: 100% = 0 harm, 0% = 1000 harm (inverted)
  const stopLossScore = Math.min(1000, Math.max(0, (100 - metrics.stopLossUsageRate) * 10));

  // Volatility exposure: 0% high exposure = 0 harm, 100% = 1000 harm
  const volatilityScore = Math.min(1000, Math.max(0, metrics.volatilityExposurePct * 10));

  // Offshore exposure: 0% = 0 harm, 100% = 1000 harm
  const offshoreScore = Math.min(1000, Math.max(0, metrics.offshoreExposurePct * 10));

  // Calculate weighted sum
  const rhi = Math.round(
    leverageScore * weights.leverage +
    pilotScoreScore * weights.pilotScore +
    ttfScore * weights.timeToFailure +
    herdingScore * weights.herding +
    stopLossScore * weights.stopLoss +
    volatilityScore * weights.volatility +
    offshoreScore * weights.offshore
  );

  return Math.min(1000, Math.max(0, rhi));
}

/**
 * Get the harm band for a given RHI score
 */
export function getRHIBand(score: number): { band: RHIBand; label: string; color: string } {
  if (score >= RHI_THRESHOLDS.CRITICAL.min) {
    return { band: "CRITICAL", ...RHI_THRESHOLDS.CRITICAL };
  }
  if (score >= RHI_THRESHOLDS.HIGH.min) {
    return { band: "HIGH", ...RHI_THRESHOLDS.HIGH };
  }
  if (score >= RHI_THRESHOLDS.MEDIUM.min) {
    return { band: "MEDIUM", ...RHI_THRESHOLDS.MEDIUM };
  }
  return { band: "LOW", ...RHI_THRESHOLDS.LOW };
}

// Current RHI score (calculated from current metrics)
export const CURRENT_RHI = calculateRetailHarmIndex(CURRENT_RHI_METRICS);
export const CURRENT_RHI_BAND = getRHIBand(CURRENT_RHI);

// RHI time series data point
export interface RHIDataPoint {
  date: string;
  rhi: number;
  band: RHIBand;
}

/**
 * Generate synthetic RHI time series with realistic variations
 * Includes volatility spikes around major market events
 */
export function generateRHITimeSeries(days: number = 90): RHIDataPoint[] {
  const data: RHIDataPoint[] = [];
  const baseRHI = 620; // Base level
  const today = new Date();

  // Define some synthetic "volatility events" that cause RHI spikes
  const volatilityEvents = [
    { daysAgo: 75, spike: 120, decay: 8 }, // Major event 75 days ago
    { daysAgo: 52, spike: 85, decay: 6 }, // Moderate event
    { daysAgo: 35, spike: 150, decay: 10 }, // Large spike
    { daysAgo: 18, spike: 60, decay: 5 }, // Recent smaller event
    { daysAgo: 7, spike: 95, decay: 7 }, // Very recent event
  ];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Start with base + gradual trend upward over time (harm increasing)
    let rhi = baseRHI + ((days - i) / days) * 40;

    // Add volatility event effects
    for (const event of volatilityEvents) {
      const daysSinceEvent = event.daysAgo - i;
      if (daysSinceEvent >= 0 && daysSinceEvent < event.decay * 3) {
        // Exponential decay of spike
        const decay = Math.exp(-daysSinceEvent / event.decay);
        rhi += event.spike * decay;
      }
    }

    // Add deterministic noise based on day index
    rhi += (seededRandom(i * 7 + 42) - 0.5) * 30;

    // Clamp to valid range
    rhi = Math.min(1000, Math.max(0, Math.round(rhi)));

    const { band } = getRHIBand(rhi);

    data.push({
      date: date.toISOString().split("T")[0],
      rhi,
      band,
    });
  }

  return data;
}

// Pre-generated 90-day time series
export const RHI_TIME_SERIES = generateRHITimeSeries(90);

// Latest 30 days for trend chart
export const RHI_TREND_30D = RHI_TIME_SERIES.slice(-30);

// Calculate delta from 30 days ago
export const RHI_30D_AGO = RHI_TIME_SERIES[RHI_TIME_SERIES.length - 31]?.rhi ?? CURRENT_RHI;
export const RHI_DELTA_30D = CURRENT_RHI - RHI_30D_AGO;
export const RHI_DELTA_30D_PCT = ((RHI_DELTA_30D / RHI_30D_AGO) * 100).toFixed(1);

// Statistics
export const RHI_90D_HIGH = Math.max(...RHI_TIME_SERIES.map((d) => d.rhi));
export const RHI_90D_LOW = Math.min(...RHI_TIME_SERIES.map((d) => d.rhi));
export const RHI_90D_AVG = Math.round(
  RHI_TIME_SERIES.reduce((sum, d) => sum + d.rhi, 0) / RHI_TIME_SERIES.length
);

// Days in critical/high zone
export const DAYS_IN_HIGH_ZONE = RHI_TIME_SERIES.filter(
  (d) => d.band === "HIGH" || d.band === "CRITICAL"
).length;

// =============================================================================
// RISK FACTOR DECOMPOSITION
// =============================================================================

// Risk factor definition with metadata
export interface RiskFactor {
  id: string;
  name: string;
  description: string;
  weight: number; // Weight in RHI calculation (0-1, sum to 1.0)
  rawScore: number; // Raw score before weighting (0-1000)
  contribution: number; // Weighted contribution to RHI (0-1000 scaled)
  percentOfTotal: number; // Percentage of total RHI
  color: string;
  metric: string; // Description of underlying metric
  currentValue: string; // Current synthetic value display
}

// Factor weight configuration (must sum to 1.0)
export const RISK_FACTOR_WEIGHTS = {
  leverageMisuse: 0.18,
  earlyFailure: 0.17,
  herding: 0.16,
  lowStopLoss: 0.15,
  volatilityChasing: 0.14,
  blowupFrequency: 0.12,
  offshoreLeakage: 0.08,
} as const;

// Factor colors for visualization
const FACTOR_COLORS = {
  leverageMisuse: "#ef4444",
  earlyFailure: "#f97316",
  herding: "#fbbf24",
  lowStopLoss: "#a78bfa",
  volatilityChasing: "#6ea8ff",
  blowupFrequency: "#f87171",
  offshoreLeakage: "#fb923c",
};

// Synthetic factor input values (these would come from real data in production)
export interface RiskFactorInputs {
  avgLeverage: number;
  highLeveragePct: number;
  medianTimeToFailure: number;
  earlyLossPct: number;
  herdingIntensity: number;
  clusterEventCount: number;
  stopLossAdoptionRate: number;
  noStopLossPct: number;
  volatilityExposurePct: number;
  volatilityReactionScore: number;
  repeatBlowupPct: number;
  avgBlowupsPerTrader: number;
  offshoreExposurePct: number;
  propFirmPct: number;
}

// Current synthetic factor inputs
export const CURRENT_FACTOR_INPUTS: RiskFactorInputs = {
  avgLeverage: 52,
  highLeveragePct: 28.2, // % using 1:100+
  medianTimeToFailure: 28,
  earlyLossPct: 55, // % failing in 30 days
  herdingIntensity: 580, // 0-1000 scale
  clusterEventCount: 16, // Detected cluster events
  stopLossAdoptionRate: 42.7,
  noStopLossPct: 27.2,
  volatilityExposurePct: 44.4,
  volatilityReactionScore: 620, // 0-1000 scale
  repeatBlowupPct: 42, // % with 2+ blowups
  avgBlowupsPerTrader: 2.9,
  offshoreExposurePct: 65.4,
  propFirmPct: 34.2,
};

/**
 * Calculate individual risk factor scores and contributions
 */
export function calculateRiskFactorDecomposition(
  inputs: RiskFactorInputs = CURRENT_FACTOR_INPUTS
): RiskFactor[] {
  // Calculate raw scores for each factor (0-1000 scale, higher = more harm)
  
  // Leverage Misuse: combines avg leverage and high leverage %
  const leverageRaw = Math.min(1000, Math.max(0,
    (((inputs.avgLeverage - 10) / 190) * 500) + (inputs.highLeveragePct * 17.7)
  ));

  // Early Time-to-Failure: faster failure = higher harm
  const earlyFailureRaw = Math.min(1000, Math.max(0,
    (((180 - inputs.medianTimeToFailure) / 173) * 600) + (inputs.earlyLossPct * 4)
  ));

  // Herding/Synchronisation: cluster intensity and event count
  const herdingRaw = Math.min(1000, Math.max(0,
    (inputs.herdingIntensity * 0.7) + (inputs.clusterEventCount * 18)
  ));

  // Low Stop-Loss Usage: inverted - lower usage = higher harm
  const stopLossRaw = Math.min(1000, Math.max(0,
    ((100 - inputs.stopLossAdoptionRate) * 8) + (inputs.noStopLossPct * 8)
  ));

  // Volatility Chasing: exposure + reaction score
  const volatilityRaw = Math.min(1000, Math.max(0,
    (inputs.volatilityExposurePct * 8) + (inputs.volatilityReactionScore * 0.35)
  ));

  // Account Blow-up Frequency
  const blowupRaw = Math.min(1000, Math.max(0,
    (inputs.repeatBlowupPct * 15) + (inputs.avgBlowupsPerTrader * 100)
  ));

  // Offshore Leakage
  const offshoreRaw = Math.min(1000, Math.max(0,
    (inputs.offshoreExposurePct * 10) + (inputs.propFirmPct * 8)
  ));

  // Calculate weighted contributions
  const factors: Omit<RiskFactor, "percentOfTotal">[] = [
    {
      id: "leverageMisuse",
      name: "Leverage Misuse",
      description: "Excessive use of leverage amplifies losses and increases account depletion risk",
      weight: RISK_FACTOR_WEIGHTS.leverageMisuse,
      rawScore: Math.round(leverageRaw),
      contribution: Math.round(leverageRaw * RISK_FACTOR_WEIGHTS.leverageMisuse),
      color: FACTOR_COLORS.leverageMisuse,
      metric: "Average leverage and % using 1:100+",
      currentValue: `1:${inputs.avgLeverage} avg · ${inputs.highLeveragePct}% high leverage`,
    },
    {
      id: "earlyFailure",
      name: "Early Time-to-Failure",
      description: "Rapid account depletion indicates poor preparation and high-risk trading",
      weight: RISK_FACTOR_WEIGHTS.earlyFailure,
      rawScore: Math.round(earlyFailureRaw),
      contribution: Math.round(earlyFailureRaw * RISK_FACTOR_WEIGHTS.earlyFailure),
      color: FACTOR_COLORS.earlyFailure,
      metric: "Median days to failure and early loss concentration",
      currentValue: `${inputs.medianTimeToFailure}d median · ${inputs.earlyLossPct}% fail in 30d`,
    },
    {
      id: "herding",
      name: "Herding / Synchronisation",
      description: "Coordinated trading behaviour suggests external influence and reduced independent decision-making",
      weight: RISK_FACTOR_WEIGHTS.herding,
      rawScore: Math.round(herdingRaw),
      contribution: Math.round(herdingRaw * RISK_FACTOR_WEIGHTS.herding),
      color: FACTOR_COLORS.herding,
      metric: "Cluster intensity and detected synchronised events",
      currentValue: `${inputs.herdingIntensity}/1000 intensity · ${inputs.clusterEventCount} events`,
    },
    {
      id: "lowStopLoss",
      name: "Low Stop-Loss Usage",
      description: "Failure to use basic risk controls exposes traders to catastrophic losses",
      weight: RISK_FACTOR_WEIGHTS.lowStopLoss,
      rawScore: Math.round(stopLossRaw),
      contribution: Math.round(stopLossRaw * RISK_FACTOR_WEIGHTS.lowStopLoss),
      color: FACTOR_COLORS.lowStopLoss,
      metric: "Stop-loss adoption rate and % never using",
      currentValue: `${inputs.stopLossAdoptionRate}% adopt · ${inputs.noStopLossPct}% never use`,
    },
    {
      id: "volatilityChasing",
      name: "Volatility Chasing",
      description: "Trading during high volatility events without proper risk management",
      weight: RISK_FACTOR_WEIGHTS.volatilityChasing,
      rawScore: Math.round(volatilityRaw),
      contribution: Math.round(volatilityRaw * RISK_FACTOR_WEIGHTS.volatilityChasing),
      color: FACTOR_COLORS.volatilityChasing,
      metric: "Volatility exposure and event reaction score",
      currentValue: `${inputs.volatilityExposurePct}% high exposure · ${inputs.volatilityReactionScore}/1000`,
    },
    {
      id: "blowupFrequency",
      name: "Account Blow-up Frequency",
      description: "Repeated account failures indicate persistent harmful trading patterns",
      weight: RISK_FACTOR_WEIGHTS.blowupFrequency,
      rawScore: Math.round(blowupRaw),
      contribution: Math.round(blowupRaw * RISK_FACTOR_WEIGHTS.blowupFrequency),
      color: FACTOR_COLORS.blowupFrequency,
      metric: "% with repeat blow-ups and average per trader",
      currentValue: `${inputs.repeatBlowupPct}% repeat · ${inputs.avgBlowupsPerTrader} avg`,
    },
    {
      id: "offshoreLeakage",
      name: "Offshore Leakage",
      description: "Trading on unregulated offshore platforms reduces oversight and protection",
      weight: RISK_FACTOR_WEIGHTS.offshoreLeakage,
      rawScore: Math.round(offshoreRaw),
      contribution: Math.round(offshoreRaw * RISK_FACTOR_WEIGHTS.offshoreLeakage),
      color: FACTOR_COLORS.offshoreLeakage,
      metric: "Offshore platform exposure and prop firm usage",
      currentValue: `${inputs.offshoreExposurePct}% offshore · ${inputs.propFirmPct}% prop firms`,
    },
  ];

  // Calculate total contribution for percentage calculation
  const totalContribution = factors.reduce((sum, f) => sum + f.contribution, 0);

  // Add percentage of total to each factor
  const factorsWithPercent: RiskFactor[] = factors.map((f) => ({
    ...f,
    percentOfTotal: totalContribution > 0 
      ? Math.round((f.contribution / totalContribution) * 100) 
      : 0,
  }));

  // Sort by contribution (highest first)
  return factorsWithPercent.sort((a, b) => b.contribution - a.contribution);
}

// Pre-calculated decomposition for current state
export const CURRENT_RISK_FACTORS = calculateRiskFactorDecomposition();

// Top 3 drivers for summary
export const TOP_3_DRIVERS = CURRENT_RISK_FACTORS.slice(0, 3);

// Total RHI from decomposition (should match CURRENT_RHI)
export const RHI_FROM_DECOMPOSITION = CURRENT_RISK_FACTORS.reduce(
  (sum, f) => sum + f.contribution,
  0
);

/**
 * Get a text summary of top drivers
 */
export function getTopDriversSummary(count: number = 3): string {
  const topFactors = CURRENT_RISK_FACTORS.slice(0, count);
  const parts = topFactors.map((f) => `${f.name} (${f.percentOfTotal}%)`);
  return parts.join(", ");
}
