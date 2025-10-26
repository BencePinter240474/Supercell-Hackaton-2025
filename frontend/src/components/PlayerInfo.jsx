import React from 'react';

const PlayerInfo = ({ playerInfo }) => {
  return (
    // Added max-w-2xl mx-auto to match deck width, reduced padding
    <div className="mb-6 p-4 bg-gray-800 rounded-xl border border-blue-500 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-3 text-blue-400">Player Info</h2>
      {/* Reduced gap from gap-4 to gap-3, kept 4 columns */}
      <div className="grid grid-cols-4 gap-3">
        <div>
          <p className="text-gray-400 text-xs">Name</p>
          <p className="font-semibold text-sm">{playerInfo.name}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Trophies</p>
          <p className="font-semibold text-yellow-400 text-sm">{playerInfo.trophies}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Level</p>
          <p className="font-semibold text-sm">{playerInfo.expLevel}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Arena</p>
          <p className="font-semibold text-sm">{playerInfo.arena_name}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Wins</p>
          <p className="font-semibold text-green-400 text-sm">{playerInfo.wins}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Losses</p>
          <p className="font-semibold text-red-400 text-sm">{playerInfo.losses}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Best</p>
          <p className="font-semibold text-sm">{playerInfo.bestTrophies}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Battles</p>
          <p className="font-semibold text-sm">{playerInfo.battleCount}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;