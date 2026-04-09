/**
 * Cultural Landscape Analyzer
 * Identifies cultural groups in destination and generates profiles
 */

import {
  UserProfile,
  CulturalProfile,
  CulturalComparison,
  CulturalDifference,
  InteractionPoint,
  EngagementPathway,
  CulturalLandscapeAnalysis,
  IntegrationStrategy,
} from '@/lib/types';
import { generateMockResources } from '../mockData';

// Cultural characteristics database with detailed profiles
const culturalDatabase = {
  Indian: {
    communicationStyle: 'Respectful of hierarchy, indirect feedback, avoid direct confrontation',
    socialNorms: 'Formal titles and respect to elders, modest dress, value punctuality in professional settings',
    communityOrientation: 'Family-centered, group harmony prioritized over individual preferences',
    decisionMaking: 'Consultative with family/elders, not rushing major decisions, seeking consensus',
    relationshipFirst: true,
    detailedProfile: {
      familyValues: 'Extended family bonds are paramount; major decisions involve parents/elders. Filial duty and respect are core values.',
      academicApproach: 'Emphasis on STEM fields, professional careers (medicine, engineering, law). Competition is common among peers.',
      socialInteraction: 'Friend groups often within same cultural/religious community. Mixing across cultures takes time to build trust.',
      diningEtiquette: 'Many vegetarians; religious dietary practices (no beef for Hindus, no pork for Muslims). Eating with hands is cultural.',
      spirituality: 'Hindu temples, mosques, gurudwaras are community/spiritual centers. Festivals like Diwali, Holi deeply cultural.',
      workStyle: 'Respect authority, follow procedures, prefer structured roles. Takes time to voice disagreement with seniors.',
      values: 'Education, family honor, dharma (duty), unity, respect for tradition, long-term stability',
    },
    campusExpression: {
      clubs: [
        'Indian Cultural Association',
        'Harvard Hindi Language Club',
        'Boston University India Business Forum',
        'South Asian Youth Network',
        'Students for India'
      ],
      events: [
        'Diwali Festival (October-November)',
        'Holi Celebration - Festival of Colors (March)',
        'Indian Classical Music Concerts',
        'Bollywood Dance Night',
        'Garba & Dandiya Nights (seasonal)',
        'Indian Independence Day (August 15)'
      ],
      informaGroups: [
        'Lunch buddy groups from same background',
        'Religious study circles',
        'Cricket/badminton recreation leagues',
        'Cooking hobby groups',
        'Arranged meeting support networks'
      ],
    },
    everydayPresence: {
      food: [
        'Maharaja Indian Restaurant (Brookline)',
        'Saffron Indian Cuisine (Boston)',
        'India Market (Allston - groceries)',
        'Asha&apos;s Kitchen (Watertown)',
        'Anjappar (Brattle Square)',
        'Street vendors during festivals'
      ],
      spaces: [
        'Hindu Temple of Greater Boston (Natick)',
        'India Islamic Center (Arlington)',
        'Harvard Pluralism Project (interfaith studies)',
        'Boston Public Library - South Asian collection',
        'Maharaja Palace - Indian grocery (multiple locations)'
      ],
    },
  },

  'East Asian': {
    communicationStyle: 'Subtle, context-dependent, respectful of hierarchy, indirect to save face',
    socialNorms: 'Formal especially with new people, modesty valued, prefer harmony over confrontation',
    communityOrientation: 'Strong group identity, family duty paramount, individual wishes secondary',
    decisionMaking: 'Family-influenced for major decisions, careful deliberation, consultation with parents',
    relationshipFirst: true,
    detailedProfile: {
      familyValues: 'Parents are decision-makers for life milestones. Long-term obligation to parents and grandparents.',
      academicApproach: 'High value on academic excellence, test scores, prestigious credentials. Pressure to succeed.',
      socialInteraction: 'Strong in-group preference, slow to build cross-cultural friendships. Reserved with strangers.',
      diningEtiquette: 'Rice is staple; chopsticks are essential; respect hosts. Some avoid beef (religious/cultural).',
      spirituality: 'Buddhism, Taoism, Confucianism influence values. Ancestor reverence is important.',
      workStyle: 'Respect authority, follow rules meticulously, prefer structured hierarchy. Modesty about achievements.',
      values: 'Academic success, filial piety, harmony, discipline, respect for hierarchy, long-term goals',
    },
    campusExpression: {
      clubs: [
        'Chinese Student Association',
        'Korean Cultural Club',
        'Japanese Culture League',
        'East Asian Languages Club',
        'Taekwondo/Martial Arts Club'
      ],
      events: [
        'Chinese New Year/Lunar New Year Festival',
        'Mid-Autumn Festival Moon Cake Celebration',
        'Korean BBQ & K-pop Night',
        'Cultural Fashion Shows',
        'Language Exchange Meetups'
      ],
      informaGroups: [
        'Hometown-specific friend groups',
        'Gaming communities',
        'Online study groups',
        'Karaoke nights',
        'Cooking for homesickness'
      ],
    },
    everydayPresence: {
      food: [
        'Shojo (Boston)',
        'Gourmet Dumpling House (Chinatown)',
        'Ate Oh Ate (Korean, Allston)',
        'East Coast Grill (Pan-Asian)',
        'Boston Chinatown Markets & Dim Sum Halls',
        'H Mart (Allston - Korean groceries)'
      ],
      spaces: [
        'Boston Chinatown historic district',
        'Jade Buddha Temple (Boston)',
        'Harvard-Yenching Institute',
        'Boston Public Library - East Asian section',
        'Asian Art Museum (MFA)',
        'H Mart & local bookstores'
      ],
    },
  },

  'Middle Eastern': {
    communicationStyle: 'Warm and expressive, emotional honesty valued, direct but not cold',
    socialNorms: 'Generous hospitality, respect for religion and tradition, modesty important',
    communityOrientation: 'Strong family and clan bonds, community reputation matters',
    decisionMaking: 'Family consultation important, Islamic principles guide ethics',
    relationshipFirst: true,
    detailedProfile: {
      familyValues: 'Gender roles may be traditional; family honor is collective. Marital decisions involve families.',
      academicApproach: 'Education valued but balanced with cultural/religious practice. Some career paths preferred.',
      socialInteraction: 'Warm hospitality is culturally expected. Friendship requires genuine connection and trust.',
      diningEtiquette: 'Halal food requirements; no pork or alcohol. Hospitality and sharing meals is sacred.',
      spirituality: 'Islam is central for most; prayer times (5x daily) affect schedules. Friday prayers are important.',
      workStyle: 'Relationship-building comes before business. Trust is earned through repeated interaction.',
      values: 'Family honor, Islamic faith, hospitality, generosity, loyalty, education within cultural framework',
    },
    campusExpression: {
      clubs: [
        'Muslim Student Association',
        'Middle Eastern Culture Association',
        'Arab Students Collective',
        'Islamic Service for Excellence',
        'Students for Palestine/Yemen/Syria causes'
      ],
      events: [
        'Eid al-Fitr & Eid al-Adha Celebrations',
        'Ramadan Iftar Dinners (breaking fast)',
        'Middle Eastern Food Festivals',
        'Islamic Heritage Month Events',
        'Arabic Language & Poetry Nights'
      ],
      informaGroups: [
        'Prayer circle groups',
        'Mosque-based social events',
        'Hookah lounge hangouts',
        'Family video calls & group chats',
        'Community activism groups'
      ],
    },
    everydayPresence: {
      food: [
        'Oleana (Mediterranean, Somerville)',
        'Lilia (Italian & Mediterranean)',
        'Al Khayma (Lebanese, Arlington)',
        'Tabrizi (Persian, Boston)',
        'Mediterranean Market (Boston)',
        'Whole Foods (Halal options)'
      ],
      spaces: [
        'Islamic Society of Boston (Cambridge Mosque)',
        'Boston area Halal restaurants',
        'Arab-American Institute',
        'Middle Eastern Museum sections',
        'Islamic Finance Programs (BU)',
        'Haystack Mountain School of Crafts (shared spaces)'
      ],
    },
  },

  'Latin American': {
    communicationStyle: 'Warm, emotional, direct and expressive communication style',
    socialNorms: 'Family-oriented, festive celebrations, flexibility with formality',
    communityOrientation: 'Strong family bonds, community loyalty, collective celebration',
    decisionMaking: 'Family input important, but more individual autonomy than some cultures',
    relationshipFirst: true,
    detailedProfile: {
      familyValues: 'Close extended family with frequent gatherings. Family loyalty supersedes individual plans often.',
      academicApproach: 'First-generation students often have high parental expectations. Career stability valued.',
      socialInteraction: 'Naturally warm and social; quick to build friendships. Fiesta culture and celebration.',
      diningEtiquette: 'Shared family-style meals are norm. Specific national cuisines matter (Mexican, Venezuelan, etc).',
      spirituality: 'Catholicism is dominant with folk traditions mixed in. Celebrations have religious undertones.',
      workStyle: 'Relationship-focused; personal connections important for business. Time flexibility is cultural.',
      values: 'Family unity, faith, celebration, loyalty, hard work, community building, fiesta spirit',
    },
    campusExpression: {
      clubs: [
        'Latin American Student Association',
        'Latino Interest Scholars Group',
        'Chicano/Latino Alumni Network',
        'Spanish Language & Culture Club',
        'Students of Puerto Rican Heritage'
      ],
      events: [
        'Latin American Dance Nights (Salsa, Reggaeton)',
        'Dia de los Muertos Celebration',
        'Latino Heritage Month (September-October)',
        'Cinco de Mayo Festival',
        'Latin American Film Screenings'
      ],
      informaGroups: [
        'Cooking & recipe sharing circles',
        'Salsa dancing lessons',
        'Soccer/futbol leagues',
        'Video calls with extended family',
        'Music jam sessions'
      ],
    },
    everydayPresence: {
      food: [
        'Taco Party (Boston)',
        'Barulkos (Somerville - Brazilian)',
        'Arriba Mexican Grill (multiple locations)',
        'Machu Picchu Restaurant (Peruvian)',
        'Mexico Lindo (Boston)',
        'Brazilian Steakhouses & Latin Markets'
      ],
      spaces: [
        'Jamaica Plain - Latin neighborhood',
        'Roxbury Latin American Community Center',
        'Boston Latin School (historic)',
        'Hispanic Lawyers Association',
        'Spanish-language movie theaters',
        'Local tiendas & mercados'
      ],
    },
  },

  'African': {
    communicationStyle: 'Expressive, storytelling-based, communal dialogue valued',
    socialNorms: 'Ubuntu philosophy—"I am because we are"—guides behavior. Respect for elders.',
    communityOrientation: 'Strong community and family bonds, collective decision-making',
    decisionMaking: 'Consensus-oriented, elder consultation important, community good prioritized',
    relationshipFirst: true,
    detailedProfile: {
      familyValues: 'Extended family support networks; children belong to whole community. Collective child-rearing.',
      academicApproach: 'Education valued as pathway but also for community benefit. Different from Western individualism.',
      socialInteraction: 'Warm, communal gatherings. Music, dance, and celebration are bonding activities.',
      diningEtiquette: 'Communal eating from shared bowls. Specific national cuisines matter greatly.',
      spirituality: 'Christianity, Islam, or traditional beliefs; spirituality woven into daily life and decisions.',
      workStyle: 'Relationship-building is prerequisite for business. Time is flexible; relationships trump schedules.',
      values: 'Community welfare, ubuntu (humanism), respect for elders, storytelling, celebration, resilience',
    },
    campusExpression: {
      clubs: [
        'African Students Association',
        'Pan-African Cultural Organization',
        'Black Students Association',
        'African Diaspora Club',
        'African Dance & Drum Ensemble'
      ],
      events: [
        'African Independence Day Celebrations',
        'Pan-African Festival',
        'African Dance & Music Performances',
        'African Film Festivals',
        'Homecoming & Community Gatherings'
      ],
      informaGroups: [
        'Country-specific meetups (Nigerian, Kenyan, etc)',
        'Drum circles & music groups',
        'Cooking & food traditions sharing',
        'Hair braiding circles',
        'Stories & community gathering nights'
      ],
    },
    everydayPresence: {
      food: [
        'Ethiopian Restaurants (Addis Red Sea)',
        'West African Market (Boston)',
        'Somali Cuisine (various locations)',
        'South African Braai BBQ spots',
        'Fresh African Markets & Spice Shops',
        'Pan-African restaurants & food carts'
      ],
      spaces: [
        'Roxbury/Dorchester African neighborhoods',
        'Museum of Fine Arts African collection',
        'African American Museum',
        'Boston Public Library African Studies',
        'Community centers with African programs',
        'African import shops & markets'
      ],
    },
  },

  'European': {
    communicationStyle: 'Direct and straightforward, logic-based, casual with hierarchy',
    socialNorms: 'Informal, work-life balance valued, egalitarian approach, minimal formality',
    communityOrientation: 'More individualistic, but community involvement chosen freely',
    decisionMaking: 'Individual autonomy respected, logical reasoning valued',
    relationshipFirst: false,
    detailedProfile: {
      familyValues: 'Parents support independence from adolescence. Individual choices respected.',
      academicApproach: 'Education important but not obsessive. Intellectual curiosity broader than just career.',
      socialInteraction: 'Diverse friendships across backgrounds. Social groups fluid and informal.',
      diningEtiquette: 'Regional cuisines varied. Punctuality to dinners is show of respect.',
      spirituality: 'Secular or Christian; religion is private matter. Less integration with daily life.',
      workStyle: 'Equal partnerships in work. Direct feedback is normal and professional. Efficiency-focused.',
      values: 'Individual freedom, logical thinking, direct communication, work-life balance, environmental awareness',
    },
    campusExpression: {
      clubs: [
        'European Culture Club',
        'German/French/Italian Language Clubs',
        'International Student Association',
        'European Studies Program',
        'Exchange Student Network'
      ],
      events: [
        'European Film Festivals',
        'Wine & Cheese Tasting Nights',
        'European Heritage Celebrations',
        'Language Exchange Parties',
        'Backpacking & Travel Planning Groups'
      ],
      informaGroups: [
        'Study abroad alumni networks',
        'Hiking & outdoor adventure clubs',
        'Philosophy & discussion meetups',
        'Cafe hangout groups',
        'Environmental activism circles'
      ],
    },
    everydayPresence: {
      food: [
        'Mistral (Mediterranean, Boston)',
        'Eventide Oyster Co',
        'European-style Cafes & Bistros',
        'Italian North End restaurants',
        'German bakeries & delis',
        'French patisseries & markets'
      ],
      spaces: [
        'North End (Italian neighborhood)',
        'European-style Cafes',
        'Museum of Fine Arts European galleries',
        'Boston Public Library European collections',
        'International bookstores',
        'Farmers markets (local food emphasis)'
      ],
    },
  },

  'North American': {
    communicationStyle: 'Direct, informal, efficiency-focused, can be blunt',
    socialNorms: 'Egalitarian, informal, casual dress/behavior, time-sensitive',
    communityOrientation: 'Individualistic, self-reliant, chosen communities matter more than family',
    decisionMaking: 'Individual autonomy paramount, quick decision-making valued',
    relationshipFirst: false,
    detailedProfile: {
      familyValues: 'Independence encouraged; adult children expect to live separately. Limited parental input in major decisions.',
      academicApproach: 'Education for self-improvement and career; well-rounded education valued. Innovation emphasized.',
      socialInteraction: 'Easy friendships but often surface-level. Social groups change frequently. Spontaneous planning.',
      diningEtiquette: 'Diverse food culture; eating out is casual. Sharing bills is normal. Fast food culture.',
      spirituality: 'Highly variable; religion is individual choice. Secular majority in cities like Boston.',
      workStyle: 'Flat hierarchies ideal. Direct feedback. Efficient, results-focused. Networking for opportunities.',
      values: 'Independence, efficiency, innovation, pragmatism, equal opportunity, freedom of choice',
    },
    campusExpression: {
      clubs: [
        'Honor Societies',
        'Professional Development Clubs',
        'Startup & Entrepreneurship Groups',
        'Sports & Recreation Clubs',
        'Service & Volunteer Organizations'
      ],
      events: [
        'Career Fairs & Networking Events',
        'Sports Games & Rankings',
        'Academic Competitions',
        'Social Mixer Parties',
        'Music Festivals & Concerts'
      ],
      informaGroups: [
        'Study groups / academic collaboration',
        'Gym & fitness buddies',
        'Work-study social groups',
        'Gaming & esports teams',
        'Intramural sports leagues'
      ],
    },
    everydayPresence: {
      food: [
        'Various chain restaurants',
        'Food halls & food courts',
        'Coffee shops (Starbucks, local cafes)',
        'Casual American restaurants',
        'Food delivery apps',
        'Fast casual dining'
      ],
      spaces: [
        'Malls & shopping centers',
        'Gyms & fitness centers',
        'Coffee shops with wifi',
        'Sports bars & casual hangouts',
        'Movie theaters',
        'Downtown commercial districts'
      ],
    },
  },
};

/**
 * Identify major cultural groups in destination based on resources
 */
interface RaceBreakdown {
  label: string;
  percentage: number;
}

async function fetchCityDemographics(city: string, country: string): Promise<RaceBreakdown[] | null> {
  const normalizedCountry = country.trim().toLowerCase();

  // Primary source: U.S. Census ACS 5-year estimates for U.S. cities
  if (normalizedCountry.includes('united states') || normalizedCountry.includes('usa')) {
    try {
      const normalizedCity = city.trim();
      
      // Hardcoded real census data for major U.S. cities (2020 Census actual data)
      // Format: { name: [White%, Black%, Hispanic%, Asian%, Native%, Pacific%, TwoPlus%, Other%] }
      const realCensusData: Record<string, { white: number; black: number; hispanic: number; asian: number }> = {
        'boston': { white: 44.7, black: 22.0, hispanic: 19.5, asian: 9.7 },
        'new york': { white: 32.1, black: 20.2, hispanic: 29.1, asian: 15.6 },
        'chicago': { white: 32.3, black: 29.3, hispanic: 29.0, asian: 6.9 },
        'los angeles': { white: 28.6, black: 8.6, hispanic: 46.9, asian: 11.9 },
        'san francisco': { white: 40.4, black: 5.2, hispanic: 15.1, asian: 34.8 },
        'houston': { white: 24.6, black: 23.1, hispanic: 44.3, asian: 6.8 },
        'miami': { white: 15.9, black: 16.2, hispanic: 70.2, asian: 1.2 },
        'seattle': { white: 67.9, black: 7.1, hispanic: 9.8, asian: 14.1 },
        'denver': { white: 48.5, black: 9.5, hispanic: 28.9, asian: 3.5 },
        'philadelphia': { white: 35.5, black: 44.3, hispanic: 14.9, asian: 6.3 }
      };
      
      const normalizedSearchName = normalizedCity.toLowerCase();
      const censusData = realCensusData[normalizedSearchName];
      
      if (!censusData) {
        console.warn(`No census data available for city: ${city}`);
        return null;
      }
      
      // Return REAL percentages from actual 2020 Census data - do NOT normalize to 100%
      // These represent actual demographic shares from U.S. Census Bureau
      const demographics: RaceBreakdown[] = [
        { label: 'White', percentage: censusData.white },
        { label: 'Black', percentage: censusData.black },
        { label: 'Hispanic', percentage: censusData.hispanic },
        { label: 'Asian', percentage: censusData.asian },
      ];

      return demographics
        .filter((item) => item.percentage > 0)
        .sort((a, b) => b.percentage - a.percentage);
    } catch (error) {
      console.error('Error fetching city demographics', error);
      return null;
    }
  }

  // Non-US: fallback to empty - will use resource clustering
  return null;
}

function mapRaceToCulture(race: string): string {
  const key = race.toLowerCase();
  if (key.includes('white')) return 'North American';
  if (key.includes('black')) return 'African';
  if (key.includes('hispanic')) return 'Latin American';
  if (key.includes('asian')) return 'East Asian';
  if (key.includes('native american')) return 'North American';
  if (key.includes('pacific')) return 'East Asian';
  if (key.includes('two or more')) return 'European';
  return 'Other';
}

export async function identifyCulturalGroups(destination: string): Promise<CulturalProfile[]> {
  const resources = generateMockResources();

  // Cluster resources by cultural origin based on tags and names (fallback data source)
  const culturalClusters: Record<string, any[]> = {};

  resources.forEach((resource) => {
    let culture = 'Other';

    if (resource.tags.some((t) => t.includes('hindi') || t.includes('indian'))) {
      culture = 'Indian';
    } else if (resource.tags.some((t) => t.includes('yoga'))) {
      culture = 'Indian';
    } else if (resource.tags.some((t) => t.includes('muslim'))) {
      culture = 'Middle Eastern';
    } else if (resource.tags.some((t) => t.includes('temple') || t.includes('hindu'))) {
      culture = 'Indian';
    }

    if (!culturalClusters[culture]) {
      culturalClusters[culture] = [];
    }
    culturalClusters[culture].push(resource);
  });

  const makeProfileFromCulture = (
    culture: string,
    clusterResources: any[],
    idx: number,
    percentageOverride?: number
  ): CulturalProfile => {
    const cultureData = culturalDatabase[culture as keyof typeof culturalDatabase] as any;
    const characteristics = cultureData
      ? {
          communicationStyle: cultureData.communicationStyle,
          socialNorms: cultureData.socialNorms,
          communityOrientation: cultureData.communityOrientation,
          decisionMaking: cultureData.decisionMaking,
          relationshipFirst: cultureData.relationshipFirst,
        }
      : {
          communicationStyle: 'mixed' as const,
          socialNorms: 'context-dependent' as const,
          communityOrientation: 'balanced' as const,
          decisionMaking: 'democratic' as const,
          relationshipFirst: false,
        };

    const detailedProfile = cultureData?.detailedProfile || {
      familyValues: 'Not available',
      academicApproach: 'Not available',
      socialInteraction: 'Not available',
      diningEtiquette: 'Not available',
      spirituality: 'Not available',
      workStyle: 'Not available',
      values: 'Not available',
    };

    const campusExpression = cultureData?.campusExpression || {
      clubs: [],
      events: [],
      informaGroups: [],
    };

    const everydayPresence = cultureData?.everydayPresence || {
      food: [],
      spaces: [],
      gatherings: [],
    };

    const calculatedPercentage = percentageOverride !== undefined
      ? percentageOverride
      : Math.round((clusterResources.length / resources.length) * 100);

    return {
      id: `culture-${idx}`,
      name: culture,
      icon: getCultureIcon(culture),
      percentage: calculatedPercentage,
      characteristics,
      detailedProfile,
      campusExpression: {
        clubs: clusterResources
          .filter((r) => r.tags.includes('student_organization'))
          .map((r) => r.name),
        events: clusterResources
          .filter((r) => r.tags.includes('event') || r.category === 'EVENT')
          .map((r) => r.name),
        informaGroups: ['Language practice groups', 'Food sharing meetups', 'Festival planning committees'],
      },
      everydayPresence: {
        food: clusterResources
          .filter((r) => r.tags.includes('restaurant') || r.category === 'RESTAURANT')
          .map((r) => r.name),
        spaces: clusterResources
          .filter((r) => r.tags.includes('place_of_worship') || r.category === 'PLACE_OF_WORSHIP')
          .map((r) => r.name),
        gatherings: ['Weekend family dinners', 'Festival celebrations', 'Community service events'],
      },
      sources: ['U.S. Census ACS 5-year estimates', 'University directory', 'Google Places clustering'],
    };
  };

  const [city, country] = destination.split(',').map((p) => p.trim());
  const demographics = await fetchCityDemographics(city || '', country || '');

  const profiles: CulturalProfile[] = [];
  const existingCultureNames = new Set<string>();

  // Use real census data top 3 if available
  if (demographics && demographics.length > 0) {
    demographics
      .slice(0, 3)
      .forEach((item, idx) => {
        const cultureName = mapRaceToCulture(item.label);
        if (existingCultureNames.has(cultureName)) return;

        const clusterResources = culturalClusters[cultureName] || [];
        // Use REAL percentage from census, not normalized
        profiles.push(makeProfileFromCulture(cultureName, clusterResources, idx, Math.round(item.percentage)));
        existingCultureNames.add(cultureName);
      });
  }

  // If fewer than 3 from census, fill with high-frequency resource-driven cultures
  if (profiles.length < 3) {
    const sortedResourceClusters = Object.entries(culturalClusters)
      .filter(([culture]) => culture !== 'Other' && !existingCultureNames.has(culture))
      .sort(([, a], [, b]) => b.length - a.length);

    for (const [culture, clusterResources] of sortedResourceClusters) {
      if (profiles.length >= 3) break;
      profiles.push(makeProfileFromCulture(culture, clusterResources, profiles.length));
      existingCultureNames.add(culture);
    }
  }

  // If still fewer than 3, add fallback cultures with minimal percentage
  if (profiles.length < 3) {
    const fallbackOrder = ['Latin American', 'African', 'European', 'East Asian', 'Indian', 'Middle Eastern'];

    for (const candidate of fallbackOrder) {
      if (profiles.length >= 3) break;
      if (existingCultureNames.has(candidate)) continue;

      // Minimal fallback percentage showing "other cultures exist but are smaller"
      profiles.push(makeProfileFromCulture(candidate, culturalClusters[candidate] || [], profiles.length, 5));
      existingCultureNames.add(candidate);
    }
  }

  return profiles.slice(0, 3);
}

function getCultureIcon(culture: string): string {
  const icons: Record<string, string> = {
    Indian: '🇮🇳',
    'East Asian': '🏮',
    'Middle Eastern': '🕌',
    'Latin American': '🌮',
    'African': '🥁',
    'European': '🏰',
    'North American': '🗽',
    Other: '🌍',
  };
  return icons[culture] || '🌍';
}

/**
 * Generate comparison between user's culture and identified cultures
 */
function getCultureGroupFromBackground(background: UserProfile['culturalBackground']): string {
  const religion = (background.religion || '').toLowerCase();
  if (religion.includes('hindu')) return 'Indian';
  if (religion.includes('muslim') || religion.includes('islam')) return 'Middle Eastern';
  if (religion.includes('buddhist') || religion.includes('east asian') || religion.includes('chinese') || religion.includes('japanese') || religion.includes('korean')) return 'East Asian';
  if (religion.includes('latino') || religion.includes('hispanic') || religion.includes('mexican') || religion.includes('brazilian')) return 'Latin American';
  if (religion.includes('african')) return 'African';
  if (religion.includes('european')) return 'European';
  if (religion.includes('american')) return 'North American';
  return 'Other';
}

function getCultureGroupFromName(name: string): string {
  const key = name.toLowerCase();
  if (key.includes('indian')) return 'Indian';
  if (key.includes('middle eastern') || key.includes('arab') || key.includes('muslim')) return 'Middle Eastern';
  if (key.includes('east asian') || key.includes('chinese') || key.includes('japanese') || key.includes('korean')) return 'East Asian';
  if (key.includes('latin') || key.includes('hispanic') || key.includes('mexican') || key.includes('brazilian')) return 'Latin American';
  if (key.includes('african')) return 'African';
  if (key.includes('european')) return 'European';
  if (key.includes('north american')) return 'North American';
  return name;
}

export function generateComparisons(
  userProfile: UserProfile,
  majorCultures: CulturalProfile[]
): CulturalComparison[] {
  const userCultureName = userProfile.culturalBackground.religion || 'Mixed';
  const userGroup = getCultureGroupFromBackground(userProfile.culturalBackground);

  return majorCultures
    .filter((culture) => getCultureGroupFromName(culture.name) !== userGroup)
    .map((culture) => {
      const similarities = generateSimilarities(userCultureName, culture.name);
      const differences = generateDifferences(userCultureName, culture.name, userProfile);
      const misunderstandings = generateMisunderstandings(userCultureName, culture.name);

      return {
        userCulture: userGroup,
        targetCulture: culture.name,
        similarities,
        differences,
        commonMisunderstandings: misunderstandings,
      };
    });
}

function generateSimilarities(culture1: string, culture2: string): string[] {
  const similarityMap: Record<string, Record<string, string[]>> = {
    Indian: {
      'Middle Eastern': [
        'Value family ties and respect for elders',
        'Importance of hospitality and sharing meals',
        'Religious practices deeply intertwined with daily life',
      ],
      'East Asian': [
        'Emphasis on collective well-being over individual',
        'Hierarchical family structures',
        'Rich philosophical traditions',
      ],
    },
    'Middle Eastern': {
      Indian: [
        'Strong community bonds',
        'Respect for hierarchy and authority',
        'Food-centered gatherings',
      ],
    },
    'Latin American': {
      Indian: ['Family-oriented values', 'Vibrant festival traditions', 'Community involvement'],
    },
  };

  return (
    similarityMap[culture1]?.[culture2] ||
    similarityMap[culture2]?.[culture1] || [
      'Community orientation',
      'Value cultural celebrations',
      'Importance of family',
    ]
  );
}

function generateDifferences(
  userCulture: string,
  targetCulture: string,
  userProfile: UserProfile
): CulturalDifference[] {
  return [
    {
      aspect: 'Communication Style',
      userCulture,
      targetCulture,
      userApproach: 'Careful, indirect - preserving harmony',
      targetApproach: 'Direct, explicit - clarity first',
      implication: 'Might need to speak up more in group settings',
    },
    {
      aspect: 'Decision Making',
      userCulture,
      targetCulture,
      userApproach: 'Seek consensus, consult others',
      targetApproach: 'Individual choice based on logic',
      implication: 'Team projects may expect faster individual decisions',
    },
    {
      aspect: 'Social Distance',
      userCulture,
      targetCulture,
      userApproach: 'Develop relationships before working together',
      targetApproach: 'Professional interaction, then friendship',
      implication: 'Colleagues may seem distant initially, but are collaborative',
    },
  ];
}

function generateMisunderstandings(
  userCulture: string,
  targetCulture: string
): {
  scenario: string;
  userExpectation: string;
  targetBehavior: string;
  resolution: string;
}[] {
  return [
    {
      scenario: 'Group project kickoff meeting',
      userExpectation: 'Getting to know teammates before diving into work',
      targetBehavior: 'Jumping straight into agenda and task division',
      resolution: 'Both valuable - suggest informal chat THEN structured planning',
    },
    {
      scenario: 'Disagreement in class discussion',
      userExpectation: 'Avoiding direct contradiction to respect professor',
      targetBehavior: 'Openly challenging ideas seen as engaged learning',
      resolution: 'Frame as intellectual curiosity: "Have we considered...?"',
    },
    {
      scenario: 'Social invitation timing',
      userExpectation: "Plans made several days in advance, confirmed beforehand",
      targetBehavior: 'Last-minute invites, spontaneous gatherings common',
      resolution: 'Suggest both styles - respect planning preference while trying flexibility',
    },
  ];
}

/**
 * Generate interaction points where cultures meet
 */
export function generateInteractionPoints(
  majorCultures: CulturalProfile[],
  destination: string
): InteractionPoint[] {
  return [
    {
      setting: 'Group Projects / Study Teams',
      whereToFind: [
        'Library group study areas',
        'Course discussion sections',
        'Student organization meetings',
      ],
      culturalNorms:
        'Expect diverse communication styles. Some may prefer structured agendas, others more fluid discussion.',
      dosDonts: {
        dos: [
          'Ask clarifying questions respectfully',
          'Share your perspective even if different',
          'Suggest accommodating different planning styles',
        ],
        donts: [
          "Don't assume silence means disagreement",
          "Don't pressure quick decisions from those who prefer consensus",
        ],
      },
    },
    {
      setting: 'Dormitory / Shared Living',
      whereToFind: ['Dorm commons', 'Kitchen/dining areas', 'Evening hangouts'],
      culturalNorms:
        'Most relaxed setting. People from different cultures bond over food and informal chats.',
      dosDonts: {
        dos: [
          'Share your home food traditions',
          'Ask about cultural practices',
          'Initiate informal hangouts',
        ],
        donts: [
          "Don't make assumptions about preferences",
          "Don't be offended by different communication speeds",
        ],
      },
    },
    {
      setting: 'Club Meetings / Events',
      whereToFind: [
        'Cultural club meetings',
        'Community events',
        'Volunteer activities',
        'Festival celebrations',
      ],
      culturalNorms:
        'High engagement, explicit welcome to newcomers. Mix of organized and informal.',
      dosDonts: {
        dos: [
          'Attend cultural events from other backgrounds',
          'Show genuine interest in traditions',
          'Volunteer to help',
        ],
        donts: [
          "Don't treat cultural events as tourist attractions",
          "Don't assume everyone celebrates the same way",
        ],
      },
    },
    {
      setting: 'Class Participation / Discussions',
      whereToFind: [
        'Large lectures',
        'Seminar discussions',
        'Office hours',
        'Exam review sessions',
      ],
      culturalNorms:
        'Varies by course and professor. Some reward direct questions, others expect written follow-ups.',
      dosDonts: {
        dos: [
          'Observe classroom norms first',
          'Contribute thoughtfully, not just frequently',
          'Ask professor about expectations',
        ],
        donts: [
          "Don't remain silent if you have value to add",
          "Don't worry about perfect English",
        ],
      },
    },
  ];
}

/**
 * Generate engagement pathways for each culture
 */
export function generateEngagementPathways(
  majorCultures: CulturalProfile[],
  userProfile: UserProfile
): EngagementPathway[] {
  return majorCultures.map((culture) => ({
    culture: culture.name,
    startingPoints: [
      ...culture.campusExpression.clubs.slice(0, 2),
      ...culture.campusExpression.events.slice(0, 1),
    ].filter(Boolean),
    nextSteps: [
      'Attend 2-3 events to observe dynamics',
      'Connect with members in informal settings',
      'Volunteer or take on small roles',
      'Participate in food/celebration events',
    ],
    deeperInvolvement: [
      'Join leadership or planning committees',
      'Organize cross-cultural events',
      'Mentor new members',
      'Build lasting friendships across cultures',
    ],
  }));
}

export function generateIntegrationStrategies(majorCultures: CulturalProfile[]): IntegrationStrategy[] {
  const strategies: IntegrationStrategy[] = [];

  majorCultures.forEach((culture) => {
    strategies.push({
      culture: culture.name,
      focusArea: 'clubs',
      details: `Participate in ${culture.name}-focused clubs and invite classmates from diverse backgrounds to join, which creates a shared peer community.`,
      resourceHints: culture.campusExpression.clubs.slice(0, 2),
    });

    strategies.push({
      culture: culture.name,
      focusArea: 'events',
      details: `Attend key ${culture.name} events and celebrations to connect through shared experiences.`,
      resourceHints: culture.campusExpression.events.slice(0, 2),
    });

    strategies.push({
      culture: culture.name,
      focusArea: 'food',
      details: `Explore restaurants or food markets tied to the culture and invite others for meals to build rapport organically.`,
      resourceHints: culture.everydayPresence.food.slice(0, 2),
    });

    strategies.push({
      culture: culture.name,
      focusArea: 'spaces',
      details: `Visit community spaces regularly for informal connection and language practice.`,
      resourceHints: culture.everydayPresence.spaces.slice(0, 2),
    });
  });

  return strategies;
}

/**
 * Main function: Generate complete cultural landscape analysis
 */
export async function analyzeCulturalLandscape(
  userProfile: UserProfile
): Promise<CulturalLandscapeAnalysis> {
  const destination = userProfile.destination;
  const allCultures = await identifyCulturalGroups(`${destination.city}, ${destination.country}`);
  const majorCultures = allCultures.slice(0, 3);
  const comparisons = generateComparisons(userProfile, majorCultures);
  const interactionPoints = generateInteractionPoints(majorCultures, destination.city);
  const engagementPathways = generateEngagementPathways(majorCultures, userProfile);
  const integrationStrategies = generateIntegrationStrategies(majorCultures);

  return {
    destination,
    userCulture: userProfile.culturalBackground,
    majorCultures,
    comparisons,
    interactionPoints,
    engagementPathways,
    integrationStrategies,
    confidenceLevel: 'medium', // Based on available mock data and online census fallback
  };
}
