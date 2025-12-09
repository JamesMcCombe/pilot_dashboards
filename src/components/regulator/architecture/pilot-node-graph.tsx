"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Shield, Eye, Users, Activity, BarChart3, Lock, ArrowDown } from "lucide-react";

const regulatorLenses = [
  { id: "broker", label: "Broker Lens", subtitle: "Risk Ops", icon: Eye },
  { id: "market", label: "Market Lens", subtitle: "Integrity", icon: Activity },
  { id: "population", label: "Population Insights", subtitle: "Cohort Analysis", icon: Users },
  { id: "herding", label: "Herding Module", subtitle: "Synchronisation", icon: Users },
  { id: "risk", label: "Risk Factor Decomposition", subtitle: "Attribution", icon: BarChart3 },
];

const connectors = [
  { id: "mt4", label: "MT4 Plugin" },
  { id: "mt5", label: "MT5 Plugin" },
  { id: "ctrader", label: "cTrader Bridge" },
  { id: "fix", label: "FIX API Listener" },
  { id: "tv", label: "TradingView Connector" },
  { id: "other", label: "Other APIs (Future)" },
];

const brokers = [
  "BlackBull Markets",
  "IG Markets NZ",
  "CMC Markets NZ",
  "ThinkMarkets NZ",
  "Axi / Zero Markets",
  "PFD",
];

export function PilotNodeGraph() {
  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">
              PilotBridge Architecture
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  This diagram illustrates the data flow from NZ retail brokers 
                  through PilotBridge to the FMA regulator dashboard. All routing 
                  is synthetic for demonstration purposes.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="rounded-full bg-[#fbbf24]/10 px-3 py-1 text-xs font-medium text-[#fbbf24]">
            Illustrative Diagram
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          End-to-end data flow from trading platforms to regulatory insights
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative flex flex-col items-center gap-6 py-4">
          {/* FMA Regulator Node */}
          <div className="w-full max-w-md">
            <div className="rounded-2xl border-2 border-primary/50 bg-gradient-to-b from-primary/20 to-primary/5 p-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold text-primary">FMA</h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Financial Markets Authority</p>
              <p className="mt-2 text-sm font-medium text-primary/80">
                Real-Time Conduct & Risk Insight
              </p>
            </div>
          </div>

          {/* Arrow */}
          <FlowArrow label="Aggregated Insights" />

          {/* Regulator Lenses */}
          <div className="w-full">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Regulator Lenses
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {regulatorLenses.map((lens) => (
                <div
                  key={lens.id}
                  className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-2"
                >
                  <lens.icon className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs font-medium">{lens.label}</p>
                    <p className="text-[10px] text-muted-foreground">{lens.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <FlowArrow label="Behavioral Scores & Signals" />

          {/* PilotScore Protocol */}
          <div className="w-full max-w-lg">
            <div className="rounded-2xl border-2 border-[#8b5cf6]/50 bg-gradient-to-b from-[#8b5cf6]/20 to-[#8b5cf6]/5 p-5 text-center">
              <h3 className="text-lg font-bold text-[#8b5cf6]">PilotScore Protocol</h3>
              <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                <span>Encrypted Telemetry Stream</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <FlowArrow label="Anonymised Trade Events" />

          {/* PilotBridge Layer */}
          <div className="w-full">
            <div className="rounded-2xl border-2 border-[#53f6c5]/50 bg-gradient-to-b from-[#53f6c5]/15 to-[#53f6c5]/5 p-5">
              <h3 className="text-center text-lg font-bold text-[#53f6c5]">
                PILOTBRIDGE LAYER
              </h3>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                Universal Interoperability • Trade Telemetry • Behavioural Signal Routing
              </p>
              
              {/* Connectors */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {connectors.map((connector) => (
                  <div
                    key={connector.id}
                    className="rounded-lg border border-[#53f6c5]/30 bg-card/50 px-3 py-1.5 text-xs font-medium"
                  >
                    {connector.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Arrow */}
          <FlowArrow label="Raw Trade Data" direction="up" />

          {/* Trading Platforms / Brokers */}
          <div className="w-full">
            <div className="rounded-2xl border-2 border-[#f97316]/50 bg-gradient-to-b from-[#f97316]/15 to-[#f97316]/5 p-5">
              <h3 className="text-center text-sm font-bold text-[#f97316]">
                All FMA-Regulated NZ Retail Brokers
              </h3>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {brokers.map((broker) => (
                  <div
                    key={broker}
                    className="rounded-lg border border-[#f97316]/30 bg-card/50 px-3 py-2 text-xs font-medium"
                  >
                    {broker}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-3 text-center text-xs text-muted-foreground">
          Diagram is illustrative and uses synthetic routing to demonstrate interoperability.
          <br />
          Actual implementation would require direct integration agreements with each broker.
        </div>
      </CardContent>
    </Card>
  );
}

function FlowArrow({ label, direction = "down" }: { label: string; direction?: "up" | "down" }) {
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      {direction === "up" && (
        <ArrowDown className="h-5 w-5 rotate-180 text-muted-foreground/50" />
      )}
      <div className="h-6 w-px bg-gradient-to-b from-muted-foreground/30 to-muted-foreground/10" />
      <span className="rounded-full bg-muted/30 px-3 py-1 text-[10px] text-muted-foreground">
        {label}
      </span>
      <div className="h-6 w-px bg-gradient-to-b from-muted-foreground/10 to-muted-foreground/30" />
      {direction === "down" && (
        <ArrowDown className="h-5 w-5 text-muted-foreground/50" />
      )}
    </div>
  );
}
