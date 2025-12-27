import { Badge } from '@/components/Badge';
import type { LeadRecord } from '@/types';

interface GrowthPlaybookProps {
  focusedLead: LeadRecord | null;
  leads: LeadRecord[];
}

const playbooks = [
  {
    id: 'intent-swarm',
    name: 'Intent Signal Swarm',
    description:
      'Sequence warm outreach to leads showing funding or hiring signals. Pair enriched insights with timely plays.',
    steps: [
      'Group leads by funding/hiring signals into a micro-cadence.',
      'Launch 3-touch sequence using persona tone variations.',
      'Track responses in CRM and feed learnings back to prompt library.',
    ],
    assets: ['Figma outreach templates', 'Notion agentic workflows'],
  },
  {
    id: 'stack-takeover',
    name: 'Stack Takeover Play',
    description:
      'Target accounts using adjacent tooling where your product can augment RevOps automation gaps.',
    steps: [
      'Filter leads by overlapping technologies (e.g., Salesforce + Gong).',
      'Draft comparison snippets highlighting integration unlocks.',
      'Run LinkedIn voice note + email pairing for top 10 accounts.',
    ],
    assets: ['Competitive intel tracker', 'Integration ROI calculator'],
  },
  {
    id: 'momentum-loop',
    name: 'Momentum Loop',
    description:
      'Chief revenue & marketing leaders exploring AI GTM flows. Deliver strategic value narrative before scheduling.',
    steps: [
      'Surface C-level leads with content engagement signals.',
      'Send thought leadership asset personalized around their activity.',
      'Follow up with outcomes from a similar industry partner.',
    ],
    assets: ['AI GTM manifesto deck', 'Outcome micro-case library'],
  },
];

export function GrowthPlaybook({ focusedLead, leads }: GrowthPlaybookProps) {
  return (
    <div className="space-y-5">
      {playbooks.map((play) => {
        const relevant = focusedLead
          ? leads.filter((lead) => lead.signals.some((signal) => signal !== 'Job Change')).length
          : leads.length;
        return (
          <article
            key={play.id}
            className="rounded-3xl border border-slate-700/40 bg-slate-900/50 p-6 transition hover:border-accent/40 hover:shadow-glow"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold text-white">{play.name}</h4>
                <p className="mt-1 text-sm text-slate-300">{play.description}</p>
              </div>
              <Badge color="accent">{relevant} leads match</Badge>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              {play.steps.map((step) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
              {play.assets.map((asset) => (
                <Badge key={asset}>{asset}</Badge>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
