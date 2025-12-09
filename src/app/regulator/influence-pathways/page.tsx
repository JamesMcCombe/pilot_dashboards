import { InfluencePathwayGraph } from "@/components/regulator/charts/influence-pathway-graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Influence Pathways | Regulator Dashboard",
  description: "Network visualization of influence propagation in trading behaviour",
};

export default function InfluencePathwaysPage() {
  return (
    <div className="space-y-8">
      {/* Context Panel */}
      <div className="rounded-3xl border border-[#8b5cf6]/30 bg-[#8b5cf6]/5 p-6">
        <h3 className="text-lg font-semibold text-[#8b5cf6]">
          Understanding Influence Pathways
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This network visualization shows how trading behaviour patterns propagate 
          through the market ecosystem. By analyzing timing correlations and cluster 
          formation, we can infer influence pathways without monitoring content or 
          identifying individuals.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <div className="mx-auto h-8 w-8 rounded-lg bg-[#ef4444]/20 p-1.5">
              <div className="h-full w-full rounded bg-[#ef4444]" />
            </div>
            <p className="mt-2 text-xs font-medium">Events</p>
            <p className="text-[10px] text-muted-foreground">Volatility triggers</p>
          </div>
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <div className="mx-auto h-8 w-8 rounded-lg bg-[#f97316]/20 p-1.5">
              <div className="h-full w-full rounded bg-[#f97316]" />
            </div>
            <p className="mt-2 text-xs font-medium">Signals</p>
            <p className="text-[10px] text-muted-foreground">Social providers</p>
          </div>
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <div className="mx-auto h-8 w-8 rounded-lg bg-[#8b5cf6]/20 p-1.5">
              <div className="h-full w-full rounded bg-[#8b5cf6]" />
            </div>
            <p className="mt-2 text-xs font-medium">Clusters</p>
            <p className="text-[10px] text-muted-foreground">Behaviour groups</p>
          </div>
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <div className="mx-auto h-8 w-8 rounded-lg bg-[#3b82f6]/20 p-1.5">
              <div className="h-full w-full rounded bg-[#3b82f6]" />
            </div>
            <p className="mt-2 text-xs font-medium">Cohorts</p>
            <p className="text-[10px] text-muted-foreground">Trader segments</p>
          </div>
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <div className="mx-auto h-8 w-8 rounded-lg bg-[#53f6c5]/20 p-1.5">
              <div className="h-full w-full rounded bg-[#53f6c5]" />
            </div>
            <p className="mt-2 text-xs font-medium">Assets</p>
            <p className="text-[10px] text-muted-foreground">Trading instruments</p>
          </div>
        </div>
      </div>

      {/* Main Influence Graph */}
      <InfluencePathwayGraph />

      {/* Insight Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Influence Detection Methodology
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Influence pathways are inferred through behavioral signal analysis:
            </p>
            <ul className="ml-4 list-disc space-y-1 pt-2">
              <li>
                <strong>Entry timing correlation:</strong> Detecting traders who 
                consistently enter positions within seconds of each other
              </li>
              <li>
                <strong>Order flow patterns:</strong> Identifying similar position 
                sizes and direction clusters
              </li>
              <li>
                <strong>Event response:</strong> Measuring latency between market 
                events and coordinated trading
              </li>
              <li>
                <strong>Cross-asset correlation:</strong> Tracking synchronized 
                activity across multiple instruments
              </li>
              <li>
                <strong>Temporal clustering:</strong> Using statistical methods to 
                identify non-random groupings
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Regulatory Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Network analysis supports several regulatory objectives:
            </p>
            <ul className="ml-4 list-disc space-y-1 pt-2">
              <li>
                <strong>Market integrity:</strong> Detecting potential coordination 
                or manipulation patterns
              </li>
              <li>
                <strong>Influencer oversight:</strong> Identifying high-impact signal 
                providers for disclosure rules
              </li>
              <li>
                <strong>Risk propagation:</strong> Understanding how losses cascade 
                through connected traders
              </li>
              <li>
                <strong>Intervention targeting:</strong> Focusing education and 
                warnings on high-influence pathways
              </li>
              <li>
                <strong>Copy trading review:</strong> Assessing systemic risks from 
                concentrated following
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Key Patterns */}
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Observed Influence Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Analysis of the synthetic network reveals common influence propagation patterns:
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <h4 className="font-medium text-[#ef4444]">Event-Triggered Cascades</h4>
              <p className="mt-2 text-xs text-muted-foreground">
                Major volatility events (CPI, FOMC) trigger signal provider activity, 
                which then propagates to clusters and cohorts. This cascade happens 
                within minutes and affects specific assets.
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <h4 className="font-medium text-[#8b5cf6]">Cluster-Cohort Overlap</h4>
              <p className="mt-2 text-xs text-muted-foreground">
                Trading clusters show strong overlap with behavioural cohorts. The 
                &ldquo;Socially Influenced&rdquo; cohort appears in multiple clusters, suggesting 
                these traders are susceptible to various influence sources.
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <h4 className="font-medium text-[#53f6c5]">Asset Concentration</h4>
              <p className="mt-2 text-xs text-muted-foreground">
                High-leverage and volatility-chasing cohorts concentrate heavily on 
                NAS100 and BTCUSD, while socially influenced traders spread across 
                multiple assets following signal providers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6">
        <h3 className="text-lg font-semibold text-primary">
          Privacy-Preserving Analysis
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This influence pathway analysis is conducted entirely through behavioral 
          signal correlation. No social media content is scraped, no messages are 
          monitored, and no individual traders are identified. The network represents 
          aggregate patterns detected through anonymised trade timing analysis only.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground">Content Scraped</p>
          </div>
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground">Individuals Named</p>
          </div>
          <div className="rounded-xl bg-card/50 p-3 text-center">
            <p className="text-2xl font-bold text-primary">100%</p>
            <p className="text-xs text-muted-foreground">Behavioural Inference</p>
          </div>
        </div>
      </div>
    </div>
  );
}
