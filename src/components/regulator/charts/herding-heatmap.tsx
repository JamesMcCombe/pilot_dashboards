"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { herdingHeatmapData } from "@/data/regulator/influence-clusters";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hourLabels = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);

function getIntensityColor(intensity: number): string {
  if (intensity < 20) return "rgba(83, 246, 197, 0.1)";
  if (intensity < 40) return "rgba(83, 246, 197, 0.25)";
  if (intensity < 60) return "rgba(83, 246, 197, 0.45)";
  if (intensity < 80) return "rgba(248, 113, 113, 0.5)";
  return "rgba(248, 113, 113, 0.8)";
}

export function HerdingHeatmap() {
  const heatmapMatrix = useMemo(() => {
    const matrix: (typeof herdingHeatmapData[0] | null)[][] = Array(7)
      .fill(null)
      .map(() => Array(24).fill(null));

    herdingHeatmapData.forEach((cell) => {
      matrix[cell.dayOfWeek][cell.hour] = cell;
    });

    return matrix;
  }, []);



  return (
    <Card className="rounded-3xl border-2 border-border/60 bg-card/85">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Herding Intensity Heatmap
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Coordinated entry patterns by hour and day of week (UTC)
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Hour labels */}
            <div className="flex">
              <div className="w-12" />
              {hourLabels.map((hour) => (
                <div
                  key={hour}
                  className="flex-1 text-center text-[10px] text-muted-foreground"
                >
                  {parseInt(hour) % 3 === 0 ? hour : ""}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="mt-1 space-y-0.5">
              {dayLabels.map((day, dayIndex) => (
                <div key={day} className="flex items-center gap-0.5">
                  <div className="w-12 text-xs text-muted-foreground">{day}</div>
                  {heatmapMatrix[dayIndex].map((cell, hourIndex) => (
                    <div
                      key={`${dayIndex}-${hourIndex}`}
                      className="group relative flex-1"
                    >
                      <div
                        className="h-6 w-full cursor-pointer rounded-sm transition-transform hover:scale-110"
                        style={{
                          backgroundColor: cell
                            ? getIntensityColor(cell.intensity)
                            : "rgba(124, 141, 173, 0.1)",
                        }}
                      />
                      {cell && cell.intensity > 0 && (
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-popover px-3 py-2 text-xs shadow-lg group-hover:block">
                          <p className="font-medium">
                            {day} {hourIndex}:00 UTC
                          </p>
                          <p className="text-muted-foreground">
                            Intensity: {cell.intensity}%
                          </p>
                          <p className="text-muted-foreground">
                            ~{cell.traderCount} traders
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  <div
                    className="h-4 w-6 rounded-sm"
                    style={{ backgroundColor: "rgba(83, 246, 197, 0.1)" }}
                  />
                  <div
                    className="h-4 w-6 rounded-sm"
                    style={{ backgroundColor: "rgba(83, 246, 197, 0.25)" }}
                  />
                  <div
                    className="h-4 w-6 rounded-sm"
                    style={{ backgroundColor: "rgba(83, 246, 197, 0.45)" }}
                  />
                  <div
                    className="h-4 w-6 rounded-sm"
                    style={{ backgroundColor: "rgba(248, 113, 113, 0.5)" }}
                  />
                  <div
                    className="h-4 w-6 rounded-sm"
                    style={{ backgroundColor: "rgba(248, 113, 113, 0.8)" }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  Low → High Herding Intensity
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            Peak herding detected during London/NY overlap (13:00-17:00 UTC) on
            weekdays. Weekend activity is minimal as expected.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
