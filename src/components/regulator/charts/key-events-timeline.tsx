"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Info,
  Zap,
  Users,
  Building2,
  Globe,
  Grid3X3,
  Shield,
  X,
  ExternalLink,
  Calendar,
  TrendingUp,
  TrendingDown,
  Filter,
} from "lucide-react";
import Link from "next/link";
import {
  EVENTS_BY_DATE,
  EVENT_CATEGORY_CONFIG,
  SEVERITY_CONFIG,
  EVENT_SUMMARY,
  type KeyHarmEvent,
  type EventCategory,
} from "@/data/regulator/key-events";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Users,
  Building2,
  Globe,
  Grid3X3,
  Shield,
};

function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("en-NZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EventDetailPanel({
  event,
  onClose,
}: {
  event: KeyHarmEvent;
  onClose: () => void;
}) {
  const catConfig = EVENT_CATEGORY_CONFIG[event.category];
  const sevConfig = SEVERITY_CONFIG[event.severity];
  const Icon = iconMap[catConfig.icon] || Zap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border-2 bg-card/95 p-4 shadow-xl backdrop-blur-sm"
      style={{ borderColor: catConfig.color }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: catConfig.bgColor, color: catConfig.color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold">{event.label}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(event.timestamp)} at {formatTime(event.timestamp)}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted/20 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{event.description}</p>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <div className="rounded-lg bg-muted/20 p-2 text-center">
          <p className="text-lg font-bold" style={{ color: catConfig.color }}>
            {event.rhiAtTime}
          </p>
          <p className="text-[10px] text-muted-foreground">RHI at Event</p>
        </div>
        <div className="rounded-lg bg-muted/20 p-2 text-center">
          <div className="flex items-center justify-center gap-1">
            {event.rhiChange > 0 ? (
              <TrendingUp className="h-3 w-3 text-[#ef4444]" />
            ) : (
              <TrendingDown className="h-3 w-3 text-[#53f6c5]" />
            )}
            <p
              className="text-lg font-bold"
              style={{ color: event.rhiChange > 0 ? "#ef4444" : "#53f6c5" }}
            >
              {event.rhiChange > 0 ? "+" : ""}
              {event.rhiChange}
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground">RHI Change</p>
        </div>
        <div className="rounded-lg bg-muted/20 p-2 text-center">
          <p className="text-lg font-bold">{event.affectedTraders || "—"}</p>
          <p className="text-[10px] text-muted-foreground">Traders Affected</p>
        </div>
        <div className="rounded-lg bg-muted/20 p-2 text-center">
          <p className="text-lg font-bold" style={{ color: sevConfig.color }}>
            {sevConfig.label}
          </p>
          <p className="text-[10px] text-muted-foreground">Severity</p>
        </div>
      </div>

      {event.relatedAssets && event.relatedAssets.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-muted-foreground">Related Assets</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {event.relatedAssets.map((asset) => (
              <span
                key={asset}
                className="rounded-full bg-[#53f6c5]/10 px-2 py-0.5 text-xs text-[#53f6c5]"
              >
                {asset}
              </span>
            ))}
          </div>
        </div>
      )}

      {event.linkedModule && (
        <Link
          href={event.linkedModule}
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary/10 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
        >
          <ExternalLink className="h-4 w-4" />
          View Related Analysis
        </Link>
      )}
    </motion.div>
  );
}

function TimelineEvent({
  event,
  isSelected,
  onSelect,
}: {
  event: KeyHarmEvent;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const catConfig = EVENT_CATEGORY_CONFIG[event.category];
  const sevConfig = SEVERITY_CONFIG[event.severity];
  const Icon = iconMap[catConfig.icon] || Zap;

  return (
    <div className="relative">
      {/* Connector line */}
      <div className="absolute left-5 top-10 h-full w-0.5 bg-border/40" />

      <motion.div
        className={`relative flex cursor-pointer gap-4 rounded-xl p-3 transition-colors ${
          isSelected ? "bg-muted/30" : "hover:bg-muted/20"
        }`}
        onClick={onSelect}
        whileHover={{ x: 4 }}
      >
        {/* Event marker */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2"
            style={{
              backgroundColor: catConfig.bgColor,
              borderColor: catConfig.color,
              color: catConfig.color,
            }}
          >
            <Icon className="h-5 w-5" />
          </div>
          {/* Severity indicator */}
          <div
            className="mt-1 h-2 w-2 rounded-full"
            style={{ backgroundColor: sevConfig.color }}
          />
        </div>

        {/* Event content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium leading-tight">{event.label}</h4>
              <p className="text-xs text-muted-foreground">
                {formatDate(event.timestamp)}
              </p>
            </div>
            <div className="flex items-center gap-2 text-right">
              <div>
                <p className="text-sm font-bold" style={{ color: catConfig.color }}>
                  {event.rhiAtTime}
                </p>
                <p className="text-[10px] text-muted-foreground">RHI</p>
              </div>
              <div
                className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                  event.rhiChange > 0
                    ? "bg-[#ef4444]/10 text-[#ef4444]"
                    : "bg-[#53f6c5]/10 text-[#53f6c5]"
                }`}
              >
                {event.rhiChange > 0 ? "+" : ""}
                {event.rhiChange}
              </div>
            </div>
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {event.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px]"
              style={{ backgroundColor: catConfig.bgColor, color: catConfig.color }}
            >
              {catConfig.label}
            </span>
            {event.affectedTraders && (
              <span className="text-[10px] text-muted-foreground">
                {event.affectedTraders.toLocaleString()} traders
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Detail panel */}
      <AnimatePresence>
        {isSelected && (
          <EventDetailPanel event={event} onClose={onSelect} />
        )}
      </AnimatePresence>
    </div>
  );
}

export function KeyEventsTimeline({ compact = false }: { compact?: boolean }) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const filteredEvents = useMemo(() => {
    return EVENTS_BY_DATE.filter((event) => {
      if (categoryFilter !== "all" && event.category !== categoryFilter) return false;
      if (severityFilter !== "all" && event.severity !== severityFilter) return false;
      return true;
    });
  }, [categoryFilter, severityFilter]);

  const displayEvents = compact ? filteredEvents.slice(0, 5) : filteredEvents;

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">
              Key Harm Events Timeline
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  Chronological sequence of significant harm events detected in
                  NZ retail trading. Click on events for detailed analysis.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#ef4444]/10 px-2 py-1 text-xs font-medium text-[#ef4444]">
              {EVENT_SUMMARY.criticalEvents} Critical
            </span>
            <span className="rounded-full bg-[#f97316]/10 px-2 py-1 text-xs font-medium text-[#f97316]">
              {EVENT_SUMMARY.highEvents} High
            </span>
          </div>
        </div>

        {/* Filters */}
        {!compact && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Filter className="h-3 w-3" />
              Filter:
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as EventCategory | "all")}
              className="rounded-lg border border-border/40 bg-muted/20 px-2 py-1 text-xs"
            >
              <option value="all">All Categories</option>
              {Object.entries(EVENT_CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="rounded-lg border border-border/40 bg-muted/20 px-2 py-1 text-xs"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <span className="ml-auto text-xs text-muted-foreground">
              Showing {filteredEvents.length} of {EVENTS_BY_DATE.length} events
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* Summary Stats */}
        <div className="mb-4 grid grid-cols-4 gap-3">
          <div className="rounded-xl bg-muted/10 p-3 text-center">
            <p className="text-2xl font-bold">{EVENT_SUMMARY.totalEvents}</p>
            <p className="text-[10px] text-muted-foreground">Total Events</p>
          </div>
          <div className="rounded-xl bg-muted/10 p-3 text-center">
            <p className="text-2xl font-bold text-[#ef4444]">{EVENT_SUMMARY.maxRHI}</p>
            <p className="text-[10px] text-muted-foreground">Peak RHI</p>
          </div>
          <div className="rounded-xl bg-muted/10 p-3 text-center">
            <p className="text-2xl font-bold">{EVENT_SUMMARY.avgRHIAtEvent}</p>
            <p className="text-[10px] text-muted-foreground">Avg RHI at Event</p>
          </div>
          <div className="rounded-xl bg-muted/10 p-3 text-center">
            <p className="text-2xl font-bold">{EVENT_SUMMARY.totalAffectedTraders.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Traders Affected</p>
          </div>
        </div>

        {/* Category breakdown */}
        {!compact && (
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.entries(EVENT_CATEGORY_CONFIG).map(([key, config]) => {
              const count = EVENT_SUMMARY.eventsByCategory[key] || 0;
              return (
                <button
                  key={key}
                  onClick={() => setCategoryFilter(categoryFilter === key ? "all" : key as EventCategory)}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs transition-all ${
                    categoryFilter === key
                      ? "ring-2 ring-offset-2 ring-offset-background"
                      : ""
                  }`}
                  style={{
                    backgroundColor: config.bgColor,
                    color: config.color,
                    ...(categoryFilter === key ? { ringColor: config.color } : {}),
                  }}
                >
                  <span className="font-medium">{count}</span>
                  <span>{config.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-1">
          {displayEvents.map((event) => (
            <TimelineEvent
              key={event.id}
              event={event}
              isSelected={selectedEventId === event.id}
              onSelect={() =>
                setSelectedEventId(selectedEventId === event.id ? null : event.id)
              }
            />
          ))}
        </div>

        {compact && filteredEvents.length > 5 && (
          <Link
            href="/regulator/events"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-muted/20 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
          >
            View All {filteredEvents.length} Events
            <ExternalLink className="h-4 w-4" />
          </Link>
        )}

        {/* Data notice */}
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
          <span className="font-medium text-primary">Note: </span>
          All events are synthetic demonstrations. Timestamps, RHI values, and 
          affected trader counts are illustrative and do not represent actual data.
        </div>
      </CardContent>
    </Card>
  );
}
