// =============================================================================
// INFLUENCE PATHWAY GRAPH DATA
// =============================================================================
// Synthetic network data showing how trading behaviour clusters form and
// propagate through the market. This visualization demonstrates influence
// pathways without identifying individuals or scraping content.
//
// Node types:
// - event: Market volatility events that trigger behaviour
// - cluster: Detected trading behaviour clusters
// - cohort: Behavioural cohort groups
// - asset: Trading instruments
// - signal: Social/copy trading signals

export type NodeType = "event" | "cluster" | "cohort" | "asset" | "signal";

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  description: string;
  importanceScore: number; // 0-100
  timestamp?: string; // ISO date for events/clusters
  metadata?: Record<string, string | number>;
  // Position for static layout (percentage of container)
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  weight: number; // 1-10, affects line thickness
  type: "triggers" | "influences" | "trades" | "follows" | "correlates";
}

export interface InfluenceGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Node type configuration
export const NODE_TYPE_CONFIG: Record<NodeType, {
  color: string;
  bgColor: string;
  icon: string;
  label: string;
}> = {
  event: {
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.15)",
    icon: "Zap",
    label: "Volatility Event",
  },
  cluster: {
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.15)",
    icon: "Users",
    label: "Trading Cluster",
  },
  cohort: {
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.15)",
    icon: "UsersRound",
    label: "Behavioural Cohort",
  },
  asset: {
    color: "#53f6c5",
    bgColor: "rgba(83, 246, 197, 0.15)",
    icon: "TrendingUp",
    label: "Trading Asset",
  },
  signal: {
    color: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.15)",
    icon: "Radio",
    label: "Social Signal",
  },
};

// Edge type configuration
export const EDGE_TYPE_CONFIG: Record<string, { color: string; dashArray?: string }> = {
  triggers: { color: "#ef4444" },
  influences: { color: "#8b5cf6", dashArray: "5,5" },
  trades: { color: "#53f6c5" },
  follows: { color: "#f97316", dashArray: "3,3" },
  correlates: { color: "#7c8dad", dashArray: "8,4" },
};

// =============================================================================
// SYNTHETIC GRAPH DATA
// =============================================================================

export const INFLUENCE_GRAPH: InfluenceGraph = {
  nodes: [
    // Volatility Events (Top layer)
    {
      id: "event-cpi",
      label: "US CPI Surprise",
      type: "event",
      description: "Higher-than-expected inflation data triggered rapid market moves",
      importanceScore: 92,
      timestamp: "2024-11-13T13:30:00Z",
      x: 20,
      y: 8,
    },
    {
      id: "event-fomc",
      label: "FOMC Decision",
      type: "event",
      description: "Federal Reserve rate decision sparked volatility across FX pairs",
      importanceScore: 88,
      timestamp: "2024-10-27T22:00:00Z",
      x: 50,
      y: 8,
    },
    {
      id: "event-geopolitical",
      label: "Geopolitical Shock",
      type: "event",
      description: "Middle East tensions drove safe-haven flows",
      importanceScore: 85,
      timestamp: "2024-10-07T08:15:00Z",
      x: 80,
      y: 8,
    },

    // Social Signals (Second layer)
    {
      id: "signal-influencer-a",
      label: "Signal Provider A",
      type: "signal",
      description: "High-follower trading signal with 2,400 subscribers",
      importanceScore: 78,
      metadata: { followers: 2400, winRate: "62%" },
      x: 15,
      y: 25,
    },
    {
      id: "signal-copy-platform",
      label: "Copy Trading Hub",
      type: "signal",
      description: "Aggregated copy trading signals from multiple providers",
      importanceScore: 72,
      metadata: { activeSignals: 45, totalCopiers: 890 },
      x: 55,
      y: 25,
    },

    // Trading Clusters (Third layer)
    {
      id: "cluster-1",
      label: "Cluster Alpha",
      type: "cluster",
      description: "High-frequency entry cluster detected during CPI release",
      importanceScore: 82,
      timestamp: "2024-11-13T13:31:00Z",
      metadata: { traderCount: 142, avgEntrySpread: "45s" },
      x: 25,
      y: 42,
    },
    {
      id: "cluster-2",
      label: "Cluster Beta",
      type: "cluster",
      description: "Synchronized short positions following signal provider",
      importanceScore: 75,
      timestamp: "2024-11-12T09:15:00Z",
      metadata: { traderCount: 89, avgEntrySpread: "120s" },
      x: 50,
      y: 42,
    },
    {
      id: "cluster-3",
      label: "Cluster Gamma",
      type: "cluster",
      description: "Gold accumulation cluster during geopolitical uncertainty",
      importanceScore: 68,
      timestamp: "2024-10-08T02:30:00Z",
      metadata: { traderCount: 67, avgEntrySpread: "180s" },
      x: 75,
      y: 42,
    },

    // Cohorts (Fourth layer)
    {
      id: "cohort-social",
      label: "Socially Influenced",
      type: "cohort",
      description: "Traders whose activity correlates with social signals",
      importanceScore: 85,
      metadata: { size: 428, rhiContribution: "24.8%" },
      x: 20,
      y: 62,
    },
    {
      id: "cohort-volatility",
      label: "Volatility Chasers",
      type: "cohort",
      description: "Traders who increase activity during high-volatility events",
      importanceScore: 78,
      metadata: { size: 420, rhiContribution: "20.3%" },
      x: 50,
      y: 62,
    },
    {
      id: "cohort-leverage",
      label: "High-Leverage",
      type: "cohort",
      description: "Traders consistently using leverage above 10x",
      importanceScore: 90,
      metadata: { size: 312, rhiContribution: "28.2%" },
      x: 80,
      y: 62,
    },

    // Assets (Bottom layer)
    {
      id: "asset-nas100",
      label: "NAS100",
      type: "asset",
      description: "NASDAQ 100 index - high volatility during US sessions",
      importanceScore: 88,
      metadata: { avgVolume: "High", spreadBps: 12 },
      x: 15,
      y: 85,
    },
    {
      id: "asset-xauusd",
      label: "XAUUSD",
      type: "asset",
      description: "Gold/USD - safe-haven asset during uncertainty",
      importanceScore: 82,
      metadata: { avgVolume: "High", spreadBps: 8 },
      x: 40,
      y: 85,
    },
    {
      id: "asset-eurusd",
      label: "EURUSD",
      type: "asset",
      description: "Euro/USD - most liquid FX pair",
      importanceScore: 75,
      metadata: { avgVolume: "Very High", spreadBps: 3 },
      x: 65,
      y: 85,
    },
    {
      id: "asset-btcusd",
      label: "BTCUSD",
      type: "asset",
      description: "Bitcoin/USD - high volatility crypto exposure",
      importanceScore: 70,
      metadata: { avgVolume: "Medium", spreadBps: 45 },
      x: 88,
      y: 85,
    },
  ],

  edges: [
    // Events triggering clusters
    { id: "e1", source: "event-cpi", target: "cluster-1", weight: 8, type: "triggers", label: "triggers" },
    { id: "e2", source: "event-fomc", target: "cluster-2", weight: 6, type: "triggers", label: "triggers" },
    { id: "e3", source: "event-geopolitical", target: "cluster-3", weight: 7, type: "triggers", label: "triggers" },
    
    // Signals influencing clusters
    { id: "e4", source: "signal-influencer-a", target: "cluster-1", weight: 5, type: "influences", label: "influences" },
    { id: "e5", source: "signal-copy-platform", target: "cluster-2", weight: 7, type: "influences", label: "influences" },
    { id: "e6", source: "signal-influencer-a", target: "cluster-2", weight: 4, type: "influences", label: "influences" },
    
    // Events to signals
    { id: "e7", source: "event-cpi", target: "signal-influencer-a", weight: 5, type: "triggers", label: "activates" },
    { id: "e8", source: "event-fomc", target: "signal-copy-platform", weight: 6, type: "triggers", label: "activates" },
    
    // Clusters to cohorts
    { id: "e9", source: "cluster-1", target: "cohort-social", weight: 7, type: "correlates", label: "contains" },
    { id: "e10", source: "cluster-1", target: "cohort-volatility", weight: 5, type: "correlates", label: "contains" },
    { id: "e11", source: "cluster-2", target: "cohort-social", weight: 8, type: "correlates", label: "contains" },
    { id: "e12", source: "cluster-3", target: "cohort-volatility", weight: 6, type: "correlates", label: "contains" },
    { id: "e13", source: "cluster-2", target: "cohort-leverage", weight: 5, type: "correlates", label: "overlap" },
    
    // Cohorts trading assets
    { id: "e14", source: "cohort-social", target: "asset-nas100", weight: 6, type: "trades", label: "trades" },
    { id: "e15", source: "cohort-social", target: "asset-eurusd", weight: 5, type: "trades", label: "trades" },
    { id: "e16", source: "cohort-volatility", target: "asset-nas100", weight: 8, type: "trades", label: "trades" },
    { id: "e17", source: "cohort-volatility", target: "asset-xauusd", weight: 6, type: "trades", label: "trades" },
    { id: "e18", source: "cohort-leverage", target: "asset-btcusd", weight: 7, type: "trades", label: "trades" },
    { id: "e19", source: "cohort-leverage", target: "asset-nas100", weight: 5, type: "trades", label: "trades" },
    
    // Cross-cluster correlations
    { id: "e20", source: "cluster-1", target: "cluster-2", weight: 3, type: "correlates", label: "correlates" },
  ],
};

// Get statistics about the graph
export const GRAPH_STATS = {
  totalNodes: INFLUENCE_GRAPH.nodes.length,
  totalEdges: INFLUENCE_GRAPH.edges.length,
  nodesByType: {
    event: INFLUENCE_GRAPH.nodes.filter((n) => n.type === "event").length,
    signal: INFLUENCE_GRAPH.nodes.filter((n) => n.type === "signal").length,
    cluster: INFLUENCE_GRAPH.nodes.filter((n) => n.type === "cluster").length,
    cohort: INFLUENCE_GRAPH.nodes.filter((n) => n.type === "cohort").length,
    asset: INFLUENCE_GRAPH.nodes.filter((n) => n.type === "asset").length,
  },
  avgImportance: Math.round(
    INFLUENCE_GRAPH.nodes.reduce((sum, n) => sum + n.importanceScore, 0) / INFLUENCE_GRAPH.nodes.length
  ),
  strongestConnections: INFLUENCE_GRAPH.edges
    .filter((e) => e.weight >= 7)
    .map((e) => ({
      from: INFLUENCE_GRAPH.nodes.find((n) => n.id === e.source)?.label,
      to: INFLUENCE_GRAPH.nodes.find((n) => n.id === e.target)?.label,
      weight: e.weight,
    })),
};

// Get node by ID
export function getNodeById(id: string): GraphNode | undefined {
  return INFLUENCE_GRAPH.nodes.find((n) => n.id === id);
}

// Get edges connected to a node
export function getConnectedEdges(nodeId: string): GraphEdge[] {
  return INFLUENCE_GRAPH.edges.filter(
    (e) => e.source === nodeId || e.target === nodeId
  );
}

// Get connected nodes
export function getConnectedNodes(nodeId: string): GraphNode[] {
  const connectedEdges = getConnectedEdges(nodeId);
  const connectedIds = new Set<string>();
  
  connectedEdges.forEach((e) => {
    if (e.source === nodeId) connectedIds.add(e.target);
    if (e.target === nodeId) connectedIds.add(e.source);
  });
  
  return INFLUENCE_GRAPH.nodes.filter((n) => connectedIds.has(n.id));
}
