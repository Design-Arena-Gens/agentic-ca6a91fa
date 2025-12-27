import { NextResponse } from 'next/server';
import { craftPersonalizedMessage, generatePersonaFromLead, getAllLeads } from '@/lib/leads';

export async function POST(request: Request) {
  const body = await request.json();
  const { leadId, persona, offer } = body as {
    leadId: string;
    persona?: {
      name: string;
      painPoints: string[];
      valueDrivers: string[];
      tone: 'Consultative' | 'Challenger' | 'Casual' | 'Visionary';
      callToAction: string;
    };
    offer: string;
  };

  const lead = getAllLeads().find((item) => item.id === leadId);
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  const basePersona = persona
    ? {
        id: `persona-${leadId}`,
        ...persona,
      }
    : generatePersonaFromLead(lead);

  const message = craftPersonalizedMessage(lead, basePersona, offer);

  return NextResponse.json({
    lead,
    persona: basePersona,
    message,
  });
}
