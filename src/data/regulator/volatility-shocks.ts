// =============================================================================
// VOLATILITY SHOCK RESPONSE DATA
// =============================================================================
// Synthetic dataset demonstrating how NZ traders react to volatility spikes:
// - Increased leverage usage
// - Higher clustering/herding behavior
// - Worse short-term loss rates
// - Elevated RHI during shock windows

export interface VolatilityShockEvent {
  eventId: string;
  timestamp: string;
  label: string;
  description: string;
  category: "economic" | "geopolitical" | "market" | "crypto";
  
  // Before/after metrics
  baselineLeverage: number;
  shockLeverage: number;
  leverageChange: number; // percentage change
  
  baselineClusterScore: number; // 0-1000 scale
  shockClusterScore: number;
  clusterChange: number;
  
  baselineLossRate: number; // 0-1 (percentage of traders losing)
  shockLossRate: number;
  lossRateChange: number;
  
  // Additional metrics
  affectedTraders: number;
  avgLossDuringShock: number;
  peakVolatility: number; // VIX or similar
  
  // RHI impact
  baselineRHI: number;
  shockRHI: number;
  rhiBump: number;
}

export interface ShockTimeSeriesPoint {
  minutesFromEvent: number;
  leverage: number;
  clusterScore: number;
  lossRate: number;
  rhi: number;
  isShockWindow: boolean;
}

// Historical volatility shock events (synthetic)
export const volatilityShockEvents: VolatilityShockEvent[] = [
  {
    eventId: "shock-1",
    timestamp: "2024-11-13T13:30:00Z",
    label: "US CPI Surprise",
    description: "Higher-than-expected US inflation data triggered rapid USD moves and equity selloff",
    category: "economic",
    baselineLeverage: 3.2,
    shockLeverage: 6.7,
    leverageChange: 109.4,
    baselineClusterScore: 180,
    shockClusterScore: 620,
    clusterChange: 244.4,
    baselineLossRate: 0.12,
    shockLossRate: 0.31,
    lossRateChange: 158.3,
    affectedTraders: 847,
    avgLossDuringShock: 1240,
    peakVolatility: 24.8,
    baselineRHI: 542,
    shockRHI: 724,
    rhiBump: 182,
  },
  {
    eventId: "shock-2",
    timestamp: "2024-10-27T22:00:00Z",
    label: "FOMC Rate Decision",
    description: "Federal Reserve held rates but signaled longer 'higher for longer' stance",
    category: "economic",
    baselineLeverage: 2.8,
    shockLeverage: 5.4,
    leverageChange: 92.9,
    baselineClusterScore: 210,
    shockClusterScore: 540,
    clusterChange: 157.1,
    baselineLossRate: 0.14,
    shockLossRate: 0.28,
    lossRateChange: 100.0,
    affectedTraders: 723,
    avgLossDuringShock: 980,
    peakVolatility: 21.2,
    baselineRHI: 518,
    shockRHI: 668,
    rhiBump: 150,
  },
  {
    eventId: "shock-3",
    timestamp: "2024-10-07T08:15:00Z",
    label: "Middle East Escalation",
    description: "Geopolitical tensions spiked oil prices and triggered risk-off sentiment",
    category: "geopolitical",
    baselineLeverage: 3.1,
    shockLeverage: 7.2,
    leverageChange: 132.3,
    baselineClusterScore: 195,
    shockClusterScore: 710,
    clusterChange: 264.1,
    baselineLossRate: 0.11,
    shockLossRate: 0.38,
    lossRateChange: 245.5,
    affectedTraders: 912,
    avgLossDuringShock: 1580,
    peakVolatility: 28.4,
    baselineRHI: 528,
    shockRHI: 782,
    rhiBump: 254,
  },
  {
    eventId: "shock-4",
    timestamp: "2024-09-18T14:00:00Z",
    label: "Tech Earnings Miss",
    description: "Major tech company missed earnings, triggering broad NASDAQ selloff",
    category: "market",
    baselineLeverage: 2.9,
    shockLeverage: 5.8,
    leverageChange: 100.0,
    baselineClusterScore: 165,
    shockClusterScore: 485,
    clusterChange: 193.9,
    baselineLossRate: 0.13,
    shockLossRate: 0.26,
    lossRateChange: 100.0,
    affectedTraders: 634,
    avgLossDuringShock: 890,
    peakVolatility: 19.6,
    baselineRHI: 505,
    shockRHI: 632,
    rhiBump: 127,
  },
  {
    eventId: "shock-5",
    timestamp: "2024-08-05T04:30:00Z",
    label: "JPY Carry Unwind",
    description: "Bank of Japan policy shift triggered massive yen carry trade unwinding",
    category: "market",
    baselineLeverage: 3.4,
    shockLeverage: 8.1,
    leverageChange: 138.2,
    baselineClusterScore: 220,
    shockClusterScore: 820,
    clusterChange: 272.7,
    baselineLossRate: 0.10,
    shockLossRate: 0.42,
    lossRateChange: 320.0,
    affectedTraders: 1024,
    avgLossDuringShock: 2140,
    peakVolatility: 32.1,
    baselineRHI: 534,
    shockRHI: 845,
    rhiBump: 311,
  },
  {
    eventId: "shock-6",
    timestamp: "2024-07-22T16:45:00Z",
    label: "BTC ETF Outflow",
    description: "Large Bitcoin ETF redemptions triggered crypto market cascade",
    category: "crypto",
    baselineLeverage: 4.2,
    shockLeverage: 9.5,
    leverageChange: 126.2,
    baselineClusterScore: 280,
    shockClusterScore: 680,
    clusterChange: 142.9,
    baselineLossRate: 0.18,
    shockLossRate: 0.44,
    lossRateChange: 144.4,
    affectedTraders: 456,
    avgLossDuringShock: 1820,
    peakVolatility: 35.8,
    baselineRHI: 612,
    shockRHI: 798,
    rhiBump: 186,
  },
];

// Generate time-series data around a shock event
export function generateShockTimeSeries(event: VolatilityShockEvent): ShockTimeSeriesPoint[] {
  const points: ShockTimeSeriesPoint[] = [];
  
  // Generate points from -120 minutes to +240 minutes (2 hours before, 4 hours after)
  for (let minutes = -120; minutes <= 240; minutes += 10) {
    const isShockWindow = minutes >= -10 && minutes <= 60;
    
    // Calculate smooth transitions using sigmoid-like curves
    let leverage: number;
    let clusterScore: number;
    let lossRate: number;
    let rhi: number;
    
    if (minutes < -10) {
      // Pre-shock: baseline with slight noise
      const noise = Math.random() * 0.1 - 0.05;
      leverage = event.baselineLeverage * (1 + noise);
      clusterScore = event.baselineClusterScore * (1 + noise);
      lossRate = event.baselineLossRate * (1 + noise);
      rhi = event.baselineRHI * (1 + noise * 0.5);
    } else if (minutes >= -10 && minutes <= 20) {
      // Shock onset: rapid rise
      const progress = (minutes + 10) / 30; // 0 to 1 over 30 minutes
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      leverage = event.baselineLeverage + (event.shockLeverage - event.baselineLeverage) * eased;
      clusterScore = event.baselineClusterScore + (event.shockClusterScore - event.baselineClusterScore) * eased;
      lossRate = event.baselineLossRate + (event.shockLossRate - event.baselineLossRate) * eased;
      rhi = event.baselineRHI + (event.shockRHI - event.baselineRHI) * eased;
    } else if (minutes > 20 && minutes <= 60) {
      // Peak shock: high with volatility
      const noise = Math.random() * 0.15 - 0.075;
      leverage = event.shockLeverage * (1 + noise);
      clusterScore = event.shockClusterScore * (1 + noise);
      lossRate = event.shockLossRate * (1 + noise);
      rhi = event.shockRHI * (1 + noise * 0.5);
    } else {
      // Recovery: gradual decline back toward baseline
      const progress = Math.min(1, (minutes - 60) / 180); // 0 to 1 over 3 hours
      const eased = progress * progress; // ease-in quadratic
      const recoveryFactor = 0.3; // Don't fully recover to baseline
      const targetLeverage = event.baselineLeverage + (event.shockLeverage - event.baselineLeverage) * recoveryFactor;
      const targetCluster = event.baselineClusterScore + (event.shockClusterScore - event.baselineClusterScore) * recoveryFactor;
      const targetLoss = event.baselineLossRate + (event.shockLossRate - event.baselineLossRate) * recoveryFactor;
      const targetRHI = event.baselineRHI + (event.shockRHI - event.baselineRHI) * recoveryFactor;
      
      leverage = event.shockLeverage - (event.shockLeverage - targetLeverage) * eased;
      clusterScore = event.shockClusterScore - (event.shockClusterScore - targetCluster) * eased;
      lossRate = event.shockLossRate - (event.shockLossRate - targetLoss) * eased;
      rhi = event.shockRHI - (event.shockRHI - targetRHI) * eased;
      
      // Add some noise
      const noise = Math.random() * 0.08 - 0.04;
      leverage *= (1 + noise);
      clusterScore *= (1 + noise);
      lossRate *= (1 + noise);
    }
    
    points.push({
      minutesFromEvent: minutes,
      leverage: Math.round(leverage * 10) / 10,
      clusterScore: Math.round(clusterScore),
      lossRate: Math.round(lossRate * 1000) / 1000,
      rhi: Math.round(rhi),
      isShockWindow,
    });
  }
  
  return points;
}

// Pre-generate time series for all events
export const shockTimeSeriesData: Record<string, ShockTimeSeriesPoint[]> = {};
volatilityShockEvents.forEach((event) => {
  shockTimeSeriesData[event.eventId] = generateShockTimeSeries(event);
});

// Summary statistics
export const SHOCK_SUMMARY = {
  totalEvents: volatilityShockEvents.length,
  avgLeverageIncrease: Math.round(
    volatilityShockEvents.reduce((sum, e) => sum + e.leverageChange, 0) / volatilityShockEvents.length
  ),
  avgClusterIncrease: Math.round(
    volatilityShockEvents.reduce((sum, e) => sum + e.clusterChange, 0) / volatilityShockEvents.length
  ),
  avgLossRateIncrease: Math.round(
    volatilityShockEvents.reduce((sum, e) => sum + e.lossRateChange, 0) / volatilityShockEvents.length
  ),
  avgRHIBump: Math.round(
    volatilityShockEvents.reduce((sum, e) => sum + e.rhiBump, 0) / volatilityShockEvents.length
  ),
  totalAffectedTraders: volatilityShockEvents.reduce((sum, e) => sum + e.affectedTraders, 0),
  totalLosses: volatilityShockEvents.reduce((sum, e) => sum + e.affectedTraders * e.avgLossDuringShock, 0),
};

// Category colors
export const SHOCK_CATEGORY_COLORS: Record<string, string> = {
  economic: "#3b82f6",
  geopolitical: "#ef4444",
  market: "#f97316",
  crypto: "#8b5cf6",
};

// Category labels
export const SHOCK_CATEGORY_LABELS: Record<string, string> = {
  economic: "Economic Data",
  geopolitical: "Geopolitical",
  market: "Market Event",
  crypto: "Crypto",
};
