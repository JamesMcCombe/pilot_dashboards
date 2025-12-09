// =============================================================================
// HERDING & SYNCHRONISATION SCORE MODULE
// =============================================================================
// Quantifies how synchronised NZ trader behaviour is (herding) on a 0-1000 scale.
// 0 = fully independent behaviour; 1000 = tightly synchronised herding
//
// This score feeds into the RHI composite calculation as the "Herding / Synchronisation"
// factor and is displayed independently on the Regulator Overview dashboard.

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface HerdingMetrics {
  // Number of detected clustered entry events in the period
  clusteredEntryEvents: number;
  // Average number of traders per cluster
  avgClusterSize: number;
  // Tightness of time window (lower = more synchronised)
  avgTimeWindowSeconds: number;
  // Cross-asset correlation coefficient (0-1)
  crossAssetCorrelation: number;
  // Percentage of traders participating in clusters
  clusterParticipationRate: number;
  // Maximum cluster size observed
  maxClusterSize: number;
}

export interface HerdingScoreResult {
  score: number; // 0-1000
  band: HerdingBand;
  bandLabel: string;
  bandColor: string;
  metrics: HerdingMetrics;
  componentScores: {
    clusterFrequency: number;
    clusterSize: number;
    timeTightness: number;
    crossAssetSync: number;
    participationRate: number;
  };
}

export type HerdingBand = "low" | "medium" | "high" | "critical";

export interface HerdingTimeSeriesPoint {
  date: string;
  score: number;
  band: HerdingBand;
  clusteredEvents: number;
  avgClusterSize: number;
  isVolatilitySpike: boolean;
}

// -----------------------------------------------------------------------------
// CONSTANTS & THRESHOLDS
// -----------------------------------------------------------------------------

export const HERDING_BANDS: Record<HerdingBand, { min: number; max: number; label: string; color: string }> = {
  low: { min: 0, max: 299, label: "Low", color: "#53f6c5" },
  medium: { min: 300, max: 599, label: "Medium", color: "#fbbf24" },
  high: { min: 600, max: 799, label: "High", color: "#f97316" },
  critical: { min: 800, max: 1000, label: "Critical", color: "#ef4444" },
};

// Component weights for the herding score calculation
const HERDING_WEIGHTS = {
  clusterFrequency: 0.20,    // How often clusters occur
  clusterSize: 0.25,         // Average size of clusters
  timeTightness: 0.20,       // How tight the time windows are
  crossAssetSync: 0.15,      // Cross-asset correlation
  participationRate: 0.20,   // What % of traders participate in herding
};

// Baseline thresholds for normalization (synthetic calibration)
const BASELINES = {
  // Expected clusters per day in "normal" conditions
  normalClusterFrequency: 15,
  maxClusterFrequency: 80,
  // Expected average cluster size
  normalClusterSize: 8,
  maxClusterSize: 50,
  // Time window thresholds (seconds)
  looseTimeWindow: 300, // 5 minutes = loose coordination
  tightTimeWindow: 30,  // 30 seconds = very tight coordination
  // Cross-asset correlation thresholds
  normalCorrelation: 0.3,
  highCorrelation: 0.85,
  // Participation rate thresholds
  normalParticipation: 0.15,
  highParticipation: 0.60,
};

// -----------------------------------------------------------------------------
// SCORING FUNCTION
// -----------------------------------------------------------------------------

/**
 * Calculate the Herding & Synchronisation Score (0-1000)
 * 
 * @param metrics - Input metrics describing herding behaviour
 * @returns HerdingScoreResult with score, band, and component breakdown
 */
export function calculateHerdingScore(metrics: HerdingMetrics): HerdingScoreResult {
  // Calculate component scores (each 0-1000)
  
  // 1. Cluster Frequency Score
  const clusterFrequencyRatio = Math.min(
    1,
    (metrics.clusteredEntryEvents - BASELINES.normalClusterFrequency) /
      (BASELINES.maxClusterFrequency - BASELINES.normalClusterFrequency)
  );
  const clusterFrequencyScore = Math.max(0, Math.round(clusterFrequencyRatio * 1000));
  
  // 2. Cluster Size Score
  const clusterSizeRatio = Math.min(
    1,
    (metrics.avgClusterSize - BASELINES.normalClusterSize) /
      (BASELINES.maxClusterSize - BASELINES.normalClusterSize)
  );
  const clusterSizeScore = Math.max(0, Math.round(clusterSizeRatio * 1000));
  
  // 3. Time Tightness Score (inverted - tighter = higher score)
  const timeRatio = Math.min(
    1,
    Math.max(
      0,
      (BASELINES.looseTimeWindow - metrics.avgTimeWindowSeconds) /
        (BASELINES.looseTimeWindow - BASELINES.tightTimeWindow)
    )
  );
  const timeTightnessScore = Math.round(timeRatio * 1000);
  
  // 4. Cross-Asset Synchronisation Score
  const correlationRatio = Math.min(
    1,
    Math.max(
      0,
      (metrics.crossAssetCorrelation - BASELINES.normalCorrelation) /
        (BASELINES.highCorrelation - BASELINES.normalCorrelation)
    )
  );
  const crossAssetSyncScore = Math.round(correlationRatio * 1000);
  
  // 5. Participation Rate Score
  const participationRatio = Math.min(
    1,
    Math.max(
      0,
      (metrics.clusterParticipationRate - BASELINES.normalParticipation) /
        (BASELINES.highParticipation - BASELINES.normalParticipation)
    )
  );
  const participationRateScore = Math.round(participationRatio * 1000);
  
  // Calculate weighted composite score
  const score = Math.round(
    clusterFrequencyScore * HERDING_WEIGHTS.clusterFrequency +
    clusterSizeScore * HERDING_WEIGHTS.clusterSize +
    timeTightnessScore * HERDING_WEIGHTS.timeTightness +
    crossAssetSyncScore * HERDING_WEIGHTS.crossAssetSync +
    participationRateScore * HERDING_WEIGHTS.participationRate
  );
  
  // Determine band
  const band = getHerdingBand(score);
  const bandConfig = HERDING_BANDS[band];
  
  return {
    score,
    band,
    bandLabel: bandConfig.label,
    bandColor: bandConfig.color,
    metrics,
    componentScores: {
      clusterFrequency: clusterFrequencyScore,
      clusterSize: clusterSizeScore,
      timeTightness: timeTightnessScore,
      crossAssetSync: crossAssetSyncScore,
      participationRate: participationRateScore,
    },
  };
}

/**
 * Determine the herding band from a score
 */
export function getHerdingBand(score: number): HerdingBand {
  if (score >= HERDING_BANDS.critical.min) return "critical";
  if (score >= HERDING_BANDS.high.min) return "high";
  if (score >= HERDING_BANDS.medium.min) return "medium";
  return "low";
}

// -----------------------------------------------------------------------------
// SYNTHETIC DATA GENERATION
// -----------------------------------------------------------------------------

// Volatility spike dates (should align with volatility-shocks.ts events)
const VOLATILITY_SPIKE_DATES = [
  "2024-11-13", // US CPI Surprise
  "2024-10-27", // FOMC Rate Decision
  "2024-10-07", // Middle East Escalation
  "2024-09-18", // Tech Earnings Miss
  "2024-08-05", // JPY Carry Unwind
];

/**
 * Generate synthetic herding metrics for a given date
 */
function generateSyntheticMetrics(date: Date, isVolatilitySpike: boolean): HerdingMetrics {
  // Base values with some randomness
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Weekends have lower activity
  const activityMultiplier = isWeekend ? 0.4 : 1.0;
  
  // Volatility spikes have much higher herding
  const spikeMultiplier = isVolatilitySpike ? 2.5 + Math.random() * 1.5 : 1.0;
  
  // Add some weekly pattern (Tuesdays and Wednesdays tend to be busier)
  const weekdayBoost = (dayOfWeek === 2 || dayOfWeek === 3) ? 1.15 : 1.0;
  
  // Random variation
  const randomFactor = 0.8 + Math.random() * 0.4;
  
  const combinedMultiplier = activityMultiplier * spikeMultiplier * weekdayBoost * randomFactor;
  
  return {
    clusteredEntryEvents: Math.round(18 * combinedMultiplier + Math.random() * 10),
    avgClusterSize: Math.round((12 + Math.random() * 8) * Math.min(combinedMultiplier, 2.5)),
    avgTimeWindowSeconds: Math.max(20, Math.round(180 / combinedMultiplier + Math.random() * 60)),
    crossAssetCorrelation: Math.min(0.95, 0.35 + (combinedMultiplier - 1) * 0.25 + Math.random() * 0.15),
    clusterParticipationRate: Math.min(0.75, 0.18 + (combinedMultiplier - 1) * 0.15 + Math.random() * 0.1),
    maxClusterSize: Math.round((25 + Math.random() * 15) * Math.min(combinedMultiplier, 2.0)),
  };
}

/**
 * Generate synthetic herding time series for a given number of days
 */
export function generateHerdingTimeSeries(days: number = 90): HerdingTimeSeriesPoint[] {
  const points: HerdingTimeSeriesPoint[] = [];
  const endDate = new Date("2024-11-15");
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    
    const isVolatilitySpike = VOLATILITY_SPIKE_DATES.includes(dateStr);
    const metrics = generateSyntheticMetrics(date, isVolatilitySpike);
    const result = calculateHerdingScore(metrics);
    
    points.push({
      date: dateStr,
      score: result.score,
      band: result.band,
      clusteredEvents: metrics.clusteredEntryEvents,
      avgClusterSize: metrics.avgClusterSize,
      isVolatilitySpike,
    });
  }
  
  return points;
}

// -----------------------------------------------------------------------------
// PRE-GENERATED DATA EXPORTS
// -----------------------------------------------------------------------------

// Generate 90 days of synthetic herding data
export const HERDING_TIME_SERIES = generateHerdingTimeSeries(90);

// Current herding score (most recent day)
export const CURRENT_HERDING_METRICS: HerdingMetrics = {
  clusteredEntryEvents: 42,
  avgClusterSize: 18,
  avgTimeWindowSeconds: 85,
  crossAssetCorrelation: 0.52,
  clusterParticipationRate: 0.34,
  maxClusterSize: 38,
};

export const CURRENT_HERDING_RESULT = calculateHerdingScore(CURRENT_HERDING_METRICS);

// Calculate statistics
export const HERDING_STATS = {
  current: CURRENT_HERDING_RESULT.score,
  avg30Day: Math.round(
    HERDING_TIME_SERIES.slice(-30).reduce((sum, p) => sum + p.score, 0) / 30
  ),
  max30Day: Math.max(...HERDING_TIME_SERIES.slice(-30).map((p) => p.score)),
  min30Day: Math.min(...HERDING_TIME_SERIES.slice(-30).map((p) => p.score)),
  trend: (() => {
    const last7 = HERDING_TIME_SERIES.slice(-7);
    const prev7 = HERDING_TIME_SERIES.slice(-14, -7);
    const last7Avg = last7.reduce((sum, p) => sum + p.score, 0) / 7;
    const prev7Avg = prev7.reduce((sum, p) => sum + p.score, 0) / 7;
    return Math.round(last7Avg - prev7Avg);
  })(),
  spikeCount: HERDING_TIME_SERIES.filter((p) => p.band === "critical" || p.band === "high").length,
};

// Component score descriptions for UI
export const HERDING_COMPONENTS = [
  {
    id: "clusterFrequency",
    name: "Cluster Frequency",
    description: "How often coordinated trading clusters occur",
    score: CURRENT_HERDING_RESULT.componentScores.clusterFrequency,
    weight: HERDING_WEIGHTS.clusterFrequency,
  },
  {
    id: "clusterSize",
    name: "Cluster Size",
    description: "Average number of traders per coordinated cluster",
    score: CURRENT_HERDING_RESULT.componentScores.clusterSize,
    weight: HERDING_WEIGHTS.clusterSize,
  },
  {
    id: "timeTightness",
    name: "Time Tightness",
    description: "How tightly synchronised entries are within clusters",
    score: CURRENT_HERDING_RESULT.componentScores.timeTightness,
    weight: HERDING_WEIGHTS.timeTightness,
  },
  {
    id: "crossAssetSync",
    name: "Cross-Asset Sync",
    description: "Correlation of herding behaviour across different assets",
    score: CURRENT_HERDING_RESULT.componentScores.crossAssetSync,
    weight: HERDING_WEIGHTS.crossAssetSync,
  },
  {
    id: "participationRate",
    name: "Participation Rate",
    description: "Percentage of active traders participating in clusters",
    score: CURRENT_HERDING_RESULT.componentScores.participationRate,
    weight: HERDING_WEIGHTS.participationRate,
  },
];
