import type { LossClusterCell } from "./types";

// Loss clustering heatmap data
// Rows = anonymized traders, Columns = time slots
// Shows coordinated high-loss zones

// Generate time slots for past 14 days in 4-hour blocks
const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  const baseDate = new Date("2024-11-01T00:00:00Z");
  
  for (let day = 0; day < 14; day++) {
    for (let block = 0; block < 6; block++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + day);
      date.setHours(block * 4);
      slots.push(date.toISOString().split("T")[0] + `-${String(block * 4).padStart(2, "0")}:00`);
    }
  }
  return slots;
};

export const timeSlots = generateTimeSlots();

// Generate trader IDs
const traderIds = Array.from({ length: 50 }, (_, i) => `NZ-T${String(i + 1).padStart(3, "0")}`);

// Generate loss clustering data with some coordinated patterns
export const lossClusteringData: LossClusterCell[] = [];

// Define coordinated loss events (specific time slots where multiple traders lost together)
const coordinatedEvents = [
  { slot: "2024-11-05-12:00", traders: [0, 3, 7, 12, 18, 24, 31, 38, 42], avgLoss: 2800 },
  { slot: "2024-11-07-16:00", traders: [2, 5, 9, 15, 22, 28, 35, 41, 47], avgLoss: 3200 },
  { slot: "2024-11-08-08:00", traders: [1, 4, 8, 14, 19, 26, 33, 39, 45], avgLoss: 2400 },
  { slot: "2024-11-12-12:00", traders: [0, 6, 11, 17, 23, 29, 36, 43, 48], avgLoss: 3600 },
];

// Build the data matrix
traderIds.forEach((traderId, traderIndex) => {
  timeSlots.forEach((slot) => {
    // Check if this is a coordinated event
    const coordEvent = coordinatedEvents.find(
      (e) => e.slot === slot && e.traders.includes(traderIndex)
    );
    
    if (coordEvent) {
      // Coordinated loss event
      const variance = 0.7 + Math.random() * 0.6;
      lossClusteringData.push({
        traderId,
        timeSlot: slot,
        loss: Math.round(coordEvent.avgLoss * variance),
        isCoordinated: true,
      });
    } else {
      // Random loss/gain with low probability
      const hasLoss = Math.random() < 0.15;
      if (hasLoss) {
        lossClusteringData.push({
          traderId,
          timeSlot: slot,
          loss: Math.round(200 + Math.random() * 1500),
          isCoordinated: false,
        });
      } else {
        lossClusteringData.push({
          traderId,
          timeSlot: slot,
          loss: 0,
          isCoordinated: false,
        });
      }
    }
  });
});

// Statistics
export const COORDINATED_EVENTS_COUNT = coordinatedEvents.length;
export const TRADERS_IN_COORDINATED_LOSSES = new Set(
  coordinatedEvents.flatMap((e) => e.traders.map((t) => traderIds[t]))
).size;
export const TOTAL_COORDINATED_LOSS = lossClusteringData
  .filter((c) => c.isCoordinated)
  .reduce((sum, c) => sum + c.loss, 0);

// Aggregated loss by time slot (for bar chart)
export const lossbyTimeSlot = timeSlots.map((slot) => {
  const cellsInSlot = lossClusteringData.filter((c) => c.timeSlot === slot);
  const totalLoss = cellsInSlot.reduce((sum, c) => sum + c.loss, 0);
  const hasCoordinated = cellsInSlot.some((c) => c.isCoordinated);
  
  return {
    timeSlot: slot,
    totalLoss,
    hasCoordinated,
    traderCount: cellsInSlot.filter((c) => c.loss > 0).length,
  };
});

export { traderIds };
