/**
 * Enhanced API Aggregator with Fallback to Mock Data
 * This version allows the app to work even without configured API keys
 */

import {
  CulturalResource,
  ResourceSearchResult,
  SearchFilters,
  UserProfile,
  EngagementLevel,
  SuggestedRoutine,
  ResourceCategory,
} from '@/lib/types';
import { searchGooglePlaces, searchNearbyPlaces } from './googlePlaces';
import { searchEventbriteEvents } from './eventbrite';
import { searchTicketmasterEvents } from './ticketmaster';
import { searchUniversityCulturalClubs } from './university';
import { generateMockResources } from '@/lib/mockData';

/**
 * Main function to get cultural resources - with fallback to mock data
 */
export async function getResourcesForProfileWithFallback(
  profile: UserProfile,
  filters?: SearchFilters
): Promise<{ results: ResourceSearchResult; usedMockData: boolean }> {
  // DEMO MODE: Always use mock data, skip real API calls
  const mockResources = generateMockResources();

  // Build keywords from profile
  const keywords = [
    ...(profile.culturalBackground.languages || []),
    ...(profile.culturalBackground.festivals || []),
    ...(profile.culturalBackground.customIdentifiers || []),
    ...(profile.culturalBackground.foodPreferences || []),
    profile.culturalBackground.religion || '',
  ]
    .map((k) => k.toLowerCase())
    .filter(Boolean);

  // Filter resources by matching tags or name/description
  let filteredResources = mockResources.filter((resource) => {
    const text = [resource.name, resource.description, ...(resource.tags || [])]
      .join(' ')
      .toLowerCase();
    return keywords.some((kw) => text.includes(kw));
  });

  // If less than 10, fill with most relevant others (by tag overlap)
  if (filteredResources.length < 10) {
    // Exclude already included
    const alreadyIds = new Set(filteredResources.map((r) => r.id));
    // Score remaining resources by tag overlap
    const scored = mockResources
      .filter((r) => !alreadyIds.has(r.id))
      .map((r) => {
        const tags = (r.tags || []).map((t) => t.toLowerCase());
        const overlap = keywords.filter((kw) => tags.includes(kw)).length;
        return { r, overlap };
      })
      .filter((x) => x.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap);
    for (const { r } of scored) {
      if (filteredResources.length >= 10) break;
      filteredResources.push(r);
    }
  }

  // If still less than 10, fill with any remaining
  if (filteredResources.length < 10) {
    const alreadyIds = new Set(filteredResources.map((r) => r.id));
    for (const r of mockResources) {
      if (filteredResources.length >= 10) break;
      if (!alreadyIds.has(r.id)) filteredResources.push(r);
    }
  }

  const categorized = categorizeResources(filteredResources);

  return {
    results: {
      communities: categorized.communities,
      spaces: categorized.spaces,
      events: categorized.events,
      averageCredibilityScore: filteredResources.length
        ? Math.round(filteredResources.reduce((sum, r) => sum + (r.credibilityScore || 0), 0) / filteredResources.length)
        : 0,
      totalResultsFound: filteredResources.length,
      limitedResultsWarning:
        'Showing demo data. Configure API keys in .env.local for real resources in your location.',
    },
    usedMockData: true,
  };
}

/**
 * Original function - fetches real data only
 */
export async function getResourcesForProfile(
  profile: UserProfile,
  filters?: SearchFilters
): Promise<ResourceSearchResult> {
  const { destination, culturalBackground, engagementLevel } = profile;


  const searchKeywords = buildSearchKeywords(culturalBackground);

  // Add special handling for dance, music, or other custom identifiers

  const customKeywords = (culturalBackground.customIdentifiers || []).map((kw: string) => kw.toLowerCase());
  const danceKeywords = customKeywords.filter(kw => kw.includes('dance')).map(kw => [`${kw} class`, `${kw} school`, `${kw} event`, `${kw} performance`, `${kw} group`]).flat();
  const musicKeywords = customKeywords.filter(kw => kw.includes('music') || kw.includes('flute') || kw.includes('instrument')).map(kw => [`${kw} class`, `${kw} school`, `${kw} event`, `${kw} performance`, `${kw} group`]).flat();

  const restaurantKeywords = searchKeywords.map(kw => `${kw} restaurant`);
  const groceryKeywords = searchKeywords.map(kw => `${kw} grocery store`);
  // Only include worship places matching user's religion
  let worshipKeywords: string[] = [];
  if (culturalBackground.religion) {
    const rel = culturalBackground.religion.toLowerCase();
    if (rel.includes('hindu')) worshipKeywords = searchKeywords.map(kw => `${kw} temple`).concat(['hindu temple']);
    else if (rel.includes('muslim') || rel.includes('islam')) worshipKeywords = searchKeywords.map(kw => `${kw} mosque`).concat(['mosque']);
    else if (rel.includes('christian')) worshipKeywords = searchKeywords.map(kw => `${kw} church`).concat(['church']);
    else if (rel.includes('jewish')) worshipKeywords = searchKeywords.map(kw => `${kw} synagogue`).concat(['synagogue']);
  }
  const culturalCenterKeywords = searchKeywords.map(kw => `${kw} cultural center`);
  const clubKeywords = searchKeywords.map(kw => `${kw} club`).concat(searchKeywords.map(kw => `${kw} society`));
  const danceClassKeywords = danceKeywords.length ? danceKeywords : (customKeywords.length ? [] : ['dance class', 'dance school', 'dance event']);
  const musicClassKeywords = musicKeywords.length ? musicKeywords : (customKeywords.length ? [] : ['music class', 'music school', 'music event']);
  const oneTimeExperienceKeywords = [
    'cultural festival',
    'film screening',
    'art exhibition',
    'food festival',
    'dance workshop',
    'museum',
    'gallery',
    'street fair',
  ];
  const broadCultureEventKeywords = [
    'african culture event',
    'latin american cultural festival',
    'east asian cultural event',
    'south asian cultural event',
    'middle eastern cultural event',
    'european cultural event',
    ...oneTimeExperienceKeywords,
    ...searchKeywords,
    ...customKeywords,
    ...danceClassKeywords,
    ...musicClassKeywords,
  ];

  // Fallback to generic if no user keywords
  const getOrDefault = (arr: string[], def: string[]) => arr.length ? arr : def;

  // Diversify resource types: add more categories and sources
  const [
    googleRestaurants,
    googleGroceries,
    googleWorship,
    googleCulturalCenters,
    googleOneTimeExperiences,
    googleDanceClasses,
    googleMusicClasses,
    events,
    ticketmasterEvents,
    universityCulturalClubs,
    universityDanceClubs,
    universityMusicClubs,
  ] = await Promise.all([
    destination.latitude && destination.longitude
      ? searchNearbyPlaces(
          destination.latitude,
          destination.longitude,
          getOrDefault(restaurantKeywords, ['restaurant']),
          5000
        )
      : Promise.resolve([]),

    destination.latitude && destination.longitude
      ? searchNearbyPlaces(
          destination.latitude,
          destination.longitude,
          getOrDefault(groceryKeywords, ['grocery store', 'asian market']),
          5000
        )
      : Promise.resolve([]),

    // Only search for worship if user specified a religion
    (worshipKeywords.length > 0 && destination.latitude && destination.longitude)
      ? searchNearbyPlaces(
          destination.latitude,
          destination.longitude,
          worshipKeywords,
          10000
        )
      : Promise.resolve([]),

    searchGooglePlaces(
      destination.city,
      destination.country,
      getOrDefault(culturalCenterKeywords, ['cultural center']),
      ResourceCategory.CULTURAL_CENTER
    ),

    destination.latitude && destination.longitude
      ? searchNearbyPlaces(
          destination.latitude,
          destination.longitude,
          oneTimeExperienceKeywords,
          12000
        )
      : Promise.resolve([]),

    // Add dance classes if relevant
    (danceClassKeywords.length > 0)
      ? searchGooglePlaces(
          destination.city,
          destination.country,
          danceClassKeywords,
          ResourceCategory.LANGUAGE_CLASS
        )
      : Promise.resolve([]),

    // Add music classes if relevant
    (musicClassKeywords.length > 0)
      ? searchGooglePlaces(
          destination.city,
          destination.country,
          musicClassKeywords,
          ResourceCategory.LANGUAGE_CLASS
        )
      : Promise.resolve([]),

    searchEventbriteEvents(destination.city, destination.country, broadCultureEventKeywords),

    searchTicketmasterEvents(destination.city, destination.country, broadCultureEventKeywords),

    destination.university
      ? searchUniversityCulturalClubs(destination.university, destination.city, destination.country, searchKeywords)
      : Promise.resolve([]),

    // Add university dance clubs if relevant
    (destination.university && danceClassKeywords.length > 0)
      ? searchUniversityCulturalClubs(destination.university, destination.city, destination.country, danceClassKeywords)
      : Promise.resolve([]),

    // Add university music clubs if relevant
    (destination.university && musicClassKeywords.length > 0)
      ? searchUniversityCulturalClubs(destination.university, destination.city, destination.country, musicClassKeywords)
      : Promise.resolve([]),
  ]);

  // Derive preserve-friendly spaces and communities from live Ticketmaster events.
  const ticketmasterSpaces: CulturalResource[] = ticketmasterEvents
    .filter((event) => !!event.address)
    .map((event) => {
      const venueName = event.address?.split(',')[0]?.trim() || event.name;
      return {
        ...event,
        id: `${event.id}-space`,
        name: venueName,
        category: ResourceCategory.CULTURAL_CENTER,
        description: `Venue hosting cultural events in ${destination.city}. Upcoming event: ${event.name}`,
        tags: [...new Set([...(event.tags || []), 'venue', 'cultural center', 'community'])],
      };
    });

  const ticketmasterCommunities: CulturalResource[] = Array.from(
    new Map(
      ticketmasterEvents
        .map((event) => {
          const genreTag = (event.tags || []).find(
            (tag) => tag !== 'event' && tag !== 'cultural'
          );
          const communityName = genreTag
            ? `${genreTag.replace(/\b\w/g, (char) => char.toUpperCase())} Event Community - ${destination.city}`
            : `Cultural Event Community - ${destination.city}`;

          const community: CulturalResource = {
            ...event,
            id: `${event.id}-community`,
            name: communityName,
            category: ResourceCategory.ASSOCIATION,
            description: `Public event-goer community around ${genreTag || 'cultural'} events in ${destination.city}.`,
            tags: [...new Set([...(event.tags || []), 'community', 'association'])],
          };

          return [communityName.toLowerCase(), community] as const;
        })
    ).values()
  ).slice(0, 10);


  // Helper to pick the top N most relevant and diverse resources for a section
  function pickTopRelevant(resources: CulturalResource[], max: number = 10, forceVariety = false): CulturalResource[] {
    const sorted = resources
      .filter(r => r.name && r.description && r.credibilityScore > 0)
      .sort((a, b) => {
        if (b.credibilityScore !== a.credibilityScore) return b.credibilityScore - a.credibilityScore;
        if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0);
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      });
    if (!forceVariety) {
      // Old logic for non-spaces
      const picked: CulturalResource[] = [];
      const seenTypes = new Set<string>();
      for (const r of sorted) {
        const mainType = (r.tags && r.tags.length > 0) ? r.tags[0] : r.category;
        if (mainType && Array.from(seenTypes).filter(t => t === mainType).length >= 3) continue;
        picked.push(r);
        seenTypes.add(mainType);
        if (picked.length >= max) break;
      }
      if (picked.length < max) {
        for (const r of sorted) {
          if (!picked.includes(r)) {
            picked.push(r);
            if (picked.length >= max) break;
          }
        }
      }
      return picked;
    }
    // For spaces: guarantee variety and limit temples
    const picked: CulturalResource[] = [];
    let temples = 0;
    let centers = 0;
    let restaurants = 0;
    let clubs = 0;
    let schools = 0;
    let others = 0;
    for (const r of sorted) {
      const tags = r.tags || [];
      const isTemple = tags.includes('temple') || tags.includes('hindu_temple');
      const isCenter = tags.includes('cultural center') || tags.includes('community center');
      const isRestaurant = tags.includes('restaurant') || tags.includes('food');
      const isClub = tags.includes('club') || tags.includes('association') || tags.includes('society');
      const isSchool = tags.includes('education') || tags.includes('school') || tags.includes('language school');
      if (isTemple && temples < 2) { picked.push(r); temples++; }
      else if (isCenter && centers < 2) { picked.push(r); centers++; }
      else if (isRestaurant && restaurants < 2) { picked.push(r); restaurants++; }
      else if (isClub && clubs < 2) { picked.push(r); clubs++; }
      else if (isSchool && schools < 2) { picked.push(r); schools++; }
      else if (!isTemple && !isCenter && !isRestaurant && !isClub && !isSchool && others < 2) { picked.push(r); others++; }
      if (picked.length >= max) break;
    }
    if (picked.length < max) {
      for (const r of sorted) {
        if (!picked.includes(r)) {
          picked.push(r);
          if (picked.length >= max) break;
        }
      }
    }
    return picked;
  }

  // For spaces, force variety; for others, use default
  const allResources = [
    ...pickTopRelevant(googleRestaurants, 10),
    ...pickTopRelevant(googleGroceries, 10),
    ...pickTopRelevant(googleWorship, 10),
    ...pickTopRelevant(googleCulturalCenters, 10, true), // force variety for spaces
    ...pickTopRelevant(googleOneTimeExperiences, 10),
    ...pickTopRelevant(googleDanceClasses, 10),
    ...pickTopRelevant(googleMusicClasses, 10),
    ...pickTopRelevant(events, 10),
    ...pickTopRelevant(ticketmasterEvents, 10),
    ...pickTopRelevant(ticketmasterSpaces, 10, true),
    ...pickTopRelevant(ticketmasterCommunities, 10),
    ...pickTopRelevant(universityCulturalClubs, 10),
    ...pickTopRelevant(universityDanceClubs, 10),
    ...pickTopRelevant(universityMusicClubs, 10),
  ];

  const filteredResources = applyFilters(allResources, filters);
  // Enforce max 2 temples in spaces (after all filtering)
  const categorized = categorizeResources(filteredResources);
  if (categorized.spaces && categorized.spaces.length > 0) {
    let temples = 0;
    categorized.spaces = categorized.spaces.filter(r => {
      const tags = r.tags || [];
      const isTemple = tags.includes('temple') || tags.includes('hindu_temple');
      if (isTemple) {
        if (temples >= 2) return false;
        temples++;
      }
      return true;
    });
  }

  // Only count what is actually displayed, and cap at 10 per section (and use the actual displayed arrays)
  const totalResultsFound = (categorized.communities?.slice(0, 10).length || 0) + (categorized.spaces?.slice(0, 10).length || 0) + (categorized.events?.slice(0, 10).length || 0);

  const averageCredibilityScore =
    filteredResources.length > 0
      ? Math.round(
          filteredResources.reduce((sum, r) => sum + r.credibilityScore, 0) /
            filteredResources.length
        )
      : 0;

  const limitedResultsWarning =
    totalResultsFound < 5
      ? `Limited verified resources found. Only ${totalResultsFound} resources matched your criteria. Consider expanding your search parameters.`
      : undefined;

  return {
    communities: categorized.communities,
    spaces: categorized.spaces,
    events: categorized.events,
    averageCredibilityScore,
    totalResultsFound,
    limitedResultsWarning,
  };
}

function buildSearchKeywords(culturalBackground: any): string[] {
  const keywords: string[] = [];

  if (culturalBackground.languages) {
    keywords.push(...culturalBackground.languages);
  }

  if (culturalBackground.religion) {
    keywords.push(culturalBackground.religion.toLowerCase());
  }

  if (culturalBackground.foodPreferences) {
    keywords.push(...culturalBackground.foodPreferences);
  }

  if (culturalBackground.festivals) {
    keywords.push(...culturalBackground.festivals);
  }

  return [...new Set(keywords)];
}

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

  if (filters?.sortBy) {
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'distance':
          return (a.distance || Infinity) - (b.distance || Infinity);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'credibility':
          return b.credibilityScore - a.credibilityScore;
        default:
          return b.credibilityScore - a.credibilityScore;
      }
    });
  }

  return filtered;
}

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

      default:
        spaces.push(resource);
        break;
    }
  });

  return { communities, spaces, events };
}

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
          type: 'Leisure - Explore local culture',
          description: 'Visit a cultural space or restaurant to enjoy your heritage',
          recommendedFrequency: 'Once monthly',
        },
        {
          resourceName: resources.events[0]?.name || 'Festival or Cultural Event',
          type: 'Celebration',
          description: 'Attend a cultural festival or community celebration',
          recommendedFrequency: 'As available (seasonal)',
        },
      ],
      estimatedTimeRequirement: '2-3 hours',
    });
  } else if (engagementLevel === EngagementLevel.MODERATE) {
    routines.push({
      dayOfWeek: 'Mid-week (Tuesday/Thursday)',
      activities: [
        {
          resourceName: resources.communities[0]?.name || 'Cultural Club or Group',
          type: 'Community - Meetings & Social',
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
          resourceName: resources.spaces[0]?.name || 'Restaurant or Grocery',
          type: 'Dining - Food & Culture',
          description: 'Enjoy cultural cuisine at a local restaurant or cook traditional meals',
          recommendedFrequency: 'Weekly or bi-weekly',
        },
        {
          resourceName: resources.events[0]?.name || 'Cultural Event',
          type: 'Celebration',
          description: 'Attend cultural events and festivals',
          recommendedFrequency: 'Monthly or as available',
        },
      ],
      estimatedTimeRequirement: '3-4 hours',
    });
  } else if (engagementLevel === EngagementLevel.DEEP) {
    routines.push({
      dayOfWeek: 'Tuesday/Thursday',
      activities: [
        {
          resourceName: resources.communities[0]?.name || 'Cultural Community/Organization',
          type: 'Practice & Learning',
          description: 'Regular practice sessions (language immersion, music, dance, martial arts, etc.)',
          recommendedFrequency: '2-3 times per week',
        },
      ],
      estimatedTimeRequirement: '2-3 hours per session',
    });

    routines.push({
      dayOfWeek: 'Saturday/Sunday',
      activities: [
        {
          resourceName: resources.communities[0]?.name || 'Cultural Organization',
          type: 'Community Leadership',
          description: 'Volunteer, organize events, or mentor others in the community',
          recommendedFrequency: 'Weekly or bi-weekly',
        },
        {
          resourceName: resources.spaces[0]?.name || 'Place of Worship',
          type: 'Spiritual Practice',
          description: 'Attend religious/spiritual services or regular gatherings',
          recommendedFrequency: 'Weekly or according to tradition',
        },
        {
          resourceName: resources.spaces[1]?.name || 'Restaurant/Gathering Space',
          type: 'Social & Dining',
          description: 'Participate in community meals and social activities',
          recommendedFrequency: 'Weekly or as organized',
        },
      ],
      estimatedTimeRequirement: '4-6 hours total',
    });
  }

  return routines;
}
