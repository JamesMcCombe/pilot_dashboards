"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Info,
  Zap,
  Users,
  UsersRound,
  TrendingUp,
  Radio,
  X,
  ArrowRight,
} from "lucide-react";
import {
  INFLUENCE_GRAPH,
  NODE_TYPE_CONFIG,
  EDGE_TYPE_CONFIG,
  GRAPH_STATS,
  getConnectedEdges,
  getConnectedNodes,
  type GraphNode,
  type NodeType,
} from "@/data/regulator/influence-graph";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Users,
  UsersRound,
  TrendingUp,
  Radio,
};

function GraphNodeComponent({
  node,
  isSelected,
  isHighlighted,
  isDimmed,
  onSelect,
  onHover,
  onLeave,
}: {
  node: GraphNode;
  isSelected: boolean;
  isHighlighted: boolean;
  isDimmed: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  const config = NODE_TYPE_CONFIG[node.type];

  // Scale node size by importance (smaller for SVG viewBox 0-100)
  const baseSize = 4 + (node.importanceScore / 100) * 3;

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      className="cursor-pointer"
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ opacity: isDimmed ? 0.3 : 1 }}
    >
      {/* Node circle */}
      <circle
        cx={0}
        cy={0}
        r={baseSize}
        fill={config.bgColor}
        stroke={config.color}
        strokeWidth={isSelected ? 0.5 : isHighlighted ? 0.3 : 0.2}
      />
      {/* Inner circle */}
      <circle
        cx={0}
        cy={0}
        r={baseSize * 0.6}
        fill={isSelected ? config.color : config.bgColor}
        stroke={config.color}
        strokeWidth={0.1}
      />
      {/* Label */}
      <text
        y={baseSize + 3}
        textAnchor="middle"
        fontSize="2.5"
        fontWeight="500"
        fill={isDimmed ? "#7c8dad" : "#aebbd4"}
      >
        {node.label}
      </text>
    </g>
  );
}

function GraphEdgeComponent({
  sourceNode,
  targetNode,
  edge,
  isHighlighted,
  isDimmed,
}: {
  sourceNode: GraphNode;
  targetNode: GraphNode;
  edge: typeof INFLUENCE_GRAPH.edges[0];
  isHighlighted: boolean;
  isDimmed: boolean;
}) {
  const config = EDGE_TYPE_CONFIG[edge.type];
  
  // Calculate control points for curved edge
  const midX = (sourceNode.x + targetNode.x) / 2;
  const midY = (sourceNode.y + targetNode.y) / 2;
  
  // Add some curve based on horizontal distance
  const dx = targetNode.x - sourceNode.x;
  const curveFactor = Math.abs(dx) < 20 ? 8 : 0;
  const controlX = midX + curveFactor;
  const controlY = midY;

  const path = `M ${sourceNode.x} ${sourceNode.y} Q ${controlX} ${controlY} ${targetNode.x} ${targetNode.y}`;

  return (
    <path
      d={path}
      fill="none"
      stroke={config.color}
      strokeWidth={isHighlighted ? 0.4 : 0.2}
      strokeDasharray={config.dashArray?.split(",").map(n => parseFloat(n) / 3).join(",")}
      strokeOpacity={isDimmed ? 0.15 : isHighlighted ? 0.8 : 0.4}
    />
  );
}

function NodeDetailPanel({
  node,
  onClose,
}: {
  node: GraphNode;
  onClose: () => void;
}) {
  const config = NODE_TYPE_CONFIG[node.type];
  const Icon = iconMap[config.icon] || Users;
  const connectedNodes = getConnectedNodes(node.id);
  const connectedEdges = getConnectedEdges(node.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute right-4 top-4 z-10 w-80 rounded-2xl border-2 bg-card/95 p-4 shadow-xl backdrop-blur-sm"
      style={{ borderColor: config.color }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: config.bgColor, color: config.color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold">{node.label}</h4>
            <p className="text-xs" style={{ color: config.color }}>
              {config.label}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted/20 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{node.description}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-muted/20 p-2 text-center">
          <p className="text-lg font-bold" style={{ color: config.color }}>
            {node.importanceScore}
          </p>
          <p className="text-[10px] text-muted-foreground">Importance</p>
        </div>
        <div className="rounded-lg bg-muted/20 p-2 text-center">
          <p className="text-lg font-bold">{connectedEdges.length}</p>
          <p className="text-[10px] text-muted-foreground">Connections</p>
        </div>
      </div>

      {node.timestamp && (
        <div className="mt-3 rounded-lg bg-muted/10 p-2 text-xs text-muted-foreground">
          <span className="font-medium">Timestamp: </span>
          {new Date(node.timestamp).toLocaleString()}
        </div>
      )}

      {node.metadata && Object.keys(node.metadata).length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-muted-foreground">Metadata</p>
          <div className="mt-1 space-y-1">
            {Object.entries(node.metadata).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{key}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {connectedNodes.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-muted-foreground">Connected Nodes</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {connectedNodes.slice(0, 6).map((n) => {
              const nConfig = NODE_TYPE_CONFIG[n.type];
              return (
                <span
                  key={n.id}
                  className="rounded-full px-2 py-0.5 text-[10px]"
                  style={{ backgroundColor: nConfig.bgColor, color: nConfig.color }}
                >
                  {n.label}
                </span>
              );
            })}
            {connectedNodes.length > 6 && (
              <span className="rounded-full bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground">
                +{connectedNodes.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function InfluencePathwayGraph() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const selectedNode = selectedNodeId
    ? INFLUENCE_GRAPH.nodes.find((n) => n.id === selectedNodeId)
    : null;

  const highlightedNodeIds = useMemo(() => {
    const activeId = hoveredNodeId || selectedNodeId;
    if (!activeId) return new Set<string>();
    
    const connected = getConnectedNodes(activeId);
    return new Set([activeId, ...connected.map((n) => n.id)]);
  }, [hoveredNodeId, selectedNodeId]);

  const highlightedEdgeIds = useMemo(() => {
    const activeId = hoveredNodeId || selectedNodeId;
    if (!activeId) return new Set<string>();
    
    const edges = getConnectedEdges(activeId);
    return new Set(edges.map((e) => e.id));
  }, [hoveredNodeId, selectedNodeId]);

  const hasActiveSelection = highlightedNodeIds.size > 0;

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">
              Influence Pathway Graph
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  Visual network showing how trading behaviour clusters form and 
                  propagate. Click on nodes to explore connections. All data is 
                  synthetic and does not identify individuals.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="rounded-full bg-[#fbbf24]/10 px-3 py-1 text-xs font-medium text-[#fbbf24]">
            Synthetic Network
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Click on nodes to explore influence pathways and connections
        </p>
      </CardHeader>
      <CardContent>
        {/* Stats Summary */}
        <div className="mb-4 grid grid-cols-5 gap-3">
          {Object.entries(GRAPH_STATS.nodesByType).map(([type, count]) => {
            const config = NODE_TYPE_CONFIG[type as NodeType];
            return (
              <div
                key={type}
                className="rounded-xl p-2 text-center"
                style={{ backgroundColor: config.bgColor }}
              >
                <p className="text-lg font-bold" style={{ color: config.color }}>
                  {count}
                </p>
                <p className="text-[10px] text-muted-foreground">{config.label}s</p>
              </div>
            );
          })}
        </div>

        {/* Graph Container */}
        <div className="relative rounded-2xl border border-border/40 bg-muted/10">
          {/* Legend */}
          <div className="absolute left-4 top-4 z-10 rounded-xl bg-card/90 p-3 backdrop-blur-sm">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Node Types</p>
            <div className="space-y-1.5">
              {Object.entries(NODE_TYPE_CONFIG).map(([type, config]) => {
                const Icon = iconMap[config.icon] || Users;
                return (
                  <div key={type} className="flex items-center gap-2 text-xs">
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded"
                      style={{ backgroundColor: config.bgColor, color: config.color }}
                    >
                      <Icon className="h-3 w-3" />
                    </div>
                    <span className="text-muted-foreground">{config.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 border-t border-border/40 pt-2">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Edge Types</p>
              <div className="space-y-1">
                {Object.entries(EDGE_TYPE_CONFIG).map(([type, config]) => (
                  <div key={type} className="flex items-center gap-2 text-xs">
                    <div className="w-6">
                      <svg height="8" width="24">
                        <line
                          x1="0"
                          y1="4"
                          x2="24"
                          y2="4"
                          stroke={config.color}
                          strokeWidth="2"
                          strokeDasharray={config.dashArray}
                        />
                      </svg>
                    </div>
                    <span className="text-muted-foreground capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SVG Graph */}
          <svg
            viewBox="0 0 100 100"
            className="h-[500px] w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Edges */}
            <g>
              {INFLUENCE_GRAPH.edges.map((edge) => {
                const sourceNode = INFLUENCE_GRAPH.nodes.find((n) => n.id === edge.source);
                const targetNode = INFLUENCE_GRAPH.nodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                return (
                  <GraphEdgeComponent
                    key={edge.id}
                    sourceNode={sourceNode}
                    targetNode={targetNode}
                    edge={edge}
                    isHighlighted={highlightedEdgeIds.has(edge.id)}
                    isDimmed={hasActiveSelection && !highlightedEdgeIds.has(edge.id)}
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g>
              {INFLUENCE_GRAPH.nodes.map((node) => (
                <GraphNodeComponent
                  key={node.id}
                  node={node}
                  isSelected={selectedNodeId === node.id}
                  isHighlighted={highlightedNodeIds.has(node.id)}
                  isDimmed={hasActiveSelection && !highlightedNodeIds.has(node.id)}
                  onSelect={() => setSelectedNodeId(
                    selectedNodeId === node.id ? null : node.id
                  )}
                  onHover={() => setHoveredNodeId(node.id)}
                  onLeave={() => setHoveredNodeId(null)}
                />
              ))}
            </g>
          </svg>

          {/* Node Detail Panel */}
          <AnimatePresence>
            {selectedNode && (
              <NodeDetailPanel
                node={selectedNode}
                onClose={() => setSelectedNodeId(null)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Flow Description */}
        <div className="mt-4 rounded-xl bg-muted/10 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ArrowRight className="h-4 w-4 text-primary" />
            Influence Flow Pattern
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Volatility events trigger social signals and trading clusters. These clusters 
            correlate strongly with specific behavioural cohorts (Socially Influenced, 
            Volatility Chasers, High-Leverage). Cohorts then concentrate activity on 
            particular assets, creating observable patterns without identifying individuals.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-[#ef4444]/20 px-2 py-0.5 text-[#ef4444]">
              Events
            </span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="rounded-full bg-[#f97316]/20 px-2 py-0.5 text-[#f97316]">
              Signals
            </span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="rounded-full bg-[#8b5cf6]/20 px-2 py-0.5 text-[#8b5cf6]">
              Clusters
            </span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="rounded-full bg-[#3b82f6]/20 px-2 py-0.5 text-[#3b82f6]">
              Cohorts
            </span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="rounded-full bg-[#53f6c5]/20 px-2 py-0.5 text-[#53f6c5]">
              Assets
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
          <span className="font-medium text-primary">Privacy Note: </span>
          This network visualization shows aggregate behavioural patterns only. 
          No individual traders are identified, and no social media content is scraped. 
          Clusters are detected through anonymised trade timing analysis.
        </div>
      </CardContent>
    </Card>
  );
}
