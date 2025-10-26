import React, { useState, useEffect } from 'react';
import DeckDisplay from './components/DeckDisplay';
import PlayerInfo from './components/PlayerInfo';
import axios from 'axios';
import './App.css';

function App() {
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [playerTag, setPlayerTag] = useState('#CUY0U8C9P');
  const [analysis, setAnalysis] = useState(null);

  // Fetch player data from backend
  const fetchPlayerData = async () => {
    setLoading(true);
    setAnalysis(null); // reset previous analysis
    try {
      const response = await axios.get(
        `http://localhost:8000/player/${playerTag.replace('#', '%23')}`
      );
      setPlayerData(response.data);
    } catch (error) {
      console.error('Error fetching player data:', error);
      alert(`Failed to load player: ${error.response?.data?.detail || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Analyze deck using AI backend
  const analyzeDeck = async () => {
    if (!playerData) return;
    setAnalyzing(true);
    try {
      const response = await axios.post('http://localhost:8000/analyze-deck', {
        deck: playerData.current_deck
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error analyzing deck:', error);
      alert('Failed to analyze deck. Check backend logs.');
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchPlayerData();
  }, []);

  return (
    <div className="min-h-screen clash-bg">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
            DeckDoctor
          </h1>
          <p className="text-gray-300">AI-Powered Clash Royale Deck Analysis</p>
        </header>

        <div className="mb-6 flex justify-center">
          <div className="flex gap-2">
            <input
              type="text"
              value={playerTag}
              onChange={(e) => setPlayerTag(e.target.value)}
              placeholder="Enter player tag"
              className="px-4 py-2 bg-gray-800 border border-blue-500 rounded-lg text-white focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={fetchPlayerData}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors disabled:opacity-50 text-white"
            >
              {loading ? 'Loading...' : 'Load Player'}
            </button>
          </div>
        </div>

        {playerData && (
          <>
            <PlayerInfo playerInfo={playerData.player_info} />
            <DeckDisplay deck={playerData.current_deck} />

            <div className="text-center mt-8">
              <button 
                onClick={analyzeDeck}
                disabled={analyzing}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-bold text-lg disabled:opacity-50 text-white transition-all transform hover:scale-105"
              >
                {analyzing ? 'Analyzing...' : 'Analyze This Deck'}
              </button>
            </div>

            {analysis && (
              <div className="mt-8 p-6 bg-gray-800 rounded-xl border border-blue-500 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold mb-4 text-blue-400">Analysis Results</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-red-900/30 rounded-lg border border-red-500">
                    <h4 className="font-bold text-red-400 mb-2">Roast</h4>
                    <p className="text-gray-300">{analysis.roast}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-900/30 rounded-lg border border-green-500">
                      <h4 className="font-bold text-green-400 mb-2">Strengths</h4>
                      <ul className="list-disc list-inside text-gray-300">
                        {analysis.strengths?.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-orange-900/30 rounded-lg border border-orange-500">
                      <h4 className="font-bold text-orange-400 mb-2">Weaknesses</h4>
                      <ul className="list-disc list-inside text-gray-300">
                        {analysis.weaknesses?.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {analysis.improvements && analysis.improvements.length > 0 && (
                    <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500">
                      <h4 className="font-bold text-blue-400 mb-2">Suggested Improvements</h4>
                      <ul className="list-disc list-inside text-gray-300">
                        {analysis.improvements.map((improvement, i) => (
                          <li key={i}>{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">
                      DeckDoctor Score: {analysis.doctor_score}/100
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;