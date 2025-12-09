"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface InsightNoteProps {
  children: React.ReactNode;
}

export function InsightNote({ children }: InsightNoteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3"
    >
      <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary/70" />
      <p className="text-xs leading-relaxed text-muted-foreground">
        {children}
      </p>
    </motion.div>
  );
}
