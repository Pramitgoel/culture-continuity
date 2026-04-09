/**
 * Core type definitions for Culture Continuity
 */

export interface UserProfile {
  destination: Destination;
  culturalBackground: CulturalBackground;
  engagementLevel: EngagementLevel;
}

export interface Destination {
  city: string;
  country: string;
  university?: string;
  latitude?: number;
  longitude?: number;
}

export interface CulturalBackground {
  languages: string[];
  religion?: string;
  foodPreferences: FoodPreference[];
  festivals: string[];
  customIdentifiers: string[];
}

export enum FoodPreference {
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  HALAL = 'halal',
  KOSHER = 'kosher',
  REGIONAL_CUISINE = 'regional_cuisine',
  ORGANIC = 'organic',
}

export enum EngagementLevel {
  CASUAL = 'casual',
  MODERATE = 'moderate',
  DEEP = 'deep',
}

/**
 * Resource types for cultural continuity
 */
export interface CulturalResource {
  id: string;
  name: string;
  category: ResourceCategory;
  description: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
  website?: string;
  email?: string;
  distance?: number; // in kilometers
  rating?: number; // 0-5
  reviewCount?: number;
  credibilityScore: number; // 0-100, based on verification
  source: ResourceSource;
  sourceUrl: string;
  tags: string[];
  hours?: BusinessHours;
  isVerified: boolean;
  lastUpdated: Date;
}

export enum ResourceCategory {
  CULTURAL_CLUB = 'cultural_club',
  MEETUP_GROUP = 'meetup_group',
  ASSOCIATION = 'association',
  RESTAURANT = 'restaurant',
  GROCERY_STORE = 'grocery_store',
  PLACE_OF_WORSHIP = 'place_of_worship',
  CULTURAL_CENTER = 'cultural_center',
  EVENT = 'event',
  LANGUAGE_CLASS = 'language_class',
}

export enum ResourceSource {
  GOOGLE_PLACES = 'google_places',
  EVENTBRITE = 'eventbrite',
  TICKETMASTER = 'ticketmaster',
  MEETUP = 'meetup',
  UNIVERSITY = 'university',
  DIRECTORY = 'directory',
  VERIFIED_LISTING = 'verified_listing',
}

export interface BusinessHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface ResourceSearchResult {
  communities: CulturalResource[];
  spaces: CulturalResource[];
  events: CulturalResource[];
  averageCredibilityScore: number;
  totalResultsFound: number;
  limitedResultsWarning?: string;
}

export interface SearchFilters {
  maxDistance?: number; // km
  minCredibilityScore?: number; // 0-100
  resourceTypes?: ResourceCategory[];
  sortBy?: 'distance' | 'rating' | 'credibility' | 'relevance';
}

export interface SuggestedRoutine {
  dayOfWeek: string;
  activities: RoutineActivity[];
  estimatedTimeRequirement: string;
}

export interface RoutineActivity {
  resourceName: string;
  type: string;
  description: string;
  recommendedFrequency: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

// Function 2: Cultural Landscape & Understanding Types

export interface CulturalCharacteristics {
  communicationStyle: 'direct' | 'indirect' | 'mixed';
  socialNorms: 'formal' | 'informal' | 'context-dependent';
  communityOrientation: 'collective' | 'individual' | 'balanced';
  decisionMaking: 'consensus' | 'hierarchical' | 'democratic';
  relationshipFirst: boolean;
}

export interface CulturalProfile {
  id: string;
  name: string; // e.g., "Indian", "East Asian", "Middle Eastern"
  icon: string; // emoji
  percentage: number; // estimated % in destination
  characteristics: CulturalCharacteristics;
  detailedProfile: {
    familyValues: string;
    academicApproach: string;
    socialInteraction: string;
    diningEtiquette: string;
    spirituality: string;
    workStyle: string;
    values: string;
  };
  campusExpression: {
    clubs: string[]; // names of orgs/clubs
    events: string[]; // types of events
    informaGroups: string[]; // informal gathering types
  };
  everydayPresence: {
    food: string[];
    spaces: string[]; // physical locations
    gatherings: string[];
  };
  sources: string[]; // where data comes from (verified/estimated)
}

export interface CulturalDifference {
  aspect: string; // e.g., "communication", "hierarchy", "socializing"
  userCulture: string;
  targetCulture: string;
  userApproach: string;
  targetApproach: string;
  implication: string; // how this might affect interactions
}

export interface CulturalComparison {
  userCulture: string;
  targetCulture: string;
  similarities: string[];
  differences: CulturalDifference[];
  commonMisunderstandings: {
    scenario: string;
    userExpectation: string;
    targetBehavior: string;
    resolution: string;
  }[];
}

export interface InteractionPoint {
  setting: string; // "group project", "dorm", "club meeting", etc.
  whereToFind: string[]; // specific locations/times
  culturalNorms: string; // what to expect
  dosDonts: {
    dos: string[];
    donts: string[];
  };
}

export interface EngagementPathway {
  culture: string;
  startingPoints: string[]; // entry events/clubs
  nextSteps: string[];
  deeperInvolvement: string[];
}

export interface IntegrationStrategy {
  culture: string;
  focusArea: 'clubs' | 'events' | 'food' | 'spaces';
  details: string;
  resourceHints: string[];
}

export interface CulturalLandscapeAnalysis {
  destination: Destination;
  userCulture: CulturalBackground;
  majorCultures: CulturalProfile[];
  comparisons: CulturalComparison[];
  interactionPoints: InteractionPoint[];
  engagementPathways: EngagementPathway[];
  integrationStrategies: IntegrationStrategy[];
  confidenceLevel: 'high' | 'medium' | 'low'; // based on data availability
}
