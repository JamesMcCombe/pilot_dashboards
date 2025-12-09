"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NavigatorDetailPanel } from "@/components/navigator/navigator-detail-panel";
import { PilotDetailPanel } from "@/components/pilot/pilot-detail-panel";
import { TradeDetailDialog } from "@/components/trade/trade-detail-dialog";
import { navigators } from "@/data/navigators";
import { pilots } from "@/data/pilots";
import { trades } from "@/data/trades";
import { complianceAlerts } from "@/data/alerts";
import { auditEvents } from "@/data/audit-events";
import type { Navigator, Pilot, Trade } from "@/data/types";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { getNavigatorValueMap } from "@/lib/value-score-map";
import { HelpTooltip } from "@/components/help/help-tooltip";

const conductRiskItems = [
  {
    title: "Over-trading detection",
    copy: "Monitor hourly copy frequency against navigator baselines to catch fatigue and revenge trading patterns.",
  },
  {
    title: "Rule adherence delta",
    copy: "Surface when pilots override guardrails or drift from recommended sizing templates.",
  },
  {
    title: "Drawdown deviation scoring",
    copy: "Track cohorts whose realised drawdowns exceed navigator-projected VAR envelopes.",
  },
  {
    title: "Strategy deviation monitoring",
    copy: "Compare real executions to navigator playbooks to detect unauthorized strategy shifts.",
  },
  {
    title: "Copy-latency risk",
    copy: "Quantify lag between navigator signal and pilot execution to flag alpha leakage.",
  },
];

const kycItems = [
  {
    title: "Multi-account anomaly detection",
    copy: "Cluster linked accounts to surface potential duplicate or mule activity.",
  },
  {
    title: "Geo-IP mismatch",
    copy: "Alert when login geolocation drifts from verified residence patterns.",
  },
  {
    title: "Structuring patterns",
    copy: "Identify deposits/withdrawals structured to avoid reporting thresholds.",
  },
  {
    title: "Suspicious withdrawal timing",
    copy: "Watch for spikes in off-platform transfers following high-vol trades.",
  },
  {
    title: "Identity consistency scoring",
    copy: "Score KYC packages for stale documents or partial verification trails.",
  },
];

const bestExecutionItems = [
  {
    title: "Slippage analysis",
    copy: "Benchmark navigator-side fills vs broker internal routing to spot slippage clusters.",
  },
  {
    title: "Price improvement",
    copy: "Quantify positive price improvement over venue NBBO to highlight broker alpha.",
  },
  {
    title: "Fill rate heatmap",
    copy: "Visualise fill probabilities across asset classes and liquidity venues.",
  },
  {
    title: "Venue exposure",
    copy: "Track routing concentrations to manage counterparty and venue risk.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const severityWeights: Record<"low" | "medium" | "high", number> = {
  low: 1,
  medium: 2,
  high: 3,
};

const revenueAtRiskHelpText =
  "Daily broker revenue associated with the navigator or pilot involved in this alert. Higher revenue at risk means this alert could have a bigger financial impact.";

export default function ComplianceCenterPage() {
  const [selectedNavigator, setSelectedNavigator] = useState<Navigator | null>(null);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [selectedPilot, setSelectedPilot] = useState<Pilot | null>(null);
  const [pilotOpen, setPilotOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [tradeOpen, setTradeOpen] = useState(false);

  const navigatorLookup = useMemo(
    () => new Map(navigators.map((navigator) => [navigator.id, navigator] as const)),
    [],
  );
  const pilotLookup = useMemo(
    () => new Map(pilots.map((pilot) => [pilot.id, pilot] as const)),
    [],
  );
  const tradeLookup = useMemo(
    () => new Map(trades.map((trade) => [trade.id, trade] as const)),
    [],
  );

  const navigatorValueMap = useMemo(
    () => getNavigatorValueMap(navigators, pilots),
    [],
  );

  const enrichedAlerts = useMemo(
    () =>
      complianceAlerts
        .map((alert) => {
          const navigator = alert.navigatorId ? navigatorLookup.get(alert.navigatorId) ?? null : null;
          const pilot = alert.pilotId ? pilotLookup.get(alert.pilotId) ?? null : null;
          const trade = alert.tradeId ? tradeLookup.get(alert.tradeId) ?? null : null;
          const valueMeta = alert.navigatorId ? navigatorValueMap[alert.navigatorId] : undefined;
          const revenueAtRisk = valueMeta?.brokerValue.dailyRevenue ?? null;
          const isHighValueNavigator = valueMeta?.valueTier === "high";
          const impactScore = (severityWeights[alert.severity] ?? 1) * (revenueAtRisk ?? 0);

          return {
            ...alert,
            navigator,
            pilot,
            trade,
            revenueAtRisk,
            isHighValueNavigator,
            impactScore,
          };
        })
        .sort((a, b) => {
          if (b.impactScore !== a.impactScore) {
            return b.impactScore - a.impactScore;
          }
          const severityDelta = (severityWeights[b.severity] ?? 1) - (severityWeights[a.severity] ?? 1);
          if (severityDelta !== 0) {
            return severityDelta;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }),
    [navigatorLookup, pilotLookup, tradeLookup, navigatorValueMap],
  );

  const totalRevenueAtRisk = useMemo(
    () =>
      enrichedAlerts.reduce((sum, alert) => {
        return sum + (alert.revenueAtRisk ?? 0);
      }, 0),
    [enrichedAlerts],
  );

  const highSeverityCount = useMemo(
    () => enrichedAlerts.filter((alert) => alert.severity === "high").length,
    [enrichedAlerts],
  );

  const openNavigator = (navigator: Navigator) => {
    setSelectedNavigator(navigator);
    setNavigatorOpen(true);
    setSelectedPilot(null);
    setPilotOpen(false);
    setSelectedTrade(null);
    setTradeOpen(false);
  };

  const openPilot = (pilot: Pilot) => {
    setSelectedPilot(pilot);
    setPilotOpen(true);
    setSelectedNavigator(null);
    setNavigatorOpen(false);
    setSelectedTrade(null);
    setTradeOpen(false);
  };

  const openTrade = (trade: Trade) => {
    setSelectedTrade(trade);
    setTradeOpen(true);
    setSelectedNavigator(null);
    setNavigatorOpen(false);
    setSelectedPilot(null);
    setPilotOpen(false);
  };

  const handleAlertClick = (alert: (typeof enrichedAlerts)[number]) => {
    if (alert.navigator) {
      openNavigator(alert.navigator);
      return;
    }
    if (alert.pilot) {
      openPilot(alert.pilot);
      return;
    }
    if (alert.trade) {
      openTrade(alert.trade);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-[32px] border border-border/50 bg-gradient-to-br from-[#081c3c] via-[#051127] to-[#020813] p-6 sm:p-10 shadow-[0_35px_120px_rgba(3,10,22,0.65)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground/80">Pilot compliance command</p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Compliance</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Monitor surveillance alerts, conduct risk signals, and regulatory workflows in one dark-paneled view.
              </p>
            </div>
            <p className="text-xs text-muted-foreground/70">
              Scores are signals, not promises—PilotScore links risk-adjusted performance with disclosure discipline for audit-grade storytelling.
            </p>
          </div>
          <div className="grid w-full gap-4 text-sm sm:grid-cols-2 lg:w-auto lg:grid-cols-3">
            <HeroStat label="Active alerts" value={formatNumber(enrichedAlerts.length)} detail={`${highSeverityCount} high severity`} />
            <HeroStat label="Revenue at risk" value={totalRevenueAtRisk ? formatCurrency(totalRevenueAtRisk) : "—"} detail="Last 24h" />
            <HeroStat label="Audit events" value={formatNumber(auditEvents.length)} detail="Immutable trail" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="surveillance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 gap-2 rounded-3xl border border-border/40 bg-[rgba(4,12,24,0.9)] p-2 sm:grid-cols-5">
          <TabsTrigger value="surveillance" className="rounded-2xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_10px_30px_rgba(83,246,197,0.18)]">
            Surveillance
          </TabsTrigger>
          <TabsTrigger value="conduct" className="rounded-2xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_10px_30px_rgba(83,246,197,0.18)]">
            Conduct Risk
          </TabsTrigger>
          <TabsTrigger value="kyc" className="rounded-2xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_10px_30px_rgba(83,246,197,0.18)]">
            KYC / AML
          </TabsTrigger>
          <TabsTrigger value="best" className="rounded-2xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_10px_30px_rgba(83,246,197,0.18)]">
            Best Execution
          </TabsTrigger>
          <TabsTrigger value="audit" className="rounded-2xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_10px_30px_rgba(83,246,197,0.18)]">
            Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="surveillance" className="space-y-5">
          <Card className="overflow-hidden rounded-[36px] border border-border/60 bg-[rgba(6,17,35,0.96)] shadow-[0_30px_120px_rgba(3,10,22,0.65)]">
            <CardHeader className="gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold text-foreground">Real-time alerts</CardTitle>
                <CardDescription className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Pipeline monitors leverage, AML, and slippage triggers
                </CardDescription>
              </div>
              <Badge variant="secondary" className="rounded-full border border-primary/40 bg-primary/15 px-4 text-xs uppercase tracking-[0.22em] text-primary">
                {enrichedAlerts.length} active
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              {enrichedAlerts.length === 0 ? (
                <div className="rounded-3xl border border-border/40 bg-sidebar/40 p-6 text-center text-sm text-muted-foreground">
                  No current alerts.
                </div>
              ) : null}
              {enrichedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="cursor-pointer rounded-3xl border border-border/40 bg-[rgba(7,18,36,0.92)] p-5 shadow-[0_18px_55px_rgba(3,10,22,0.45)] transition-all hover:-translate-y-0.5 hover:border-primary/50"
                  onClick={() => handleAlertClick(alert)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <SeverityBadge severity={alert.severity} />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{alert.type}</p>
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground/70">{new Date(alert.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">Revenue at Risk</p>
                      <HelpTooltip text={revenueAtRiskHelpText}>
                        <span className="text-lg font-semibold text-foreground">
                          {alert.revenueAtRisk !== null ? formatCurrency(alert.revenueAtRisk) : "—"}
                        </span>
                      </HelpTooltip>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <div className="rounded-2xl border border-border/40 bg-sidebar/40 p-4">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Business Impact</p>
                        <div className="mt-2 space-y-1 text-xs text-muted-foreground/90">
                          <p>• Daily Revenue at Risk: {alert.revenueAtRisk !== null ? formatCurrency(alert.revenueAtRisk) : "—"}</p>
                          <p>• High-Value Navigator: {alert.isHighValueNavigator ? "YES" : "NO"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">Entities</p>
                        <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                          {alert.navigator ? <span>Navigator · {alert.navigator.name}</span> : null}
                          {alert.pilot ? <span>Pilot · {alert.pilot.name}</span> : null}
                          {alert.trade ? <span>Trade · {alert.trade.instrument}</span> : null}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {alert.navigator ? (
                          <EntityChip prefix="Navigator" label={alert.navigator.name} onActivate={() => openNavigator(alert.navigator!)} />
                        ) : null}
                        {alert.pilot ? (
                          <EntityChip prefix="Pilot" label={alert.pilot.name} onActivate={() => openPilot(alert.pilot!)} />
                        ) : null}
                        {alert.trade ? (
                          <EntityChip prefix="Trade" label={alert.trade.instrument} onActivate={() => openTrade(alert.trade!)} />
                        ) : null}
                      </div>
                      {alert.isHighValueNavigator ? (
                        <Badge variant="secondary" className="rounded-full border border-amber-200/40 bg-amber-500/10 text-[0.65rem] uppercase tracking-[0.2em] text-amber-200">
                          High-value navigator
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conduct" className="space-y-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-120px" }}
            transition={{ staggerChildren: 0.08 }}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {conductRiskItems.map((item) => (
              <motion.div key={item.title} variants={cardVariants}>
                <Card className="h-full rounded-3xl border-2 border-border/60 bg-[rgba(7,18,36,0.92)] p-6 shadow-none">
                  <CardHeader className="p-0">
                    <CardTitle className="text-base font-semibold text-foreground">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="mt-4 p-0 text-sm text-muted-foreground">{item.copy}</CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-120px" }}
            transition={{ staggerChildren: 0.08 }}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {kycItems.map((item) => (
              <motion.div key={item.title} variants={cardVariants}>
                <Card className="h-full rounded-3xl border-2 border-border/60 bg-[rgba(6,16,33,0.94)] p-6 shadow-none">
                  <CardHeader className="p-0">
                    <CardTitle className="text-base font-semibold text-foreground">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="mt-4 p-0 text-sm text-muted-foreground">{item.copy}</CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="best" className="space-y-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-120px" }}
            transition={{ staggerChildren: 0.08 }}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {bestExecutionItems.map((item) => (
              <motion.div key={item.title} variants={cardVariants}>
                <Card className="h-full rounded-3xl border-2 border-border/60 bg-[rgba(7,18,35,0.92)] p-6 shadow-none">
                  <CardHeader className="p-0">
                    <CardTitle className="text-base font-semibold text-foreground">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="mt-4 p-0 text-sm text-muted-foreground">{item.copy}</CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card className="rounded-3xl border-2 border-border/60 bg-[rgba(5,15,30,0.94)] shadow-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Recent audit events</CardTitle>
              <CardDescription className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Immutable trail of compliance interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {auditEvents.map((event) => (
                <div key={event.id} className="rounded-2xl border border-border/40 bg-sidebar/40 p-4">
                  <p className="text-sm font-medium text-foreground">{event.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <NavigatorDetailPanel
        navigator={selectedNavigator}
        open={navigatorOpen}
        onOpenChange={(isOpen) => {
          setNavigatorOpen(isOpen);
          if (!isOpen) {
            setSelectedNavigator(null);
          }
        }}
      />

      <PilotDetailPanel
        pilot={selectedPilot}
        open={pilotOpen}
        onOpenChange={(isOpen) => {
          setPilotOpen(isOpen);
          if (!isOpen) {
            setSelectedPilot(null);
          }
        }}
      />

      <TradeDetailDialog
        trade={selectedTrade}
        open={tradeOpen}
        onOpenChange={(isOpen) => {
          setTradeOpen(isOpen);
          if (!isOpen) {
            setSelectedTrade(null);
          }
        }}
      />
    </div>
  );
}

function SeverityBadge({ severity }: { severity: "low" | "medium" | "high" }) {
  const classes =
    severity === "high"
      ? "bg-[color:var(--pilot-bad)]/20 text-[color:var(--pilot-bad)]"
      : severity === "medium"
        ? "bg-amber-400/15 text-amber-200"
        : "bg-primary/15 text-primary";

  return (
    <Badge variant="secondary" className={cn("rounded-full px-3 text-xs font-semibold uppercase tracking-[0.2em]", classes)}>
      {severity}
    </Badge>
  );
}

function EntityChip({ prefix, label, onActivate }: { prefix: string; label: string; onActivate: () => void }) {
  return (
    <Button
      size="sm"
      variant="secondary"
      className="h-7 rounded-full bg-sidebar/60 px-3 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary"
      onClick={(event) => {
        event.stopPropagation();
        onActivate();
      }}
    >
      <span className="mr-1 text-muted-foreground/70">{prefix}:</span>
      <span className="text-foreground">{label}</span>
    </Button>
  );
}

function HeroStat({ label, value, detail }: { label: string; value: ReactNode; detail?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-[rgba(3,10,22,0.85)] p-4 shadow-[0_12px_40px_rgba(3,10,22,0.45)]">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground/80">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
    </div>
  );
}
