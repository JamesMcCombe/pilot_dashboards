"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

const baseAvatarStyles =
  "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/40 bg-sidebar/70 text-foreground";

const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(baseAvatarStyles, className)} {...props} />
  ),
);
Avatar.displayName = "Avatar";

interface AvatarImageProps {
  src: string;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

const AvatarImage = ({ src, alt = "", className, sizes = "48px", priority }: AvatarImageProps) => (
  <span className={cn("absolute inset-0", className)}>
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
  </span>
);

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center bg-primary/15 text-xs font-semibold uppercase tracking-wide text-primary",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
