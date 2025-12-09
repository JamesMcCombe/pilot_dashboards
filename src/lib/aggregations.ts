import { groups } from "@/data/groups";
import { navigators } from "@/data/navigators";
import { pilots } from "@/data/pilots";
import type { Group, MetricSparkline, Navigator, Pilot } from "@/data/types";
import { getNavigatorValueMap } from "@/lib/value-score-map";
import type { ValueTier } from "@/lib/value-score";

export type FunnelTimeframe = "thisMonth" | "lastMonth" | "last90Days";

export type FunnelStage = {
  label: string;
  value: number;
  conversionToNext: number;
  deltaVsLast30d: number;
};

export type HistogramBin = {
  label: string;
  value: number;
};

export type SegmentStat = {
  label: string;
  description: string;
  count: number;
  percent: number;
};

export type NavigatorEconomicsRow = {
  id: string;
  name: string;
  valueScore: number;
  valueTier?: ValueTier;
  valueLabel?: string;
  brokerRevenue30d: number;
  totalCopiers: number;
  newCopiers30d: number;
  lostCopiers30d: number;
  retention30d: number;
  avgCopierLifetimeDays: number;
  avgCopierRevenue: number;
};

export type BlueprintAnalyticsRow = {
  name: string;
  sales30d: number;
  adoptionRate: number;
  retention30d: number;
  brokerRevenue30d: number;
  avgUserPnL: number;
};

type AggregatedCopierStats = {
  registered: number;
  firstCopy: number;
  active: number;
  retained30d: number;
};

const FUNNEL_SCALES: Record<FunnelTimeframe | "twoMonthsAgo", number> = {
  thisMonth: 1,
  lastMonth: 0.92,
  last90Days: 1.12,
  twoMonthsAgo: 0.85,
};

const FUNNEL_REFERENCES: Record<FunnelTimeframe, FunnelTimeframe | "twoMonthsAgo"> = {
  thisMonth: "lastMonth",
  lastMonth: "twoMonthsAgo",
  last90Days: "thisMonth",
};

export function getCopyTradingFunnel(range: FunnelTimeframe): FunnelStage[] {
  const aggregate = aggregateCopierStats();
  const baseStages = buildFunnelStages(aggregate);
  const scale = FUNNEL_SCALES[range] ?? 1;
  const referenceRange = FUNNEL_REFERENCES[range];
  const referenceScale = FUNNEL_SCALES[referenceRange] ?? 1;

  return baseStages.map((stage) => {
    const scaledValue = Math.round(stage.value * scale);
    const referenceValue = Math.max(1, Math.round(stage.value * referenceScale));
    const delta = ((scaledValue - referenceValue) / referenceValue) * 100;
    return {
      label: stage.label,
      value: scaledValue,
      conversionToNext: stage.conversionToNext,
      deltaVsLast30d: Number(delta.toFixed(1)),
    };
  });
}

export function getNavigatorEconomicsLeaderboardRows(): NavigatorEconomicsRow[] {
  const navigatorValueMap = getNavigatorValueMap(navigators, pilots);

  return [...navigators]
    .map((navigator) => {
      const economics = navigator.navigatorEconomics;
      const meta = navigatorValueMap[navigator.id];
      const brokerRevenue30d = economics?.brokerRevenue30d ?? navigator.brokerRevenueShare * 30;
      const avgLifetime = economics?.avgCopierLifetimeDays ?? 210;
      const avgRevenue = economics?.avgCopierRevenue ?? 820;
      const totalCopiers = navigator.totalCopiers ?? navigator.followers;
      const newCopiers30d = navigator.newCopiers30d ?? Math.round(totalCopiers * 0.11);
      const lostCopiers30d = navigator.lostCopiers30d ?? Math.round(totalCopiers * 0.05);
      const retention30d = navigator.retention30d ?? 75;

      return {
        id: navigator.id,
        name: navigator.name,
        valueScore: meta?.valueScore ?? navigator.pilotScore / 10,
        valueTier: meta?.valueTier,
        valueLabel: meta?.valueLabel,
        brokerRevenue30d,
        totalCopiers,
        newCopiers30d,
        lostCopiers30d,
        retention30d,
        avgCopierLifetimeDays: avgLifetime,
        avgCopierRevenue: avgRevenue,
      } satisfies NavigatorEconomicsRow;
    })
    .sort((a, b) => b.valueScore - a.valueScore);
}

export function getCopierBehaviourStats(): {
  profitDistribution: HistogramBin[];
  frequencyDistribution: HistogramBin[];
  segments: SegmentStat[];
} {
  const profitBins: HistogramBin[] = [
    { label: "<-10k", value: 0 },
    { label: "-10k to 0", value: 0 },
    { label: "0 to 25k", value: 0 },
    { label: "25k to 50k", value: 0 },
    { label: "50k to 75k", value: 0 },
    { label: ">75k", value: 0 },
  ];

  const frequencyBins: HistogramBin[] = [
    { label: "0-10", value: 0 },
    { label: "11-20", value: 0 },
    { label: "21-30", value: 0 },
    { label: "31-40", value: 0 },
    { label: "40+", value: 0 },
  ];

  pilots.forEach((pilot) => {
    const econ = pilot.pilotEconomics;
    const profit = econ?.copierProfit ?? pilot.profit;
    const frequency = econ?.copyFrequency ?? Math.round(pilot.tradesCopied / 6);

    if (profit < -10_000) profitBins[0].value += 1;
    else if (profit < 0) profitBins[1].value += 1;
    else if (profit < 25_000) profitBins[2].value += 1;
    else if (profit < 50_000) profitBins[3].value += 1;
    else if (profit < 75_000) profitBins[4].value += 1;
    else profitBins[5].value += 1;

    if (frequency <= 10) frequencyBins[0].value += 1;
    else if (frequency <= 20) frequencyBins[1].value += 1;
    else if (frequency <= 30) frequencyBins[2].value += 1;
    else if (frequency <= 40) frequencyBins[3].value += 1;
    else frequencyBins[4].value += 1;
  });

  const totalPilots = pilots.length || 1;

  const segments = [
    {
      label: "Dormant",
      description: "No copies in 30d",
      count: pilots.filter((pilot) => (pilot.pilotEconomics?.copyFrequency ?? 0) < 12).length,
    },
    {
      label: "Occasional",
      description: "1-2 copies per week",
      count: pilots.filter((pilot) => {
        const freq = pilot.pilotEconomics?.copyFrequency ?? 0;
        return freq >= 12 && freq < 22;
      }).length,
    },
    {
      label: "Active",
      description: "3-4 copies per week",
      count: pilots.filter((pilot) => {
        const freq = pilot.pilotEconomics?.copyFrequency ?? 0;
        return freq >= 22 && freq < 32;
      }).length,
    },
    {
      label: "Power Copier",
      description: "5+ copies per week",
      count: pilots.filter((pilot) => (pilot.pilotEconomics?.copyFrequency ?? 0) >= 32).length,
    },
  ].map((segment) => ({
    ...segment,
    percent: Number(((segment.count / totalPilots) * 100).toFixed(1)),
  }));

  return { profitDistribution: profitBins, frequencyDistribution: frequencyBins, segments };
}

export function getBlueprintAnalyticsRows(): BlueprintAnalyticsRow[] {
  return [
    {
      name: "Navigator Momentum",
      sales30d: 128,
      adoptionRate: 42,
      retention30d: 88,
      brokerRevenue30d: 1_420_000,
      avgUserPnL: 12_400,
    },
    {
      name: "Precision Grid",
      sales30d: 94,
      adoptionRate: 33,
      retention30d: 82,
      brokerRevenue30d: 980_000,
      avgUserPnL: 8_700,
    },
    {
      name: "Signal Relay",
      sales30d: 76,
      adoptionRate: 27,
      retention30d: 79,
      brokerRevenue30d: 760_000,
      avgUserPnL: 6_900,
    },
  ];
}

export function getNavigatorRevenueConcentrationShare(topN = 3): number {
  const sortedByRevenue = [...navigators]
    .map((navigator) => navigator.navigatorEconomics?.brokerRevenue30d ?? navigator.brokerRevenueShare * 30)
    .sort((a, b) => b - a);

  const totalRevenue = sortedByRevenue.reduce((sum, value) => sum + value, 0) || 1;
  const topRevenue = sortedByRevenue.slice(0, topN).reduce((sum, value) => sum + value, 0);
  return Number(((topRevenue / totalRevenue) * 100).toFixed(1));
}

export function getCopyTradingKpiSeries(): {
  newCopiersToday: MetricSparkline;
  lostCopiersToday: MetricSparkline;
  copierRetention30d: MetricSparkline;
  navigatorRevenueConcentration: number;
} {
  const aggregate = aggregateCopierStats();
  const totalNew30d = navigators.reduce((sum, navigator) => sum + (navigator.newCopiers30d ?? 0), 0) || aggregate.registered * 0.12;
  const totalLost30d = navigators.reduce((sum, navigator) => sum + (navigator.lostCopiers30d ?? 0), 0) || aggregate.active * 0.04;
  const newDaily = Math.round(totalNew30d / 30);
  const lostDaily = Math.round(totalLost30d / 30);

  const retentionRatio = aggregate.active ? (aggregate.retained30d / aggregate.active) * 100 : 0;

  return {
    newCopiersToday: buildSparkline(newDaily, 0.08),
    lostCopiersToday: buildSparkline(lostDaily, 0.12),
    copierRetention30d: buildSparkline(Number(retentionRatio.toFixed(1)), 0.04),
    navigatorRevenueConcentration: getNavigatorRevenueConcentrationShare(3),
  };
}

export function getNavigatorEconomicsSnapshot(navigatorId: string): {
  navigator: Navigator | undefined;
  relatedGroups: Group[];
  relatedPilots: Pilot[];
} {
  const navigator = navigators.find((item) => item.id === navigatorId);
  const relatedGroups = groups.filter((group) => group.navigatorId === navigatorId);
  const relatedPilots = pilots.filter((pilot) => pilot.navigatorIds.includes(navigatorId));
  return { navigator, relatedGroups, relatedPilots };
}

function aggregateCopierStats(): AggregatedCopierStats {
  return navigators.reduce<AggregatedCopierStats>(
    (acc, navigator) => {
      if (navigator.copierStats) {
        acc.registered += navigator.copierStats.registered;
        acc.firstCopy += navigator.copierStats.firstCopy;
        acc.active += navigator.copierStats.active;
        acc.retained30d += navigator.copierStats.retained30d;
      } else {
        const inferredRegistered = navigator.followers * 1.1;
        const inferredFirstCopy = inferredRegistered * 0.68;
        const inferredActive = inferredFirstCopy * 0.78;
        const inferredRetained = inferredActive * 0.75;
        acc.registered += inferredRegistered;
        acc.firstCopy += inferredFirstCopy;
        acc.active += inferredActive;
        acc.retained30d += inferredRetained;
      }
      return acc;
    },
    { registered: 0, firstCopy: 0, active: 0, retained30d: 0 },
  );
}

function buildFunnelStages(stats: AggregatedCopierStats): FunnelStage[] {
  const { registered, firstCopy, active, retained30d } = stats;
  const safeRegistered = Math.max(registered, 1);
  const safeFirstCopy = Math.max(firstCopy, 1);
  const safeActive = Math.max(active, 1);

  return [
    {
      label: "Registered",
      value: Math.round(safeRegistered),
      conversionToNext: Number(((safeFirstCopy / safeRegistered) * 100).toFixed(1)),
      deltaVsLast30d: 0,
    },
    {
      label: "First Copy",
      value: Math.round(safeFirstCopy),
      conversionToNext: Number(((safeActive / safeFirstCopy) * 100).toFixed(1)),
      deltaVsLast30d: 0,
    },
    {
      label: "Active Copier",
      value: Math.round(safeActive),
      conversionToNext: Number(((retained30d / safeActive) * 100).toFixed(1)),
      deltaVsLast30d: 0,
    },
    {
      label: "Retained 30d",
      value: Math.round(retained30d),
      conversionToNext: 0,
      deltaVsLast30d: 0,
    },
  ];
}

function buildSparkline(value: number, variance: number): MetricSparkline {
  const trend = Array.from({ length: 7 }, (_, index) => {
    const wave = Math.sin(index * 0.8) * variance;
    const bias = (index - 3) * variance * 0.4;
    const nextValue = value * (1 + wave + bias);
    return Number(nextValue.toFixed(0));
  });

  return {
    value,
    trend,
  };
}
