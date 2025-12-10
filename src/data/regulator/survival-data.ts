import type { BlowupPattern } from "./types";

// Time-to-failure survival curve data (Kaplan-Meier style)
// Multiple jurisdictions for comparison
export interface SurvivalDataPointExtended {
  day: number;
  nzSurvival: number;
  globalSurvival: number;
  auSurvival: number;
  ukSurvival: number;
  usSurvival: number;
  thSurvival: number;
  mySurvival: number;
}

export const survivalCurveData: SurvivalDataPointExtended[] = [
  { day: 0, nzSurvival: 100, globalSurvival: 100, auSurvival: 100, ukSurvival: 100, usSurvival: 100, thSurvival: 100, mySurvival: 100 },
  { day: 7, nzSurvival: 82, globalSurvival: 88, auSurvival: 85, ukSurvival: 90, usSurvival: 91, thSurvival: 78, mySurvival: 75 },
  { day: 14, nzSurvival: 68, globalSurvival: 78, auSurvival: 72, ukSurvival: 82, usSurvival: 84, thSurvival: 62, mySurvival: 58 },
  { day: 21, nzSurvival: 56, globalSurvival: 70, auSurvival: 62, ukSurvival: 75, usSurvival: 78, thSurvival: 50, mySurvival: 45 },
  { day: 30, nzSurvival: 45, globalSurvival: 62, auSurvival: 52, ukSurvival: 68, usSurvival: 72, thSurvival: 40, mySurvival: 35 },
  { day: 45, nzSurvival: 34, globalSurvival: 52, auSurvival: 42, ukSurvival: 58, usSurvival: 62, thSurvival: 30, mySurvival: 26 },
  { day: 60, nzSurvival: 26, globalSurvival: 44, auSurvival: 35, ukSurvival: 50, usSurvival: 54, thSurvival: 22, mySurvival: 19 },
  { day: 90, nzSurvival: 18, globalSurvival: 35, auSurvival: 26, ukSurvival: 40, usSurvival: 44, thSurvival: 15, mySurvival: 12 },
  { day: 120, nzSurvival: 12, globalSurvival: 28, auSurvival: 20, ukSurvival: 32, usSurvival: 36, thSurvival: 10, mySurvival: 8 },
  { day: 150, nzSurvival: 8, globalSurvival: 22, auSurvival: 15, ukSurvival: 26, usSurvival: 30, thSurvival: 7, mySurvival: 5 },
  { day: 180, nzSurvival: 6, globalSurvival: 18, auSurvival: 12, ukSurvival: 22, usSurvival: 25, thSurvival: 5, mySurvival: 4 },
];

// Jurisdiction metadata for toggles
export const jurisdictions = {
  nz: { key: "nzSurvival", label: "New Zealand", color: "#f87171", medianTTF: 28 },
  global: { key: "globalSurvival", label: "Global Benchmark", color: "#53f6c5", medianTTF: 52 },
  au: { key: "auSurvival", label: "Australia", color: "#fbbf24", medianTTF: 38 },
  uk: { key: "ukSurvival", label: "United Kingdom", color: "#60a5fa", medianTTF: 58 },
  us: { key: "usSurvival", label: "United States", color: "#a78bfa", medianTTF: 65 },
  th: { key: "thSurvival", label: "Thailand", color: "#f472b6", medianTTF: 24 },
  my: { key: "mySurvival", label: "Malaysia", color: "#fb923c", medianTTF: 21 },
} as const;

export type JurisdictionKey = keyof typeof jurisdictions;

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
