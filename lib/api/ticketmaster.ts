/**
 * Ticketmaster Discovery API integration
 * Provides public cultural events as a fallback/alternative to Eventbrite
 */

import axios from 'axios';
import { CulturalResource, ResourceCategory, ResourceSource } from '@/lib/types';

const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const TICKETMASTER_API_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

interface TicketmasterEvent {
  id: string;
  name: string;
  url?: string;
  info?: string;
  pleaseNote?: string;
  dates?: {
    start?: {
      localDate?: string;
      localTime?: string;
    };
  };
  classifications?: Array<{
    segment?: { name?: string };
    genre?: { name?: string };
    subGenre?: { name?: string };
  }>;
  _embedded?: {
    venues?: Array<{
      name?: string;
      address?: { line1?: string };
      city?: { name?: string };
      state?: { stateCode?: string };
      country?: { countryCode?: string };
      location?: { latitude?: string; longitude?: string };
    }>;
  };
}

function mapCountryToCode(country: string): string | undefined {
  const normalized = country.trim().toLowerCase();
  const map: Record<string, string> = {
    'united states': 'US',
    usa: 'US',
    us: 'US',
    canada: 'CA',
    uk: 'GB',
    'united kingdom': 'GB',
    india: 'IN',
    australia: 'AU',
  };
  return map[normalized];
}

function buildTags(event: TicketmasterEvent): string[] {
  const values = [
    'event',
    'cultural',
    event.classifications?.[0]?.segment?.name,
    event.classifications?.[0]?.genre?.name,
    event.classifications?.[0]?.subGenre?.name,
  ]
    .filter(Boolean)
    .map((tag) => String(tag).toLowerCase());

  return [...new Set(values)];
}

function formatVenueAddress(event: TicketmasterEvent): string {
  const venue = event._embedded?.venues?.[0];
  if (!venue) return 'Address not available';

  const parts = [
    venue.name,
    venue.address?.line1,
    venue.city?.name,
    venue.state?.stateCode,
    venue.country?.countryCode,
  ].filter(Boolean);

  return parts.join(', ');
}

function transformTicketmasterEvent(event: TicketmasterEvent): CulturalResource {
  const lat = event._embedded?.venues?.[0]?.location?.latitude;
  const lng = event._embedded?.venues?.[0]?.location?.longitude;
  const shortDescription = (event.info || event.pleaseNote || 'Public event listing').slice(0, 220);

  return {
    id: `tm-${event.id}`,
    name: event.name,
    category: ResourceCategory.EVENT,
    description: shortDescription,
    address: formatVenueAddress(event),
    latitude: lat ? Number(lat) : undefined,
    longitude: lng ? Number(lng) : undefined,
    website: event.url,
    credibilityScore: 78,
    source: ResourceSource.TICKETMASTER,
    sourceUrl: event.url || 'https://www.ticketmaster.com/',
    tags: buildTags(event),
    isVerified: true,
    lastUpdated: new Date(),
  };
}

export async function searchTicketmasterEvents(
  city: string,
  country: string,
  searchKeywords: string[]
): Promise<CulturalResource[]> {
  try {
    if (!TICKETMASTER_API_KEY) {
      return [];
    }

    const keyword = searchKeywords.map((k) => k.trim()).filter(Boolean).slice(0, 6).join(' ');
    const countryCode = mapCountryToCode(country);

    const response = await axios.get(TICKETMASTER_API_URL, {
      params: {
        apikey: TICKETMASTER_API_KEY,
        city,
        keyword: keyword || 'cultural events',
        size: 20,
        sort: 'date,asc',
        classificationName: 'music,arts & theatre,miscellaneous',
        countryCode,
      },
      timeout: 15000,
    });

    const events: TicketmasterEvent[] = response.data?._embedded?.events || [];
    return events.map(transformTicketmasterEvent);
  } catch (error) {
    console.error('Error fetching Ticketmaster events:', error);
    return [];
  }
}
