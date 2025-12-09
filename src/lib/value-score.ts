import type { Navigator } from "@/data/types";

export type ValueTier = "high" | "medium" | "watch";

export interface ValueScore {
  score: number; // 0-100
  tier: ValueTier;
  label: string;
}

/**
 * Calculate "Value to Broker" composite score for a navigator.
 * Formula: ValueScore = (RevenueRank * 0.5) + (ScoreRank * 0.3) + (GrowthRank * 0.2)
 * 
 * Returns a score from 0-100 and a tier (high/medium/watch).
 */
export function calculateValueScore(
  navigator: Navigator,
  allNavigators: Navigator[]
): ValueScore {
  // Sort navigators by each dimension (higher is better)
  const sortedByRevenue = [...allNavigators].sort(
    (a, b) => b.brokerRevenueShare - a.brokerRevenueShare
  );
  const sortedByScore = [...allNavigators].sort(
    (a, b) => b.pilotScore - a.pilotScore
  );
  
  // Calculate growth from trend (last value vs first value)
  const navigatorsWithGrowth = allNavigators.map((nav) => {
    const trend = nav.trend || [];
    const first = trend[0]?.value ?? nav.pilotScore;
    const last = trend[trend.length - 1]?.value ?? nav.pilotScore;
    const growth = last - first;
    return { nav, growth };
  });
  const sortedByGrowth = [...navigatorsWithGrowth].sort(
    (a, b) => b.growth - a.growth
  );

  // Get ranks (1 = best, n = worst)
  const revenueRank = sortedByRevenue.findIndex((n) => n.id === navigator.id) + 1;
  const scoreRank = sortedByScore.findIndex((n) => n.id === navigator.id) + 1;
  const growthRank = sortedByGrowth.findIndex((item) => item.nav.id === navigator.id) + 1;

  const n = allNavigators.length;

  // Normalize ranks to 0-100 (1 = 100, n = 0)
  const revenueNorm = ((n - revenueRank + 1) / n) * 100;
  const scoreNorm = ((n - scoreRank + 1) / n) * 100;
  const growthNorm = ((n - growthRank + 1) / n) * 100;

  // Weighted composite
  const valueScore =
    revenueNorm * 0.5 + scoreNorm * 0.3 + growthNorm * 0.2;

  // Determine tier
  let tier: ValueTier;
  let label: string;

  if (valueScore >= 70) {
    tier = "high";
    label = "High Value";
  } else if (valueScore >= 40) {
    tier = "medium";
    label = "Medium Value";
  } else {
    tier = "watch";
    label = "Watch";
  }

  return {
    score: Math.round(valueScore),
    tier,
    label,
  };
}

/**
 * Calculate value scores for all navigators and return a map.
 */
export function calculateAllValueScores(
  navigators: Navigator[]
): Map<string, ValueScore> {
  const map = new Map<string, ValueScore>();

  for (const navigator of navigators) {
    const valueScore = calculateValueScore(navigator, navigators);
    map.set(navigator.id, valueScore);
  }

  return map;
}
