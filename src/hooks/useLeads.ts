import useSWR from 'swr';
import type { LeadFilter, LeadRecord } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const serializeFilter = (filter: LeadFilter) => {
  const params = new URLSearchParams();
  if (filter.query) params.set('query', filter.query);
  if (filter.industries.length) params.set('industries', filter.industries.join(','));
  if (filter.locations.length) params.set('locations', filter.locations.join(','));
  if (filter.seniorities.length) params.set('seniorities', filter.seniorities.join(','));
  if (filter.technologies.length) params.set('technologies', filter.technologies.join(','));
  if (filter.signals.length) params.set('signals', filter.signals.join(','));
  if (filter.hiring !== null) params.set('hiring', String(filter.hiring));
  if (filter.minEmployees) params.set('minEmployees', String(filter.minEmployees));
  if (filter.maxEmployees) params.set('maxEmployees', String(filter.maxEmployees));
  if (filter.minConfidence) params.set('minConfidence', String(filter.minConfidence));
  return params.toString();
};

export function useLeads(filter: LeadFilter | null) {
  const { data, error, isLoading, mutate } = useSWR<{ leads: LeadRecord[] }>(
    filter ? `/api/leads?${serializeFilter(filter)}` : '/api/leads',
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  return {
    leads: data?.leads ?? [],
    isLoading,
    error,
    mutate,
  };
}
