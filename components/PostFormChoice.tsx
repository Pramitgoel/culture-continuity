import React from 'react';

interface PostFormChoiceProps {
  onSelect: (choice: 'preserve' | 'explore') => void;
}

export default function PostFormChoice({ onSelect }: PostFormChoiceProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">What would you like to do next?</h2>
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-xl">
        <button
          className="flex-1 bg-primary text-white py-6 px-8 rounded-lg font-bold text-xl shadow-lg hover:bg-secondary transition"
          onClick={() => onSelect('preserve')}
        >
          🛡️ Preserve My Culture
        </button>
        <button
          className="flex-1 bg-primary text-white py-6 px-8 rounded-lg font-bold text-xl shadow-lg hover:bg-secondary transition"
          onClick={() => onSelect('explore')}
        >
          🌏 Explore Local Cultures
        </button>
      </div>
    </div>
  );
}
