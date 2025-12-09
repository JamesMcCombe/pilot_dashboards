"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { volatilityTriggers } from "@/data/regulator/influence-clusters";

export function VolatilityTriggers() {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const totalReactions = volatilityTriggers.reduce((sum, t) => sum + t.traderReactions, 0);
  const avgLoss = Math.round(
    volatilityTriggers.reduce((sum, t) => sum + t.avgLoss * t.traderReactions, 0) /
      totalReactions
  );

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Volatility Event Reactions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {totalReactions} total reactions to major events · Avg loss: {currencyFormatter.format(avgLoss)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {volatilityTriggers.map((trigger) => (
            <div
              key={trigger.timestamp}
              className="rounded-2xl border border-border/40 bg-muted/20 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{trigger.event}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(trigger.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-[#f87171]">
                    {currencyFormatter.format(trigger.avgLoss)}
                  </p>
                  <p className="text-xs text-muted-foreground">avg loss</p>
                </div>
              </div>
              <div className="mt-3 flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">
                    {trigger.traderReactions} traders reacted
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#f87171]" />
                  <span className="text-muted-foreground">
                    {trigger.clusterSize} in coordinated cluster
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted/30">
                  <div
                    className="h-full rounded-full bg-[#f87171]/60"
                    style={{
                      width: `${(trigger.clusterSize / trigger.traderReactions) * 100}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {((trigger.clusterSize / trigger.traderReactions) * 100).toFixed(0)}%
                  traded in coordinated cluster
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
