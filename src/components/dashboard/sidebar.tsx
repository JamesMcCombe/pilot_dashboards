"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  mainNavItems,
  secondaryNavItems,
  type NavItem,
} from "./nav-items";
import { Shield } from "lucide-react";

const sidebarMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-72 flex-shrink-0 border-r border-sidebar-border bg-sidebar/95 px-6 py-8 text-sm text-sidebar-foreground lg:sticky lg:top-0 lg:flex">
      <div className="flex h-full w-full flex-col gap-10">
        <motion.div
          {...sidebarMotion}
          transition={{ delay: 0.05, duration: 0.35, ease: "easeOut" }}
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
            aria-label="Pilot Broker Dashboard home"
          >
            <Image
              src="/pilot-logo.svg"
              alt="Pilot Broker Dashboard"
              width={160}
              height={52}
              priority
              className="h-12 w-auto"
            />
          </Link>
        </motion.div>

        <LayoutGroup>
          <div className="flex h-full flex-col gap-6">
            <div className="flex-1 overflow-y-auto pr-1">
              <NavSection
                title="Overview"
                items={mainNavItems}
                activePath={pathname}
              />
            </div>
            <div className="border-t border-border/40 pt-4">
              <NavSection
                title="Controls"
                items={secondaryNavItems}
                activePath={pathname}
              />
            </div>

            {/* Mode Switch */}
            <div className="border-t border-border/40 pt-4">
              <Link
                href="/regulator/overview"
                className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition-all hover:bg-primary/20"
              >
                <Shield className="h-4 w-4" />
                <div className="flex-1">
                  <p className="text-xs font-semibold">Switch to Regulator Mode</p>
                  <p className="text-[10px] text-muted-foreground">FMA SupTech Dashboard</p>
                </div>
              </Link>
            </div>
          </div>
        </LayoutGroup>
      </div>
    </aside>
  );
}

function NavSection({
  title,
  items,
  activePath,
}: {
  title: string;
  items: NavItem[];
  activePath: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <motion.p
        {...sidebarMotion}
        transition={{ delay: 0.08, duration: 0.3 }}
        className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground"
      >
        {title}
      </motion.p>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, index) => (
          <SidebarLink
            key={item.href}
            item={item}
            index={index}
            isActive={activePath.startsWith(item.href)}
          />
        ))}
      </ul>
    </div>
  );
}

function SidebarLink({
  item,
  index,
  isActive,
}: {
  item: NavItem;
  index: number;
  isActive: boolean;
}) {
  return (
    <motion.li
      {...sidebarMotion}
      transition={{ delay: 0.1 + index * 0.03, duration: 0.35, ease: "easeOut" }}
    >
      <Link
        href={item.href}
        className={cn(
          "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
          isActive
            ? "text-sidebar-primary"
            : "text-muted-foreground hover:text-sidebar-foreground",
        )}
      >
        {isActive && (
          <motion.span
            layoutId="active-nav"
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
