import { motion } from 'framer-motion';
import { Badge } from '@/components/Badge';

interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  highlight?: string;
}

export function LeadMetrics({
  total,
  averageConfidence,
  hiringCount,
  topIndustry,
}: {
  total: number;
  averageConfidence: number;
  hiringCount: number;
  topIndustry: string;
}) {
  const cards: MetricCardProps[] = [
    {
      label: 'Qualified Leads',
      value: total.toString(),
      trend: total > 6 ? 'Up 12% WoW' : 'Stable',
      highlight: 'Across all applied filters',
    },
    {
      label: 'Avg Confidence Score',
      value: `${averageConfidence}%`,
      trend: averageConfidence > 85 ? 'Premium fit' : 'Needs refinement',
      highlight: 'Based on intent, stack & signals',
    },
    {
      label: 'Hiring Motions',
      value: hiringCount.toString(),
      trend: hiringCount > 0 ? 'Timing advantage' : 'Cycle neutral',
      highlight: 'Roles expanding on LinkedIn',
    },
    {
      label: 'Dominant Industry',
      value: topIndustry || 'Mixed',
      trend: 'Signal concentration',
      highlight: 'Optimize cohorts around this pattern',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </div>
  );
}

function MetricCard({ label, value, trend, highlight }: MetricCardProps) {
  return (
    <motion.div
      layout
      className="rounded-3xl border border-slate-700/40 bg-slate-900/60 p-5 shadow-glow/20"
    >
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      {trend && (
        <Badge color="accent" key={trend}>
          {trend}
        </Badge>
      )}
      {highlight && <p className="mt-3 text-xs text-slate-400">{highlight}</p>}
    </motion.div>
  );
}
