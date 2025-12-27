'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LeadMetrics } from '@/components/LeadMetrics';
import { LeadSearchForm } from '@/components/LeadSearchForm';
import { LeadTable } from '@/components/LeadTable';
import { PersonaStudio } from '@/components/PersonaStudio';
import { Section } from '@/components/Section';
import { GrowthPlaybook } from '@/components/GrowthPlaybook';
import { WorkflowTimeline } from '@/components/WorkflowTimeline';
import { useLeads } from '@/hooks/useLeads';
import type { LeadFilter, LeadRecord, PersonaProfile } from '@/types';

const initialFilter: LeadFilter = {
  industries: [],
  locations: [],
  seniorities: [],
  technologies: [],
  hiring: null,
  minEmployees: undefined,
  maxEmployees: undefined,
  minConfidence: 75,
  signals: [],
  query: '',
};

export default function Page() {
  const [filter, setFilter] = useState<LeadFilter>(initialFilter);
  const { leads, isLoading } = useLeads(filter);
  const [focusedLead, setFocusedLead] = useState<LeadRecord | null>(null);

  const metrics = useMemo(() => {
    const total = leads.length;
    const averageConfidence =
      total === 0 ? 0 : Math.round(leads.reduce((sum, lead) => sum + lead.confidenceScore, 0) / total);
    const hiringCount = leads.filter((lead) => lead.hiring).length;
    const industryTally = leads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.industry] = (acc[lead.industry] ?? 0) + 1;
      return acc;
    }, {});
    const topIndustry = Object.entries(industryTally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
    return {
      total,
      averageConfidence,
      hiringCount,
      topIndustry,
    };
  }, [leads]);

  const compose = async ({
    leadId,
    persona,
    offer,
  }: {
    leadId: string;
    persona: PersonaProfile;
    offer: string;
  }) => {
    const response = await fetch('/api/outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, persona, offer }),
    });
    if (!response.ok) {
      throw new Error('Failed to generate outreach message');
    }
    const data = await response.json();
    return data.message as string;
  };

  return (
    <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 pb-20 pt-16 sm:px-10">
      <div className="glass-surface relative overflow-hidden rounded-3xl border border-slate-700/50 p-10 text-white shadow-glow">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-600/30 via-transparent to-slate-900/80" />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              LinkedIn GTM Agent • Live
            </div>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Operate a LinkedIn-native lead generation agent that compresses research to outreach in minutes.
            </h1>
            <p className="text-base text-slate-200">
              Filter intent-rich personas, orchestrate bespoke messaging, and activate revenue plays aligned
              to LinkedIn signals. Calibrate your outbound strategy with one control surface.
            </p>
          </div>
          <div className="flex max-w-sm flex-col gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/70 p-5 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <span>Active deal cycles</span>
              <span className="font-semibold text-white">{metrics.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Cadence health</span>
              <span className="font-semibold text-success">
                {metrics.averageConfidence >= 80 ? 'High' : 'Moderate'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Persona coverage</span>
              <span className="font-semibold text-accent">4 segments</span>
            </div>
          </div>
        </div>
      </div>

      <Section
        title="Lead Signals Dashboard"
        description="Slice LinkedIn-sourced leads by signal strength, intent, and GTM fit."
      >
        <div className="space-y-6">
          <LeadMetrics
            total={metrics.total}
            averageConfidence={metrics.averageConfidence}
            hiringCount={metrics.hiringCount}
            topIndustry={metrics.topIndustry}
          />

          <LeadSearchForm
            leads={leads}
            onFilterChange={(nextFilter) => {
              setFilter(nextFilter);
            }}
          />
        </div>
      </Section>

      <Section
        title="Prioritized LinkedIn Leads"
        description="Click into a lead to personalize outreach and spin up a dedicated persona workflow."
        action={
          <span className="text-xs uppercase tracking-wider text-slate-400">
            {isLoading ? 'Refreshing leads…' : `${leads.length} leads`}
          </span>
        }
      >
        <LeadTable
          leads={leads}
          onSelect={(lead) => setFocusedLead(lead)}
          selectedLeadId={focusedLead?.id}
        />
      </Section>

      <Section
        title="Persona Refinery"
        description="Generate persona-aligned messaging and ready-to-send outreach rooted in live signals."
      >
        <PersonaStudio lead={focusedLead} onCompose={compose} />
      </Section>

      <Section
        title="Agentic GTM Workflow"
        description="Operationalize the research-to-outreach pipeline with programmable phases."
      >
        <WorkflowTimeline focusedLead={focusedLead} />
      </Section>

      <Section
        title="Expansion Playbooks"
        description="Activate curated campaigns tuned to signal density and account context."
      >
        <GrowthPlaybook focusedLead={focusedLead} leads={leads} />
      </Section>

      <AnimatePresence>
        {focusedLead && (
          <motion.div
            className="fixed bottom-6 right-6 w-full max-w-md rounded-3xl border border-accent/40 bg-slate-950/90 p-5 shadow-glow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-accent/80">Focused lead</p>
                <h4 className="text-base font-semibold text-white">{focusedLead.name}</h4>
                <p className="text-xs text-slate-300">
                  {focusedLead.title} • {focusedLead.company}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFocusedLead(null)}
                className="rounded-full bg-slate-900/70 px-3 py-1 text-xs text-slate-400 transition hover:text-white"
              >
                Clear
              </button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-slate-300">
              <div>
                <p className="text-slate-500">Confidence</p>
                <p className="font-semibold text-white">{focusedLead.confidenceScore}%</p>
              </div>
              <div>
                <p className="text-slate-500">Signals</p>
                <p className="font-semibold text-white">{focusedLead.signals.join(', ')}</p>
              </div>
              <div>
                <p className="text-slate-500">Employees</p>
                <p className="font-semibold text-white">
                  {focusedLead.employees.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
