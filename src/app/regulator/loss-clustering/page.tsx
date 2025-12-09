import { LossHeatmap } from "@/components/regulator/charts/loss-heatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  COORDINATED_EVENTS_COUNT,
  TRADERS_IN_COORDINATED_LOSSES,
  TOTAL_COORDINATED_LOSS,
  lossbyTimeSlot,
} from "@/data/regulator/loss-clustering";

export const metadata = {
  title: "Loss Clustering | Regulator Dashboard",
  description: "Coordinated loss event analysis and harm pattern detection",
};

export default function LossClusteringPage() {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const coordinatedSlots = lossbyTimeSlot.filter((s) => s.hasCoordinated);
  const avgCoordinatedLoss =
    coordinatedSlots.reduce((sum, s) => sum + s.totalLoss, 0) /
    coordinatedSlots.length;

  return (
    <div className="space-y-8">
      {/* Key Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-3xl border-2 border-[#f87171]/30 bg-[#f87171]/10">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Coordinated Loss Events</p>
            <p className="mt-2 text-3xl font-bold text-[#f87171]">
              {COORDINATED_EVENTS_COUNT}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              distinct time-clustered events
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-[#f87171]/30 bg-[#f87171]/10">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Traders Affected</p>
            <p className="mt-2 text-3xl font-bold text-[#f87171]">
              {TRADERS_IN_COORDINATED_LOSSES}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              in coordinated loss clusters
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-[#f87171]/30 bg-[#f87171]/10">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Coordinated Loss</p>
            <p className="mt-2 text-3xl font-bold text-[#f87171]">
              {currencyFormatter.format(TOTAL_COORDINATED_LOSS)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              across all cluster events
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-[#fbbf24]/30 bg-[#fbbf24]/10">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Avg Loss per Event</p>
            <p className="mt-2 text-3xl font-bold text-[#fbbf24]">
              {currencyFormatter.format(avgCoordinatedLoss)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              per coordinated time slot
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Loss Heatmap */}
      <LossHeatmap />

      {/* Interpretation Guide */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Understanding Loss Clustering
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Loss clustering reveals when multiple traders experience significant
              losses within the same time windows. This pattern indicates:
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-2">
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#f87171]" />
                <div>
                  <p className="font-medium text-foreground">Shared Influence</p>
                  <p>
                    Multiple traders acting on the same signal or recommendation
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#f87171]" />
                <div>
                  <p className="font-medium text-foreground">Herd Behaviour</p>
                  <p>
                    Coordinated entry into risky positions without independent analysis
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#f87171]" />
                <div>
                  <p className="font-medium text-foreground">Education Gaps</p>
                  <p>
                    Multiple traders making the same risk management errors
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#f87171]" />
                <div>
                  <p className="font-medium text-foreground">Volatility Exposure</p>
                  <p>
                    Coordinated vulnerability to specific market events
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Regulatory Implications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Loss clustering patterns provide evidence for policy development
              without requiring content monitoring:
            </p>
            <ul className="ml-4 list-disc space-y-2 pt-2">
              <li>
                <strong>Early Warning System:</strong> Detect emerging harm patterns
                before they reach complaint thresholds
              </li>
              <li>
                <strong>Education Targeting:</strong> Identify specific behaviours
                that lead to clustered losses
              </li>
              <li>
                <strong>Influencer Impact:</strong> Quantify the effect of social
                trading signals without monitoring content
              </li>
              <li>
                <strong>Suitability Evidence:</strong> Build case for enhanced
                disclosure or suitability requirements
              </li>
              <li>
                <strong>Platform Accountability:</strong> Identify which platforms
                see highest loss clustering
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
