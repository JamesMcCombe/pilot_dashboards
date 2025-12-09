// =============================================================================
// POLICY SANDBOX MODEL
// =============================================================================
// A toy simulation model for demonstrating how policy interventions could
// affect retail harm indicators. This is NOT a calibrated model - it uses
// simplified formulas for illustration purposes only.
//
// DISCLAIMER: All calculations are synthetic and for demonstration only.
// Real policy impact would require rigorous empirical analysis.

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface PolicyLevers {
  // Maximum leverage cap (3x to 15x, baseline is 10x)
  maxLeverageCap: number;
  // Increase in stop-loss adoption (0% to 40%)
  stopLossAdoptionIncrease: number;
  // Reduction in herding through education (0% to 50%)
  herdingReductionPct: number;
}

export interface BaselineMetrics {
  rhi: number;
  medianTTF: number;
  pctHighRisk: number;
  herdingScore: number;
  avgLeverage: number;
  pctUsingStopLoss: number;
  survivalRate90Day: number;
  avgLossPerTrader: number;
}

export interface SimulatedMetrics extends BaselineMetrics {
  // Change indicators
  rhiChange: number;
  ttfChange: number;
  highRiskChange: number;
  herdingChange: number;
  leverageChange: number;
  stopLossChange: number;
  survivalChange: number;
  lossChange: number;
}

export interface PolicyImpact {
  lever: string;
  description: string;
  rhiImpact: number;
  ttfImpact: number;
  highRiskImpact: number;
  herdingImpact: number;
}

// -----------------------------------------------------------------------------
// BASELINE VALUES (Synthetic)
// -----------------------------------------------------------------------------

export const BASELINE_METRICS: BaselineMetrics = {
  rhi: 542,
  medianTTF: 38,
  pctHighRisk: 24.2,
  herdingScore: 485,
  avgLeverage: 5.4,
  pctUsingStopLoss: 42,
  survivalRate90Day: 48,
  avgLossPerTrader: 2180,
};

export const DEFAULT_POLICY_LEVERS: PolicyLevers = {
  maxLeverageCap: 10,
  stopLossAdoptionIncrease: 0,
  herdingReductionPct: 0,
};

// -----------------------------------------------------------------------------
// LEVER CONFIGURATIONS
// -----------------------------------------------------------------------------

export interface LeverConfig {
  id: keyof PolicyLevers;
  name: string;
  description: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  impactDescription: string;
}

export const LEVER_CONFIGS: LeverConfig[] = [
  {
    id: "maxLeverageCap",
    name: "Maximum Leverage Cap",
    description: "Set the maximum leverage ratio permitted for retail traders",
    unit: "x",
    min: 3,
    max: 15,
    step: 1,
    defaultValue: 10,
    impactDescription: "Lower leverage caps reduce catastrophic losses but may push traders offshore",
  },
  {
    id: "stopLossAdoptionIncrease",
    name: "Stop-Loss Adoption Increase",
    description: "Percentage point increase in traders using stop-loss orders (via nudges/defaults)",
    unit: "%",
    min: 0,
    max: 40,
    step: 5,
    defaultValue: 0,
    impactDescription: "Higher stop-loss usage limits individual trade losses and extends survival",
  },
  {
    id: "herdingReductionPct",
    name: "Herding Reduction",
    description: "Reduction in synchronised trading through educational interventions",
    unit: "%",
    min: 0,
    max: 50,
    step: 5,
    defaultValue: 0,
    impactDescription: "Reducing herding behavior decreases coordinated losses during market stress",
  },
];

// -----------------------------------------------------------------------------
// SIMULATION FORMULAS (Toy Model)
// -----------------------------------------------------------------------------

/**
 * Calculate the impact of leverage cap changes
 * Simplified formula: Lower leverage = better outcomes
 */
function calculateLeverageImpact(cap: number): {
  rhiMultiplier: number;
  ttfMultiplier: number;
  highRiskMultiplier: number;
  herdingMultiplier: number;
  avgLeverageResult: number;
} {
  const baseline = 10; // Current effective average max
  const ratio = cap / baseline;
  
  // Impact scaling (lower cap = better outcomes)
  // Using diminishing returns formula
  const improvement = Math.max(0, (1 - ratio) * 0.4);
  
  return {
    rhiMultiplier: 1 - improvement * 0.6, // Up to ~24% RHI reduction at 3x
    ttfMultiplier: 1 + improvement * 0.8, // Up to ~32% TTF increase
    highRiskMultiplier: 1 - improvement * 0.5, // Up to ~20% high-risk reduction
    herdingMultiplier: 1 - improvement * 0.15, // Slight herding reduction
    avgLeverageResult: Math.min(cap, BASELINE_METRICS.avgLeverage) * (0.7 + 0.3 * ratio),
  };
}

/**
 * Calculate the impact of stop-loss adoption increase
 */
function calculateStopLossImpact(increasePct: number): {
  rhiMultiplier: number;
  ttfMultiplier: number;
  highRiskMultiplier: number;
  survivalMultiplier: number;
  lossMultiplier: number;
  newStopLossRate: number;
} {
  const factor = increasePct / 100;
  
  return {
    rhiMultiplier: 1 - factor * 0.35, // Up to 14% RHI reduction at +40%
    ttfMultiplier: 1 + factor * 0.6, // Up to 24% TTF increase
    highRiskMultiplier: 1 - factor * 0.4, // Up to 16% high-risk reduction
    survivalMultiplier: 1 + factor * 0.5, // Up to 20% survival improvement
    lossMultiplier: 1 - factor * 0.45, // Up to 18% loss reduction
    newStopLossRate: Math.min(95, BASELINE_METRICS.pctUsingStopLoss + increasePct),
  };
}

/**
 * Calculate the impact of herding reduction
 */
function calculateHerdingImpact(reductionPct: number): {
  rhiMultiplier: number;
  ttfMultiplier: number;
  highRiskMultiplier: number;
  newHerdingScore: number;
} {
  const factor = reductionPct / 100;
  
  return {
    rhiMultiplier: 1 - factor * 0.25, // Up to 12.5% RHI reduction at 50%
    ttfMultiplier: 1 + factor * 0.3, // Up to 15% TTF increase
    highRiskMultiplier: 1 - factor * 0.2, // Up to 10% high-risk reduction
    newHerdingScore: Math.round(BASELINE_METRICS.herdingScore * (1 - factor)),
  };
}

// -----------------------------------------------------------------------------
// MAIN SIMULATION FUNCTION
// -----------------------------------------------------------------------------

/**
 * Simulate the impact of policy levers on harm metrics
 * 
 * @param levers - The policy lever settings
 * @returns Simulated metrics with changes
 */
export function simulatePolicyImpact(levers: PolicyLevers): SimulatedMetrics {
  // Calculate individual lever impacts
  const leverageImpact = calculateLeverageImpact(levers.maxLeverageCap);
  const stopLossImpact = calculateStopLossImpact(levers.stopLossAdoptionIncrease);
  const herdingImpact = calculateHerdingImpact(levers.herdingReductionPct);
  
  // Combine multipliers (multiplicative combination with diminishing returns)
  const combinedRHIMultiplier = 
    leverageImpact.rhiMultiplier * 
    stopLossImpact.rhiMultiplier * 
    herdingImpact.rhiMultiplier;
  
  const combinedTTFMultiplier = 
    leverageImpact.ttfMultiplier * 
    stopLossImpact.ttfMultiplier * 
    herdingImpact.ttfMultiplier;
  
  const combinedHighRiskMultiplier = 
    leverageImpact.highRiskMultiplier * 
    stopLossImpact.highRiskMultiplier * 
    herdingImpact.highRiskMultiplier;
  
  // Calculate new values
  const newRHI = Math.round(BASELINE_METRICS.rhi * combinedRHIMultiplier);
  const newTTF = Math.round(BASELINE_METRICS.medianTTF * combinedTTFMultiplier);
  const newHighRisk = Math.round(BASELINE_METRICS.pctHighRisk * combinedHighRiskMultiplier * 10) / 10;
  const newHerding = herdingImpact.newHerdingScore;
  const newLeverage = Math.round(leverageImpact.avgLeverageResult * 10) / 10;
  const newStopLoss = stopLossImpact.newStopLossRate;
  const newSurvival = Math.min(95, Math.round(BASELINE_METRICS.survivalRate90Day * stopLossImpact.survivalMultiplier));
  const newLoss = Math.round(BASELINE_METRICS.avgLossPerTrader * stopLossImpact.lossMultiplier * combinedRHIMultiplier);
  
  return {
    rhi: newRHI,
    medianTTF: newTTF,
    pctHighRisk: newHighRisk,
    herdingScore: newHerding,
    avgLeverage: newLeverage,
    pctUsingStopLoss: newStopLoss,
    survivalRate90Day: newSurvival,
    avgLossPerTrader: newLoss,
    // Changes
    rhiChange: newRHI - BASELINE_METRICS.rhi,
    ttfChange: newTTF - BASELINE_METRICS.medianTTF,
    highRiskChange: newHighRisk - BASELINE_METRICS.pctHighRisk,
    herdingChange: newHerding - BASELINE_METRICS.herdingScore,
    leverageChange: newLeverage - BASELINE_METRICS.avgLeverage,
    stopLossChange: newStopLoss - BASELINE_METRICS.pctUsingStopLoss,
    survivalChange: newSurvival - BASELINE_METRICS.survivalRate90Day,
    lossChange: newLoss - BASELINE_METRICS.avgLossPerTrader,
  };
}

/**
 * Get the impact breakdown for each lever
 */
export function getPolicyImpactBreakdown(levers: PolicyLevers): PolicyImpact[] {
  const impacts: PolicyImpact[] = [];
  
  // Leverage impact
  if (levers.maxLeverageCap !== 10) {
    const impact = calculateLeverageImpact(levers.maxLeverageCap);
    impacts.push({
      lever: `Leverage Cap: ${levers.maxLeverageCap}x`,
      description: levers.maxLeverageCap < 10 
        ? "Restricting leverage reduces extreme losses"
        : "Higher leverage cap increases risk",
      rhiImpact: Math.round((impact.rhiMultiplier - 1) * BASELINE_METRICS.rhi),
      ttfImpact: Math.round((impact.ttfMultiplier - 1) * BASELINE_METRICS.medianTTF),
      highRiskImpact: Math.round((impact.highRiskMultiplier - 1) * BASELINE_METRICS.pctHighRisk * 10) / 10,
      herdingImpact: Math.round((impact.herdingMultiplier - 1) * BASELINE_METRICS.herdingScore),
    });
  }
  
  // Stop-loss impact
  if (levers.stopLossAdoptionIncrease > 0) {
    const impact = calculateStopLossImpact(levers.stopLossAdoptionIncrease);
    impacts.push({
      lever: `Stop-Loss Adoption: +${levers.stopLossAdoptionIncrease}%`,
      description: "Better loss protection extends trader survival",
      rhiImpact: Math.round((impact.rhiMultiplier - 1) * BASELINE_METRICS.rhi),
      ttfImpact: Math.round((impact.ttfMultiplier - 1) * BASELINE_METRICS.medianTTF),
      highRiskImpact: Math.round((impact.highRiskMultiplier - 1) * BASELINE_METRICS.pctHighRisk * 10) / 10,
      herdingImpact: 0,
    });
  }
  
  // Herding impact
  if (levers.herdingReductionPct > 0) {
    const impact = calculateHerdingImpact(levers.herdingReductionPct);
    impacts.push({
      lever: `Herding Reduction: -${levers.herdingReductionPct}%`,
      description: "Education reduces coordinated risky behaviour",
      rhiImpact: Math.round((impact.rhiMultiplier - 1) * BASELINE_METRICS.rhi),
      ttfImpact: Math.round((impact.ttfMultiplier - 1) * BASELINE_METRICS.medianTTF),
      highRiskImpact: Math.round((impact.highRiskMultiplier - 1) * BASELINE_METRICS.pctHighRisk * 10) / 10,
      herdingImpact: impact.newHerdingScore - BASELINE_METRICS.herdingScore,
    });
  }
  
  return impacts;
}

// -----------------------------------------------------------------------------
// PRESET SCENARIOS
// -----------------------------------------------------------------------------

export interface PolicyScenario {
  id: string;
  name: string;
  description: string;
  levers: PolicyLevers;
}

export const PRESET_SCENARIOS: PolicyScenario[] = [
  {
    id: "baseline",
    name: "Current State",
    description: "No interventions - baseline metrics",
    levers: { maxLeverageCap: 10, stopLossAdoptionIncrease: 0, herdingReductionPct: 0 },
  },
  {
    id: "conservative",
    name: "Conservative Approach",
    description: "Moderate leverage cap with education focus",
    levers: { maxLeverageCap: 5, stopLossAdoptionIncrease: 15, herdingReductionPct: 20 },
  },
  {
    id: "aggressive",
    name: "Aggressive Reform",
    description: "Strict leverage limits and high stop-loss adoption",
    levers: { maxLeverageCap: 3, stopLossAdoptionIncrease: 35, herdingReductionPct: 40 },
  },
  {
    id: "education-only",
    name: "Education Focus",
    description: "No hard limits, relying on education and nudges",
    levers: { maxLeverageCap: 10, stopLossAdoptionIncrease: 25, herdingReductionPct: 35 },
  },
];
