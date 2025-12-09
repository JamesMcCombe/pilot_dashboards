"use client";

import { AlertTriangle } from "lucide-react";

export function RegulatorFooter() {
  return (
    <footer className="border-t border-border/40 bg-sidebar/50 px-6 py-4">
      <div className="mx-auto flex max-w-[1440px] items-start gap-3 text-xs text-muted-foreground">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#fbbf24]" />
        <div className="space-y-1">
          <p className="font-medium text-[#fbbf24]">
            Synthetic Demonstration Data Notice
          </p>
          <p>
            All data presented in this dashboard is 100% synthetic and generated for
            demonstration purposes only. This is a SupTech prototype designed to
            illustrate the types of behavioural insights that could be derived from
            anonymised retail trading data. No real trader information, personally
            identifiable data, or actual trading records are used or displayed.
          </p>
          <p className="text-muted-foreground/70">
            © 2025 Pilot × FMA × Cambridge SupTech Lab · Retail Trading Harm Insight
            Prototype
          </p>
        </div>
      </div>
    </footer>
  );
}
