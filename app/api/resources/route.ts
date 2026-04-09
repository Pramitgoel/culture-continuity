/**
 * API Route Handler for Resource Search
 * Aggregates results from all data sources
 * Falls back to mock data if APIs are not configured
 */

import { NextRequest, NextResponse } from 'next/server';
import { UserProfile, ResourceSearchResult } from '@/lib/types';
import { getResourcesForProfileWithFallback, getResourcesForProfile, generateSuggestedRoutine } from '@/lib/api/resourceAggregatorEnhanced';
import { analyzeCulturalLandscape } from '@/lib/api/culturalAnalyzer';

/**
 * POST /api/resources
 * Accepts a user profile and returns cultural resources
 */
export async function POST(request: NextRequest) {
  try {
    const body: UserProfile = await request.json();

    // Validate input
    if (!body.destination || !body.destination.city || !body.destination.country) {
      return NextResponse.json(
        { error: 'Missing required destination fields' },
        { status: 400 }
      );
    }

    if (
      !body.culturalBackground ||
      (body.culturalBackground.languages.length === 0 &&
        !body.culturalBackground.religion &&
        body.culturalBackground.foodPreferences.length === 0 &&
        body.culturalBackground.festivals.length === 0 &&
        body.culturalBackground.customIdentifiers.length === 0)
    ) {
      return NextResponse.json(
        { error: 'At least one cultural identifier is required' },
        { status: 400 }
      );
    }


    // Check for API keys
    const googleKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    const eventbriteToken = process.env.EVENTBRITE_PRIVATE_TOKEN || process.env.EVENTBRITE_API_KEY;
    const ticketmasterKey = process.env.TICKETMASTER_API_KEY;

    const hasGooglePlaces =
      !!googleKey &&
      googleKey !== 'your_google_places_api_key' &&
      googleKey !== 'your_google_places_key_here' &&
      googleKey !== 'AIzaSyDemoKeyForDevelopment';
    const hasEventbrite =
      !!eventbriteToken &&
      eventbriteToken !== 'your_eventbrite_api_key' &&
      eventbriteToken !== 'your_eventbrite_private_token';
    const hasTicketmaster =
      !!ticketmasterKey &&
      ticketmasterKey !== 'your_ticketmaster_api_key';

    let results, usedMockData;
    if (hasGooglePlaces || hasEventbrite || hasTicketmaster) {
      // Use real API if at least one key is present
      results = await getResourcesForProfile(body);
      usedMockData = false;
    } else {
      // Fallback to mock data
      const fallback = await getResourcesForProfileWithFallback(body);
      results = fallback.results;
      usedMockData = true;
    }

    // Generate suggested routine
    const keywords = [
      ...(body.culturalBackground.languages || []),
      ...(body.culturalBackground.festivals || []),
      ...(body.culturalBackground.customIdentifiers || []),
    ];

    const routines = generateSuggestedRoutine(
      results,
      body.engagementLevel,
      keywords
    );

    // Generate cultural landscape analysis (Function 2)
    const culturalAnalysis = await analyzeCulturalLandscape(body);

    // Return results
    return NextResponse.json(
      {
        success: true,
        data: results,
        suggestedRoutines: routines,
        culturalAnalysis,
        usedMockData,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in resource search API:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while searching for resources',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
