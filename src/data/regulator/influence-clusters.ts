import type { TradingClusterEvent, HerdingCell, VolatilityTrigger } from "./types";

// Trading cluster events - shows coordinated trading behavior
// These represent inferred influence patterns without monitoring content
export const tradingClusterEvents: TradingClusterEvent[] = [
  // Cluster A - Morning session burst
  { traderId: "NZ-T101", timestamp: "2024-11-15T09:32:00Z", instrument: "EURUSD", clusterId: "cluster-a" },
  { traderId: "NZ-T102", timestamp: "2024-11-15T09:33:00Z", instrument: "EURUSD", clusterId: "cluster-a" },
  { traderId: "NZ-T103", timestamp: "2024-11-15T09:33:30Z", instrument: "EURUSD", clusterId: "cluster-a" },
  { traderId: "NZ-T104", timestamp: "2024-11-15T09:34:00Z", instrument: "EURUSD", clusterId: "cluster-a" },
  { traderId: "NZ-T105", timestamp: "2024-11-15T09:34:15Z", instrument: "EURUSD", clusterId: "cluster-a" },
  { traderId: "NZ-T106", timestamp: "2024-11-15T09:35:00Z", instrument: "EURUSD", clusterId: "cluster-a" },
  { traderId: "NZ-T107", timestamp: "2024-11-15T09:35:30Z", instrument: "EURUSD", clusterId: "cluster-a" },
  
  // Cluster B - Gold rush
  { traderId: "NZ-T201", timestamp: "2024-11-15T14:15:00Z", instrument: "XAUUSD", clusterId: "cluster-b" },
  { traderId: "NZ-T202", timestamp: "2024-11-15T14:15:30Z", instrument: "XAUUSD", clusterId: "cluster-b" },
  { traderId: "NZ-T203", timestamp: "2024-11-15T14:16:00Z", instrument: "XAUUSD", clusterId: "cluster-b" },
  { traderId: "NZ-T204", timestamp: "2024-11-15T14:16:20Z", instrument: "XAUUSD", clusterId: "cluster-b" },
  { traderId: "NZ-T205", timestamp: "2024-11-15T14:17:00Z", instrument: "XAUUSD", clusterId: "cluster-b" },
  
  // Cluster C - Evening session
  { traderId: "NZ-T301", timestamp: "2024-11-15T21:45:00Z", instrument: "GBPJPY", clusterId: "cluster-c" },
  { traderId: "NZ-T302", timestamp: "2024-11-15T21:45:30Z", instrument: "GBPJPY", clusterId: "cluster-c" },
  { traderId: "NZ-T303", timestamp: "2024-11-15T21:46:00Z", instrument: "GBPJPY", clusterId: "cluster-c" },
  { traderId: "NZ-T304", timestamp: "2024-11-15T21:46:30Z", instrument: "GBPJPY", clusterId: "cluster-c" },
  
  // Scattered non-cluster trades
  { traderId: "NZ-T401", timestamp: "2024-11-15T11:22:00Z", instrument: "USDJPY", clusterId: "none" },
  { traderId: "NZ-T402", timestamp: "2024-11-15T16:45:00Z", instrument: "AUDUSD", clusterId: "none" },
  { traderId: "NZ-T403", timestamp: "2024-11-15T08:12:00Z", instrument: "NZDUSD", clusterId: "none" },
];

// Herding heatmap data - intensity of coordinated entries by hour/day
export const herdingHeatmapData: HerdingCell[] = [];

// Generate heatmap data for 7 days x 24 hours
for (let day = 0; day < 7; day++) {
  for (let hour = 0; hour < 24; hour++) {
    // Higher intensity during market open hours and weekdays
    let baseIntensity = 0;
    
    // London/NY overlap (13:00-17:00 UTC)
    if (hour >= 13 && hour <= 17 && day < 5) {
      baseIntensity = 60 + Math.random() * 40;
    }
    // Asian session (00:00-08:00 UTC)
    else if (hour >= 0 && hour <= 8 && day < 5) {
      baseIntensity = 30 + Math.random() * 30;
    }
    // European session (08:00-13:00 UTC)
    else if (hour >= 8 && hour <= 13 && day < 5) {
      baseIntensity = 40 + Math.random() * 35;
    }
    // Weekend - minimal
    else if (day >= 5) {
      baseIntensity = Math.random() * 15;
    }
    // Off-hours
    else {
      baseIntensity = 10 + Math.random() * 20;
    }
    
    herdingHeatmapData.push({
      hour,
      dayOfWeek: day,
      intensity: Math.round(baseIntensity),
      traderCount: Math.round(baseIntensity * 2.5),
    });
  }
}

// Volatility trigger events
export const volatilityTriggers: VolatilityTrigger[] = [
  {
    timestamp: "2024-11-12T13:30:00Z",
    event: "US CPI Release",
    traderReactions: 156,
    avgLoss: 2840,
    clusterSize: 42,
  },
  {
    timestamp: "2024-11-07T19:00:00Z",
    event: "FOMC Rate Decision",
    traderReactions: 203,
    avgLoss: 3120,
    clusterSize: 58,
  },
  {
    timestamp: "2024-11-01T12:30:00Z",
    event: "NFP Report",
    traderReactions: 178,
    avgLoss: 2560,
    clusterSize: 47,
  },
  {
    timestamp: "2024-10-30T18:00:00Z",
    event: "BOJ Policy Statement",
    traderReactions: 89,
    avgLoss: 1890,
    clusterSize: 24,
  },
  {
    timestamp: "2024-10-17T09:00:00Z",
    event: "UK CPI Release",
    traderReactions: 67,
    avgLoss: 1420,
    clusterSize: 18,
  },
];

// Cluster statistics
export const TOTAL_CLUSTER_EVENTS = tradingClusterEvents.filter(e => e.clusterId !== "none").length;
export const UNIQUE_CLUSTERS = new Set(tradingClusterEvents.map(e => e.clusterId).filter(c => c !== "none")).size;
export const AVG_CLUSTER_SIZE = (TOTAL_CLUSTER_EVENTS / UNIQUE_CLUSTERS).toFixed(1);
