"use client";

import { Fragment, isValidElement, type ReactElement, type ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHelp } from "./help-context";

type HelpTooltipProps = {
  children: ReactNode;
  text: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  asChild?: boolean;
  indicator?: boolean;
};

export function HelpTooltip({
  children,
  text,
  side = "top",
  align = "center",
  asChild = false,
  indicator = true,
}: HelpTooltipProps) {
  const { helpEnabled } = useHelp();

  if (!helpEnabled) {
    return <>{children}</>;
  }

  const showIndicator = indicator && !asChild;

  const renderChild = () => {
    if (asChild) {
      if (isValidElement(children)) {
        return children as ReactElement;
      }
      return <span>{children}</span>;
    }

    return (
      <div
        className="group relative cursor-help outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
        tabIndex={0}
      >
        {children}
        {showIndicator ? (
          <span className="pointer-events-none absolute -right-1 -top-1 hidden rounded-full border border-primary/40 bg-primary/15 px-1.5 py-0 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-primary/80 shadow-sm group-hover:flex group-focus-visible:flex">
            ?
          </span>
        ) : null}
      </div>
    );
  };

  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>
        {renderChild()}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        className="max-w-xs text-left text-[0.72rem] leading-relaxed"
      >
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
