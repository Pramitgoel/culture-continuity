/**
 * Cultural Understanding Tab Component
 * Displays cultural landscape, profiles, comparisons, and interaction guides
 */

'use client';

import React, { useState } from 'react';
import { CulturalLandscapeAnalysis, ResourceSearchResult, CulturalResource } from '@/lib/types';

interface CulturalUnderstandingProps {
  analysis: CulturalLandscapeAnalysis;
  results: ResourceSearchResult;
  hideHeader?: boolean;
}

function cultureMatchesResource(resource: CulturalResource, culture: string) {
  const normalized = culture.toLowerCase();
  const tags = resource.tags.map((t) => t.toLowerCase());

  // Only allow exact tag match or mapped synonym (not substring)
  if (tags.includes(normalized)) return true;

  const mapping: Record<string, string[]> = {
    'north american': ['american', 'usa', 'united states', 'canadian', 'north america'],
    african: ['african', 'nigerian', 'ethiopian', 'kenyan', 'ghanaian', 'south african'],
    'latin american': ['hispanic', 'latin american', 'latin', 'mexican', 'puerto rican', 'colombian', 'cuban'],
    'east asian': ['chinese', 'japanese', 'korean', 'vietnamese', 'taiwanese', 'asian', 'east asian'],
    indian: ['indian', 'hindi', 'south asian'],
    'south asian': ['south asian', 'indian', 'hindi', 'kathak', 'bollywood', 'bhangra', 'desi'],
    'middle eastern': ['arab', 'iranian', 'turkish', 'lebanese', 'syrian', 'muslim', 'middle eastern'],
    european: ['european', 'italian', 'french', 'german', 'spanish', 'greek'],
  };

  const keywords = mapping[normalized] || [];
  // Only allow if tag matches a mapped synonym exactly
  if (keywords.some((keyword) => tags.includes(keyword))) return true;

  // Also match if resource name or description contains a mapped keyword (for broader inclusion)
  if (keywords.some((keyword) => resource.name.toLowerCase().includes(keyword) || (resource.description || '').toLowerCase().includes(keyword))) return true;

  return false;
}

export function CulturalUnderstanding({ analysis, results, hideHeader }: CulturalUnderstandingProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'profiles' | 'comparisons' | 'integration'>('overview');
  const [selectedCulture, setSelectedCulture] = useState<string | null>(null);

  // Defensive: ensure spaces is always an array
  const safeSpaces: CulturalResource[] = Array.isArray(results.spaces) ? results.spaces : [];

  const dominantCultures = [...(analysis.majorCultures || [])]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3)
    .map((culture) => culture.name);

  type IntegrationIdea = {
    id: string;
    title: string;
    description: string;
    label: string;
  };

  function normalizeCultureKey(culture: string) {
    const value = culture.toLowerCase();

    if (value.includes('latin')) return 'latin american';
    if (value.includes('afric')) return 'african';
    if (value.includes('middle east') || value.includes('arab')) return 'middle eastern';
    if (value.includes('south asian')) return 'south asian';
    if (value.includes('india') || value.includes('hindi')) return 'indian';
    if (value.includes('east asian') || value.includes('chinese') || value.includes('korean') || value.includes('japanese')) return 'east asian';
    if (value.includes('north american') || value.includes('american')) return 'north american';
    if (value.includes('europe')) return 'european';

    return value;
  }

  const curatedDemoFallback: Record<string, IntegrationIdea[]> = {
    'north american': [
      {
        id: 'na-demo-1',
        title: 'Boston Public Market',
        description: 'Visit once to sample local produce, artisan foods, and everyday city food culture.',
        label: 'Drop-In Visit',
      },
      {
        id: 'na-demo-2',
        title: 'Freedom Trail Walking Tour',
        description: 'A public tour to understand local historical identity and civic traditions.',
        label: 'Attend Event',
      },
      {
        id: 'na-demo-3',
        title: 'Museum of Fine Arts, Boston',
        description: 'Explore American collections in one museum visit to pick up social and artistic context.',
        label: 'Museum Visit',
      },
      {
        id: 'na-demo-4',
        title: 'Quincy Market Food Hall',
        description: 'Try a meal and observe local dining patterns and street performance culture.',
        label: 'Try a Meal',
      },
    ],
    african: [
      {
        id: 'af-demo-1',
        title: 'Museum of Fine Arts African Art Collection',
        description: 'One museum visit focused on African art and history for respectful cultural understanding.',
        label: 'Museum Visit',
      },
      {
        id: 'af-demo-2',
        title: 'First Fridays at SoWa - African diaspora artist showcases',
        description: 'Attend a public neighborhood event featuring music, food, and local artists.',
        label: 'Attend Event',
      },
      {
        id: 'af-demo-3',
        title: 'Asmara Restaurant (Cambridge)',
        description: 'Try Eritrean/Ethiopian cuisine once and ask staff about shared East African food traditions.',
        label: 'Try a Meal',
      },
      {
        id: 'af-demo-4',
        title: 'Afrimerican Academy Open Afrobeats Class (Boston)',
        description: 'Join one beginner drop-in class to experience contemporary African movement culture.',
        label: 'Attend Event',
      },
    ],
    'latin american': [
      {
        id: 'la-demo-1',
        title: 'East Boston Latin Music & Community Festival',
        description: 'Attend one public festival event to experience music, food, and community traditions.',
        label: 'Attend Event',
      },
      {
        id: 'la-demo-2',
        title: 'Havana Club Bachata Basics (Cambridge)',
        description: 'Take a beginner bachata class before the social dance session.',
        label: 'Attend Event',
      },
      {
        id: 'la-demo-3',
        title: 'Viva Mi Arepa (Jamaica Plain)',
        description: 'Try Venezuelan arepas once for an easy introduction to everyday Latin American street-food culture.',
        label: 'Try a Meal',
      },
      {
        id: 'la-demo-4',
        title: 'Peabody Essex Museum - Latin American art exhibits',
        description: 'Visit a named museum exhibit to understand Latin visual storytelling and heritage themes.',
        label: 'Museum Visit',
      },
    ],
    indian: [
      {
        id: 'in-demo-1',
        title: 'Shanti Indian Cuisine (Dorchester)',
        description: 'Try regional Indian dishes in a well-known local restaurant to get a grounded introduction to everyday food traditions.',
        label: 'Try a Meal',
      },
      {
        id: 'in-demo-2',
        title: 'India Society of Worcester Public Diwali Program',
        description: 'Attend a large public cultural celebration with music, dance, and community programming.',
        label: 'Attend Event',
      },
      {
        id: 'in-demo-3',
        title: 'Museum of Fine Arts South Asian Collection',
        description: 'Use one museum visit to understand South Asian visual traditions, symbolism, and history.',
        label: 'Museum Visit',
      },
      {
        id: 'in-demo-4',
        title: 'Patel Brothers (Waltham)',
        description: 'Visit a dedicated Indian grocery to see ingredients, products, and everyday household staples.',
        label: 'Visit Market',
      },
    ],
    'south asian': [
      {
        id: 'sa-demo-1',
        title: 'Shanti Indian Cuisine (Dorchester)',
        description: 'Try regional South Asian dishes in a well-known local restaurant to get a grounded introduction to everyday food traditions.',
        label: 'Try a Meal',
      },
      {
        id: 'sa-demo-2',
        title: 'India Society of Worcester Public Diwali Program',
        description: 'Attend a large public cultural celebration with music, dance, and community programming.',
        label: 'Attend Event',
      },
      {
        id: 'sa-demo-3',
        title: 'Museum of Fine Arts South Asian Collection',
        description: 'Use one museum visit to understand South Asian visual traditions, symbolism, and history.',
        label: 'Museum Visit',
      },
      {
        id: 'sa-demo-4',
        title: 'Patel Brothers (Waltham)',
        description: 'Visit a dedicated South Asian grocery to see ingredients, products, and everyday household staples.',
        label: 'Visit Market',
      },
    ],
    'middle eastern': [
      {
        id: 'me-demo-1',
        title: 'Brookline Lunch - Middle Eastern Kitchen',
        description: 'Try Levantine and Eastern Mediterranean dishes in a local restaurant with recognizable regional staples.',
        label: 'Try a Meal',
      },
      {
        id: 'me-demo-2',
        title: 'Arab American Festival of Boston',
        description: 'Attend a public community festival featuring performance, food, and cultural programming.',
        label: 'Attend Event',
      },
      {
        id: 'me-demo-3',
        title: 'Harvard Art Museums Islamic Art Galleries',
        description: 'Visit a named museum collection to understand regional design, craft, and artistic heritage.',
        label: 'Museum Visit',
      },
      {
        id: 'me-demo-4',
        title: 'Sevan Bakery & Middle Eastern Market (Watertown)',
        description: 'Browse a specialty market for breads, pantry staples, and prepared foods common across the region.',
        label: 'Visit Market',
      },
    ],
  };

  function buildCultureSpecificFallback(culture: string): IntegrationIdea[] {
    const profile = analysis.majorCultures.find(
      (candidate) => candidate.name.toLowerCase() === culture.toLowerCase()
    );

    if (!profile) return [];

    const disallowedTerms = [
      'temple',
      'mosque',
      'church',
      'synagogue',
      'gurdwara',
      'gurudwara',
      'place of worship',
      'religious',
      'prayer',
      'club',
      'association',
      'society',
    ];

    const isAllowed = (text: string) => {
      const value = text.toLowerCase();
      return !disallowedTerms.some((term) => value.includes(term));
    };

    const fallback: IntegrationIdea[] = [];

    for (const eventName of profile.campusExpression.events || []) {
      if (!isAllowed(eventName)) continue;
      fallback.push({
        id: `${profile.id}-event-${fallback.length}`,
        title: eventName,
        description: `Join this public cultural event in ${analysis.destination.city} to experience ${profile.name} culture respectfully.`,
        label: 'Attend Event',
      });
      if (fallback.length >= 4) return fallback;
    }

    for (const foodSpot of profile.everydayPresence.food || []) {
      if (!isAllowed(foodSpot)) continue;
      fallback.push({
        id: `${profile.id}-food-${fallback.length}`,
        title: foodSpot,
        description: `Try this place once to explore authentic food traditions and everyday social culture.`,
        label: 'Try a Meal',
      });
      if (fallback.length >= 4) return fallback;
    }

    for (const space of profile.everydayPresence.spaces || []) {
      if (!isAllowed(space)) continue;
      const lowered = space.toLowerCase();
      const label =
        lowered.includes('museum') || lowered.includes('gallery') || lowered.includes('exhibit')
          ? 'Museum Visit'
          : 'Drop-In Visit';

      fallback.push({
        id: `${profile.id}-space-${fallback.length}`,
        title: space,
        description: `A beginner-friendly visit to connect with local ${profile.name} cultural presence.`,
        label,
      });
      if (fallback.length >= 4) return fallback;
    }

    return fallback;
  }

  function getIntegrationResources(culture: string) {
    const lowerCulture = normalizeCultureKey(culture);
    const allowedCategories = new Set(['event', 'restaurant', 'cultural_center', 'grocery_store']);

    const disallowedTerms = [
      'temple',
      'mosque',
      'church',
      'synagogue',
      'gurdwara',
      'gurudwara',
      'place of worship',
      'religious',
      'hindu',
      'islamic',
      'christian',
      'sikh',
      'jewish',
      'buddhist',
    ];

    const allCandidates = [...(results.events || []), ...safeSpaces];

    const filtered = allCandidates.filter((resource) => {
      if (!allowedCategories.has(resource.category)) return false;
      const combinedText = `${resource.name} ${resource.description || ''}`.toLowerCase();
      if (disallowedTerms.some((term) => combinedText.includes(term))) return false;

      if (lowerCulture === 'north american' && combinedText.includes('indian')) return false;

      return cultureMatchesResource(resource, culture);
    });

    const scoreByCategory: Record<string, number> = {
      event: 5,
      restaurant: 4,
      cultural_center: 3,
      grocery_store: 2,
    };

    const ranked = filtered.sort((a, b) => {
      const scoreA = (scoreByCategory[a.category] || 1) + (a.isVerified ? 1 : 0);
      const scoreB = (scoreByCategory[b.category] || 1) + (b.isVerified ? 1 : 0);
      return scoreB - scoreA;
    });

    const uniqueById = ranked.filter(
      (item, index, self) => index === self.findIndex((candidate) => candidate.id === item.id)
    );

    const mapped: IntegrationIdea[] = uniqueById.map((item) => ({
      id: item.id,
      title: item.name,
      description: item.description || `Try this activity in ${analysis.destination.city} to engage with ${formatCultureName(culture)} culture.`,
      label: getTryOnceLabel(item.category),
    }));

    const backupSpecific = allCandidates
      .filter((resource) => {
        if (!allowedCategories.has(resource.category)) return false;
        const text = `${resource.name} ${resource.description || ''}`.toLowerCase();
        if (disallowedTerms.some((term) => text.includes(term))) return false;
        return cultureMatchesResource(resource, culture);
      })
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .map((item) => ({
        id: `backup-${item.id}`,
        title: item.name,
        description: item.description || `Activity option in ${analysis.destination.city}.`,
        label: getTryOnceLabel(item.category),
      }));

    const combined = [...mapped];
    for (const item of backupSpecific) {
      if (combined.length >= 4) break;
      if (!combined.some((existing) => existing.title === item.title)) {
        combined.push(item);
      }
    }

    const curatedFallback = curatedDemoFallback[lowerCulture] || [];
    for (const item of curatedFallback) {
      if (combined.length >= 4) break;
      if (!combined.some((existing) => existing.title === item.title)) {
        combined.push(item);
      }
    }

    const profileFallback = buildCultureSpecificFallback(culture);
    for (const item of profileFallback) {
      if (combined.length >= 4) break;
      if (!combined.some((existing) => existing.title === item.title)) {
        combined.push(item);
      }
    }

    const specificCityFallback = allCandidates
      .filter((resource) => {
        if (!allowedCategories.has(resource.category)) return false;
        const text = `${resource.name} ${resource.description || ''}`.toLowerCase();
        if (disallowedTerms.some((term) => text.includes(term))) return false;
        return cultureMatchesResource(resource, culture);
      })
      .sort((a, b) => ((b.rating || 0) - (a.rating || 0)) || ((b.reviewCount || 0) - (a.reviewCount || 0)))
      .map((resource, idx) => ({
        id: `${lowerCulture}-specific-${resource.id}-${idx}`,
        title: resource.name,
        description:
          resource.description ||
          (resource.category === 'event'
            ? `Attend ${resource.name} in ${analysis.destination.city} for a concrete local cultural experience.`
            : resource.category === 'restaurant'
            ? `Try ${resource.name} in ${analysis.destination.city} to experience local food culture directly.`
            : resource.category === 'grocery_store'
            ? `Visit ${resource.name} in ${analysis.destination.city} to explore ingredients and everyday staples.`
            : `Visit ${resource.name} in ${analysis.destination.city} to connect with active local cultural spaces.`),
        label: getTryOnceLabel(resource.category),
      }));

    for (const item of specificCityFallback) {
      if (combined.length >= 4) break;
      if (!combined.some((existing) => existing.title === item.title)) {
        combined.push(item);
      }
    }

    // Final safety net: if culture labels differ between environments,
    // fill remaining slots with specific named city resources (never generic placeholders).
    const cityNamedFallback = allCandidates
      .filter((resource) => {
        if (!allowedCategories.has(resource.category)) return false;
        const text = `${resource.name} ${resource.description || ''}`.toLowerCase();
        return !disallowedTerms.some((term) => text.includes(term));
      })
      .sort((a, b) => ((b.rating || 0) - (a.rating || 0)) || ((b.reviewCount || 0) - (a.reviewCount || 0)))
      .map((resource, idx) => ({
        id: `${lowerCulture}-city-${resource.id}-${idx}`,
        title: resource.name,
        description:
          resource.description ||
          (resource.category === 'event'
            ? `Attend ${resource.name} in ${analysis.destination.city} for a concrete local cultural experience.`
            : resource.category === 'restaurant'
            ? `Try ${resource.name} in ${analysis.destination.city} to experience local food culture directly.`
            : resource.category === 'grocery_store'
            ? `Visit ${resource.name} in ${analysis.destination.city} to explore ingredients and everyday staples.`
            : `Visit ${resource.name} in ${analysis.destination.city} to connect with active local cultural spaces.`),
        label: getTryOnceLabel(resource.category),
      }));

    for (const item of cityNamedFallback) {
      if (combined.length >= 4) break;
      if (!combined.some((existing) => existing.title === item.title)) {
        combined.push(item);
      }
    }

    return combined.slice(0, 4);
  }

  function formatCultureName(culture: string) {
    return culture.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function getTryOnceLabel(category: string) {
    if (category === 'event') return 'Attend Event';
    if (category === 'restaurant') return 'Try a Meal';
    if (category === 'grocery_store') return 'Visit Market';
    if (category === 'cultural_center') return 'Visit Space';
    return 'Explore';
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      {!hideHeader && (
        <div className='bg-gradient-to-r from-primary to-secondary rounded-lg shadow-lg p-8 text-white'>
          <h2 className='text-3xl font-bold mb-3'>
            Cultural Landscape: {analysis.destination.city}
          </h2>
          <p className='text-white text-opacity-95 mb-4'>
            Understand the cultural groups present and how to meaningfully engage
          </p>
          <p className='text-sm text-white text-opacity-80'>

          </p>
        </div>
      )}

      {/* Tab Navigation */}
      <div role='tablist' aria-label='Cultural understanding tabs' className='flex gap-2 border-b-2 border-gray-300 overflow-x-auto bg-gray-50 rounded-t-lg p-2'>
        <button
          id='tab-overview'
          role='tab'
          aria-selected={activeTab === 'overview'}
          aria-controls='panel-overview'
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 font-semibold whitespace-nowrap rounded-t-md transition ${
            activeTab === 'overview'
              ? 'bg-white border-b-3 border-primary text-primary shadow-md'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('integration')}
          className={`px-4 py-3 font-semibold whitespace-nowrap rounded-t-md transition ${
            activeTab === 'integration'
              ? 'bg-white border-b-3 border-primary text-primary shadow-md'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Integration
        </button>
      </div>

      {/* Tab Content */}
      <div className='min-h-96 bg-white rounded-b-lg p-8'>
        {activeTab === 'overview' && (
          <OverviewTab analysis={analysis} onSelectCulture={setSelectedCulture} />
        )}

        {activeTab === 'profiles' && (
          <ProfilesTab analysis={analysis} selectedCulture={selectedCulture} />
        )}

        {activeTab === 'comparisons' && (
          <ComparisonsTab analysis={analysis} userCulture={analysis.userCulture} />
        )}

        {activeTab === 'integration' && (
          <div className='space-y-8'>
            {dominantCultures.map((culture) => {
              const resources = getIntegrationResources(culture);
              return (
                <div key={culture} className='bg-white border-2 border-amber-200 rounded-xl p-6'>
                  <h4 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2'>{formatCultureName(culture)}</h4>
                  <p className='text-sm text-amber-800 mb-4'>
                    Beginner-friendly activities you can join to experience this culture respectfully.
                  </p>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {resources.map((resource) => (
                        <div key={resource.id} className='bg-amber-50 rounded-lg border border-amber-200 shadow-sm p-4'>
                          <div className='flex items-start justify-between gap-3 mb-2'>
                            <div className='font-bold text-gray-900'>{resource.title}</div>
                            <span className='text-xs font-semibold px-2 py-1 rounded-full bg-white text-amber-800 border border-amber-300'>
                              {resource.label}
                            </span>
                          </div>
                          <div className='text-sm text-gray-700'>
                            {resource.description}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Overview Tab
function OverviewTab({
  analysis,
  onSelectCulture,
}: {
  analysis: CulturalLandscapeAnalysis;
  onSelectCulture: (culture: string) => void;
}) {
  return (
    <div className='space-y-8'>
      <div>
        <h3 className='text-2xl font-bold text-gray-900 mb-4'>
          Major Cultural Groups in {analysis.destination.city}
        </h3>
        <p className='text-gray-700 mb-6 leading-relaxed'>
          Based on student organizations, community resources, and events, these are the major
          cultural communities represented:
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {analysis.majorCultures.map((culture) => (
            <div
              key={culture.id}
              onClick={() => onSelectCulture(culture.name)}
              className='bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 border-2 border-gray-200 hover:border-primary hover:shadow-lg transition cursor-pointer'
            >
                {/* Removed emoji/icon for culture */}
              <h4 className='text-xl font-bold text-gray-900 mb-2'>{culture.name}</h4>
              <p className='text-3xl font-bold text-primary mb-3'>{culture.percentage}%</p>
              <p className='text-sm text-gray-700 mb-4'>
                Estimated presence based on cultural organizations and events
              </p>

              <div className='space-y-3'>
                {culture.campusExpression.clubs.length > 0 && (
                  <div>
                    <p className='text-xs font-bold text-gray-600 uppercase'>Key Organizations</p>
                    <p className='text-sm text-gray-800'>
                      {culture.campusExpression.clubs.slice(0, 2).join(', ')}
                    </p>
                  </div>
                )}

                {culture.everydayPresence.food.length > 0 && (
                  <div>
                    <p className='text-xs font-bold text-gray-600 uppercase'>Food Spaces</p>
                    <p className='text-sm text-gray-800'>
                      {culture.everydayPresence.food.slice(0, 1).join(', ')}
                    </p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => {
                  onSelectCulture(culture.name);
                  // Scroll to profiles tab or trigger navigation
                  const profilesBtn = document.querySelector('[data-tab="profiles"]');
                  if (profilesBtn) (profilesBtn as HTMLButtonElement).click();
                }}
                className='mt-4 w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-secondary transition'
              >
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// Profiles Tab
function ProfilesTab({
  analysis,
  selectedCulture,
}: {
  analysis: CulturalLandscapeAnalysis;
  selectedCulture: string | null;
}) {
  const culturesToShow = selectedCulture
    ? analysis.majorCultures.filter((c) => c.name === selectedCulture)
    : analysis.majorCultures;

  return (
    <div className='space-y-8'>
      <h3 className='text-2xl font-bold text-gray-900'>
        {selectedCulture ? `${selectedCulture} Culture Profile` : 'Cultural Profiles'}
      </h3>

      {culturesToShow.map((culture) => (
        <div key={culture.id} className='border-2 border-gray-200 rounded-lg p-8 space-y-6'>
          <div className='flex items-center gap-4 mb-4'>
            <span className='text-5xl'>{culture.icon}</span>
            <div>
              <h4 className='text-2xl font-bold text-gray-900'>{culture.name}</h4>
              <p className='text-gray-600'>{culture.percentage}% of visible community</p>
            </div>
          </div>

          {/* Core Characteristics - DETAILED */}
          <div className='bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-6 border-l-4 border-primary'>
            <h5 className='text-lg font-bold text-gray-900 mb-4'>🎯 Core Values & Approach</h5>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <p className='text-sm text-amber-800 font-bold uppercase mb-2'>Communication Style</p>
                <p className='text-gray-800 leading-relaxed'>{culture.characteristics.communicationStyle}</p>
              </div>
              <div>
                <p className='text-sm text-amber-800 font-bold uppercase mb-2'>Social Norms</p>
                <p className='text-gray-800 leading-relaxed'>{culture.characteristics.socialNorms}</p>
              </div>
              <div>
                <p className='text-sm text-amber-800 font-bold uppercase mb-2'>Community Orientation</p>
                <p className='text-gray-800 leading-relaxed'>{culture.characteristics.communityOrientation}</p>
              </div>
              <div>
                <p className='text-sm text-amber-800 font-bold uppercase mb-2'>Decision Making</p>
                <p className='text-gray-800 leading-relaxed'>{culture.characteristics.decisionMaking}</p>
              </div>
            </div>
          </div>

          {/* Detailed Life Aspects */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-red-50 rounded-lg p-5 border-l-4 border-red-500'>
              <h6 className='font-bold text-gray-900 mb-3'>❤️ Family & Values</h6>
              <p className='text-sm text-gray-800 leading-relaxed'>{culture.detailedProfile.familyValues}</p>
            </div>
            <div className='bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500'>
              <h6 className='font-bold text-gray-900 mb-3'>📚 Academic Approach</h6>
              <p className='text-sm text-gray-800 leading-relaxed'>{culture.detailedProfile.academicApproach}</p>
            </div>
            <div className='bg-green-50 rounded-lg p-5 border-l-4 border-green-500'>
              <h6 className='font-bold text-gray-900 mb-3'>👥 Social Interaction</h6>
              <p className='text-sm text-gray-800 leading-relaxed'>{culture.detailedProfile.socialInteraction}</p>
            </div>
            <div className='bg-yellow-50 rounded-lg p-5 border-l-4 border-secondary'>
              <h6 className='font-bold text-gray-900 mb-3'>🍽️ Dining & Food</h6>
              <p className='text-sm text-gray-800 leading-relaxed'>{culture.detailedProfile.diningEtiquette}</p>
            </div>
            <div className='bg-pink-50 rounded-lg p-5 border-l-4 border-pink-500'>
              <h6 className='font-bold text-gray-900 mb-3'>🙏 Spirituality & Beliefs</h6>
              <p className='text-sm text-gray-800 leading-relaxed'>{culture.detailedProfile.spirituality}</p>
            </div>
            <div className='bg-teal-50 rounded-lg p-5 border-l-4 border-teal-500'>
              <h6 className='font-bold text-gray-900 mb-3'>💼 Work & Collaboration</h6>
              <p className='text-sm text-gray-800 leading-relaxed'>{culture.detailedProfile.workStyle}</p>
            </div>
          </div>

          <div className='bg-amber-50 rounded-lg p-6 border-2 border-amber-200'>
            <h6 className='font-bold text-gray-900 mb-3'>⭐ Core Values Summary</h6>
            <p className='text-gray-800 font-semibold text-lg'>{culture.detailedProfile.values}</p>
          </div>


          <p className='text-xs text-gray-500 pt-4 border-t border-gray-200'>
            Data sourced from: {culture.sources.join(', ')}
          </p>
        </div>
      ))}
    </div>
  );
}

// Comparisons Tab
function ComparisonsTab({
  analysis,
  userCulture,
}: {
  analysis: CulturalLandscapeAnalysis;
  userCulture: any;
}) {
  const userCultureName = userCulture.religion || 'Your Culture';

  return (
    <div className='space-y-8'>
      <div>
        <h3 className='text-2xl font-bold text-gray-900 mb-4'>
          How {userCultureName} Compares to Campus Cultures
        </h3>
        <p className='text-gray-700 mb-6'>
          Understanding differences helps you navigate interactions more smoothly.
        </p>
      </div>

      {analysis.comparisons.map((comparison, idx) => (
        <div key={idx} className='border-2 border-amber-200 rounded-lg p-8 bg-amber-50'>
          <h4 className='text-xl font-bold text-gray-900 mb-6'>
            {comparison.userCulture} ↔️ {comparison.targetCulture}
          </h4>

          {/* Similarities */}
          <div className='mb-8'>
            <h5 className='text-lg font-bold text-green-700 mb-4'>✅ Similarities</h5>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {comparison.similarities.map((sim, i) => (
                <div key={i} className='bg-green-100 rounded-lg p-4 border-l-4 border-green-500'>
                  <p className='text-gray-800 font-semibold'>{sim}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Differences */}
          <div className='mb-8'>
            <h5 className='text-lg font-bold text-amber-800 mb-4'>📍 Key Differences</h5>
            <div className='space-y-4'>
              {comparison.differences.map((diff, i) => (
                <div key={i} className='bg-amber-100 rounded-lg p-6 border-l-4 border-primary'>
                  <p className='text-lg font-bold text-gray-900 mb-3'>{diff.aspect}</p>
                  <div className='grid grid-cols-2 gap-4 mb-4'>
                    <div>
                      <p className='text-sm text-gray-600 font-semibold'>Your Approach</p>
                      <p className='text-gray-800'>{diff.userApproach}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600 font-semibold'>{diff.targetCulture} Approach</p>
                      <p className='text-gray-800'>{diff.targetApproach}</p>
                    </div>
                  </div>
                  <p className='text-sm text-gray-700 italic border-t border-amber-300 pt-3'>
                    💡 {diff.implication}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}

// Integration Tab
function IntegrationTab({ analysis, results }: { analysis: CulturalLandscapeAnalysis; results: ResourceSearchResult }) {
  const resolveResources = (
    cultureName: string,
    items: CulturalResource[],
    allowedCategories?: string[]
  ) => {
    const idealMatches = items.filter((res) => {
      const categoryMatch = !allowedCategories || allowedCategories.includes(res.category);
      return categoryMatch && cultureMatchesResource(res, cultureName);
    });
    if (idealMatches.length > 0) return idealMatches;

    const secondaryMatches = items.filter((res) => {
      const categoryMatch = !allowedCategories || allowedCategories.includes(res.category);
      return (
        categoryMatch &&
        res.tags.some((tag) => tag.toLowerCase().includes(cultureName.toLowerCase()))
      );
    });
    return secondaryMatches;
  };

  return (
    <div className='space-y-8'>
      <div>
        <h3 className='text-2xl font-bold text-gray-900 mb-4'>🔗 Cultural Integration Guide</h3>
        <p className='text-gray-700 mb-6'>
          These suggestions repeat the structure of communities/places/events for each major culture in your destination.
          Use them as practical steps to connect with each culture’s local resources.
        </p>
      </div>

      {analysis.majorCultures.map((culture, idx) => {
        const allClubs = results?.communities || [];
        const allEvents = results?.events || [];
        const allSpaces = results?.spaces || [];

        const clubs = resolveResources(culture.name, allClubs, [
          'cultural_club',
          'meetup_group',
          'association',
          'language_class',
        ]);

        const events = resolveResources(culture.name, allEvents, ['event']);

        const food = resolveResources(culture.name, allSpaces, ['restaurant', 'grocery_store']);

        const spaces = resolveResources(culture.name, allSpaces, ['place_of_worship', 'cultural_center']);

        const noDataHint = `No resources found for ${culture.name}. Try broadening the search or checking nearby community listings for ${culture.name}.`;

        return (
          <div key={idx} className='border-2 border-gray-200 rounded-lg p-8 bg-white shadow-sm'>
            <h4 className='text-xl font-bold text-gray-900 mb-4'>
              {culture.icon} {culture.name} Integration (approx {culture.percentage}%)
            </h4>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-amber-50 rounded-lg p-4 border-l-4 border-primary'>
                <h5 className='text-lg font-semibold text-amber-800 mb-2'>👥 Communities & Organizations</h5>
                <ul className='list-disc list-inside text-sm text-gray-800 space-y-1'>
                  {clubs.length > 0
                    ? clubs.map((club) => <li key={club.id}>{club.name}</li>)
                    : <li>No club data; explore nearby student group listings.</li>}
                </ul>
              </div>

              <div className='bg-green-50 rounded-lg p-4 border-l-4 border-green-500'>
                <h5 className='text-lg font-semibold text-green-700 mb-2'>🎉 Events & Celebrations</h5>
                <ul className='list-disc list-inside text-sm text-gray-800 space-y-1'>
                  {events.length > 0
                    ? events.map((event) => <li key={event.id}>{event.name}</li>)
                    : <li>No {culture.name} event data found; search festival calendars and campus cultural notices.</li>}
                </ul>
              </div>

              <div className='bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500'>
                <h5 className='text-lg font-semibold text-yellow-700 mb-2'>🍽️ Places to Eat & Shop</h5>
                <ul className='list-disc list-inside text-sm text-gray-800 space-y-1'>
                  {food.length > 0
                    ? food.map((f) => <li key={f.id}>{f.name}</li>)
                    : <li>No {culture.name} restaurants or markets found; look for regional eateries specific to this culture.</li>}
                </ul>
              </div>

              <div className='bg-yellow-50 rounded-lg p-4 border-l-4 border-secondary'>
                <h5 className='text-lg font-semibold text-amber-800 mb-2'>🏛️ Cultural Spaces</h5>
                <ul className='list-disc list-inside text-sm text-gray-800 space-y-1'>
                  {spaces.length > 0
                    ? spaces.map((spaceItem) => <li key={spaceItem.id}>{spaceItem.name}</li>)
                    : <li>No {culture.name} cultural spaces found; explore local heritage centers and community-service hubs.</li>}
                </ul>
              </div>
            </div>

            <div className='mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400'>
              <p className='text-sm text-gray-700'>
                This section now pulls data from your search results (communities/spaces/events), matching the major culture values from the first section.
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}


