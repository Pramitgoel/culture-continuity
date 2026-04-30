/**
 * User Input Form Component
 * Collects destination and cultural background information
 */

'use client';

import React, { useState } from 'react';
import { UserProfile, Destination, CulturalBackground, EngagementLevel, FoodPreference } from '@/lib/types';

interface InputFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
  submitLabel?: string;
}

export function InputForm({ onSubmit, isLoading, submitLabel }: InputFormProps) {
  const sampleDestination: Destination = {
    city: 'Boston',
    country: 'United States',
    university: 'Harvard University',
  };

  const sampleCulturalBackground: CulturalBackground = {
    languages: ['Hindi', 'English'],
    religion: 'Hinduism',
    foodPreferences: [FoodPreference.VEGETARIAN, FoodPreference.HALAL],
    festivals: ['Diwali', 'Holi'],
    customIdentifiers: ['South Asian Community', 'Bollywood Dance'],
  };

const [destination, setDestination] = useState<Destination>({
  city: '',
  country: '',
  university: '',
});

const [culturalBackground, setCulturalBackground] = useState<CulturalBackground>({
  languages: [],
  religion: '',
  foodPreferences: [],
  festivals: [],
  customIdentifiers: [],
});

  const [engagementLevel, setEngagementLevel] = useState<EngagementLevel>(EngagementLevel.MODERATE);

  const [languageInput, setLanguageInput] = useState('');
  const [festivalInput, setFestivalInput] = useState('');
  const [customInput, setCustomInput] = useState('');

  const loadSampleData = () => {
    setDestination(sampleDestination);
    setCulturalBackground(sampleCulturalBackground);
    setEngagementLevel(EngagementLevel.MODERATE);
    setLanguageInput('');
    setFestivalInput('');
    setCustomInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!destination.city || !destination.country) {
      alert('Please enter city and country');
      return;
    }

    if (
      culturalBackground.languages.length === 0 &&
      !culturalBackground.religion &&
      culturalBackground.foodPreferences.length === 0 &&
      culturalBackground.festivals.length === 0 &&
      culturalBackground.customIdentifiers.length === 0
    ) {
      alert('Please select at least one cultural identifier');
      return;
    }

    const profile: UserProfile = {
      destination,
      culturalBackground,
      engagementLevel,
    };

    onSubmit(profile);
  };

  const addLanguage = () => {
    if (languageInput.trim()) {
      setCulturalBackground((prev) => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()],
      }));
      setLanguageInput('');
    }
  };

  const removeLanguage = (index: number) => {
    setCulturalBackground((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const toggleFoodPreference = (preference: FoodPreference) => {
    setCulturalBackground((prev) => ({
      ...prev,
      foodPreferences: prev.foodPreferences.includes(preference)
        ? prev.foodPreferences.filter((p) => p !== preference)
        : [...prev.foodPreferences, preference],
    }));
  };

  const addFestival = () => {
    if (festivalInput.trim()) {
      setCulturalBackground((prev) => ({
        ...prev,
        festivals: [...prev.festivals, festivalInput.trim()],
      }));
      setFestivalInput('');
    }
  };

  const removeFestival = (index: number) => {
    setCulturalBackground((prev) => ({
      ...prev,
      festivals: prev.festivals.filter((_, i) => i !== index),
    }));
  };

  const addCustomIdentifier = () => {
    if (customInput.trim()) {
      setCulturalBackground((prev) => ({
        ...prev,
        customIdentifiers: [...prev.customIdentifiers, customInput.trim()],
      }));
      setCustomInput('');
    }
  };

  const removeCustomIdentifier = (index: number) => {
    setCulturalBackground((prev) => ({
      ...prev,
      customIdentifiers: prev.customIdentifiers.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8 max-w-6xl mx-auto pb-4'>
      {/* Destination Section */}
      <div className='bg-white rounded-lg shadow-lg p-8 border-l-4 border-primary'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>📍 Destination</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div>
            <label className='block text-sm font-bold text-gray-900 mb-2'>
              City <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={destination.city}
              onChange={(e) => setDestination({ ...destination, city: e.target.value })}
              placeholder='e.g., Boston'
              className='w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder-gray-500'
            />
          </div>

          <div>
            <label className='block text-sm font-bold text-gray-900 mb-2'>
              Country <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={destination.country}
              onChange={(e) => setDestination({ ...destination, country: e.target.value })}
              placeholder='e.g., United States'
              className='w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder-gray-500'
            />
          </div>
        </div>

        <div>
            <label className='block text-sm font-bold text-gray-900 mb-2'>University (Optional)</label>
            <input
              type='text'
              value={destination.university || ''}
              onChange={(e) => setDestination({ ...destination, university: e.target.value })}
              placeholder='e.g., Harvard University'
              className='w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder-gray-500'
            />
            <p className='text-xs text-gray-600 mt-1'>Find university-affiliated clubs!</p>
          </div>
      </div>

      {/* Cultural Background Section */}
      <div className='bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>🌍 Cultural Background</h2>

        {/* Languages */}
        <div className='mb-6'>
          <label className='block text-sm font-bold text-gray-900 mb-2'>🗣️ Languages</label>
          <div className='flex gap-2 mb-3'>
            <input
              type='text'
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLanguage();
                }
              }}
              placeholder='e.g., Hindi, Mandarin'
              className='flex-1 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder-gray-500'
            />
            <button
              type='button'
              onClick={addLanguage}
              className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition'
            >
              Add
            </button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {culturalBackground.languages.map((lang, i) => (
              <span
                key={i}
                className='inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm'
              >
                {lang}
                <button
                  type='button'
                  onClick={() => removeLanguage(i)}
                  className='text-lg cursor-pointer hover:text-amber-700'
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>



        {/* Religion */}
        <div className='mb-6'>
          <label className='block text-sm font-bold text-gray-900 mb-2'>🙏 Religion / Spiritual Practice</label>
          <select
            value={culturalBackground.religion}
            onChange={(e) =>
              setCulturalBackground({ ...culturalBackground, religion: e.target.value })
            }
            className='w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900'
          >
            <option value=''>Select or leave blank</option>
            <option value='Hinduism'>Hinduism</option>
            <option value='Islam'>Islam</option>
            <option value='Christianity'>Christianity</option>
            <option value='Judaism'>Judaism</option>
            <option value='Buddhism'>Buddhism</option>
            <option value='Sikhism'>Sikhism</option>
            <option value='Jainism'>Jainism</option>
            <option value='Zoroastrianism'>Zoroastrianism</option>
            <option value='Other'>Other</option>
          </select>
        </div>

        {/* Food Preferences */}
        <div className='mb-8'>
          <label className='block text-sm font-bold text-gray-900 mb-3'>🍲 Food Preferences</label>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {Object.values(FoodPreference).map((pref) => (
              <label key={pref} className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={culturalBackground.foodPreferences.includes(pref)}
                  onChange={() => toggleFoodPreference(pref)}
                  className='w-4 h-4 text-primary rounded'
                />
                <span className='text-sm text-gray-700 capitalize'>{pref.replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Festivals */}
        <div className='mb-6'>
          <label className='block text-sm font-bold text-gray-900 mb-2'>🎉 Festivals & Celebrations</label>
          <div className='flex gap-2 mb-3'>
            <input
              type='text'
              value={festivalInput}
              onChange={(e) => setFestivalInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFestival();
                }
              }}
              placeholder='e.g., Diwali, Eid, Christmas'
              className='flex-1 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder-gray-500'
            />
            <button
              type='button'
              onClick={addFestival}
              className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition'
            >
              Add
            </button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {culturalBackground.festivals.map((fest, i) => (
              <span
                key={i}
                className='inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm'
              >
                {fest}
                <button
                  type='button'
                  onClick={() => removeFestival(i)}
                  className='text-lg cursor-pointer hover:text-green-600'
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Custom Identifiers */}
        <div className='mb-6'>
          <label className='block text-sm font-bold text-gray-900 mb-2'>✨ Cultural & Community Identifiers</label>
          <p className='text-xs text-gray-600 mb-2'>Add any cultural aspects like diaspora, artisan traditions, martial arts, music genres, etc.</p>
          <div className='flex gap-2 mb-3'>
            <input
              type='text'
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomIdentifier();
                }
              }}
              placeholder='e.g., Diaspora, Martial Arts, Classical Music, LGBTQ+, Yoga, Poetry'
              className='flex-1 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder-gray-500'
            />
            <button
              type='button'
              onClick={addCustomIdentifier}
              className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition'
            >
              Add
            </button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {culturalBackground.customIdentifiers.map((id, i) => (
              <span
                key={i}
                className='inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm'
              >
                {id}
                <button
                  type='button'
                  onClick={() => removeCustomIdentifier(i)}
                  className='text-lg cursor-pointer hover:text-orange-700'
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Level Section */}
      <div className='bg-white rounded-lg shadow-lg p-8 border-l-4 border-accent'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>⚡ Depth of Engagement</h2>
        <p className='text-sm text-gray-700 mb-6 font-medium'>
          How deeply would you like to engage with your cultural community?
        </p>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {Object.values(EngagementLevel).map((level) => (
            <label key={level} className='flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg hover:bg-amber-50 hover:border-primary transition cursor-pointer'>
              <input
                type='radio'
                name='engagement'
                value={level}
                checked={engagementLevel === level}
                onChange={(e) => setEngagementLevel(e.target.value as EngagementLevel)}
                className='w-4 h-4 text-primary mt-1'
              />
              <div className='flex-1'>
                <span className='block font-bold text-gray-900 capitalize'>{level}</span>
                <span className='text-xs text-gray-700'>
                  {level === EngagementLevel.CASUAL &&
                    'Occasional engagement with cultural activities'}
                  {level === EngagementLevel.MODERATE &&
                    'Regular community involvement + events'}
                  {level === EngagementLevel.DEEP &&
                    'Deep practice, rituals, and community leadership'}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className='flex flex-col sm:flex-row gap-3 mb-12'>
        <button
          type='button'
          onClick={loadSampleData}
          className='w-full sm:w-auto px-4 py-3 bg-gray-200 text-gray-900 rounded-lg font-bold text-sm hover:bg-gray-300 transition'
        >
          🧪 Load Sample Data
        </button>
        <button
          type='submit'
          disabled={isLoading}
          className='w-full sm:flex-1 bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl'
        >
          {isLoading ? '🔍 Searching for resources...' : submitLabel || '✨ Find Cultural Resources'}
        </button>
      </div>
    </form>
  );
}
