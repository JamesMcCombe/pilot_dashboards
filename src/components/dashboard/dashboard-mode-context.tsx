"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type DashboardMode = "withPilot" | "withoutPilot";

type DashboardModeContextValue = {
  mode: DashboardMode;
  setMode: (mode: DashboardMode) => void;
  toggleMode: () => void;
};

const DashboardModeContext = createContext<DashboardModeContextValue | null>(
  null,
);

export function DashboardModeProvider({
  children,
  initialMode = "withPilot",
}: {
  children: ReactNode;
  initialMode?: DashboardMode;
}) {
  const [mode, setMode] = useState<DashboardMode>(initialMode);

  const toggleMode = useCallback(() => {
    setMode((current) =>
      current === "withPilot" ? "withoutPilot" : "withPilot",
    );
  }, []);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
    }),
    [mode, toggleMode],
  );

  return (
    <DashboardModeContext.Provider value={value}>
      {children}
    </DashboardModeContext.Provider>
  );
}

export function useDashboardMode() {
  const context = useContext(DashboardModeContext);

  if (!context) {
    throw new Error("useDashboardMode must be used within DashboardModeProvider");
  }

  return context;
}
