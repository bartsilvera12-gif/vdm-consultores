import { createLucideIcon } from "lucide-react";

/** Escalera ascendente con flecha, en el mismo trazo que los íconos de Lucide. */
export const StairsIcon = createLucideIcon("stairs-up", [
  ["path", { d: "M3 21h4v-4h4v-4h4V9h4V5h2", key: "steps" }],
  ["path", { d: "M3 12 9 6", key: "arrow-line" }],
  ["path", { d: "M5 6h4v4", key: "arrow-head" }],
]);
