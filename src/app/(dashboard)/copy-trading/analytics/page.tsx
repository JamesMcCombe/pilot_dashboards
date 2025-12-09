import { CopyTradingFunnel } from "@/components/copy-trading/copy-trading-funnel";
import { NavigatorEconomicsLeaderboard } from "@/components/copy-trading/navigator-economics-leaderboard";
import { CopierBehaviourOverview } from "@/components/copy-trading/copier-behaviour-overview";
import { BlueprintAnalyticsCard } from "@/components/copy-trading/blueprint-analytics-card";
import { HelpTooltip } from "@/components/help/help-tooltip";
import { HELP_COPY } from "@/components/help/help-text";

export default function CopyTradingAnalyticsPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <HelpTooltip text={HELP_COPY.copyTradingAnalyticsPage} asChild indicator={false}>
          <h1 className="text-xl font-semibold text-foreground">Copy Trading Analytics</h1>
        </HelpTooltip>
        <p className="text-sm text-muted-foreground">
          Product health signals focused on navigator economics, funnel performance, and follower retention.
        </p>
      </section>

      <section>
        <CopyTradingFunnel />
      </section>

      <section className="space-y-6">
        <NavigatorEconomicsLeaderboard />
        <CopierBehaviourOverview />
      </section>

      <section>
        <BlueprintAnalyticsCard />
      </section>
    </div>
  );
}
