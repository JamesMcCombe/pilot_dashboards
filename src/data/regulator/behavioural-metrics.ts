import type { BehaviouralMetric } from "./types";

// Leverage usage distribution
export const leverageDistribution: BehaviouralMetric[] = [
  { value: 5, label: "1:5 or less", count: 124, percentage: 7.1 },
  { value: 10, label: "1:10", count: 186, percentage: 10.7 },
  { value: 20, label: "1:20", count: 245, percentage: 14.1 },
  { value: 30, label: "1:30", count: 312, percentage: 18.0 },
  { value: 50, label: "1:50", count: 378, percentage: 21.8 },
  { value: 100, label: "1:100", count: 298, percentage: 17.2 },
  { value: 200, label: "1:200", count: 124, percentage: 7.1 },
  { value: 500, label: "1:500+", count: 68, percentage: 3.9 },
];

// Average leverage
export const AVERAGE_LEVERAGE = 52;
export const MEDIAN_LEVERAGE = 45;
export const HIGH_LEVERAGE_THRESHOLD = 100;
export const HIGH_LEVERAGE_PCT = leverageDistribution
  .filter((d) => d.value >= HIGH_LEVERAGE_THRESHOLD)
  .reduce((sum, d) => sum + d.percentage, 0)
  .toFixed(1);

// Stop-loss usage
export const stopLossUsage = {
  always: { label: "Always uses stop-loss", count: 312, percentage: 18.0 },
  usually: { label: "Usually (>75%)", count: 428, percentage: 24.7 },
  sometimes: { label: "Sometimes (25-75%)", count: 524, percentage: 30.2 },
  rarely: { label: "Rarely (<25%)", count: 298, percentage: 17.2 },
  never: { label: "Never uses stop-loss", count: 173, percentage: 10.0 },
};

export const STOP_LOSS_ADOPTION_RATE = (
  stopLossUsage.always.percentage + stopLossUsage.usually.percentage
).toFixed(1);

export const NO_STOP_LOSS_PCT = (
  stopLossUsage.rarely.percentage + stopLossUsage.never.percentage
).toFixed(1);

// Volatility exposure distribution
export const volatilityExposure: BehaviouralMetric[] = [
  { value: 10, label: "Very Low", count: 156, percentage: 9.0 },
  { value: 30, label: "Low", count: 312, percentage: 18.0 },
  { value: 50, label: "Moderate", count: 498, percentage: 28.7 },
  { value: 70, label: "High", count: 412, percentage: 23.8 },
  { value: 90, label: "Very High", count: 357, percentage: 20.6 },
];

export const HIGH_VOLATILITY_EXPOSURE_PCT = volatilityExposure
  .filter((d) => d.value >= 70)
  .reduce((sum, d) => sum + d.percentage, 0)
  .toFixed(1);

// Trading frequency distribution
export const tradingFrequency: BehaviouralMetric[] = [
  { value: 1, label: "1-5 trades/week", count: 245, percentage: 14.1 },
  { value: 2, label: "6-15 trades/week", count: 398, percentage: 22.9 },
  { value: 3, label: "16-30 trades/week", count: 478, percentage: 27.6 },
  { value: 4, label: "31-50 trades/week", count: 356, percentage: 20.5 },
  { value: 5, label: "50+ trades/week", count: 258, percentage: 14.9 },
];

export const AVG_TRADES_PER_WEEK = 24;
export const OVERTRADING_THRESHOLD = 50;
export const OVERTRADING_PCT = tradingFrequency
  .filter((d) => d.value >= 5)
  .reduce((sum, d) => sum + d.percentage, 0)
  .toFixed(1);

// Risk discipline score distribution (composite metric)
export const riskDisciplineScore: BehaviouralMetric[] = [
  { value: 10, label: "Very Poor (0-20)", count: 186, percentage: 10.7 },
  { value: 30, label: "Poor (21-40)", count: 298, percentage: 17.2 },
  { value: 50, label: "Average (41-60)", count: 524, percentage: 30.2 },
  { value: 70, label: "Good (61-80)", count: 412, percentage: 23.8 },
  { value: 90, label: "Excellent (81-100)", count: 315, percentage: 18.2 },
];

export const AVG_RISK_DISCIPLINE = 52;
export const POOR_DISCIPLINE_PCT = riskDisciplineScore
  .filter((d) => d.value <= 30)
  .reduce((sum, d) => sum + d.percentage, 0)
  .toFixed(1);
