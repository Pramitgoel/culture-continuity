/**
 * Google Places API integration
 * Fetches real-time data for restaurants, cultural centers, places of worship, etc.
 */

import axios from 'axios';
import { CulturalResource, ResourceCategory, ResourceSource } from '@/lib/types';

const PLACES_API_KEY =
  process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';

/**
 * Define search keywords for different cultural categories
 */
const CULTURAL_SEARCH_KEYWORDS: Record<string, string[]> = {
  restaurant: ['restaurant', 'food'],
  grocery: ['grocery store', 'asian market', 'international market', 'specialty market'],
  worship: ['temple', 'mosque', 'church', 'synagogue', 'gurudwara', 'place of worship'],
  cultural_center: ['cultural center', 'community center', 'arts center'],
  language_class: ['language school', 'language center', 'language courses'],
};

interface GooglePlacesResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    weekday_text: string[];
  };
  website?: string;
  formatted_phone_number?: string;
  url?: string;
}

/**
 * Search for cultural resources using Google Places API
 * @param city City name
 * @param country Country name
 * @param searchKeywords Keywords to search for
 * @param category Resource category
 * @returns Promise<CulturalResource[]>
 */
export async function searchGooglePlaces(
  city: string,
  country: string,
  searchKeywords: string[],
  category: ResourceCategory
): Promise<CulturalResource[]> {
  try {
    if (!PLACES_API_KEY) {
      console.warn('Google Places API key not configured');
      return [];
    }

    const results: CulturalResource[] = [];
    const searchQuery = `${searchKeywords[0]} in ${city}, ${country}`;

    // Note: This uses the Text Search endpoint, but in production you would use
    // Nearby Search with geocoded coordinates for better results
    const response = await axios.get(`${PLACES_API_URL}/textsearch/json`, {
      params: {
        query: searchQuery,
        key: PLACES_API_KEY,
        region: country.toLowerCase(),
      },
      timeout: 10000,
    });

    if (response.data.results && response.data.results.length > 0) {
      for (const place of response.data.results.slice(0, 10)) {
        // Limit to 10 results per query
        const resource = transformGooglePlace(place, category);
        results.push(resource);
      }
    }

    return results;
  } catch (error) {
    console.error(`Error fetching Google Places for ${category}:`, error);
    return [];
  }
}

/**
 * Transform Google Places result to CulturalResource
 */
function transformGooglePlace(place: GooglePlacesResult, category: ResourceCategory): CulturalResource {
  const hours = place.opening_hours?.weekday_text
    ? convertGoogleHoursToBusiness(place.opening_hours.weekday_text)
    : undefined;

  // Build a human-friendly description
  let desc = '';
  if (place.types && place.types.length > 0) {
    // Prioritize more specific types
    if (place.types.includes('hindu_temple')) {
      desc = 'A Hindu temple and place of worship.';
    } else if (place.types.includes('mosque')) {
      desc = 'A mosque and Islamic place of worship.';
    } else if (place.types.includes('church')) {
      desc = 'A Christian church and place of worship.';
    } else if (place.types.includes('synagogue')) {
      desc = 'A Jewish synagogue and place of worship.';
    } else if (place.types.includes('cultural_center')) {
      desc = 'A cultural center for community events and activities.';
    } else if (place.types.includes('community_center')) {
      desc = 'A community center for gatherings and programs.';
    } else if (place.types.includes('restaurant')) {
      desc = 'A restaurant offering food and dining.';
    } else if (place.types.includes('grocery_or_supermarket')) {
      desc = 'A grocery store or supermarket.';
    } else if (place.types.includes('school')) {
      desc = 'An educational institution or school.';
    } else {
      desc = `A ${place.types[0].replace(/_/g, ' ')} in the area.`;
    }
  } else {
    desc = 'Cultural resource in the area.';
  }

  // Add address for context
  desc += ` Located at ${place.formatted_address}.`;

  return {
    id: place.place_id,
    name: place.name,
    category,
    description: desc,
    address: place.formatted_address,
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
    phoneNumber: place.formatted_phone_number,
    website: place.website,
    rating: place.rating,
    reviewCount: place.user_ratings_total,
    credibilityScore: calculateCredibilityScore({
      hasRating: !!place.rating,
      hasReviews: !!place.user_ratings_total,
      hasPhone: !!place.formatted_phone_number,
      hasWebsite: !!place.website,
      rating: place.rating || 0,
      source: 'google_places',
    }),
    source: ResourceSource.GOOGLE_PLACES,
    sourceUrl: place.url || `https://www.google.com/maps/search/${encodeURIComponent(place.name)}`,
    tags: categorizeGooglePlace(place),
    hours,
    isVerified: !!place.rating, // Google-rated places are considered verified
    lastUpdated: new Date(),
  };
}

/**
 * Convert Google's weekday text format to business hours
 */
function convertGoogleHoursToBusiness(weekdayText: string[]): Record<string, string> {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours: Record<string, string> = {};

  weekdayText.forEach((text) => {
    days.forEach((day) => {
      if (text.includes(day)) {
        const timeMatch = text.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\s*–\s*(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)/);
        if (timeMatch) {
          hours[day.toLowerCase()] = `${timeMatch[1]} - ${timeMatch[2]}`;
        }
      }
    });
  });

  return hours;
}

/**
 * Categorize Google Place based on types
 */
function categorizeGooglePlace(place: GooglePlacesResult): string[] {
  const tags: string[] = [];

  place.types.forEach((type) => {
    // Map common Google place types to our tags
    if (type.includes('restaurant')) tags.push('restaurant');
    if (type.includes('restaurant')) tags.push('food');
    if (type.includes('grocery')) tags.push('grocery');
    if (type.includes('store')) tags.push('retail');
    if (type.includes('place_of_worship')) tags.push('worship');
    if (type.includes('church')) tags.push('church');
    if (type.includes('mosque')) tags.push('mosque');
    if (type.includes('hindu_temple')) tags.push('temple');
    if (type.includes('synagogue')) tags.push('synagogue');
    if (type.includes('school')) tags.push('education');
  });

  // Remove duplicates
  return [...new Set(tags)];
}

/**
 * Calculate credibility score based on multiple factors
 */
function calculateCredibilityScore(factors: {
  hasRating: boolean;
  hasReviews: boolean;
  hasPhone: boolean;
  hasWebsite: boolean;
  rating: number;
  source: string;
}): number {
  let score = 0;

  // Check for complete information (maximum 40 points)
  if (factors.hasRating) score += 15;
  if (factors.hasReviews) score += 10;
  if (factors.hasPhone) score += 8;
  if (factors.hasWebsite) score += 7;

  // Rating bonus (maximum 40 points)
  if (factors.rating >= 4.5) {
    score += 40;
  } else if (factors.rating >= 4.0) {
    score += 30;
  } else if (factors.rating >= 3.5) {
    score += 20;
  } else if (factors.rating > 0) {
    score += 10;
  }

  // Source bonus (maximum 20 points)
  if (factors.source === 'google_places') {
    score += 20; // Google Places is highly reliable
  }

  return Math.min(Math.round(score), 100);
}

/**
 * Get nearby cultural resources for a specific location
 * @param latitude
 * @param longitude
 * @param searchKeywords
 * @param radiusInMeters
 */
export async function searchNearbyPlaces(
  latitude: number,
  longitude: number,
  searchKeywords: string[],
  radiusInMeters: number = 5000
): Promise<CulturalResource[]> {
  try {
    if (!PLACES_API_KEY) {
      console.warn('Google Places API key not configured');
      return [];
    }

    const results: CulturalResource[] = [];

    for (const keyword of searchKeywords) {
      try {
        const response = await axios.get(`${PLACES_API_URL}/nearbysearch/json`, {
          params: {
            location: `${latitude},${longitude}`,
            radius: radiusInMeters,
            keyword,
            key: PLACES_API_KEY,
          },
          timeout: 10000,
        });

        if (response.data.results) {
          for (const place of response.data.results.slice(0, 5)) {
            // Limit per keyword
            results.push(transformGooglePlace(place, ResourceCategory.CULTURAL_CENTER));
          }
        }
      } catch (error) {
        console.error(`Error searching nearby places for keyword "${keyword}":`, error);
        continue; // Continue with next keyword
      }
    }

    // Remove duplicates by place_id
    const uniqueResults = Array.from(
      new Map(results.map((r) => [r.id, r])).values()
    );

    return uniqueResults.slice(0, 15); // Limit total results
  } catch (error) {
    console.error('Error in searchNearbyPlaces:', error);
    return [];
  }
}
