import { SurvivalCurve } from "@/components/regulator/charts/survival-curve";
import { BlowupPatterns } from "@/components/regulator/charts/blowup-patterns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  NZ_MEDIAN_TTF,
  GLOBAL_MEDIAN_TTF,
  NZ_EARLY_LOSS_PCT,
  GLOBAL_EARLY_LOSS_PCT,
  REPEAT_BLOWUP_TRADERS,
} from "@/data/regulator/survival-data";

export const metadata = {
  title: "Survival Curves | Regulator Dashboard",
  description: "Time-to-failure analysis and repeated account blow-up patterns",
};

export default function SurvivalCurvesPage() {
  return (
    <div className="space-y-8">
      {/* Key Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-3xl border-2 border-[#f87171]/30 bg-[#f87171]/10">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">NZ Median Time-to-Failure</p>
            <p className="mt-2 text-3xl font-bold text-[#f87171]">{NZ_MEDIAN_TTF} days</p>
            <p className="mt-1 text-xs text-muted-foreground">
              vs {GLOBAL_MEDIAN_TTF} days global
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-[#f87171]/30 bg-[#f87171]/10">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">NZ Early Loss Rate</p>
            <p className="mt-2 text-3xl font-bold text-[#f87171]">{NZ_EARLY_LOSS_PCT}%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              fail within 30 days (vs {GLOBAL_EARLY_LOSS_PCT}% global)
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-[#fbbf24]/30 bg-[#fbbf24]/10">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Repeat Offenders</p>
            <p className="mt-2 text-3xl font-bold text-[#fbbf24]">{REPEAT_BLOWUP_TRADERS}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              traders with 2+ account blow-ups
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-primary/30 bg-primary/10">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Gap vs Global</p>
            <p className="mt-2 text-3xl font-bold text-primary">
              {GLOBAL_MEDIAN_TTF - NZ_MEDIAN_TTF} days
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              NZ traders fail faster
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Survival Curve */}
      <SurvivalCurve />

      {/* Blow-up Patterns */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Repeated Account Failures
        </h2>
        <BlowupPatterns />
      </div>

      {/* Insight Panel */}
      <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Key Insight: Prop Firm Funnel Effect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            NZ traders engaging with offshore prop firms show significantly faster
            account depletion compared to global benchmarks. The median time-to-failure
            of {NZ_MEDIAN_TTF} days suggests a pattern of:
          </p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              Inadequate preparation before entering challenges
            </li>
            <li>
              Over-leveraging to meet aggressive profit targets
            </li>
            <li>
              Repeat purchasing of evaluation accounts after failures
            </li>
            <li>
              Limited risk management education or discipline
            </li>
          </ul>
          <p>
            The high concentration of early losses ({NZ_EARLY_LOSS_PCT}% within 30 days)
            indicates that harm occurs quickly, limiting the window for intervention
            or education.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
