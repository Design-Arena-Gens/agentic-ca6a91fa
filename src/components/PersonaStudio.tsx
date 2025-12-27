import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/Badge';
import type { LeadRecord, PersonaProfile } from '@/types';

interface PersonaStudioProps {
  lead: LeadRecord | null;
  onCompose: (payload: { leadId: string; persona: PersonaProfile; offer: string }) => Promise<string>;
}

const toneOptions: PersonaProfile['tone'][] = ['Consultative', 'Challenger', 'Casual', 'Visionary'];

export function PersonaStudio({ lead, onCompose }: PersonaStudioProps) {
  const [persona, setPersona] = useState<PersonaProfile | null>(null);
  const [offer, setOffer] = useState(
    'AI-guided revenue playbook that maps LinkedIn signals to outbound sequencing.',
  );
  const [isComposing, setIsComposing] = useState(false);
  const [message, setMessage] = useState('');

  const generatedPersona = useMemo(() => {
    if (!lead) return null;
    return {
      id: `persona-${lead.id}`,
      name: `${lead.title.split(' ').slice(-2).join(' ') || lead.title}`,
      painPoints: [
        'Hard to prioritize high-intent accounts with only firmographics',
        'Manual personalization cannot keep up with pipeline targets',
        'Need faster coaching loops for outbound reps',
      ],
      valueDrivers: [
        'Actionable scoring layer using live LinkedIn intent signals',
        'Dynamic outreach snippets tailored to roles and signals',
        'Workflow insights that de-risk expansion plays',
      ],
      tone: lead.seniority === 'C-Level' ? 'Visionary' : 'Consultative',
      callToAction: '30 minute working session',
    } satisfies PersonaProfile;
  }, [lead]);

  useEffect(() => {
    if (generatedPersona) {
      setPersona(generatedPersona);
      setMessage('');
    }
  }, [generatedPersona]);

  useEffect(() => {
    setOffer((prev) =>
      lead ? `Agentic workflow to operationalize LinkedIn signals for ${lead.company}` : prev,
    );
  }, [lead]);

  if (!lead || !persona) {
    return (
      <div className="rounded-3xl border border-slate-700/40 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
        Select a lead to design a persona-based outreach play.
      </div>
    );
  }

  const updatePersona = <K extends keyof PersonaProfile>(key: K, value: PersonaProfile[K]) => {
    setPersona((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <motion.div
      key={lead.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
    >
      <div className="space-y-6 rounded-3xl border border-slate-700/40 bg-slate-950/40 p-6">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-slate-400">Persona Blueprint</p>
          <h3 className="text-lg font-semibold text-white">Targeting {lead.name}</h3>
          <p className="text-sm text-slate-400">
            {lead.title} • {lead.company} • {lead.industry}
          </p>
        </header>

        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Persona Name
            </span>
            <input
              value={persona.name}
              onChange={(event) => updatePersona('name', event.target.value)}
              className="w-full rounded-xl border border-slate-700/40 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/40"
            />
          </label>

          <EditableList
            label="Pain Points"
            values={persona.painPoints}
            onChange={(painPoints) => updatePersona('painPoints', painPoints)}
            placeholder="Add pain point"
          />

          <EditableList
            label="Value Drivers"
            values={persona.valueDrivers}
            onChange={(valueDrivers) => updatePersona('valueDrivers', valueDrivers)}
            placeholder="Add value driver"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tone
              </span>
              <div className="flex flex-wrap gap-2">
                {toneOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                      persona.tone === option
                        ? 'bg-accent/20 text-accent'
                        : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800/80'
                    }`}
                    onClick={() => updatePersona('tone', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Call To Action
              </span>
              <input
                value={persona.callToAction}
                onChange={(event) => updatePersona('callToAction', event.target.value)}
                className="w-full rounded-xl border border-slate-700/40 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/40"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Offer / Value Proposition
            </span>
            <textarea
              value={offer}
              onChange={(event) => setOffer(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-700/40 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/40"
            />
          </label>

          <button
            onClick={async () => {
              if (!lead || !persona) return;
              setIsComposing(true);
              const response = await onCompose({ leadId: lead.id, persona, offer });
              setMessage(response);
              setIsComposing(false);
            }}
            className="w-full rounded-2xl bg-gradient-to-r from-accent to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:shadow-glow/60 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isComposing}
          >
            {isComposing ? 'Composing...' : 'Generate Outreach'}
          </button>
        </div>
      </div>

      <motion.div
        layout
        className="space-y-6 rounded-3xl border border-slate-700/40 bg-slate-950/60 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Outreach Preview</p>
            <h3 className="text-lg font-semibold text-white">Persona-aligned message</h3>
          </div>
          <Badge color="accent">{persona.tone} tone</Badge>
        </div>
        <article className="space-y-4 rounded-2xl border border-slate-700/30 bg-slate-900/60 p-5 text-sm text-slate-200 shadow-glow/10">
          <p className="whitespace-pre-line leading-relaxed">{message || defaultNarrative(lead)}</p>
        </article>

        <div className="grid gap-3 sm:grid-cols-2">
          <Insight title="Signals detected" items={lead.signals} />
          <Insight title="Recent activity" items={lead.recentActivity} />
          <Insight title="Tech stack" items={lead.technologies.slice(0, 4)} />
          <Insight
            title="Persona CTA"
            items={[persona.callToAction, `${lead.employees.toLocaleString()} employees`]}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function defaultNarrative(lead: LeadRecord) {
  return `Draft a personalized opener referencing ${lead.company}'s recent ${
    lead.signals.join(', ') || 'activity'
  } and bridge into how you can help ${lead.title.toLowerCase()}s accelerate pipeline generation.`;
}

interface EditableListProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}

function EditableList({ label, values, onChange, placeholder }: EditableListProps) {
  const [draft, setDraft] = useState('');
  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <Badge key={value} color="default">
            <button
              type="button"
              className="flex items-center gap-2"
              onClick={() => onChange(values.filter((item) => item !== value))}
            >
              {value}
              <span className="text-xs text-slate-400">×</span>
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-slate-700/40 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/40"
        />
        <button
          type="button"
          onClick={() => {
            if (!draft.trim()) return;
            onChange([...values, draft.trim()]);
            setDraft('');
          }}
          className="rounded-xl border border-accent/40 bg-accent/20 px-4 py-2 text-xs font-medium text-accent transition hover:bg-accent/30"
        >
          Add
        </button>
      </div>
    </div>
  );
}

interface InsightProps {
  title: string;
  items: string[];
}

function Insight({ title, items }: InsightProps) {
  return (
    <div className="rounded-2xl border border-slate-700/40 bg-slate-900/60 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-400">{title}</p>
      <ul className="mt-2 space-y-1 text-xs text-slate-200">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
