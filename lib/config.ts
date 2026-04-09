/**
 * Example Configuration for Advanced Usage
 * Customize the app with these settings
 */

// API Configuration
export const API_CONFIG = {
  // Increase timeout for slower connections
  timeout: 30000,

  // Google Places
  googlePlaces: {
    // Number of results per query
    resultsPerQuery: 10,
    // Search radius in meters
    radiusMeters: 5000,
  },

  // Eventbrite
  eventbrite: {
    // Days in the future to search for events
    daysAhead: 60,
    // Maximum results per search
    maxResults: 20,
  },

  // Meetup
  meetup: {
    // Search radius in km
    radiusKm: 10,
    // Only show groups with minimum members
    minMembers: 5,
  },
};

// Credibility Scoring Thresholds
export const CREDIBILITY_CONFIG = {
  // Minimum score to display resource
  minimumScore: 60,

  // Score ranges for color-coding
  colors: {
    high: { range: [80, 100], color: 'green' },
    medium: { range: [60, 79], color: 'yellow' },
    low: { range: [0, 59], color: 'orange' },
  },

  // Weight for different factors
  weights: {
    source: 0.2,
    completeness: 0.3,
    rating: 0.4,
    community: 0.1,
  },
};

// UI Configuration
export const UI_CONFIG = {
  // Results per page
  resultsPerPage: 12,

  // Maximum resources to show in a category
  maxResourcesPerCategory: 20,

  // Theme colors
  theme: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },

  // Animation speeds
  animations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
};

// Engagement Level Recommendations
export const ENGAGEMENT_CONFIG = {
  casual: {
    eventsPerMonth: 2,
    communityPerMonth: 1,
    hoursPerWeek: 3,
  },
  moderate: {
    eventsPerMonth: 4,
    communityPerMonth: 3,
    hoursPerWeek: 6,
  },
  deep: {
    eventsPerMonth: 8,
    communityPerMonth: 4,
    hoursPerWeek: 12,
  },
};

// Language & Localization
export const LOCALE_CONFIG = {
  default: 'en-US',
  supportedLanguages: ['en', 'es', 'fr', 'de', 'hi', 'zh', 'ja'],
};

// Feature Flags
export const FEATURES = {
  // Enable/disable features
  bookmarking: true,
  mapIntegration: true,
  shareResources: true,
  userProfiles: false, // Coming soon
  notifications: false, // Coming soon
  communityReviews: false, // Coming soon
};

export default {
  API_CONFIG,
  CREDIBILITY_CONFIG,
  UI_CONFIG,
  ENGAGEMENT_CONFIG,
  LOCALE_CONFIG,
  FEATURES,
};
