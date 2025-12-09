import { TradingClusterScatter } from "@/components/regulator/charts/trading-cluster-scatter";
import { HerdingHeatmap } from "@/components/regulator/charts/herding-heatmap";
import { VolatilityTriggers } from "@/components/regulator/charts/volatility-triggers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TOTAL_CLUSTER_EVENTS,
  UNIQUE_CLUSTERS,
  AVG_CLUSTER_SIZE,
  volatilityTriggers,
} from "@/data/regulator/influence-clusters";

export const metadata = {
  title: "Influence Detection | Regulator Dashboard",
  description: "Trading cluster analysis and herding pattern detection",
};

export default function InfluenceDetectionPage() {
  const totalTriggerReactions = volatilityTriggers.reduce(
    (sum, t) => sum + t.traderReactions,
    0
  );

  return (
    <div className="space-y-8">
      {/* Key Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-3xl border-2 border-primary/30 bg-primary/10">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Cluster Events Detected</p>
            <p className="mt-2 text-3xl font-bold text-primary">{TOTAL_CLUSTER_EVENTS}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              coordinated trading instances
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-[#fbbf24]/30 bg-[#fbbf24]/10">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Unique Clusters</p>
            <p className="mt-2 text-3xl font-bold text-[#fbbf24]">{UNIQUE_CLUSTERS}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              distinct influence patterns
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-[#a78bfa]/30 bg-[#a78bfa]/10">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Avg Cluster Size</p>
            <p className="mt-2 text-3xl font-bold text-[#a78bfa]">{AVG_CLUSTER_SIZE}</p>
            <p className="mt-1 text-xs text-muted-foreground">traders per cluster</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-[#f87171]/30 bg-[#f87171]/10">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Volatility Reactions</p>
            <p className="mt-2 text-3xl font-bold text-[#f87171]">
              {totalTriggerReactions}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              coordinated event responses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Methodology Note */}
      <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6">
        <h3 className="text-lg font-semibold text-primary">
          Influence Detection Methodology
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This analysis detects influence patterns <strong>without monitoring content</strong>.
          We infer social-driven behaviour through observable trading signatures:
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium">Temporal Clustering</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Multiple traders entering same instrument within narrow time windows
            </p>
          </div>
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium">Instrument Convergence</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Unusual concentration on specific assets at specific times
            </p>
          </div>
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium">Event Correlation</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Coordinated responses to volatility triggers
            </p>
          </div>
          <div className="rounded-xl bg-card/50 p-3">
            <p className="font-medium">Session Patterns</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Unusual trading activity outside normal market hours
            </p>
          </div>
        </div>
      </div>

      {/* Trading Cluster Scatter */}
      <TradingClusterScatter />

      {/* Herding Heatmap */}
      <HerdingHeatmap />

      {/* Volatility Triggers */}
      <div className="grid gap-6 lg:grid-cols-2">
        <VolatilityTriggers />

        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Key Insight: Social Signal Inference
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              The detected trading clusters strongly suggest the presence of external
              influence signals, without the need to monitor:
            </p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Social media posts or videos</li>
              <li>Telegram/Discord group messages</li>
              <li>Trading alert services</li>
              <li>Influencer recommendations</li>
            </ul>
            <p className="pt-2">
              This approach allows regulators to identify <strong>harm patterns</strong>{" "}
              while respecting privacy. The presence of influence can be inferred
              from the <strong>effect</strong> (coordinated trading) rather than
              the <strong>cause</strong> (content monitoring).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
