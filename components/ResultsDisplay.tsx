/**
 * Results Display Component
 * Shows categorized cultural resources with detailed information
 */

'use client';

import React, { useState } from 'react';
import { CulturalResource, ResourceSearchResult, CulturalLandscapeAnalysis, SuggestedRoutine } from '@/lib/types';
import ResourceCard from './ResourceCard';

import { CulturalUnderstanding } from './CulturalUnderstanding';

interface ResultsDisplayProps {
  results: ResourceSearchResult;
  suggestedRoutines?: SuggestedRoutine[];
  culturalAnalysis?: CulturalLandscapeAnalysis | null;
  onBack?: () => void;
  mainSection?: 'preserve' | 'explore';
  showToggle?: boolean;
}

function cultureMatchesResource(resource: CulturalResource, culture: string) {
  const normalized = culture.toLowerCase();
  const tags = resource.tags.map((tag) => tag.toLowerCase());

  if (tags.includes(normalized)) return true;

  const mapping: Record<string, string[]> = {
    'north american': ['american', 'usa', 'united states', 'canadian', 'north america'],
    african: ['african', 'nigerian', 'ethiopian', 'kenyan', 'ghanaian', 'south african'],
    'latin american': ['hispanic', 'latin', 'mexican', 'puerto rican', 'colombian', 'cuban'],
    'east asian': ['chinese', 'japanese', 'korean', 'vietnamese', 'taiwanese', 'asian'],
    indian: ['indian', 'hindi', 'sanskrit', 'south asian'],
    'middle eastern': ['arab', 'iranian', 'turkish', 'lebanese', 'syrian', 'muslim'],
    european: ['european', 'italian', 'french', 'german', 'spanish', 'greek'],
  };

  const keywords = mapping[normalized] || [];
  return keywords.some((keyword) =>
    resource.name.toLowerCase().includes(keyword) || tags.some((tag) => tag.includes(keyword))
  );
}

import { useEffect } from 'react';

export function ResultsDisplay({ results, suggestedRoutines, culturalAnalysis, onBack, mainSection: mainSectionProp, showToggle }: ResultsDisplayProps) {
  const [mainSection, setMainSection] = useState<'preserve' | 'explore'>(mainSectionProp || 'preserve');

  // Sync mainSection with prop changes (for nav bar switching)
  useEffect(() => {
    if (mainSectionProp) setMainSection(mainSectionProp);
  }, [mainSectionProp]);
  const [activeTab, setActiveTab] = useState<'communities' | 'spaces' | 'events' | 'routine'>('communities');
  const [savedResources, setSavedResources] = useState<Set<string>>(new Set());

  const toggleSave = (resourceId: string) => {
    const updated = new Set(savedResources);
    if (updated.has(resourceId)) {
      updated.delete(resourceId);
    } else {
      updated.add(resourceId);
    }
    setSavedResources(updated);
  };

  // Helper to check if a URL is likely valid and openable
  function isValidUrl(url?: string) {
    if (!url) return false;
    try {
      const parsed = new URL(url.startsWith('http') ? url : 'https://' + url);
      // Only allow http(s) protocols
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  const renderResources = (resources: CulturalResource[], isSpaces = false) => {
    if (resources.length === 0) {
      return (
        <div className='text-center py-8 text-gray-500'>
          <p className='text-lg'>No resources found in this category.</p>
          <p className='text-sm'>Try adjusting your search criteria.</p>
        </div>
      );
    }

    // Enforce: max 10, max 2 temples, and variety for spaces
    let filtered = resources;
    // Only apply for spaces (not communities/events)
    if (isSpaces) {
      let temples = 0;
      const seenTypes = new Set();
      filtered = [];
      for (const r of resources) {
        const isTemple = (r.tags && (r.tags.includes('temple') || r.tags.includes('hindu_temple')));
        if (isTemple) {
          if (temples >= 2) continue;
          temples++;
        }
        // Try to maximize variety by type
        const mainType = (r.tags && r.tags.length > 0) ? r.tags[0] : r.category;
        if (seenTypes.has(mainType) && !isTemple) continue;
        seenTypes.add(mainType);
        filtered.push(r);
        if (filtered.length >= 10) break;
      }
      // If not enough, fill with next best regardless of type/temple
      if (filtered.length < 10) {
        for (const r of resources) {
          if (!filtered.includes(r)) {
            filtered.push(r);
            if (filtered.length >= 10) break;
          }
        }
      }
    } else {
      filtered = resources.slice(0, 10);
    }

    // Filter out resources with invalid or unreachable website URLs
    filtered = filtered.filter(r => !r.website || isValidUrl(r.website));

    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filtered.map((resource, idx) => (
          <ResourceCard
            key={resource.id + '-' + (resource.category || '') + '-' + idx}
            resource={resource}
            isSaved={savedResources.has(resource.id)}
            onSave={() => toggleSave(resource.id)}
          />
        ))}
      </div>
    );
  };

  // Add extra bottom padding so the button never touches the bottom
  return (
    <div className='space-y-6 pb-16'>
      {/* Header only for preserve mode */}
      {mainSection === 'preserve' && (
        <div className='bg-gradient-to-r from-primary to-secondary rounded-lg shadow-lg p-8 text-white border border-primary border-opacity-30'>
          <h2 className='text-4xl font-bold mb-3'>Your Cultural Resources</h2>
          <p className='text-white text-opacity-95 font-medium'>
            Found {results.totalResultsFound} verified resources in your location
          </p>
          {results.limitedResultsWarning && (
            <div className='mt-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded p-3'>
              <p className='text-sm'>⚠️ {results.limitedResultsWarning}</p>
            </div>
          )}
        </div>
      )}



      {/* Always show the banner at the top of Explore Local Cultures, never duplicated */}
      {mainSection === 'explore' && culturalAnalysis && (
        <div className='mb-4'>
          <div className='bg-gradient-to-r from-primary to-secondary rounded-lg shadow-lg p-8 text-white'>
            <h2 className='text-3xl font-bold mb-3'>
              Cultural Landscape: {culturalAnalysis.destination.city}
            </h2>
            <p className='text-white text-opacity-95 mb-4'>
              Understand the cultural groups present and how to meaningfully engage
            </p>

          </div>
        </div>
      )}

      {/* Main Section Switcher (toggle) only after form submission */}
      {showToggle && (
        <div className='flex flex-col md:flex-row gap-4 justify-center items-center mt-2'>
          <button
            onClick={() => setMainSection('preserve')}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition border-2 focus:outline-none focus:ring-2 focus:ring-primary ${
              mainSection === 'preserve'
                ? 'bg-primary text-white border-primary shadow-lg'
                : 'bg-white text-primary border-primary hover:bg-primary hover:text-white'
            }`}
          >
            Preserve My Culture
          </button>
          <button
            onClick={() => setMainSection('explore')}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition border-2 focus:outline-none focus:ring-2 focus:ring-secondary ${
              mainSection === 'explore'
                ? 'bg-secondary text-white border-secondary shadow-lg'
                : 'bg-white text-secondary border-secondary hover:bg-secondary hover:text-white'
            }`}
          >
            Explore Local Cultures
          </button>
        </div>
      )}

      {/* Section Content */}
      {mainSection === 'preserve' ? (
        <>
          {/* Tabs for "Preserve My Culture" */}
          <div className='flex gap-3 border-b-2 border-gray-300 overflow-x-auto bg-gray-50 rounded-t-lg p-1 mt-2'>
            <button
              onClick={() => setActiveTab('communities')}
              className={`px-5 py-3 font-semibold whitespace-nowrap transition rounded-t-md ${
                activeTab === 'communities'
                  ? 'border-b-3 border-primary text-primary bg-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white'
              }`}
            >
              Communities ({results.communities.length})
            </button>
            <button
              onClick={() => setActiveTab('spaces')}
              className={`px-5 py-3 font-semibold whitespace-nowrap transition rounded-t-md ${
                activeTab === 'spaces'
                  ? 'border-b-3 border-primary text-primary bg-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white'
              }`}
            >
              Spaces ({results.spaces.length})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-5 py-3 font-semibold whitespace-nowrap transition rounded-t-md ${
                activeTab === 'events'
                  ? 'border-b-3 border-primary text-primary bg-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white'
              }`}
            >
              Events ({results.events.length})
            </button>

          </div>

          {/* Tab Content */}
          <div className='min-h-96'>
            {activeTab === 'communities' && (
              <div>
                <h3 className='text-2xl font-bold text-gray-900 mb-3'>Communities & Organizations</h3>
                <p className='text-gray-700 mb-6 leading-relaxed border-l-4 border-primary pl-4 py-2 bg-amber-50 rounded'>
                  Join cultural clubs, student organizations, and community groups to connect with people who share your heritage.
                </p>
                {renderResources(results.communities)}
              </div>
            )}

            {activeTab === 'spaces' && (
              <div>
                <h3 className='text-2xl font-bold text-gray-900 mb-3'>Spaces & Resources</h3>
                <p className='text-gray-700 mb-6 leading-relaxed border-l-4 border-secondary pl-4 py-2 bg-yellow-50 rounded'>
                  Discover restaurants, grocery stores, places of worship, and cultural centers near you.
                </p>
                {renderResources(results.spaces, true)}
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                <h3 className='text-2xl font-bold text-gray-900 mb-3'>Events & Gatherings</h3>
                <p className='text-gray-700 mb-6 leading-relaxed border-l-4 border-accent pl-4 py-2 bg-orange-50 rounded'>
                  Attend upcoming festivals, celebrations, and cultural events in your area.
                </p>
                {renderResources(results.events)}
              </div>
            )}

            {activeTab === 'routine' && suggestedRoutines && (
              <div>
                <h3 className='text-2xl font-bold text-gray-900 mb-3'>📅 Suggested Weekly Cultural Routine</h3>
                <p className='text-gray-700 mb-6 leading-relaxed border-l-4 border-accent pl-4 py-2 bg-green-50 rounded'>
                  Based on your engagement level and available resources, here&apos;s a suggested routine to help you stay connected:
                </p>

                <div className='space-y-6'>
                  {suggestedRoutines.map((routine, idx) => (
                    <div key={idx} className='bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary hover:shadow-xl transition'>
                      <div className='flex justify-between items-start mb-4'>
                        <h4 className='text-xl font-bold text-gray-900'>{routine.dayOfWeek}</h4>
                        <span className='text-sm bg-primary bg-opacity-20 text-primary px-4 py-2 rounded-full font-semibold'>
                          {routine.estimatedTimeRequirement}
                        </span>
                      </div>

                      <div className='space-y-3'>
                        {routine.activities.map((activity, actIdx) => (
                          <div
                            key={actIdx}
                            className='bg-gray-50 rounded-lg p-4 border-2 border-gray-300 hover:border-primary hover:bg-amber-50 transition'
                          >
                            <div className='flex justify-between items-start mb-2'>
                              <h5 className='font-bold text-gray-900'>{activity.resourceName}</h5>
                              <span className='text-xs bg-primary bg-opacity-20 text-primary px-3 py-1 rounded-full font-semibold'>
                                {activity.type}
                              </span>
                            </div>
                            <p className='text-sm text-gray-700 mb-2'>{activity.description}</p>
                            <p className='text-sm text-gray-600'>
                              <span className='font-bold'>Frequency:</span> {activity.recommendedFrequency}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className='min-h-96'>
          {culturalAnalysis ? (
            // Render CulturalUnderstanding but hide its header/banner since it's already above
            <CulturalUnderstanding analysis={culturalAnalysis} results={results} hideHeader />
          ) : (
            <div className='text-center py-16 text-gray-500'>
              <p className='text-lg'>No cultural analysis available for this location.</p>
            </div>
          )}
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => {
          if (onBack) onBack();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className='w-full py-4 border-2 border-primary text-primary rounded-lg font-bold text-lg hover:bg-primary hover:text-white transition shadow hover:shadow-lg mb-8'
        style={{ marginBottom: 32 }}
      >
        ← Start New Search
      </button>
    </div>
  );
}
