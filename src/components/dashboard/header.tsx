"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bell, HelpCircle, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useDashboardMode } from "./dashboard-mode-context";
import { Button } from "@/components/ui/button";
import { useHelp } from "@/components/help/help-context";
import { HelpTooltip } from "@/components/help/help-tooltip";
import { HELP_COPY } from "@/components/help/help-text";
import {
  mainNavItems,
  resolveTitleFromPath,
  secondaryNavItems,
  type NavItem,
} from "./nav-items";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function DashboardHeader() {
  const pathname = usePathname();
  const title = useMemo(() => resolveTitleFromPath(pathname), [pathname]);
  const { mode, setMode } = useDashboardMode();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { helpEnabled, toggleHelp } = useHelp();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-6 border-b border-border/70 bg-panel/95 px-6 backdrop-blur">
      <div className="flex flex-1 items-center gap-4">
        <div className="flex items-center lg:hidden">
          <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
        </div>
        <motion.div
          layout
          className="flex flex-1 flex-col gap-1"
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <h1 className="text-xl font-semibold text-foreground/90 md:text-2xl">
            {title}
          </h1>
          <p className="hidden text-xs text-muted-foreground/80 sm:block">
            Static pilot demo · values switch with mode for future data binding.
          </p>
        </motion.div>

        <div className="hidden max-w-sm flex-1 items-center gap-3 self-stretch md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search pilots, navigators, trades..."
              className="h-11 rounded-2xl border-border/60 bg-sidebar/60 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <HelpTooltip text={HELP_COPY.modeToggle} asChild indicator={false}>
          <ModeToggle
            mode={mode}
            onModeChange={(checked) =>
              setMode(checked ? "withPilot" : "withoutPilot")
            }
          />
        </HelpTooltip>

        <HelpModeToggle helpEnabled={helpEnabled} onToggle={toggleHelp} />

        <HelpTooltip text={HELP_COPY.alertsButton} asChild indicator={false}>
          <HeaderIconButton label="Alerts">
            <Bell className="h-4 w-4" />
          </HeaderIconButton>
        </HelpTooltip>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
          JM
        </div>
      </div>
    </header>
  );
}

function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-sidebar/50 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          aria-label="Toggle navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 border-border/40 bg-sidebar text-sidebar-foreground">
        <SheetHeader className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
            aria-label="Pilot Broker Dashboard home"
          >
            <Image
              src="/pilot-logomark.svg"
              alt="Pilot logomark"
              width={48}
              height={48}
              className="h-10 w-auto"
            />
            <SheetTitle className="text-left text-lg font-semibold text-foreground">
              Pilot Navigation
            </SheetTitle>
          </Link>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-6 text-sm">
          <nav className="flex flex-col gap-1.5">
            {mainNavItems.map((item) => (
              <MobileNavLink
                key={item.href}
                item={item}
                onNavigate={() => onOpenChange(false)}
              />
            ))}
          </nav>
          <nav className="flex flex-col gap-1.5">
            {secondaryNavItems.map((item) => (
              <MobileNavLink
                key={item.href}
                item={item}
                onNavigate={() => onOpenChange(false)}
              />
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileNavLink({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  return (
    <SheetClose asChild>
      <Link
        href={item.href}
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
      >
        <item.icon className="h-4 w-4" />
        {item.title}
      </Link>
    </SheetClose>
  );
}

function ModeToggle({
  mode,
  onModeChange,
}: {
  mode: "withPilot" | "withoutPilot";
  onModeChange: (checked: boolean) => void;
}) {
  const checked = mode === "withPilot";

  return (
    <motion.div
      layout
      className="flex items-center gap-3 rounded-2xl border border-border/60 bg-sidebar/50 px-4 py-2.5 text-xs font-medium text-muted-foreground"
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground/80">
          Mode
        </span>
        <div className="flex items-center gap-2 text-sm">
          <span className={cn("font-semibold", checked && "text-primary")}>With Pilot</span>
          <Switch checked={checked} onCheckedChange={onModeChange} />
          <span className={cn("font-semibold", !checked && "text-primary")}>Without</span>
        </div>
      </div>
    </motion.div>
  );
}

function HeaderIconButton({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-sidebar/50 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      aria-label={label}
    >
      {children}
    </button>
  );
}

function HelpModeToggle({
  helpEnabled,
  onToggle,
}: {
  helpEnabled: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onToggle}
      aria-pressed={helpEnabled}
      className={cn(
        "flex h-11 items-center rounded-2xl border border-border/60 bg-sidebar/50 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary",
        helpEnabled && "border-primary/60 bg-primary/10 text-primary",
      )}
    >
      <HelpCircle className="h-4 w-4" />
      <span className="text-[0.7rem] normal-case tracking-tight">
        {helpEnabled ? "Hide Help" : "Show Help"}
      </span>
    </Button>
  );
}
