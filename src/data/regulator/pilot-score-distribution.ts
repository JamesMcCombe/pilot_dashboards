import type { PilotScoreBin } from "./types";

// Synthetic PilotScore distribution for NZ retail traders
// Skewed toward lower scores to demonstrate harm patterns
export const pilotScoreDistribution: PilotScoreBin[] = [
  { range: "0-10", min: 0, max: 10, count: 142, percentage: 8.2 },
  { range: "11-20", min: 11, max: 20, count: 186, percentage: 10.7 },
  { range: "21-30", min: 21, max: 30, count: 168, percentage: 9.7 },
  { range: "31-40", min: 31, max: 40, count: 154, percentage: 8.9 },
  { range: "41-50", min: 41, max: 50, count: 198, percentage: 11.4 },
  { range: "51-60", min: 51, max: 60, count: 224, percentage: 12.9 },
  { range: "61-70", min: 61, max: 70, count: 201, percentage: 11.6 },
  { range: "71-80", min: 71, max: 80, count: 178, percentage: 10.3 },
  { range: "81-90", min: 81, max: 90, count: 156, percentage: 9.0 },
  { range: "91-100", min: 91, max: 100, count: 128, percentage: 7.4 },
];

// High-harm zone threshold (0-40)
export const HIGH_HARM_THRESHOLD = 40;

// Total traders in sample
export const TOTAL_TRADERS = pilotScoreDistribution.reduce((sum, bin) => sum + bin.count, 0);

// Traders in high-harm zone
export const HIGH_HARM_COUNT = pilotScoreDistribution
  .filter((bin) => bin.max <= HIGH_HARM_THRESHOLD)
  .reduce((sum, bin) => sum + bin.count, 0);

export const HIGH_HARM_PERCENTAGE = ((HIGH_HARM_COUNT / TOTAL_TRADERS) * 100).toFixed(1);

// Average PilotScore
export const AVERAGE_PILOT_SCORE = Math.round(
  pilotScoreDistribution.reduce((sum, bin) => {
    const midpoint = (bin.min + bin.max) / 2;
    return sum + midpoint * bin.count;
  }, 0) / TOTAL_TRADERS
);

// Median PilotScore (approximation)
export const MEDIAN_PILOT_SCORE = 52;
