import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/Badge';
import type { LeadRecord } from '@/types';

interface LeadTableProps {
  leads: LeadRecord[];
  onSelect: (lead: LeadRecord) => void;
  selectedLeadId?: string;
}

const transition = { type: 'spring', damping: 20, stiffness: 200 };

export function LeadTable({ leads, onSelect, selectedLeadId }: LeadTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-700/40 bg-slate-900/40">
      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
            <tr className="text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-4">Lead</th>
              <th className="px-5 py-4">Signals</th>
              <th className="px-5 py-4">Stack</th>
              <th className="px-5 py-4 text-right">Confidence</th>
              <th className="px-5 py-4 text-right">Employees</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <motion.tr
                key={lead.id}
                layout
                transition={transition}
                onClick={() => onSelect(lead)}
                className="group cursor-pointer border-t border-slate-700/20 bg-slate-950/40 last:border-b hover:bg-slate-800/40"
              >
                <td className="px-5 py-4 text-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{lead.name}</span>
                      {selectedLeadId === lead.id && <Badge color="accent">Focused</Badge>}
                    </div>
                    <div className="text-xs text-slate-400">
                      {lead.title} • {lead.company}
                    </div>
                    <Link
                      href={lead.linkedinUrl}
                      target="_blank"
                      className="text-xs text-accent underline decoration-dotted underline-offset-4"
                      onClick={(event) => event.stopPropagation()}
                    >
                      View LinkedIn
                    </Link>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {lead.signals.map((signal) => (
                      <Badge key={signal} color={signal === 'Funding' ? 'accent' : 'default'}>
                        {signal}
                      </Badge>
                    ))}
                    {lead.hiring && <Badge color="success">Hiring</Badge>}
                  </div>
                </td>
                <td className="px-5 py-4 text-xs text-slate-300">
                  {lead.technologies.slice(0, 3).join(', ')}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="font-semibold text-white">{lead.confidenceScore}%</div>
                  <div className="text-xs text-slate-400">{lead.emailStatus}</div>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="font-semibold text-white">{lead.employees.toLocaleString()}</div>
                  {lead.fundingRound && (
                    <div className="text-xs text-slate-400">{lead.fundingRound}</div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {leads.length === 0 && (
        <div className="px-6 py-12 text-center text-sm text-slate-400">
          No leads match the current filters. Try broadening your criteria.
        </div>
      )}
    </div>
  );
}
