import { LeverageCurve } from "@/components/regulator/charts/leverage-curve";
import { StopLossRatio } from "@/components/regulator/charts/stop-loss-ratio";
import { VolatilityExposure } from "@/components/regulator/charts/volatility-exposure";
import { PlatformUsage } from "@/components/regulator/charts/platform-usage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AVERAGE_LEVERAGE,
  HIGH_LEVERAGE_PCT,
  STOP_LOSS_ADOPTION_RATE,
  NO_STOP_LOSS_PCT,
  HIGH_VOLATILITY_EXPOSURE_PCT,
  AVG_TRADES_PER_WEEK,
  OVERTRADING_PCT,
  AVG_RISK_DISCIPLINE,
  POOR_DISCIPLINE_PCT,
} from "@/data/regulator/behavioural-metrics";

export const metadata = {
  title: "Behavioural Metrics | Regulator Dashboard",
  description: "Leverage, stop-loss, volatility exposure and risk discipline analysis",
};

export default function BehaviouralMetricsPage() {
  return (
    <div className="space-y-8">
      {/* Key Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-3xl border-2 border-[#f87171]/30 bg-[#f87171]/10">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">High Leverage Usage</p>
            <p className="mt-2 text-3xl font-bold text-[#f87171]">{HIGH_LEVERAGE_PCT}%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              using 1:100 or higher leverage
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-[#f97316]/30 bg-[#f97316]/10">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">No Stop-Loss</p>
            <p className="mt-2 text-3xl font-bold text-[#f97316]">{NO_STOP_LOSS_PCT}%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              rarely or never use stop-losses
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-[#a78bfa]/30 bg-[#a78bfa]/10">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">High Volatility Exposure</p>
            <p className="mt-2 text-3xl font-bold text-[#a78bfa]">
              {HIGH_VOLATILITY_EXPOSURE_PCT}%
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              high or very high exposure
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-[#fbbf24]/30 bg-[#fbbf24]/10">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Poor Discipline</p>
            <p className="mt-2 text-3xl font-bold text-[#fbbf24]">{POOR_DISCIPLINE_PCT}%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              risk discipline score under 40
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LeverageCurve />
        <StopLossRatio />
      </div>

      <VolatilityExposure />

      {/* Platform Usage */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Platform Analysis
        </h2>
        <PlatformUsage />
      </div>

      {/* Behavioural Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Risk Behaviour Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-muted/20 p-3">
                <span className="text-muted-foreground">Average Leverage</span>
                <span className="font-semibold">1:{AVERAGE_LEVERAGE}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/20 p-3">
                <span className="text-muted-foreground">Stop-Loss Adoption</span>
                <span className="font-semibold">{STOP_LOSS_ADOPTION_RATE}%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/20 p-3">
                <span className="text-muted-foreground">Avg Trades/Week</span>
                <span className="font-semibold">{AVG_TRADES_PER_WEEK}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/20 p-3">
                <span className="text-muted-foreground">Overtrading Rate</span>
                <span className="font-semibold">{OVERTRADING_PCT}%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/20 p-3">
                <span className="text-muted-foreground">Avg Risk Discipline</span>
                <span className="font-semibold">{AVG_RISK_DISCIPLINE}/100</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Key Findings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Analysis of NZ retail trader behaviour reveals several concerning
              patterns:
            </p>
            <ul className="ml-4 list-disc space-y-2 pt-2">
              <li>
                <strong>Leverage Misuse:</strong> {HIGH_LEVERAGE_PCT}% of traders
                use leverage levels that significantly amplify risk
              </li>
              <li>
                <strong>Risk Control Gaps:</strong> Over a quarter of traders
                rarely or never use basic stop-loss protections
              </li>
              <li>
                <strong>Platform Correlation:</strong> MT4/MT5 users show higher
                prop firm usage and lower stop-loss adoption
              </li>
              <li>
                <strong>Overtrading Signal:</strong> {OVERTRADING_PCT}% trade at
                frequencies associated with reduced performance
              </li>
            </ul>
            <p className="pt-2">
              These metrics provide a baseline for measuring education and
              intervention effectiveness over time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
