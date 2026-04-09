/**
 * Resource Card Component
 * Displays individual resource information
 */

'use client';

import React from 'react';
import { CulturalResource } from '@/lib/types';

interface ResourceCardProps {
  resource: CulturalResource;
  isSaved: boolean;
  onSave: () => void;
}

export default function ResourceCard({ resource, isSaved, onSave }: ResourceCardProps) {
  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      cultural_club: '👥',
      meetup_group: '🤝',
      association: '🏛️',
      restaurant: '🍽️',
      grocery_store: '🛒',
      place_of_worship: '🙏',
      cultural_center: '🎭',
      event: '🎉',
      language_class: '📚',
    };
    return icons[category] || '📍';
  };



  const openInMaps = () => {
    if (resource.latitude && resource.longitude) {
      window.open(
        `https://www.google.com/maps?q=${resource.latitude},${resource.longitude}`,
        '_blank'
      );
    }
  };

  return (
    <div className='bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-200'>
      {/* Card Header with Category */}
      <div className='bg-gradient-to-r from-primary to-secondary p-5 text-white border-b-4 border-primary border-opacity-30'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-start gap-3 flex-1'>
            <span className='text-3xl'>{getCategoryIcon(resource.category)}</span>
            <div className='min-w-0'>
              <h3 className='text-xl font-bold mb-2 text-white break-words whitespace-pre-line bg-white px-2 py-1 rounded' style={{background: 'transparent', color: '#fff'}}>
                {resource.name}
              </h3>
                {/* Removed inaccurate category label */}
            </div>
          </div>
          <button
            onClick={onSave}
            className={`text-2xl transition transform hover:scale-125 flex-shrink-0 pt-1 ${
              isSaved ? 'text-yellow-300 drop-shadow-lg' : 'text-white text-opacity-80 hover:text-opacity-100 hover:drop-shadow-md'
            }`}
            title='Save this resource'
          >
            ★
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className='p-5 flex-1 flex flex-col gap-4'>


        {/* Description */}
        {resource.description && (
          <p className='text-gray-800 text-sm line-clamp-3 leading-relaxed'>{resource.description}</p>
        )}

        {/* Rating */}
        {resource.rating && (
          <div className='flex items-center gap-3 text-sm bg-yellow-50 rounded-lg p-3 border border-yellow-200'>
            <span className='text-lg'>{'★'.repeat(Math.round(resource.rating))}</span>
            <span className='text-gray-800 font-semibold'>
              {resource.rating.toFixed(1)}/5
              {resource.reviewCount && ` · ${resource.reviewCount} reviews`}
            </span>
          </div>
        )}

        {/* Address */}
        {resource.address && (
          <div className='text-sm text-gray-800 bg-amber-50 rounded-lg p-3 border border-amber-200 font-medium'>
            📍 {resource.address}
            {resource.distance && <span className='ml-2 text-gray-600'>({resource.distance.toFixed(1)} km away)</span>}
          </div>
        )}

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {resource.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className='text-xs bg-primary bg-opacity-20 text-primary px-3 py-1 rounded-full font-semibold'>
                {tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className='text-xs bg-gray-300 text-gray-800 px-3 py-1 rounded-full font-semibold'>
                +{resource.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Verification Badge */}
        {resource.isVerified && (
          <div className='flex items-center gap-2 text-sm text-green-700 bg-green-100 px-3 py-2 rounded-lg w-fit font-bold border border-green-300'>
            ✓ Verified Resource
          </div>
        )}

        {/* Contact Info */}
        <div className='space-y-2 text-sm text-gray-800 pt-3 border-t-2 border-gray-300'>
          {resource.phoneNumber && (
            <p className='font-semibold'>
              📞 <span className='text-gray-900'>{resource.phoneNumber}</span>
            </p>
          )}
          {resource.email && (
            <p className='font-semibold'>
              ✉️ <span className='text-gray-900'>{resource.email}</span>
            </p>
          )}
          {resource.hours && Object.keys(resource.hours).length > 0 && (
            <div className='flex flex-col gap-2'>
              <strong className='text-gray-900'>⏰ Hours:</strong>
              <div className='text-xs text-gray-700 space-y-0.5 bg-gray-50 p-2 rounded border border-gray-300'>
                {Object.entries(resource.hours).map(([day, hours]) => (
                  <p key={day} className='font-medium'>
                    <span className='capitalize text-gray-900'>{day}:</span> {hours}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Source removed */}
      </div>

      {/* Card Footer with Actions */}
      <div className='bg-gray-100 p-4 flex gap-3 border-t-2 border-gray-300'>
        {resource.website && (() => {
          // Normalize and validate the website URL
          let url = resource.website.trim();
          if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
          }
          try {
            const parsed = new URL(url);
            if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
              return (
                <a
                  href={url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex-1 px-4 py-3 bg-primary text-white text-sm rounded-lg font-bold hover:bg-opacity-90 transition shadow hover:shadow-lg text-center'
                >
                  Ⓞ Visit Website
                </a>
              );
            }
          } catch {}
          return null;
        })()}
        {resource.latitude && resource.longitude && (
          <button
            onClick={openInMaps}
            className='flex-1 px-4 py-3 bg-gray-400 text-white text-sm rounded-lg font-bold hover:bg-gray-500 transition shadow hover:shadow-lg'
          >
            📍 View Map
          </button>
        )}
      </div>
    </div>
  );
}
