import React from 'react';
import CardItem from './CardItem';

const DeckDisplay = ({ deck }) => {
  const averageElixir = (deck.reduce((sum, card) => sum + (card.elixirCost || 0), 0) / deck.length).toFixed(1);

  return (
    <div className="p-6 bg-gray-800 rounded-xl border border-blue-500 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-400">Current Deck</h2>
        <div className="text-lg font-semibold">
          Average Elixir: <span className="text-blue-400">{averageElixir}</span>
        </div>
      </div>
      {/* Changed from grid-cols-8 to grid-cols-4 for 2 rows */}
      <div className="grid grid-cols-4 gap-2">
        {deck.map((card, index) => (
          <CardItem key={index} card={card} />
        ))}
      </div>
    </div>
  );
};

export default DeckDisplay;