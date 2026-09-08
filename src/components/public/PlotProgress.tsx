import { getPlotStats } from "@/lib/utils";

interface PlotProgressProps {
  totalPlots?: number | null;
  soldPlots?: number | null;
  compact?: boolean;
}

export function PlotProgress({
  totalPlots,
  soldPlots,
  compact = false,
}: PlotProgressProps) {
  const stats = getPlotStats(totalPlots, soldPlots);
  if (!stats) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-semibold text-primary-700">
          {stats.percent}% Completed
        </span>
        <span className="text-gray-400">
          {stats.remaining} Remaining
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{
          height: compact ? 6 : 8,
          background: "rgba(29,79,56,0.08)",
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${stats.percent}%`,
            background: "linear-gradient(90deg, var(--color-primary), #c6912b)",
          }}
        />
      </div>
      <p className="text-[11px] text-gray-400 mt-1.5">
        {stats.sold} of {stats.total} plots sold
      </p>
    </div>
  );
}