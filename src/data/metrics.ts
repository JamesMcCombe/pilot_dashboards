import type { DashboardMetricsSnapshot } from "./types";

const revenueTrendWithPilot = [368_000, 392_500, 405_800, 421_300, 438_700, 462_400, 485_200];
const revenueTrendBaseline = [158_000, 164_500, 168_900, 172_200, 175_600, 178_300, 182_400];
const volumeLiftTrend = [54, 57, 59, 61, 64, 66, 68];
const activeCopierTrendWithPilot = [9_850, 10_420, 11_050, 11_980, 12_350, 12_860, 13_240];
const activeCopierTrendBaseline = [4_100, 4_230, 4_380, 4_510, 4_680, 4_820, 4_940];
const navigatorRevenueTrendWithPilot = [128_400, 136_500, 142_800, 151_600, 163_200, 174_900, 182_500];
const navigatorRevenueTrendBaseline = [72_400, 74_800, 79_600, 82_200, 86_900, 91_100, 97_400];
const blueprintTrendWithPilot = [12, 15, 18, 21, 24, 29, 34];
const blueprintTrendBaseline = [5, 6, 7, 7, 8, 9, 9];

export const withPilotMetrics: DashboardMetricsSnapshot = {
  brokerRevenueToday: {
    value: 485_200,
    trend: revenueTrendWithPilot,
  },
  volumeLiftPercent: {
    value: 68,
    trend: volumeLiftTrend,
    label: "vs baseline",
  },
  activeCopiers: {
    value: 13_240,
    trend: activeCopierTrendWithPilot,
  },
  topNavigatorRevenueToday: {
    value: 182_500,
    trend: navigatorRevenueTrendWithPilot,
    navigatorId: "astra-quant",
    navigatorName: "Astra Quant",
  },
  totalBlueprintSales: {
    value: 34,
    trend: blueprintTrendWithPilot,
  },
};

export const baselineMetrics: DashboardMetricsSnapshot = {
  brokerRevenueToday: {
    value: 182_400,
    trend: revenueTrendBaseline,
  },
  volumeLiftPercent: {
    value: 0,
    trend: [0, 0, 0, 0, 0, 0, 0],
    label: "baseline",
  },
  activeCopiers: {
    value: 4_940,
    trend: activeCopierTrendBaseline,
  },
  topNavigatorRevenueToday: {
    value: 97_400,
    trend: navigatorRevenueTrendBaseline,
    navigatorId: "astra-quant",
    navigatorName: "Astra Quant",
  },
  totalBlueprintSales: {
    value: 9,
    trend: blueprintTrendBaseline,
  },
};
