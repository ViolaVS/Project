import { HEATMAP_THRESHOLDS } from "../constants";

// Tailwind background/text classes for a heatmap cell, by completion ratio (0..1).
export function heatClass(ratio: number): string {
  if (ratio === 0) return "bg-slate-100 text-slate-400";
  if (ratio < HEATMAP_THRESHOLDS.Low) return "bg-emerald-200 text-emerald-900";
  if (ratio < HEATMAP_THRESHOLDS.Medium) return "bg-emerald-400 text-white";
  if (ratio < HEATMAP_THRESHOLDS.Full) return "bg-emerald-500 text-white";
  return "bg-emerald-600 text-white";
}
