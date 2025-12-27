import { NextResponse } from 'next/server';
import { getAllLeads, searchLeads } from '@/lib/leads';
import type { LeadFilter } from '@/types';

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (![...searchParams.keys()].length) {
    return NextResponse.json({ leads: getAllLeads() });
  }

  const filter: LeadFilter = { ...defaultFilter };

  if (searchParams.get('query')) {
    filter.query = searchParams.get('query') ?? '';
  }
  if (searchParams.get('industries')) {
    filter.industries = searchParams.get('industries')!.split(',');
  }
  if (searchParams.get('locations')) {
    filter.locations = searchParams.get('locations')!.split(',');
  }
  if (searchParams.get('seniorities')) {
    filter.seniorities = searchParams.get('seniorities')!.split(',') as LeadFilter['seniorities'];
  }
  if (searchParams.get('technologies')) {
    filter.technologies = searchParams.get('technologies')!.split(',');
  }
  if (searchParams.get('signals')) {
    filter.signals = searchParams.get('signals')!.split(',') as LeadFilter['signals'];
  }
  if (searchParams.get('hiring')) {
    filter.hiring = searchParams.get('hiring') === 'true';
  }
  if (searchParams.get('minEmployees')) {
    filter.minEmployees = Number(searchParams.get('minEmployees'));
  }
  if (searchParams.get('maxEmployees')) {
    filter.maxEmployees = Number(searchParams.get('maxEmployees'));
  }
  if (searchParams.get('minConfidence')) {
    filter.minConfidence = Number(searchParams.get('minConfidence'));
  }

  const leads = searchLeads(filter);
  return NextResponse.json({ leads });
}
