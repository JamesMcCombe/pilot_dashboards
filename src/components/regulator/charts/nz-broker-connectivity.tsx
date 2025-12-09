"use client";

import { useState, useMemo } from "react";
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
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plug,
} from "lucide-react";
import {
  NZ_BROKER_CONNECTIVITY,
  READINESS_TIERS,
  CONNECTIVITY_SUMMARY,
  type PilotBridgeReadiness,
} from "@/data/regulator/nz-broker-connectivity";

type SortKey = "broker" | "pilotBridgeReadiness";
type SortDirection = "asc" | "desc";

const readinessOrder: Record<PilotBridgeReadiness, number> = {
  "A – Native Ready": 1,
  "B – Add-On Possible": 2,
  "C – Limited": 3,
};

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
  return direction === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5 text-primary" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-primary" />
  );
}

function ReadinessIcon({ readiness }: { readiness: PilotBridgeReadiness }) {
  const tier = READINESS_TIERS[readiness];
  
  if (readiness === "A – Native Ready") {
    return <CheckCircle2 className="h-4 w-4" style={{ color: tier.color }} />;
  }
  if (readiness === "B – Add-On Possible") {
    return <AlertCircle className="h-4 w-4" style={{ color: tier.color }} />;
  }
  return <XCircle className="h-4 w-4" style={{ color: tier.color }} />;
}

export function NZBrokerConnectivityPanel() {
  const [sortKey, setSortKey] = useState<SortKey>("pilotBridgeReadiness");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedBrokers = useMemo(() => {
    return [...NZ_BROKER_CONNECTIVITY].sort((a, b) => {
      if (sortKey === "broker") {
        return sortDirection === "asc"
          ? a.broker.localeCompare(b.broker)
          : b.broker.localeCompare(a.broker);
      }
      // Sort by readiness tier
      const aOrder = readinessOrder[a.pilotBridgeReadiness];
      const bOrder = readinessOrder[b.pilotBridgeReadiness];
      return sortDirection === "asc" ? aOrder - bOrder : bOrder - aOrder;
    });
  }, [sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">
              Broker Connectivity & Readiness
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  Connectivity and readiness indicators are illustrative and 
                  synthetic for demo purposes. This shows real NZ-licensed brokers 
                  and their potential PilotBridge integration pathways.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Real NZ Brokers
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          PilotBridge integration readiness for NZ-licensed trading platforms
        </p>
      </CardHeader>
      <CardContent>
        {/* Readiness Summary */}
        <div className="mb-6 grid grid-cols-4 gap-3">
          <div className="rounded-xl bg-muted/20 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Plug className="h-3.5 w-3.5" />
              <span className="text-xs">Total Brokers</span>
            </div>
            <p className="mt-1 text-xl font-bold">{CONNECTIVITY_SUMMARY.totalBrokers}</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: READINESS_TIERS["A – Native Ready"].bgColor }}>
            <div className="flex items-center justify-center gap-1.5" style={{ color: READINESS_TIERS["A – Native Ready"].color }}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="text-xs">Tier A</span>
            </div>
            <p className="mt-1 text-xl font-bold" style={{ color: READINESS_TIERS["A – Native Ready"].color }}>
              {CONNECTIVITY_SUMMARY.tierA}
            </p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: READINESS_TIERS["B – Add-On Possible"].bgColor }}>
            <div className="flex items-center justify-center gap-1.5" style={{ color: READINESS_TIERS["B – Add-On Possible"].color }}>
              <AlertCircle className="h-3.5 w-3.5" />
              <span className="text-xs">Tier B</span>
            </div>
            <p className="mt-1 text-xl font-bold" style={{ color: READINESS_TIERS["B – Add-On Possible"].color }}>
              {CONNECTIVITY_SUMMARY.tierB}
            </p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: READINESS_TIERS["C – Limited"].bgColor }}>
            <div className="flex items-center justify-center gap-1.5" style={{ color: READINESS_TIERS["C – Limited"].color }}>
              <XCircle className="h-3.5 w-3.5" />
              <span className="text-xs">Tier C</span>
            </div>
            <p className="mt-1 text-xl font-bold" style={{ color: READINESS_TIERS["C – Limited"].color }}>
              {CONNECTIVITY_SUMMARY.tierC}
            </p>
          </div>
        </div>

        {/* Readiness Legend */}
        <div className="mb-4 flex flex-wrap gap-4 rounded-xl bg-muted/10 p-3 text-xs">
          {Object.entries(READINESS_TIERS).map(([key, tier]) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: tier.bgColor, color: tier.color }}
                  >
                    {tier.label}
                  </span>
                  <span className="text-muted-foreground">{key}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">{tier.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Broker Table */}
        <div className="overflow-x-auto rounded-xl border border-border/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/10">
                <th className="px-4 py-3 text-left font-medium">
                  <button
                    className="flex items-center gap-1.5"
                    onClick={() => handleSort("broker")}
                  >
                    Broker
                    <SortIcon active={sortKey === "broker"} direction={sortDirection} />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Connectivity
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  <button
                    className="flex items-center gap-1.5"
                    onClick={() => handleSort("pilotBridgeReadiness")}
                  >
                    PilotBridge Readiness
                    <SortIcon active={sortKey === "pilotBridgeReadiness"} direction={sortDirection} />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Insight Potential
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBrokers.map((broker, index) => {
                const tier = READINESS_TIERS[broker.pilotBridgeReadiness];
                return (
                  <tr
                    key={broker.id}
                    className={`border-b border-border/20 transition-colors hover:bg-muted/10 ${
                      index % 2 === 0 ? "bg-transparent" : "bg-muted/5"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">{broker.broker}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <code className="rounded bg-muted/30 px-1.5 py-0.5 text-xs">
                        {broker.connectivity}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ReadinessIcon readiness={broker.pilotBridgeReadiness} />
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-medium"
                          style={{ backgroundColor: tier.bgColor, color: tier.color }}
                        >
                          {broker.pilotBridgeReadiness}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {broker.insightPotential}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
          <span className="font-medium text-primary">Note: </span>
          This table shows real NZ-licensed brokers with illustrative connectivity 
          and readiness indicators. Actual integration capabilities would require 
          direct technical assessment with each platform provider.
        </div>
      </CardContent>
    </Card>
  );
}
