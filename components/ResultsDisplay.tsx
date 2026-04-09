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

  const getVisibleSpaces = (resources: CulturalResource[]): CulturalResource[] => {
    const uniqueByName = new Set<string>();
    const normalized = resources.filter((resource) => {
      const key = resource.name.trim().toLowerCase();
      if (uniqueByName.has(key)) return false;
      uniqueByName.add(key);
      return true;
    });

    // Keep URL handling strict and consistent with card behavior.
    const withValidUrls = normalized.filter((resource) => !resource.website || isValidUrl(resource.website));

    let temples = 0;
    const picked: CulturalResource[] = [];
    for (const resource of withValidUrls) {
      const isTemple = resource.tags && (resource.tags.includes('temple') || resource.tags.includes('hindu_temple'));
      if (isTemple) {
        if (temples >= 2) continue;
        temples++;
      }
      picked.push(resource);
      if (picked.length >= 10) break;
    }

    return picked;
  };

  const visibleSpaces = getVisibleSpaces(results.spaces);

  const renderResources = (resources: CulturalResource[]) => {
    if (resources.length === 0) {
      return (
        <div className='text-center py-8 text-gray-500'>
          <p className='text-lg'>No resources found in this category.</p>
          <p className='text-sm'>Try adjusting your search criteria.</p>
        </div>
      );
    }

    let filtered = resources.slice(0, 10);

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
            Showing {visibleSpaces.length} nearby spaces in your location
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
          <div className='min-h-96'>
            <div>
              <h3 className='text-2xl font-bold text-gray-900 mb-3'>Spaces & Resources</h3>
              <p className='text-gray-700 mb-6 leading-relaxed border-l-4 border-secondary pl-4 py-2 bg-yellow-50 rounded'>
                Discover restaurants, grocery stores, places of worship, and cultural centers near you.
              </p>
              {renderResources(visibleSpaces)}
            </div>
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
