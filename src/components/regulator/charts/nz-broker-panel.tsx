"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Cell,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Info,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Building2,
  Users,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  NZ_BROKERS,
  BROKER_METRICS,
  BROKER_RISK_BANDS,
  BROKER_COMPARISON_CHART_DATA,
  INDUSTRY_AVERAGES,
  type NZBrokerData,
} from "@/data/regulator/nz-brokers";

type SortKey = keyof NZBrokerData;
type SortDirection = "asc" | "desc";

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
  return direction === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5 text-primary" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-primary" />
  );
}

export function NZBrokerPanel() {
  const [sortKey, setSortKey] = useState<SortKey>("brokerRiskScore");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedMetric, setSelectedMetric] = useState<"risk" | "comparison">("risk");

  const sortedBrokers = useMemo(() => {
    return [...NZ_BROKERS].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">
              NZ Broker Comparison
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  Synthetic comparison of NZ-licensed brokers on key risk metrics. 
                  All broker names and data are fictional and for demonstration 
                  purposes only. In production, this would show anonymised or 
                  aggregated broker-level insights.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="rounded-full bg-[#fbbf24]/10 px-3 py-1 text-xs font-medium text-[#fbbf24]">
            Synthetic Data
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Risk metrics across NZ-licensed trading platforms
        </p>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-4 gap-3">
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              <span className="text-xs">Brokers</span>
            </div>
            <p className="mt-1 text-xl font-bold">{NZ_BROKERS.length}</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs">Total Traders</span>
            </div>
            <p className="mt-1 text-xl font-bold">{INDUSTRY_AVERAGES.totalTraders.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-xs">Avg PilotScore</span>
            </div>
            <p className="mt-1 text-xl font-bold">{INDUSTRY_AVERAGES.avgPilotScore.toFixed(0)}</p>
          </div>
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="text-xs">Avg Risk Score</span>
            </div>
            <p className="mt-1 text-xl font-bold text-[#f97316]">
              {INDUSTRY_AVERAGES.brokerRiskScore.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Chart Type Toggle */}
        <div className="mb-4 flex gap-1 rounded-xl bg-muted/20 p-1">
          <button
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedMetric === "risk"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setSelectedMetric("risk")}
          >
            Risk Score Ranking
          </button>
          <button
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedMetric === "comparison"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setSelectedMetric("comparison")}
          >
            Metric Comparison
          </button>
        </div>

        {/* Charts */}
        {selectedMetric === "risk" ? (
          <RiskScoreChart />
        ) : (
          <MetricComparisonChart />
        )}

        {/* Sortable Table */}
        <div className="mt-6">
          <h4 className="mb-3 text-sm font-medium text-muted-foreground">
            Detailed Broker Metrics
          </h4>
          <div className="overflow-x-auto rounded-xl border border-border/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/10">
                  <th className="px-4 py-3 text-left font-medium">
                    <button
                      className="flex items-center gap-1.5"
                      onClick={() => handleSort("name")}
                    >
                      Broker
                      <SortIcon active={sortKey === "name"} direction={sortDirection} />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    <button
                      className="flex items-center gap-1.5"
                      onClick={() => handleSort("brokerRiskScore")}
                    >
                      Risk Score
                      <SortIcon active={sortKey === "brokerRiskScore"} direction={sortDirection} />
                    </button>
                  </th>
                  {BROKER_METRICS.slice(0, 4).map((metric) => (
                    <th key={metric.key} className="px-4 py-3 text-left font-medium">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="flex items-center gap-1.5"
                            onClick={() => handleSort(metric.key)}
                          >
                            {metric.label}
                            <SortIcon active={sortKey === metric.key} direction={sortDirection} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">{metric.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left font-medium">
                    <button
                      className="flex items-center gap-1.5"
                      onClick={() => handleSort("totalActiveTraders")}
                    >
                      Traders
                      <SortIcon active={sortKey === "totalActiveTraders"} direction={sortDirection} />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedBrokers.map((broker, index) => {
                  const bandConfig = BROKER_RISK_BANDS[broker.riskBand];
                  return (
                    <tr
                      key={broker.id}
                      className={`border-b border-border/20 transition-colors hover:bg-muted/10 ${
                        index % 2 === 0 ? "bg-transparent" : "bg-muted/5"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">{broker.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-lg font-bold"
                            style={{ color: bandConfig.color }}
                          >
                            {broker.brokerRiskScore}
                          </span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                            style={{
                              backgroundColor: `${bandConfig.color}20`,
                              color: bandConfig.color,
                            }}
                          >
                            {bandConfig.label.split(" ")[0]}
                          </span>
                        </div>
                      </td>
                      {BROKER_METRICS.slice(0, 4).map((metric) => {
                        const value = broker[metric.key] as number;
                        const avg = INDUSTRY_AVERAGES[metric.key as keyof typeof INDUSTRY_AVERAGES] as number;
                        const isWorse = metric.higherIsBetter ? value < avg : value > avg;
                        return (
                          <td
                            key={metric.key}
                            className={`px-4 py-3 ${isWorse ? "text-[#f97316]" : ""}`}
                          >
                            {metric.format(value)}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3">{broker.totalActiveTraders.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Industry Average Note */}
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block h-3 w-3 rounded-full bg-[#f97316]/50" />
          <span>Values highlighted in orange are worse than industry average</span>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
          <span className="font-medium text-primary">Synthetic Demo Data: </span>
          All broker names and metrics shown are entirely fictional and generated 
          for demonstration purposes. In a production system, this data would be 
          derived from anonymised regulatory reporting and would require appropriate 
          data sharing agreements with licensed entities.
        </div>
      </CardContent>
    </Card>
  );
}

function RiskScoreChart() {
  const sortedData = [...BROKER_COMPARISON_CHART_DATA].sort(
    (a, b) => b.riskScore - a.riskScore
  );

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 141, 173, 0.1)" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 1000]}
            tick={{ fill: "#7c8dad", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
            ticks={[0, 300, 500, 700, 1000]}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#aebbd4", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
            width={115}
          />
          <RechartsTooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload[0]) return null;
              const data = payload[0].payload;
              const bandConfig = BROKER_RISK_BANDS[data.riskBand as keyof typeof BROKER_RISK_BANDS];
              return (
                <div className="rounded-xl border border-border bg-popover p-3 shadow-lg">
                  <p className="font-semibold">{data.fullName}</p>
                  <p className="mt-1 text-2xl font-bold" style={{ color: bandConfig.color }}>
                    {data.riskScore}
                  </p>
                  <p className="text-xs" style={{ color: bandConfig.color }}>
                    {bandConfig.label}
                  </p>
                </div>
              );
            }}
          />
          {/* Band reference lines */}
          <ReferenceLine x={300} stroke="#fbbf24" strokeDasharray="3 3" strokeOpacity={0.5} />
          <ReferenceLine x={500} stroke="#f97316" strokeDasharray="3 3" strokeOpacity={0.5} />
          <ReferenceLine x={700} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
          <Bar dataKey="riskScore" radius={[0, 6, 6, 0]}>
            {sortedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={BROKER_RISK_BANDS[entry.riskBand as keyof typeof BROKER_RISK_BANDS].color}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function MetricComparisonChart() {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={BROKER_COMPARISON_CHART_DATA}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 141, 173, 0.1)" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#7c8dad", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
          />
          <YAxis
            tick={{ fill: "#7c8dad", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(124, 141, 173, 0.3)" }}
          />
          <RechartsTooltip
            content={({ active, payload, label }) => {
              if (!active || !payload) return null;
              const data = BROKER_COMPARISON_CHART_DATA.find((d) => d.name === label);
              return (
                <div className="rounded-xl border border-border bg-popover p-3 shadow-lg">
                  <p className="font-semibold">{data?.fullName || label}</p>
                  <div className="mt-2 space-y-1 text-xs">
                    {payload.map((entry) => (
                      <div key={entry.name} className="flex justify-between gap-4">
                        <span style={{ color: entry.color }}>{entry.name}:</span>
                        <span className="font-medium">
                          {typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}
                          {entry.name === "High-Risk %" || entry.name === "Offshore %" ? "%" : ""}
                          {entry.name === "Leverage" ? "x" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px" }}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="highRisk" name="High-Risk %" fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="offshore" name="Offshore %" fill="#f97316" radius={[4, 4, 0, 0]} />
          <Bar dataKey="leverage" name="Leverage" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
