import type { PlatformUsage } from "./types";

// Platform usage breakdown
export const platformUsageData: PlatformUsage[] = [
  {
    platform: "MT4",
    percentage: 42.3,
    traderCount: 734,
    avgPilotScore: 48,
    riskProfile: "medium",
  },
  {
    platform: "MT5",
    percentage: 28.6,
    traderCount: 496,
    avgPilotScore: 52,
    riskProfile: "medium",
  },
  {
    platform: "NinjaTrader",
    percentage: 14.2,
    traderCount: 246,
    avgPilotScore: 58,
    riskProfile: "low",
  },
  {
    platform: "IBKR",
    percentage: 8.4,
    traderCount: 146,
    avgPilotScore: 64,
    riskProfile: "low",
  },
  {
    platform: "Other",
    percentage: 6.5,
    traderCount: 113,
    avgPilotScore: 44,
    riskProfile: "high",
  },
];

// Platform-specific insights
export const platformInsights = {
  MT4: {
    propFirmUsage: 68,
    avgLeverage: 58,
    stopLossRate: 38,
    commonInstruments: ["EURUSD", "GBPUSD", "XAUUSD"],
  },
  MT5: {
    propFirmUsage: 52,
    avgLeverage: 48,
    stopLossRate: 45,
    commonInstruments: ["EURUSD", "USDJPY", "GBPJPY"],
  },
  NinjaTrader: {
    propFirmUsage: 24,
    avgLeverage: 32,
    stopLossRate: 62,
    commonInstruments: ["ES", "NQ", "CL"],
  },
  IBKR: {
    propFirmUsage: 8,
    avgLeverage: 18,
    stopLossRate: 72,
    commonInstruments: ["SPY", "QQQ", "AAPL"],
  },
};

// Connection type breakdown
export const connectionTypes = [
  { type: "API Direct", percentage: 34, description: "Direct API connection to broker" },
  { type: "MT4/MT5 Bridge", percentage: 48, description: "Connected via MetaTrader bridge" },
  { type: "Manual Import", percentage: 12, description: "Manually imported trade data" },
  { type: "Third-party Sync", percentage: 6, description: "Via third-party aggregator" },
];

// Multi-platform users
export const MULTI_PLATFORM_USERS = 287;
export const MULTI_PLATFORM_PCT = "16.5";

// Platform migration trends (last 6 months)
export const platformMigrationTrend = [
  { month: "Jun", mt4: 48, mt5: 24, ninjaTrader: 12, ibkr: 10, other: 6 },
  { month: "Jul", mt4: 47, mt5: 25, ninjaTrader: 12, ibkr: 10, other: 6 },
  { month: "Aug", mt4: 45, mt5: 27, ninjaTrader: 13, ibkr: 9, other: 6 },
  { month: "Sep", mt4: 44, mt5: 28, ninjaTrader: 13, ibkr: 9, other: 6 },
  { month: "Oct", mt4: 43, mt5: 28, ninjaTrader: 14, ibkr: 8, other: 7 },
  { month: "Nov", mt4: 42, mt5: 29, ninjaTrader: 14, ibkr: 8, other: 7 },
];
