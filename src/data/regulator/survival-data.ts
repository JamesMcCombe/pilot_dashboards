import type { SurvivalDataPoint, BlowupPattern } from "./types";

// Time-to-failure survival curve data (Kaplan-Meier style)
// NZ cohort vs Global benchmark
export const survivalCurveData: SurvivalDataPoint[] = [
  { day: 0, nzSurvival: 100, globalSurvival: 100 },
  { day: 7, nzSurvival: 82, globalSurvival: 88 },
  { day: 14, nzSurvival: 68, globalSurvival: 78 },
  { day: 21, nzSurvival: 56, globalSurvival: 70 },
  { day: 30, nzSurvival: 45, globalSurvival: 62 },
  { day: 45, nzSurvival: 34, globalSurvival: 52 },
  { day: 60, nzSurvival: 26, globalSurvival: 44 },
  { day: 90, nzSurvival: 18, globalSurvival: 35 },
  { day: 120, nzSurvival: 12, globalSurvival: 28 },
  { day: 150, nzSurvival: 8, globalSurvival: 22 },
  { day: 180, nzSurvival: 6, globalSurvival: 18 },
];

// Median time-to-failure (days)
export const NZ_MEDIAN_TTF = 28;
export const GLOBAL_MEDIAN_TTF = 52;

// Early loss concentration (% failing within 30 days)
export const NZ_EARLY_LOSS_PCT = 55;
export const GLOBAL_EARLY_LOSS_PCT = 38;

// Repeated blowup patterns (synthetic)
export const blowupPatterns: BlowupPattern[] = [
  { traderId: "NZ-T001", blowupCount: 5, avgDaysBetween: 18, totalLoss: 12400, riskCategory: "extreme" },
  { traderId: "NZ-T002", blowupCount: 4, avgDaysBetween: 24, totalLoss: 8900, riskCategory: "extreme" },
  { traderId: "NZ-T003", blowupCount: 4, avgDaysBetween: 31, totalLoss: 7200, riskCategory: "high" },
  { traderId: "NZ-T004", blowupCount: 3, avgDaysBetween: 22, totalLoss: 6100, riskCategory: "high" },
  { traderId: "NZ-T005", blowupCount: 3, avgDaysBetween: 28, totalLoss: 5400, riskCategory: "high" },
  { traderId: "NZ-T006", blowupCount: 3, avgDaysBetween: 35, totalLoss: 4800, riskCategory: "moderate" },
  { traderId: "NZ-T007", blowupCount: 2, avgDaysBetween: 42, totalLoss: 3600, riskCategory: "moderate" },
  { traderId: "NZ-T008", blowupCount: 2, avgDaysBetween: 38, totalLoss: 3200, riskCategory: "moderate" },
  { traderId: "NZ-T009", blowupCount: 2, avgDaysBetween: 45, totalLoss: 2800, riskCategory: "moderate" },
  { traderId: "NZ-T010", blowupCount: 2, avgDaysBetween: 52, totalLoss: 2400, riskCategory: "moderate" },
];

// Blowup statistics
export const REPEAT_BLOWUP_TRADERS = blowupPatterns.length;
export const AVG_BLOWUPS_PER_TRADER = (
  blowupPatterns.reduce((sum, p) => sum + p.blowupCount, 0) / REPEAT_BLOWUP_TRADERS
).toFixed(1);
export const TOTAL_REPEAT_LOSSES = blowupPatterns.reduce((sum, p) => sum + p.totalLoss, 0);

// Blowup frequency distribution
export const blowupFrequencyData = [
  { blowups: "1", count: 245, percentage: 58 },
  { blowups: "2", count: 98, percentage: 23 },
  { blowups: "3", count: 52, percentage: 12 },
  { blowups: "4+", count: 28, percentage: 7 },
];
