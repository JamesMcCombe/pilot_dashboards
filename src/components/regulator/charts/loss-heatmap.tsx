"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  lossClusteringData,
  timeSlots,
  traderIds,
  COORDINATED_EVENTS_COUNT,
  TRADERS_IN_COORDINATED_LOSSES,
  TOTAL_COORDINATED_LOSS,
} from "@/data/regulator/loss-clustering";

function getLossColor(loss: number, isCoordinated: boolean): string {
  if (loss === 0) return "rgba(124, 141, 173, 0.05)";
  
  if (isCoordinated) {
    if (loss < 2000) return "rgba(248, 113, 113, 0.5)";
    if (loss < 3000) return "rgba(248, 113, 113, 0.7)";
    return "rgba(248, 113, 113, 0.9)";
  }
  
  if (loss < 500) return "rgba(249, 115, 22, 0.2)";
  if (loss < 1000) return "rgba(249, 115, 22, 0.35)";
  if (loss < 1500) return "rgba(249, 115, 22, 0.5)";
  return "rgba(249, 115, 22, 0.65)";
}

export function LossHeatmap() {
  const [hoveredCell, setHoveredCell] = useState<{
    traderId: string;
    timeSlot: string;
    loss: number;
    isCoordinated: boolean;
  } | null>(null);

  // Build a map for quick lookup
  const cellMap = useMemo(() => {
    const map = new Map<string, (typeof lossClusteringData)[0]>();
    lossClusteringData.forEach((cell) => {
      map.set(`${cell.traderId}-${cell.timeSlot}`, cell);
    });
    return map;
  }, []);

  // Simplified time slots for display (show every 6th)
  const displayTimeSlots = useMemo(
    () => timeSlots.filter((_, i) => i % 6 === 0),
    []
  );

  // Simplified trader list (show first 25)
  const displayTraders = useMemo(() => traderIds.slice(0, 25), []);

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Loss Clustering Heatmap
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {COORDINATED_EVENTS_COUNT} coordinated loss events · {TRADERS_IN_COORDINATED_LOSSES} traders
          affected · {currencyFormatter.format(TOTAL_COORDINATED_LOSS)} total coordinated losses
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Time slot labels */}
            <div className="flex pl-16">
              {displayTimeSlots.map((slot) => (
                <div
                  key={slot}
                  className="flex-1 text-center text-[9px] text-muted-foreground"
                  style={{ minWidth: "40px" }}
                >
                  {slot.split("-").slice(1, 2).join("")}
                </div>
              ))}
            </div>

            {/* Heatmap rows */}
            <div className="mt-1 space-y-px">
              {displayTraders.map((traderId) => (
                <div key={traderId} className="flex items-center">
                  <div className="w-16 truncate text-[10px] text-muted-foreground">
                    {traderId}
                  </div>
                  <div className="flex flex-1 gap-px">
                    {timeSlots.map((slot) => {
                      const cell = cellMap.get(`${traderId}-${slot}`);
                      const loss = cell?.loss ?? 0;
                      const isCoordinated = cell?.isCoordinated ?? false;

                      return (
                        <div
                          key={`${traderId}-${slot}`}
                          className="relative h-4 flex-1 cursor-pointer rounded-[2px] transition-transform hover:z-10 hover:scale-150"
                          style={{
                            backgroundColor: getLossColor(loss, isCoordinated),
                            minWidth: "4px",
                          }}
                          onMouseEnter={() =>
                            loss > 0 &&
                            setHoveredCell({ traderId, timeSlot: slot, loss, isCoordinated })
                          }
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          {isCoordinated && (
                            <div className="absolute inset-0 rounded-[2px] ring-1 ring-[#f87171]" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Tooltip */}
            {hoveredCell && (
              <div className="fixed right-8 top-1/2 z-50 -translate-y-1/2 rounded-lg border border-border bg-popover p-3 text-xs shadow-xl">
                <p className="font-medium">{hoveredCell.traderId}</p>
                <p className="text-muted-foreground">{hoveredCell.timeSlot}</p>
                <p className="mt-1 text-[#f87171] font-semibold">
                  Loss: {currencyFormatter.format(hoveredCell.loss)}
                </p>
                {hoveredCell.isCoordinated && (
                  <p className="mt-1 text-[#f87171]">⚠ Coordinated Event</p>
                )}
              </div>
            )}

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  <div
                    className="h-4 w-5 rounded-sm"
                    style={{ backgroundColor: "rgba(249, 115, 22, 0.2)" }}
                  />
                  <div
                    className="h-4 w-5 rounded-sm"
                    style={{ backgroundColor: "rgba(249, 115, 22, 0.35)" }}
                  />
                  <div
                    className="h-4 w-5 rounded-sm"
                    style={{ backgroundColor: "rgba(249, 115, 22, 0.65)" }}
                  />
                </div>
                <span className="text-muted-foreground">Individual Losses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  <div
                    className="h-4 w-5 rounded-sm ring-1 ring-[#f87171]"
                    style={{ backgroundColor: "rgba(248, 113, 113, 0.5)" }}
                  />
                  <div
                    className="h-4 w-5 rounded-sm ring-1 ring-[#f87171]"
                    style={{ backgroundColor: "rgba(248, 113, 113, 0.9)" }}
                  />
                </div>
                <span className="text-muted-foreground">Coordinated Losses</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-[#f87171]/30 bg-[#f87171]/10 p-3 text-sm">
          <p className="font-medium text-[#f87171]">Pattern Detected</p>
          <p className="mt-1 text-muted-foreground">
            Highlighted zones show multiple traders experiencing significant losses
            within the same time window, suggesting coordinated exposure to market events
            or shared influence sources.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
