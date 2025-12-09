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
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f1d36",
                  border: "1px solid rgba(124, 141, 173, 0.3)",
                  borderRadius: "12px",
                }}
              />
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
