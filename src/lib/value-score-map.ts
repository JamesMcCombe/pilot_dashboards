import type { Navigator, Pilot } from "@/data/types";
import { calculateValueScore } from "@/lib/value-score";
import type { ValueTier } from "@/lib/value-score";

export type NavigatorValueEntry = {
  valueScore: number;
  valueTier: ValueTier;
  valueLabel: string;
  valueRank: number;
  revenueRank: number;
  isRevenueLeader: boolean;
  brokerValue: {
    dailyRevenue: number;
    monthlyRevenue: number;
    revenueSharePct: number;
    copiedVolumeDaily: number;
    copiedVolumeMonthly: number;
    copiers: number;
  };
  revenueTrend: number[];
};

type NavigatorValueMap = Record<string, NavigatorValueEntry>;

export function getNavigatorValueMap(
  navigators: Navigator[],
  pilots: Pilot[] = [],
): NavigatorValueMap {
  if (!navigators.length) {
    return {};
  }

  const pilotCopierCounts = buildPilotCopierCounts(pilots);
  const revenueTrendCache = new Map<string, number[]>();
  const entries = navigators.map((navigator) => {
    const composite = calculateValueScore(navigator, navigators);
    const copiedVolumeDaily = Math.max(0, navigator.groupVolume * 1_000_000);
    const dailyRevenue = Math.max(0, navigator.brokerRevenueShare);
    const monthlyRevenue = Math.round(dailyRevenue * 30);
    const revenueSharePct = computeRevenueSharePct(
      dailyRevenue,
      copiedVolumeDaily,
    );
    const copiers = pilotCopierCounts.get(navigator.id) ?? navigator.followers;

    return {
      id: navigator.id,
      entry: {
        valueScore: composite.score,
        valueTier: composite.tier,
        valueLabel: composite.label,
        valueRank: 0,
        revenueRank: 0,
        isRevenueLeader: false,
        brokerValue: {
          dailyRevenue,
          monthlyRevenue,
          revenueSharePct,
          copiedVolumeDaily,
          copiedVolumeMonthly: Math.round(copiedVolumeDaily * 30),
          copiers,
        },
        revenueTrend: getRevenueTrend(
          navigator.id,
          dailyRevenue,
          revenueTrendCache,
        ),
      },
    };
  });

  const sortedByValue = [...entries].sort(
    (a, b) => b.entry.valueScore - a.entry.valueScore,
  );
  sortedByValue.forEach((item, index) => {
    item.entry.valueRank = index + 1;
  });

  const sortedByRevenue = [...entries].sort(
    (a, b) => b.entry.brokerValue.dailyRevenue - a.entry.brokerValue.dailyRevenue,
  );
  sortedByRevenue.forEach((item, index) => {
    item.entry.revenueRank = index + 1;
    item.entry.isRevenueLeader = index === 0;
  });

  return entries.reduce<NavigatorValueMap>((acc, { id, entry }) => {
    acc[id] = entry;
    return acc;
  }, {});
}

export function calculateHighQualityRevenue(
  navigators: Navigator[],
  pilots: Pilot[] = [],
): number {
  return computeHighQualityRevenueStats(navigators, pilots).high;
}

export function calculateHighQualityRevenuePct(
  navigators: Navigator[],
  pilots: Pilot[] = [],
): number {
  const { high, total } = computeHighQualityRevenueStats(navigators, pilots);
  if (total === 0) {
    return 0;
  }
  return (high / total) * 100;
}

function computeHighQualityRevenueStats(
  navigators: Navigator[],
  pilots: Pilot[],
) {
  if (!navigators.length) {
    return { high: 0, total: 0 };
  }

  const valueMap = getNavigatorValueMap(navigators, pilots);

  return navigators.reduce(
    (acc, navigator) => {
      const revenue = Math.max(0, navigator.brokerRevenueShare);
      acc.total += revenue;

      const meta = valueMap[navigator.id];
      const isHighTier = meta?.valueTier === "high" || navigator.valueTier === "high";
      const pilotScore = navigator.pilotScore ?? 0;
      const valueScore = meta?.valueScore ?? navigator.valueScore ?? 0;
      const isHighScore = pilotScore >= 750 || valueScore >= 75;

      if (isHighTier || isHighScore) {
        acc.high += revenue;
      }

      return acc;
    },
    { high: 0, total: 0 },
  );
}

function buildPilotCopierCounts(pilots: Pilot[]) {
  return pilots.reduce<Map<string, number>>((acc, pilot) => {
    const inferredCopiers = Math.max(1, Math.round(pilot.tradesCopied / 5));
    for (const navigatorId of pilot.navigatorIds) {
      acc.set(
        navigatorId,
        (acc.get(navigatorId) ?? 0) + inferredCopiers,
      );
    }
    return acc;
  }, new Map());
}

function computeRevenueSharePct(dailyRevenue: number, copiedVolumeDaily: number) {
  if (copiedVolumeDaily === 0) {
    return 0;
  }
  const pct = (dailyRevenue / copiedVolumeDaily) * 100;
  return Math.min(100, Math.max(0, Number(pct.toFixed(2))));
}

function getRevenueTrend(
  seed: string,
  baseRevenue: number,
  cache: Map<string, number[]>,
) {
  if (cache.has(seed)) {
    return cache.get(seed)!;
  }

  const safeBase = baseRevenue || 1_000;
  const trend = Array.from({ length: 7 }, (_, index) => {
    const variance = Math.sin(seed.charCodeAt(index % seed.length) + index) * 0.08;
    const directionalBias = (index - 3) * 0.01;
    const value = safeBase * (1 + variance + directionalBias);
    return Math.max(0, Math.round(value));
  });

  cache.set(seed, trend);
  return trend;
}
