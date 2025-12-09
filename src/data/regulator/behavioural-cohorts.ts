// =============================================================================
// BEHAVIOURAL COHORT DATA
// =============================================================================
// Synthetic NZ trader cohorts segmented by behavioural patterns.
// Each cohort represents a distinct trading behaviour profile with associated
// risk metrics and outcomes.

export interface BehaviouralCohort {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
  
  // Size metrics
  cohortSize: number; // Number of traders
  percentOfTotal: number; // % of total sample
  
  // Risk metrics
  avgPilotScore: number; // 0-1000
  avgLeverage: number;
  medianTimeToFailure: number; // Days
  avgHerdingScore: number; // 0-1000
  pctUsingStopLoss: number;
  avgVolatilityExposure: number; // 0-100 scale
  
  // Outcome metrics
  rhiContribution: number; // % contribution to overall RHI
  avgLossPerTrader: number; // NZD
  survivalRate90Day: number; // % still trading after 90 days
  
  // Risk classification
  riskLevel: "low" | "medium" | "high" | "critical";
  
  // Mini survival curve data (days -> survival %)
  survivalCurve: { day: number; survival: number }[];
  
  // PilotScore distribution (score range -> count)
  pilotScoreDistribution: { range: string; count: number; color: string }[];
  
  // Key characteristics
  characteristics: string[];
  
  // Regulatory implications
  regulatoryImplications: string;
}

// Cohort risk level colors
export const COHORT_RISK_COLORS = {
  low: "#53f6c5",
  medium: "#fbbf24",
  high: "#f97316",
  critical: "#ef4444",
};

// Generate survival curve data
function generateSurvivalCurve(
  startSurvival: number,
  endSurvival: number,
  decayRate: "slow" | "medium" | "fast"
): { day: number; survival: number }[] {
  const points: { day: number; survival: number }[] = [];
  const days = [0, 7, 14, 30, 45, 60, 90];
  
  const decayFactors = {
    slow: 0.3,
    medium: 0.5,
    fast: 0.7,
  };
  
  const factor = decayFactors[decayRate];
  
  days.forEach((day) => {
    const progress = day / 90;
    const decay = Math.pow(progress, factor);
    const survival = startSurvival - (startSurvival - endSurvival) * decay;
    points.push({ day, survival: Math.round(survival * 10) / 10 });
  });
  
  return points;
}

// Generate PilotScore distribution
function generatePilotScoreDistribution(
  avgScore: number,
  skew: "low" | "balanced" | "high"
): { range: string; count: number; color: string }[] {
  const ranges = [
    { range: "0-200", color: "#ef4444" },
    { range: "201-400", color: "#f97316" },
    { range: "401-600", color: "#fbbf24" },
    { range: "601-800", color: "#53f6c5" },
    { range: "801-1000", color: "#3b82f6" },
  ];
  
  // Generate counts based on average and skew
  const distributions: Record<string, number[]> = {
    low: [35, 30, 20, 10, 5],
    balanced: [15, 20, 30, 25, 10],
    high: [5, 10, 25, 35, 25],
  };
  
  const baseCounts = distributions[skew];
  
  return ranges.map((r, i) => ({
    ...r,
    count: baseCounts[i] + Math.round((Math.random() - 0.5) * 5),
  }));
}

// Synthetic cohort data
export const BEHAVIOURAL_COHORTS: BehaviouralCohort[] = [
  {
    id: "new-traders",
    name: "New Traders",
    description: "Recently onboarded traders with less than 90 days of activity. High learning curve, prone to early mistakes.",
    icon: "UserPlus",
    color: "#3b82f6",
    cohortSize: 486,
    percentOfTotal: 22.4,
    avgPilotScore: 485,
    avgLeverage: 4.8,
    medianTimeToFailure: 28,
    avgHerdingScore: 520,
    pctUsingStopLoss: 32,
    avgVolatilityExposure: 68,
    rhiContribution: 18.5,
    avgLossPerTrader: 1840,
    survivalRate90Day: 42,
    riskLevel: "high",
    survivalCurve: generateSurvivalCurve(100, 42, "fast"),
    pilotScoreDistribution: generatePilotScoreDistribution(485, "low"),
    characteristics: [
      "Account age < 90 days",
      "High initial deposit frequency",
      "Frequent position size changes",
      "Low stop-loss adoption",
      "High social media influence susceptibility",
    ],
    regulatoryImplications: "Target for enhanced onboarding education and risk warnings. Consider mandatory cooling-off periods for high-leverage products.",
  },
  {
    id: "high-leverage",
    name: "High-Leverage Traders",
    description: "Traders consistently using leverage above 10x. High risk tolerance, often chase losses with increased position sizes.",
    icon: "TrendingUp",
    color: "#ef4444",
    cohortSize: 312,
    percentOfTotal: 14.4,
    avgPilotScore: 380,
    avgLeverage: 12.4,
    medianTimeToFailure: 18,
    avgHerdingScore: 580,
    pctUsingStopLoss: 24,
    avgVolatilityExposure: 82,
    rhiContribution: 28.2,
    avgLossPerTrader: 3420,
    survivalRate90Day: 28,
    riskLevel: "critical",
    survivalCurve: generateSurvivalCurve(100, 28, "fast"),
    pilotScoreDistribution: generatePilotScoreDistribution(380, "low"),
    characteristics: [
      "Average leverage > 10x",
      "Frequent margin calls",
      "Loss-chasing behaviour patterns",
      "After-hours trading spikes",
      "Multiple account blow-ups",
    ],
    regulatoryImplications: "Priority group for leverage cap enforcement. Consider mandatory risk acknowledgments and position limits.",
  },
  {
    id: "socially-influenced",
    name: "Socially Influenced Traders",
    description: "Traders whose activity correlates with social signals - copy trading, influencer follows, coordinated entries.",
    icon: "Users",
    color: "#8b5cf6",
    cohortSize: 428,
    percentOfTotal: 19.7,
    avgPilotScore: 445,
    avgLeverage: 5.6,
    medianTimeToFailure: 35,
    avgHerdingScore: 780,
    pctUsingStopLoss: 38,
    avgVolatilityExposure: 72,
    rhiContribution: 24.8,
    avgLossPerTrader: 2180,
    survivalRate90Day: 38,
    riskLevel: "high",
    survivalCurve: generateSurvivalCurve(100, 38, "medium"),
    pilotScoreDistribution: generatePilotScoreDistribution(445, "low"),
    characteristics: [
      "High cluster participation rate",
      "Correlated entry timing",
      "Copy trading subscriptions",
      "Social platform activity spikes",
      "Influencer-aligned positions",
    ],
    regulatoryImplications: "Focus for influencer disclosure rules and copy trading warnings. Monitor for potential market manipulation coordination.",
  },
  {
    id: "consistent-stable",
    name: "Consistent / Stable Traders",
    description: "Traders with disciplined risk management, consistent position sizing, and sustainable trading patterns.",
    icon: "Shield",
    color: "#53f6c5",
    cohortSize: 524,
    percentOfTotal: 24.1,
    avgPilotScore: 725,
    avgLeverage: 2.8,
    medianTimeToFailure: 180,
    avgHerdingScore: 220,
    pctUsingStopLoss: 78,
    avgVolatilityExposure: 35,
    rhiContribution: 8.2,
    avgLossPerTrader: 680,
    survivalRate90Day: 82,
    riskLevel: "low",
    survivalCurve: generateSurvivalCurve(100, 82, "slow"),
    pilotScoreDistribution: generatePilotScoreDistribution(725, "high"),
    characteristics: [
      "Consistent position sizing",
      "Regular stop-loss usage",
      "Low leverage preference",
      "Diversified instrument exposure",
      "Longer holding periods",
    ],
    regulatoryImplications: "Benchmark cohort for healthy trading behaviour. Study for best practices that could be encouraged across other cohorts.",
  },
  {
    id: "volatility-chasers",
    name: "Volatility Chasers",
    description: "Traders who increase activity during high-volatility events. Often over-trade during news releases and market stress.",
    icon: "Zap",
    color: "#f97316",
    cohortSize: 420,
    percentOfTotal: 19.4,
    avgPilotScore: 420,
    avgLeverage: 7.2,
    medianTimeToFailure: 24,
    avgHerdingScore: 640,
    pctUsingStopLoss: 28,
    avgVolatilityExposure: 92,
    rhiContribution: 20.3,
    avgLossPerTrader: 2650,
    survivalRate90Day: 34,
    riskLevel: "high",
    survivalCurve: generateSurvivalCurve(100, 34, "fast"),
    pilotScoreDistribution: generatePilotScoreDistribution(420, "low"),
    characteristics: [
      "Activity spikes during news events",
      "High VIX correlation",
      "Rapid position turnover",
      "Weekend gap exposure",
      "Event-driven trading patterns",
    ],
    regulatoryImplications: "Candidates for volatility-specific warnings and temporary leverage restrictions during high-impact events.",
  },
];

// Summary statistics
export const COHORT_SUMMARY = {
  totalTraders: BEHAVIOURAL_COHORTS.reduce((sum, c) => sum + c.cohortSize, 0),
  avgPilotScore: Math.round(
    BEHAVIOURAL_COHORTS.reduce((sum, c) => sum + c.avgPilotScore * c.cohortSize, 0) /
    BEHAVIOURAL_COHORTS.reduce((sum, c) => sum + c.cohortSize, 0)
  ),
  highRiskCohorts: BEHAVIOURAL_COHORTS.filter((c) => c.riskLevel === "high" || c.riskLevel === "critical").length,
  totalRHIContribution: BEHAVIOURAL_COHORTS.reduce((sum, c) => sum + c.rhiContribution, 0),
};

// Overall survival curve for comparison
export const OVERALL_SURVIVAL_CURVE = [
  { day: 0, survival: 100 },
  { day: 7, survival: 92 },
  { day: 14, survival: 82 },
  { day: 30, survival: 68 },
  { day: 45, survival: 58 },
  { day: 60, survival: 52 },
  { day: 90, survival: 48 },
];

// Get cohort by ID
export function getCohortById(id: string): BehaviouralCohort | undefined {
  return BEHAVIOURAL_COHORTS.find((c) => c.id === id);
}

// Get cohorts sorted by risk contribution
export function getCohortsByRiskContribution(): BehaviouralCohort[] {
  return [...BEHAVIOURAL_COHORTS].sort((a, b) => b.rhiContribution - a.rhiContribution);
}
