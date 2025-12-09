import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardModeProvider } from "@/components/dashboard/dashboard-mode-context";
import { HelpProvider } from "@/components/help/help-context";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardModeProvider>
      <TooltipProvider delayDuration={150} skipDelayDuration={0}>
        <HelpProvider>
          <div className="flex min-h-screen bg-shell text-foreground">
            <Sidebar />
            <div className="flex flex-1 flex-col bg-panel">
              <DashboardHeader />
              <main className="flex-1 overflow-y-auto px-5 py-6 md:px-10 md:py-10">
                <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </HelpProvider>
      </TooltipProvider>
    </DashboardModeProvider>
  );
}
