import type { LeadRecord } from '@/types';

interface WorkflowTimelineProps {
  focusedLead: LeadRecord | null;
}

const phases = [
  {
    id: 'enrich',
    title: 'Enrich & Prioritize',
    description:
      'Aggregate LinkedIn intent, team expansion, and firmographic signals. Assign a confidence score to rank plays.',
    artifacts: ['Signal heatmap', 'Tech stack overlap'],
  },
  {
    id: 'persona',
    title: 'Persona Crafting',
    description:
      'Define pain/value statements and calibrate messaging tone. Ensure assets map directly to current activity.',
    artifacts: ['Pain/value matrix', 'Tone prompt templates'],
  },
  {
    id: 'activation',
    title: 'Outbound Activation',
    description:
      'Launch multi-channel sequences that mirror the generated narrative. Track responses to refine prompts.',
    artifacts: ['Outreach snippets', 'Sequencer copy blocks'],
  },
  {
    id: 'feedback',
    title: 'Feedback Loop',
    description:
      'Feed call outcomes and reply sentiment back into the agent to strengthen scoring and messaging.',
    artifacts: ['Qual signal tracker', 'Rep annotations'],
  },
];

export function WorkflowTimeline({ focusedLead }: WorkflowTimelineProps) {
  return (
    <div className="relative space-y-6 rounded-3xl border border-slate-700/40 bg-slate-900/50 p-6">
      <div className="absolute left-10 top-14 bottom-10 hidden w-px bg-gradient-to-b from-accent/60 via-slate-700/20 to-transparent md:block" />
      {phases.map((phase, index) => {
        const isActive = !!focusedLead && index === 1;
        return (
          <div key={phase.id} className="relative grid gap-4 md:grid-cols-[auto,1fr]">
            <div className="flex items-start gap-4">
              <div className="hidden md:block">
                <span
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    isActive
                      ? 'border-accent/80 bg-accent/20 text-accent'
                      : 'border-slate-700/60 bg-slate-950 text-slate-400'
                  }`}
                >
                  {index + 1}
                </span>
              </div>
              <div className="md:hidden">
                <span className="rounded-full border border-slate-700/50 px-3 py-1 text-xs text-slate-300">
                  Step {index + 1}
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-700/30 bg-slate-950/70 p-5">
              <header className="flex items-start justify-between gap-4">
                <div>
                  <h5 className="text-base font-semibold text-white">{phase.title}</h5>
                  <p className="mt-1 text-sm text-slate-300">{phase.description}</p>
                </div>
                {isActive && (
                  <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
                    Focused on {focusedLead?.company}
                  </span>
                )}
              </header>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                {phase.artifacts.map((artifact) => (
                  <span
                    key={artifact}
                    className="rounded-full border border-slate-700/40 bg-slate-900/70 px-3 py-1"
                  >
                    {artifact}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
