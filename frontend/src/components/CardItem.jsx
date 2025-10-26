import React from 'react';

const CardItem = ({ card }) => {
  const getRarityColor = (rarity) => {
    const colors = {
      'common': 'border-gray-400',
      'rare': 'border-orange-400',
      'epic': 'border-purple-500',
      'legendary': 'border-yellow-400',
      'champion': 'border-red-500'
    };
    return colors[rarity?.toLowerCase()] || 'border-gray-400';
  };

  const cardImageUrl = card.iconUrls?.medium || 
    `https://cdn.royaleapi.com/static/img/cards-150/${card.card_name?.toLowerCase().replace(/\s+/g, '-')}.png`;

  return (
    <div className={`relative bg-gray-700 rounded-lg p-2 border-2 ${getRarityColor(card.rarity)} hover:scale-105 transition-transform`}>
      <img 
        src={cardImageUrl}
        alt={card.card_name}
        className="w-full h-auto rounded"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/100x120?text=Card';
        }}
      />
      {/* Changed bg-blue-600 to bg-purple-600 for elixir bubble */}
      <div className="absolute top-1 left-1 bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
        {card.elixirCost}
      </div>
      {/* REMOVED THE LEVEL BADGE - this entire div block is deleted */}
      <p className="text-xs text-center mt-1 truncate">{card.card_name}</p>
    </div>
  );
};

export default CardItem;