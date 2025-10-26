import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InsightsPage = ({ playerTag, playerData }) => {
  const [battleData, setBattleData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBattleInsights = async () => {
    if (!playerTag) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/battles/${playerTag.replace('#', '%23')}`
      );
      setBattleData(response.data);
    } catch (error) {
      console.error('Error fetching battle insights:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (playerTag) {
      fetchBattleInsights();
    }
  }, [playerTag]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-purple-400 mb-8">
        ⚔️ Battle Insights
      </h1>
      
      {!playerTag ? (
        <div className="text-center text-gray-400">
          <p>Please load a player first from the Home page</p>
        </div>
      ) : loading ? (
        <div className="text-center text-white">Loading battle data...</div>
      ) : battleData ? (
        <div className="space-y-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-purple-500">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Overall Performance</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-400">Total Battles</p>
                <p className="text-3xl font-bold">{battleData.total_battles}</p>
              </div>
              <div>
                <p className="text-gray-400">Win Rate</p>
                <p className="text-3xl font-bold text-green-400">{battleData.win_rate}%</p>
              </div>
              <div>
                <p className="text-gray-400">W/L</p>
                <p className="text-3xl font-bold">
                  <span className="text-green-400">{battleData.wins}</span>/
                  <span className="text-red-400">{battleData.losses}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400">
          <p>No battle data available</p>
          <button 
            onClick={fetchBattleInsights}
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default InsightsPage;