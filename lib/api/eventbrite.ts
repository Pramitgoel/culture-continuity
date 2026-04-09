/**
 * Eventbrite API integration
 * Fetches real-time event data for cultural events and festivals
 */

import axios from 'axios';
import { CulturalResource, ResourceCategory, ResourceSource } from '@/lib/types';

const EVENTBRITE_AUTH_TOKEN =
  process.env.EVENTBRITE_PRIVATE_TOKEN || process.env.EVENTBRITE_API_KEY;
const EVENTBRITE_API_URL = 'https://www.eventbriteapi.com/v3';

interface EventbriteEvent {
  id: string;
  name: {
    text: string;
  };
  description: {
    text: string;
  };
  start: {
    utc: string;
    timezone: string;
  };
  end: {
    utc: string;
    timezone: string;
  };
  url: string;
  logo?: {
    url: string;
  };
  status: string;
  venue?: {
    address: {
      address_1?: string;
      city?: string;
      region?: string;
      postal_code?: string;
      country?: string;
    };
    latitude?: number;
    longitude?: number;
  };
  category?: {
    name: string;
  };
}

/**
 * Search for cultural events on Eventbrite
 * @param city City name
 * @param country Country name
 * @param searchKeywords Keywords to search for
 * @returns Promise<CulturalResource[]>
 */
export async function searchEventbriteEvents(
  city: string,
  country: string,
  searchKeywords: string[]
): Promise<CulturalResource[]> {
  try {
    if (!EVENTBRITE_AUTH_TOKEN) {
      console.warn('Eventbrite token not configured');
      return [];
    }

    const results: CulturalResource[] = [];
    const cleanedKeywords = searchKeywords.map((k) => k.trim()).filter(Boolean);
    const searchQuery = cleanedKeywords.length > 0 ? cleanedKeywords.join(' OR ') : 'cultural event';

    const response = await axios.get(`${EVENTBRITE_API_URL}/events/search/`, {
      params: {
        q: searchQuery,
        'location.address': `${city}, ${country}`,
        'location.within': '10km', // Search within 10km radius
        'status': 'live',
        'sort_by': 'date',
        'expand': 'venue,category',
      },
      headers: {
        'Authorization': `Bearer ${EVENTBRITE_AUTH_TOKEN}`,
      },
      timeout: 15000,
    });

    if (response.data.events && response.data.events.length > 0) {
      for (const event of response.data.events.slice(0, 20)) {
        if (event.status === 'live' || event.status === 'started') {
          const resource = transformEventbriteEvent(event);
          results.push(resource);
        }
      }
    }

    return results;
  } catch (error) {
    const axiosError = error as any;
    const status = axiosError?.response?.status;
    const details = axiosError?.response?.data;
    console.error('Error fetching Eventbrite events:', status, details || error);
    return [];
  }
}

/**
 * Transform Eventbrite event to CulturalResource
 */
function transformEventbriteEvent(event: EventbriteEvent): CulturalResource {
  const startDate = new Date(event.start.utc);
  const endDate = new Date(event.end.utc);

  return {
    id: event.id,
    name: event.name.text,
    category: ResourceCategory.EVENT,
    description: event.description.text.substring(0, 200),
    address: formatEventAddress(event.venue),
    latitude: event.venue?.latitude,
    longitude: event.venue?.longitude,
    website: event.url,
    credibilityScore: calculateEventCredibilityScore(event),
    source: ResourceSource.EVENTBRITE,
    sourceUrl: event.url,
    tags: [
      'event',
      'festival',
      event.category?.name.toLowerCase() || 'cultural',
      getEventType(event),
    ].filter(Boolean),
    isVerified: true, // Eventbrite verified events
    lastUpdated: new Date(),
  };
}

/**
 * Format event address from Eventbrite venue data
 */
function formatEventAddress(venue?: any): string {
  if (!venue || !venue.address) {
    return 'Address not available';
  }

  const addr = venue.address;
  const parts = [
    addr.address_1,
    addr.city,
    addr.region,
    addr.postal_code,
    addr.country,
  ].filter(Boolean);

  return parts.join(', ');
}

/**
 * Determine event type based on keywords
 */
function getEventType(event: EventbriteEvent): string {
  const text = (event.name.text + ' ' + event.description.text).toLowerCase();

  if (text.includes('festival')) return 'festival';
  if (text.includes('workshop')) return 'workshop';
  if (text.includes('celebration')) return 'celebration';
  if (text.includes('class')) return 'class';
  if (text.includes('meetup') || text.includes('meet-up')) return 'meetup';
  if (text.includes('concert') || text.includes('music')) return 'music';
  if (text.includes('food') || text.includes('feast')) return 'food';
  if (text.includes('film') || text.includes('movie')) return 'film';
  if (text.includes('exhibition') || text.includes('gallery')) return 'exhibition';

  return 'event';
}

/**
 * Calculate credibility score for events
 */
function calculateEventCredibilityScore(event: EventbriteEvent): number {
  let score = 70; // Base score for Eventbrite verified events

  // Add points for complete information
  if (event.description && event.description.text.length > 100) score += 10;
  if (event.venue && event.venue.address) score += 10;
  if (event.logo) score += 10;

  return Math.min(score, 100);
}

/**
 * Search for recurring cultural events and gatherings
 */
export async function searchRecurringCulturalEvents(
  city: string,
  country: string,
  culturalKeywords: string[]
): Promise<CulturalResource[]> {
  // For now, use the standard event search
  // In production, you would want to identify recurring events specifically
  return searchEventbriteEvents(city, country, culturalKeywords);
}
