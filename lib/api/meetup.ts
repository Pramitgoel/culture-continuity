/**
 * Meetup API integration
 * Fetches real-time data for cultural meetups and community groups
 */

import axios from 'axios';
import { CulturalResource, ResourceCategory, ResourceSource } from '@/lib/types';

const MEETUP_API_KEY = process.env.MEETUP_API_KEY;
const MEETUP_API_URL = 'https://api.meetup.com';

interface MeetupGroup {
  id: number;
  name: string;
  description: string;
  members: number;
  created: number;
  city: string;
  country: string;
  lat?: number;
  lon?: number;
  url: string;
  category?: {
    name: string;
  };
  photo?: {
    photo_link: string;
  };
}

interface MeetupEvent {
  id: number;
  name: string;
  description: string;
  local_date: string;
  local_time: string;
  event_url: string;
  group: {
    name: string;
    id: number;
    url_name: string;
  };
  venue?: {
    name: string;
    address_1: string;
    city: string;
    country: string;
    lat: number;
    lon: number;
  };
  status: string;
  yes_rsvp_count: number;
}

/**
 * Search for cultural groups on Meetup
 * @param city City name
 * @param country Country name
 * @param searchKeywords Keywords to search for
 * @returns Promise<CulturalResource[]>
 */
export async function searchMeetupGroups(
  city: string,
  country: string,
  searchKeywords: string[]
): Promise<CulturalResource[]> {
  try {
    // Note: Meetup API requires authentication and has specific endpoints
    // This is a placeholder for the implementation
    // In production, you would use their proper API with authentication

    console.warn('Meetup API integration: Using placeholder implementation. Add your Meetup API key for live data.');
    return [];
  } catch (error) {
    console.error('Error fetching Meetup groups:', error);
    return [];
  }
}

/**
 * Search for upcoming meetup events
 * @param city City name
 * @param country Country name
 * @param searchKeywords Keywords to search for
 */
export async function searchMeetupEvents(
  city: string,
  country: string,
  searchKeywords: string[]
): Promise<CulturalResource[]> {
  try {
    console.warn('Meetup API integration: Using placeholder implementation. Add your Meetup API key for live data.');
    return [];
  } catch (error) {
    console.error('Error fetching Meetup events:', error);
    return [];
  }
}

/**
 * Transform Meetup group to CulturalResource
 */
function transformMeetupGroup(group: MeetupGroup): CulturalResource {
  return {
    id: `meetup-group-${group.id}`,
    name: group.name,
    category: ResourceCategory.MEETUP_GROUP,
    description: group.description.substring(0, 200),
    latitude: group.lat,
    longitude: group.lon,
    website: group.url,
    credibilityScore: calculateMeetupCredibilityScore(group),
    source: ResourceSource.MEETUP,
    sourceUrl: group.url,
    tags: [
      'meetup',
      'community',
      'group',
      group.category?.name.toLowerCase() || 'cultural',
    ].filter(Boolean),
    isVerified: group.members > 10, // Groups with members are likely active
    lastUpdated: new Date(),
  };
}

/**
 * Calculate credibility score for Meetup groups
 */
function calculateMeetupCredibilityScore(group: MeetupGroup): number {
  let score = 50; // Base score for Meetup groups

  // Adjust based on member count
  if (group.members > 100) score += 30;
  else if (group.members > 50) score += 20;
  else if (group.members > 10) score += 10;

  // Adjust based on group age
  const groupAgeMonths = (Date.now() - group.created) / (1000 * 60 * 60 * 24 * 30);
  if (groupAgeMonths > 12) score += 15;
  else if (groupAgeMonths > 6) score += 10;
  else if (groupAgeMonths > 3) score += 5;

  // Description completeness
  if (group.description && group.description.length > 100) score += 5;

  return Math.min(score, 100);
}

/**
 * Transform Meetup event to CulturalResource
 */
function transformMeetupEvent(event: MeetupEvent): CulturalResource {
  return {
    id: `meetup-event-${event.id}`,
    name: event.name,
    category: ResourceCategory.EVENT,
    description: event.description.substring(0, 200),
    address: event.venue
      ? `${event.venue.address_1}, ${event.venue.city}, ${event.venue.country}`
      : undefined,
    latitude: event.venue?.lat,
    longitude: event.venue?.lon,
    website: event.event_url,
    credibilityScore: calculateMeetupEventCredibilityScore(event),
    source: ResourceSource.MEETUP,
    sourceUrl: event.event_url,
    tags: [
      'meetup',
      'event',
      'community',
      event.group.name.toLowerCase(),
    ],
    isVerified: true,
    lastUpdated: new Date(),
  };
}

/**
 * Calculate credibility score for Meetup events
 */
function calculateMeetupEventCredibilityScore(event: MeetupEvent): number {
  let score = 70; // Base score for Meetup verified events

  // Adjust based on attendance
  if (event.yes_rsvp_count > 50) score += 20;
  else if (event.yes_rsvp_count > 20) score += 15;
  else if (event.yes_rsvp_count > 5) score += 10;

  if (event.venue) score += 10;
  if (event.description && event.description.length > 100) score += 5;

  return Math.min(score, 100);
}
