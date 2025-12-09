"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Menu, Shield, Database } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { regulatorNavItems, resolveRegulatorTitleFromPath } from "./nav-items";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function RegulatorHeader() {
  const pathname = usePathname();
  const title = useMemo(() => resolveRegulatorTitleFromPath(pathname), [pathname]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-6 border-b border-border/70 bg-panel/95 px-6 backdrop-blur">
      <div className="flex flex-1 items-center gap-4">
        {/* Mobile Nav */}
        <div className="flex items-center lg:hidden">
          <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
        </div>

        {/* Title */}
        <motion.div
          layout
          className="flex flex-1 flex-col gap-1"
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <h1 className="text-xl font-semibold text-foreground/90 md:text-2xl">
            {title}
          </h1>
          <p className="hidden text-xs text-muted-foreground/80 sm:block">
            FMA SupTech Dashboard · Retail Trading Harm Insight Prototype
          </p>
        </motion.div>
      </div>

      <div className="flex items-center gap-3">
        {/* Synthetic Data Badge */}
        <div className="hidden items-center gap-2 rounded-2xl border border-[#fbbf24]/40 bg-[#fbbf24]/10 px-4 py-2 text-xs font-medium text-[#fbbf24] sm:flex">
          <Database className="h-3.5 w-3.5" />
          <span>Synthetic Demo Data</span>
        </div>

        {/* Mode Badge */}
        <div className="flex items-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs font-medium text-primary">
          <Shield className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Regulator Mode</span>
        </div>

        {/* User Avatar */}
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
          FMA
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
      <SheetContent
        side="left"
        className="w-72 border-border/40 bg-sidebar text-sidebar-foreground"
      >
        <SheetHeader className="flex items-center justify-between">
          <Link
            href="/regulator/overview"
            className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-primary/10"
          >
            <Image
              src="/pilot-logomark.svg"
              alt="Pilot"
              width={48}
              height={48}
              className="h-10 w-auto"
            />
            <SheetTitle className="text-left text-lg font-semibold text-foreground">
              Regulator Mode
            </SheetTitle>
          </Link>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-6 text-sm">
          <nav className="flex flex-col gap-1.5">
            {regulatorNavItems.map((item) => (
              <SheetClose key={item.href} asChild>
                <Link
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </SheetClose>
            ))}
          </nav>
          <div className="border-t border-border/40 pt-4">
            <SheetClose asChild>
              <Link
                href="/dashboard"
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-border/40 hover:text-foreground"
              >
                ← Back to Broker Mode
              </Link>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
