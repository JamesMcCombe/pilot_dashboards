"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { KPIHeader } from "@/components/dashboard/kpi-header";
import { VolumeSimulator } from "@/components/dashboard/volume-simulator";
import { TopNavigators } from "@/components/dashboard/top-navigators";
import { Watchlists } from "@/components/dashboard/watchlists";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function DashboardPage() {
  return (
    <motion.div
      className="flex flex-col gap-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <KPIHeader />
      </motion.div>
      <motion.div variants={itemVariants}>
        <VolumeSimulator />
      </motion.div>
      <motion.section
        variants={itemVariants}
        className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
      >
        <TopNavigators />
        <Watchlists />
      </motion.section>
    </motion.div>
  );
}
