import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-purple-400 mb-8">
        About DeckDoctor
      </h1>
      <div className="bg-gray-800 rounded-xl p-8 border border-purple-500 max-w-2xl mx-auto">
        <p className="text-gray-300 mb-4">
          DeckDoctor is an AI-powered Clash Royale deck analyzer that helps players
          understand their deck's strengths and weaknesses.
        </p>
        <p className="text-gray-300 mb-4">
          Features:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4">
          <li>Deck strength and weakness analysis</li>
          <li>AI-powered roasts and suggestions</li>
          <li>Battle insights and win/loss patterns</li>
          <li>Meta matchup predictions</li>
        </ul>
        <p className="text-gray-300">
          Built for the Supercell Hackathon 2025 
        </p>
      </div>
    </div>
  );
};

export default AboutPage;