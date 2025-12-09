"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EntityAvatarProps {
  name: string;
  src?: string;
  className?: string;
}

export function EntityAvatar({ name, src, className }: EntityAvatarProps) {
  const initials = React.useMemo(
    () =>
      name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [name],
  );

  return (
    <Avatar className={className}>
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
