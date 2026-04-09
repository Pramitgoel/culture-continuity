/**
 * Resource Aggregator
 * Combines results from multiple API sources and applies filtering/ranking
 */

import {
  CulturalResource,
  ResourceCategory,
  ResourceSearchResult,
  SearchFilters,
  UserProfile,
  EngagementLevel,
  SuggestedRoutine,
  RoutineActivity,
} from '@/lib/types';
import { searchGooglePlaces, searchNearbyPlaces } from './googlePlaces';
import { searchEventbriteEvents } from './eventbrite';
import { searchMeetupGroups, searchMeetupEvents } from './meetup';
import { searchUniversityCulturalClubs } from './university';

/**
 * Main function to get all cultural resources for a user profile
 */
export async function getResourcesForProfile(
  profile: UserProfile,
  filters?: SearchFilters
): Promise<ResourceSearchResult> {
  const { destination, culturalBackground, engagementLevel } = profile;

  // Build search keywords from cultural background
  const searchKeywords = buildSearchKeywords(culturalBackground);

  // Run all searches in parallel
  const [
    googleRestaurants,
    googleGroceries,
    googleWorship,
    googleCulturalCenters,
    events,
    meetups,
    universityCulturalClubs,
  ] = await Promise.all([
    // Google Places searches for food and shopping
    destination.latitude && destination.longitude
      ? searchNearbyPlaces(
          destination.latitude,
          destination.longitude,
          ['restaurant ' + searchKeywords.join(' ')],
          5000
        )
      : Promise.resolve([]),

    destination.latitude && destination.longitude
      ? searchNearbyPlaces(
          destination.latitude,
          destination.longitude,
          ['grocery store ' + searchKeywords.join(' ')],
          5000
        )
      : Promise.resolve([]),

    destination.latitude && destination.longitude
      ? searchNearbyPlaces(
          destination.latitude,
          destination.longitude,
          ['place of worship ' + searchKeywords.join(' ')],
          10000
        )
      : Promise.resolve([]),

    searchGooglePlaces(
      destination.city,
      destination.country,
      ['cultural center ' + searchKeywords[0]],
      ResourceCategory.CULTURAL_CENTER
    ),

    // Event searches
    searchEventbriteEvents(destination.city, destination.country, searchKeywords),

    // Meetup searches
    searchMeetupGroups(destination.city, destination.country, searchKeywords),

    // University resources
    destination.university
      ? searchUniversityCulturalClubs(destination.university, destination.city, destination.country, searchKeywords)
      : Promise.resolve([]),
  ]);

  // Combine and categorize results
  const allResources = [
    ...googleRestaurants,
    ...googleGroceries,
    ...googleWorship,
    ...googleCulturalCenters,
    ...events,
    ...meetups,
    ...universityCulturalClubs,
  ];

  // Apply filters
  const filteredResources = applyFilters(allResources, filters);

  // Categorize by type
  const categorized = categorizeResources(filteredResources);

  // Calculate average credibility score
  const averageCredibilityScore =
    filteredResources.length > 0
      ? Math.round(
          filteredResources.reduce((sum, r) => sum + r.credibilityScore, 0) /
            filteredResources.length
        )
      : 0;

  // Check if results are limited
  const limitedResultsWarning =
    filteredResources.length < 5
      ? `Limited verified resources found. Only ${filteredResources.length} resources matched your criteria. Consider expanding your search or checking back later.`
      : undefined;

  return {
    communities: categorized.communities,
    spaces: categorized.spaces,
    events: categorized.events,
    averageCredibilityScore,
    totalResultsFound: filteredResources.length,
    limitedResultsWarning,
  };
}

/**
 * Build search keywords from cultural background
 */
function buildSearchKeywords(culturalBackground: any): string[] {
  const keywords: string[] = [];

  if (culturalBackground.languages && culturalBackground.languages.length > 0) {
    keywords.push(...culturalBackground.languages);
  }

  if (culturalBackground.religion) {
    keywords.push(culturalBackground.religion);
  }

  if (culturalBackground.foodPreferences && culturalBackground.foodPreferences.length > 0) {
    keywords.push(...culturalBackground.foodPreferences);
  }

  if (culturalBackground.festivals && culturalBackground.festivals.length > 0) {
    keywords.push(...culturalBackground.festivals);
  }

  if (culturalBackground.customIdentifiers && culturalBackground.customIdentifiers.length > 0) {
    keywords.push(...culturalBackground.customIdentifiers);
  }

  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Apply filters to resources
 */
function applyFilters(resources: CulturalResource[], filters?: SearchFilters): CulturalResource[] {
  let filtered = resources;

  if (filters) {
    if (filters.maxDistance && filters.maxDistance > 0) {
      filtered = filtered.filter((r) => !r.distance || r.distance <= filters.maxDistance!);
    }

    if (filters.minCredibilityScore && filters.minCredibilityScore > 0) {
      filtered = filtered.filter((r) => r.credibilityScore >= filters.minCredibilityScore!);
    }

    if (filters.resourceTypes && filters.resourceTypes.length > 0) {
      filtered = filtered.filter((r) => filters.resourceTypes!.includes(r.category));
    }
  }

  // Sort by preference
  if (filters?.sortBy) {
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'distance':
          return (a.distance || Infinity) - (b.distance || Infinity);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'credibility':
          return b.credibilityScore - a.credibilityScore;
        case 'relevance':
        default:
          return b.credibilityScore - a.credibilityScore;
      }
    });
  }

  return filtered;
}

/**
 * Categorize resources by type
 */
function categorizeResources(resources: CulturalResource[]): {
  communities: CulturalResource[];
  spaces: CulturalResource[];
  events: CulturalResource[];
} {
  const communities: CulturalResource[] = [];
  const spaces: CulturalResource[] = [];
  const events: CulturalResource[] = [];

  resources.forEach((resource) => {
    switch (resource.category) {
      case ResourceCategory.CULTURAL_CLUB:
      case ResourceCategory.MEETUP_GROUP:
      case ResourceCategory.ASSOCIATION:
        communities.push(resource);
        break;

      case ResourceCategory.EVENT:
        events.push(resource);
        break;

      case ResourceCategory.RESTAURANT:
      case ResourceCategory.GROCERY_STORE:
      case ResourceCategory.PLACE_OF_WORSHIP:
      case ResourceCategory.CULTURAL_CENTER:
      case ResourceCategory.LANGUAGE_CLASS:
      default:
        spaces.push(resource);
        break;
    }
  });

  return { communities, spaces, events };
}

/**
 * Generate suggested weekly cultural routine
 */
export function generateSuggestedRoutine(
  resources: ResourceSearchResult,
  engagementLevel: EngagementLevel,
  culturalKeywords: string[]
): SuggestedRoutine[] {
  const routines: SuggestedRoutine[] = [];

  if (engagementLevel === EngagementLevel.CASUAL) {
    routines.push({
      dayOfWeek: 'Weekend',
      activities: [
        {
          resourceName: resources.spaces[0]?.name || 'Cultural Center',
          type: 'Leisure',
          description: 'Visit a cultural space or restaurant to enjoy your heritage',
          recommendedFrequency: 'Once monthly',
        },
        {
          resourceName: resources.events[0]?.name || 'Cultural Event',
          type: 'Event',
          description: 'Attend a cultural festival or celebration',
          recommendedFrequency: 'As available',
        },
      ],
      estimatedTimeRequirement: '2-3 hours',
    });
  } else if (engagementLevel === EngagementLevel.MODERATE) {
    routines.push({
      dayOfWeek: 'Mid-week',
      activities: [
        {
          resourceName: resources.communities[0]?.name || 'Cultural Club',
          type: 'Community',
          description: 'Join a cultural club meeting or group gathering',
          recommendedFrequency: 'Bi-weekly',
        },
      ],
      estimatedTimeRequirement: '1-2 hours',
    });

    routines.push({
      dayOfWeek: 'Weekend',
      activities: [
        {
          resourceName: resources.spaces[0]?.name || 'Restaurant',
          type: 'Dining',
          description: 'Enjoy cultural cuisine at a local restaurant',
          recommendedFrequency: 'Weekly',
        },
        {
          resourceName: resources.events[0]?.name || 'Event',
          type: 'Event',
          description: 'Attend cultural events and festivals',
          recommendedFrequency: 'Monthly',
        },
      ],
      estimatedTimeRequirement: '3-4 hours',
    });
  } else if (engagementLevel === EngagementLevel.DEEP) {
    routines.push({
      dayOfWeek: 'Tuesday/Thursday',
      activities: [
        {
          resourceName: resources.communities[0]?.name || 'Cultural Community',
          type: 'Practice',
          description: 'Regular practice sessions (language, music, dance, etc.)',
          recommendedFrequency: '2-3 times weekly',
        },
      ],
      estimatedTimeRequirement: '2-3 hours',
    });

    routines.push({
      dayOfWeek: 'Weekend',
      activities: [
        {
          resourceName: resources.communities[0]?.name || 'Cultural Organization',
          type: 'Community Service',
          description: 'Volunteer or help organize community events',
          recommendedFrequency: 'Weekly',
        },
        {
          resourceName: resources.spaces[0]?.name || 'Place of Worship',
          type: 'Spiritual',
          description: 'Attend religious/spiritual services or gatherings',
          recommendedFrequency: 'Weekly or as per tradition',
        },
      ],
      estimatedTimeRequirement: '4-5 hours',
    });
  }

  return routines;
}
