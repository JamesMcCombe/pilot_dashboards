"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  regulatorNavItems,
  NAV_SECTION_ORDER,
  type RegulatorNavItem,
  type RegulatorNavSection,
} from "./nav-items";
import { Shield } from "lucide-react";

const sidebarMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

// Group nav items by section
function groupBySection(
  items: RegulatorNavItem[]
): Map<RegulatorNavSection, RegulatorNavItem[]> {
  const grouped = new Map<RegulatorNavSection, RegulatorNavItem[]>();

  // Initialize in correct order
  NAV_SECTION_ORDER.forEach((section) => {
    grouped.set(section, []);
  });

  // Populate groups
  items.forEach((item) => {
    const sectionItems = grouped.get(item.section);
    if (sectionItems) {
      sectionItems.push(item);
    }
  });

  return grouped;
}

export function RegulatorSidebar() {
  const pathname = usePathname();

  const groupedNavItems = useMemo(
    () => groupBySection(regulatorNavItems),
    []
  );

  // Precompute section start indices for animation delay
  const sectionStartIndices = useMemo(() => {
    const indices: number[] = [];
    let runningIndex = 0;
    NAV_SECTION_ORDER.forEach((section) => {
      indices.push(runningIndex);
      const items = groupedNavItems.get(section) || [];
      runningIndex += items.length;
    });
    return indices;
  }, [groupedNavItems]);

  return (
    <aside className="hidden h-screen w-72 flex-shrink-0 border-r border-sidebar-border bg-sidebar/95 px-6 py-8 text-sm text-sidebar-foreground lg:sticky lg:top-0 lg:flex">
      <div className="flex h-full w-full flex-col gap-6">
        {/* Logo */}
        <motion.div
          {...sidebarMotion}
          transition={{ delay: 0.05, duration: 0.35, ease: "easeOut" }}
        >
          <Link
            href="/regulator/overview"
            className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-primary/10"
          >
            <Image
              src="/pilot-logo.svg"
              alt="Pilot"
              width={140}
              height={48}
              priority
              className="h-10 w-auto"
            />
          </Link>
        </motion.div>

        {/* FMA Logo & Mode Badge */}
        <motion.div
          {...sidebarMotion}
          transition={{ delay: 0.08, duration: 0.35, ease: "easeOut" }}
          className="rounded-2xl border border-primary/30 bg-primary/10 p-4"
        >
          {/* FMA Logo */}
          <div className="mb-3 flex justify-center">
            <Image
              src="/fma-logo.png"
              alt="Financial Markets Authority"
              width={180}
              height={60}
              className="h-auto w-full max-w-[160px]"
            />
          </div>
          
          {/* Divider */}
          <div className="mb-3 border-t border-primary/20" />
          
          {/* Mode Label */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                  SupTech Dashboard
                </p>
                <p className="text-[9px] text-muted-foreground">
                  Regulator Mode Active
                </p>
              </div>
            </div>
            <div className="flex h-2 w-2 animate-pulse rounded-full bg-primary" />
          </div>
        </motion.div>

        {/* Navigation */}
        <LayoutGroup>
          <div className="flex min-h-0 flex-1 flex-col">
            <nav className="flex-1 space-y-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/50">
              {NAV_SECTION_ORDER.map((section, sectionIndex) => {
                const items = groupedNavItems.get(section) || [];
                if (items.length === 0) return null;

                const startIndex = sectionStartIndices[sectionIndex];

                return (
                  <div key={section} className={sectionIndex > 0 ? "mt-5" : ""}>
                    {/* Section Header */}
                    <motion.p
                      {...sidebarMotion}
                      transition={{
                        delay: 0.1 + sectionIndex * 0.02,
                        duration: 0.3,
                      }}
                      className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70"
                    >
                      {section}
                    </motion.p>

                    {/* Section Items */}
                    <ul className="space-y-1">
                      {items.map((item, itemIndex) => (
                        <SidebarLink
                          key={item.href}
                          item={item}
                          index={startIndex + itemIndex}
                          isActive={pathname.startsWith(item.href)}
                        />
                      ))}
                    </ul>
                  </div>
                );
              })}
            </nav>

            {/* Footer Link */}
            <div className="flex-shrink-0 border-t border-border/40 pt-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <span className="text-xs">← Back to Broker Mode</span>
              </Link>
            </div>
          </div>
        </LayoutGroup>
      </div>
    </aside>
  );
}

function SidebarLink({
  item,
  index,
  isActive,
}: {
  item: RegulatorNavItem;
  index: number;
  isActive: boolean;
}) {
  return (
    <motion.li
      {...sidebarMotion}
      transition={{ delay: 0.12 + index * 0.03, duration: 0.35, ease: "easeOut" }}
    >
      <Link
        href={item.href}
        className={cn(
          "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
          isActive
            ? "text-sidebar-primary"
            : "text-muted-foreground hover:text-sidebar-foreground"
        )}
      >
        {isActive && (
          <motion.span
            layoutId="active-regulator-nav"
            className="absolute inset-0 rounded-2xl bg-primary/10 ring-1 ring-inset ring-primary/60"
            transition={{ type: "spring", stiffness: 230, damping: 26 }}
          />
        )}
        <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/70 text-primary transition-colors group-hover:bg-secondary">
          <item.icon className="h-4 w-4" />
        </span>
        <span className="relative">{item.title}</span>
      </Link>
    </motion.li>
  );
}
