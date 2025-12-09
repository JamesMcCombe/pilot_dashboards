export interface AuditEvent {
  id: string;
  message: string;
  timestamp: string;
}

export const auditEvents: AuditEvent[] = [
  {
    id: "audit-001",
    message: "Navigator Astra Quant promoted to Featured tier by compliance desk.",
    timestamp: "2025-11-15T09:05:00.000Z",
  },
  {
    id: "audit-002",
    message: "Pilot Mira Odum flagged for abnormal leverage sequence and acknowledged remediation steps.",
    timestamp: "2025-11-15T08:12:00.000Z",
  },
  {
    id: "audit-003",
    message: "Group Zenith Watch triggered consistency anomaly threshold > 12% variance.",
    timestamp: "2025-11-14T21:44:00.000Z",
  },
  {
    id: "audit-004",
    message: "Trade trade-021 reconstructed successfully for regulator replay feed.",
    timestamp: "2025-11-14T18:02:00.000Z",
  },
  {
    id: "audit-005",
    message: "Navigator Helios Macro submitted new strategy disclosure document.",
    timestamp: "2025-11-14T12:37:00.000Z",
  },
];
