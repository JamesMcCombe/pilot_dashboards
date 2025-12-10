"use client";

import { useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ZAxis,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  tradingClusterEvents,
  UNIQUE_CLUSTERS,
  AVG_CLUSTER_SIZE,
} from "@/data/regulator/influence-clusters";

const clusterColors: Record<string, string> = {
  "cluster-a": "#f87171",
  "cluster-b": "#fbbf24",
  "cluster-c": "#a78bfa",
  none: "#6ea8ff",
};

const clusterNames: Record<string, string> = {
  "cluster-a": "Cluster A (EURUSD)",
  "cluster-b": "Cluster B (XAUUSD)",
  "cluster-c": "Cluster C (GBPJPY)",
  none: "Individual Trade",
};

interface TooltipPayload {
  payload: {
    traderId: string;
    instrument: string;
    timestamp: string;
    clusterId: string;
  };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload || !payload[0]) return null;

  const data = payload[0].payload;
  const time = new Date(data.timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const date = new Date(data.timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="rounded-xl border border-border bg-popover p-3 shadow-lg">
      <p className="font-semibold" style={{ color: clusterColors[data.clusterId] || "#6ea8ff" }}>
        {clusterNames[data.clusterId] || "Unknown Cluster"}
      </p>
      <div className="mt-2 space-y-1 text-xs">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Trader:</span>
          <span className="font-medium">{data.traderId}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Instrument:</span>
          <span className="font-medium">{data.instrument}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Time:</span>
          <span className="font-medium">{time}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Date:</span>
          <span className="font-medium">{date}</span>
        </div>
      </div>
    </div>
  );
}

export function TradingClusterScatter() {
  const chartData = useMemo(() => {
    // Group by cluster
    const clusters: Record<string, typeof tradingClusterEvents> = {};
    tradingClusterEvents.forEach((event) => {
      if (!clusters[event.clusterId]) {
        clusters[event.clusterId] = [];
      }
      clusters[event.clusterId].push(event);
    });

    // Convert to scatter data
    return Object.entries(clusters).map(([clusterId, events]) => ({
      clusterId,
      data: events.map((e, idx) => ({
        x: new Date(e.timestamp).getTime(),
        y: idx + 1,
        traderId: e.traderId,
        instrument: e.instrument,
        timestamp: e.timestamp,
        clusterId: e.clusterId,
      })),
    }));
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Trading Cluster Events
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {UNIQUE_CLUSTERS} distinct clusters detected · Avg cluster size: {AVG_CLUSTER_SIZE} traders
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(124, 141, 173, 0.2)"
              />
              <XAxis
                type="number"
                dataKey="x"
                domain={["dataMin - 1000000", "dataMax + 1000000"]}
                tickFormatter={formatTime}
                tick={{ fill: "#7c8dad", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                label={{
                  value: "Time of Trade Entry",
                  position: "bottom",
                  offset: 20,
                  fill: "#7c8dad",
                  fontSize: 12,
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                tick={{ fill: "#7c8dad", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
                label={{
                  value: "Trader Index",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#7c8dad",
                  fontSize: 12,
                }}
              />
              <ZAxis range={[60, 120]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => {
                  if (value === "cluster-a") return "Cluster A (EURUSD)";
                  if (value === "cluster-b") return "Cluster B (XAUUSD)";
                  if (value === "cluster-c") return "Cluster C (GBPJPY)";
                  return "Individual Trades";
                }}
              />
              {chartData.map(({ clusterId, data }) => (
                <Scatter
                  key={clusterId}
                  name={clusterId}
                  data={data}
                  fill={clusterColors[clusterId] || "#6ea8ff"}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/10 p-3 text-sm">
          <p className="font-medium text-primary">Influence Detection Note</p>
          <p className="mt-1 text-muted-foreground">
            Clusters indicate coordinated trading behavior within narrow time windows,
            suggesting external influence (social signals, alerts) without monitoring content.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
