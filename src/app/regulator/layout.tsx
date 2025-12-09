import type { ReactNode } from "react";
import { RegulatorSidebar } from "@/components/regulator/regulator-sidebar";
import { RegulatorHeader } from "@/components/regulator/regulator-header";
import { RegulatorFooter } from "@/components/regulator/regulator-footer";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RegulatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={150} skipDelayDuration={0}>
      <div className="flex min-h-screen bg-shell text-foreground">
        <RegulatorSidebar />
        <div className="flex flex-1 flex-col bg-panel">
          <RegulatorHeader />
          <main className="flex-1 overflow-y-auto px-5 py-6 md:px-10 md:py-10">
            <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6">
              {children}
            </div>
          </main>
          <RegulatorFooter />
        </div>
      </div>
    </TooltipProvider>
  );
}
