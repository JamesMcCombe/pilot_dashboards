"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type HelpContextValue = {
  helpEnabled: boolean;
  toggleHelp: () => void;
};

const HelpContext = createContext<HelpContextValue | null>(null);

export function HelpProvider({ children }: { children: ReactNode }) {
  const [helpEnabled, setHelpEnabled] = useState(false);

  const toggleHelp = () => setHelpEnabled((prev) => !prev);

  const value = useMemo(
    () => ({
      helpEnabled,
      toggleHelp,
    }),
    [helpEnabled],
  );

  return <HelpContext.Provider value={value}>{children}</HelpContext.Provider>;
}

export function useHelp() {
  const context = useContext(HelpContext);

  if (!context) {
    throw new Error("useHelp must be used within HelpProvider");
  }

  return context;
}
