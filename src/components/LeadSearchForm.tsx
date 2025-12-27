import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Badge } from '@/components/Badge';
import type { IntentSignal, LeadFilter, LeadRecord, Seniority } from '@/types';

interface LeadSearchFormProps {
  leads: LeadRecord[];
  onFilterChange: (filter: LeadFilter) => void;
}

const defaultFilter: LeadFilter = {
  industries: [],
  locations: [],
  seniorities: [],
  technologies: [],
  hiring: null,
  minEmployees: undefined,
  maxEmployees: undefined,
  minConfidence: undefined,
  signals: [],
  query: '',
};

export function LeadSearchForm({ leads, onFilterChange }: LeadSearchFormProps) {
  const [localFilter, setLocalFilter] = useState<LeadFilter>(defaultFilter);

  const facets = useMemo(() => {
    const industries = new Set<string>();
    const locations = new Set<string>();
    const seniorities = new Set<Seniority>();
    const technologies = new Set<string>();
    const signals = new Set<IntentSignal>();

    leads.forEach((lead) => {
      industries.add(lead.industry);
      locations.add(lead.location);
      seniorities.add(lead.seniority);
      lead.technologies.forEach((tech) => technologies.add(tech));
      lead.signals.forEach((signal) => signals.add(signal));
    });

    return {
      industries: Array.from(industries).sort(),
      locations: Array.from(locations).sort(),
      seniorities: Array.from(seniorities),
      technologies: Array.from(technologies).sort(),
      signals: Array.from(signals),
    };
  }, [leads]);

  const updateFilter = (update: Partial<LeadFilter>) => {
    setLocalFilter((prev) => {
      const next = { ...prev, ...update };
      onFilterChange(next);
      return next;
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div className="glass-surface p-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Search
        </label>
        <input
          type="search"
          placeholder="Search by name, company, or keyword"
          className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/40"
          value={localFilter.query}
          onChange={(event) => updateFilter({ query: event.target.value })}
        />
      </div>

      <AutocompleteSelect
        label="Industries"
        placeholder="Select industries"
        options={facets.industries}
        selected={localFilter.industries}
        onChange={(industries) => updateFilter({ industries })}
      />

      <AutocompleteSelect
        label="Locations"
        placeholder="Select locations"
        options={facets.locations}
        selected={localFilter.locations}
        onChange={(locations) => updateFilter({ locations })}
      />

      <AutocompleteSelect
        label="Seniority"
        placeholder="Pick seniority levels"
        options={facets.seniorities}
        selected={localFilter.seniorities}
        onChange={(seniorities) => updateFilter({ seniorities })}
      />

      <AutocompleteSelect
        label="Technologies"
        placeholder="Filter by stack"
        options={facets.technologies}
        selected={localFilter.technologies}
        onChange={(technologies) => updateFilter({ technologies })}
      />

      <AutocompleteSelect
        label="Intent Signals"
        placeholder="Add signals"
        options={facets.signals}
        selected={localFilter.signals}
        onChange={(signals) => updateFilter({ signals })}
      />

      <div className="glass-surface p-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Team Size
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            min={0}
            placeholder="Min"
            className="rounded-xl border border-slate-700/50 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/40"
            value={localFilter.minEmployees ?? ''}
            onChange={(event) =>
              updateFilter({
                minEmployees: event.target.value ? Number(event.target.value) : undefined,
              })
            }
          />
          <input
            type="number"
            min={0}
            placeholder="Max"
            className="rounded-xl border border-slate-700/50 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/40"
            value={localFilter.maxEmployees ?? ''}
            onChange={(event) =>
              updateFilter({
                maxEmployees: event.target.value ? Number(event.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <div className="glass-surface p-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Confidence
        </label>
        <input
          type="range"
          min={50}
          max={100}
          step={5}
          value={localFilter.minConfidence ?? 50}
          onChange={(event) =>
            updateFilter({ minConfidence: Number(event.target.value) ?? undefined })
          }
          className="w-full accent-accent"
        />
        <p className="mt-2 text-xs text-slate-400">
          Minimum confidence: {localFilter.minConfidence ?? 50}%
        </p>
      </div>

      <div className="glass-surface p-4">
        <fieldset className="space-y-4">
          <legend className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Hiring Signal
          </legend>
          <div className="flex gap-3">
            <button
              type="button"
              className={clsx(
                'flex-1 rounded-xl border px-4 py-3 text-sm transition',
                localFilter.hiring === true
                  ? 'border-success/60 bg-success/10 text-success'
                  : 'border-slate-700/40 bg-slate-900/60 text-slate-300 hover:border-slate-500/50',
              )}
              onClick={() => updateFilter({ hiring: localFilter.hiring === true ? null : true })}
            >
              Hiring
            </button>
            <button
              type="button"
              className={clsx(
                'flex-1 rounded-xl border px-4 py-3 text-sm transition',
                localFilter.hiring === false
                  ? 'border-warning/60 bg-warning/10 text-warning'
                  : 'border-slate-700/40 bg-slate-900/60 text-slate-300 hover:border-slate-500/50',
              )}
              onClick={() => updateFilter({ hiring: localFilter.hiring === false ? null : false })}
            >
              Not Hiring
            </button>
          </div>
        </fieldset>
      </div>

      <div className="glass-surface p-4 md:col-span-2 xl:col-span-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active filters
          </span>
          {Object.entries(localFilter)
            .flatMap(([key, value]) => {
              if (value === null || value === undefined) {
                return [];
              }
              if (Array.isArray(value) && value.length === 0) {
                return [];
              }
              if (Array.isArray(value)) {
                return value.map((item) => ({
                  key,
                  label: `${key}:${item}`,
                }));
              }
              if (typeof value === 'boolean') {
                return [{ key, label: `${key}:${value ? 'Yes' : 'No'}` }];
              }
              if (typeof value === 'number') {
                return [{ key, label: `${key}:${value}` }];
              }
              if (typeof value === 'string' && value.length > 0) {
                return [{ key, label: `${key}:${value}` }];
              }
              return [];
            })
            .map((filter) => (
              <Badge key={filter.label} color="accent">
                {filter.label}
              </Badge>
            ))}
          <button
            type="button"
            onClick={() => {
              setLocalFilter(defaultFilter);
              onFilterChange(defaultFilter);
            }}
            className="ml-auto text-xs font-medium text-slate-400 underline-offset-4 transition hover:text-white hover:underline"
          >
            Reset filters
          </button>
        </div>
      </div>
    </div>
  );
}

interface AutocompleteSelectProps<TOption extends string> {
  label: string;
  placeholder: string;
  options: TOption[];
  selected: TOption[];
  onChange: (values: TOption[]) => void;
}

function AutocompleteSelect<TOption extends string>({
  label,
  placeholder,
  options,
  selected,
  onChange,
}: AutocompleteSelectProps<TOption>) {
  const [inputValue, setInputValue] = useState('');

  const filtered = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <div className="glass-surface p-4">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <div className="space-y-3">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/40"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {selected.map((value) => (
            <Badge key={value} color="accent">
              <button
                type="button"
                className="flex items-center gap-2"
                onClick={() => onChange(selected.filter((item) => item !== value))}
              >
                {value}
                <span className="text-xs text-slate-300">×</span>
              </button>
            </Badge>
          ))}
          {selected.length === 0 && (
            <span className="text-xs text-slate-500">No selections yet</span>
          )}
        </div>
        <div className="max-h-28 space-y-1 overflow-auto">
          {filtered.map((option) => {
            const isActive = selected.includes(option);
            return (
              <button
                type="button"
                key={option}
                onClick={() =>
                  onChange(isActive ? selected.filter((item) => item !== option) : [...selected, option])
                }
                className={clsx(
                  'w-full rounded-lg px-3 py-2 text-left text-xs transition',
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white',
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
