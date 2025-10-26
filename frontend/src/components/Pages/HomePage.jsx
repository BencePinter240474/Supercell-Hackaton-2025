import React from 'react';
import axios from 'axios';
import DeckDisplay from '../components/DeckDisplay';
import PlayerInfo from '../components/PlayerInfo';

const HomePage = ({ playerTag, setPlayerTag, playerData, setPlayerData }) => {
  const [loading, setLoading] = React.useState(false);
  const [analysis, setAnalysis] = React.useState(null);

  const fetchPlayerData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/player/${playerTag.replace('#', '%23')}`
      );
      setPlayerData(response.data);
    } catch (error) {
      console.error('Error fetching player data:', error);
      alert(`Failed to load player: ${error.response?.data?.detail || 'Unknown error'}`);
    }
    setLoading(false);
  };

  const analyzeDeck = async () => {
  if (!playerData) return;

  try {
    // Send only the card names to the backend
    const response = await axios.post('http://localhost:8000/analyze-deck', {
      deck: playerData.current_deck.map(c => c.card_name)
    });

    // Store AI analysis in state
    setAnalysis(response.data);
  } catch (error) {
    console.error('Error analyzing deck:', error);
  }
};

  React.useEffect(() => {
    fetchPlayerData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
          Deck Analysis
        </h1>
        <p className="text-gray-400">Enter a player tag to analyze their deck</p>
      </header>

      <div className="mb-6 flex justify-center">
        <div className="flex gap-2">
          <input
            type="text"
            value={playerTag}
            onChange={(e) => setPlayerTag(e.target.value)}
            placeholder="Enter player tag"
            className="px-4 py-2 bg-gray-800 border border-purple-500 rounded-lg text-white"
          />
          <button
            onClick={fetchPlayerData}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
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
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-lg"
            >
              Analyze This Deck
            </button>
          </div>

          {analysis && (
            <div className="mt-8 p-6 bg-gray-800 rounded-xl border border-purple-500">
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Analysis Results</h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-900/30 rounded-lg border border-red-500">
                  <h4 className="font-bold text-red-400 mb-2">Roast</h4>
                  <p className="text-gray-300">{analysis.roast}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-900/30 rounded-lg border border-green-500">
                    <h4 className="font-bold text-green-400 mb-2">Strengths</h4>
                    <ul className="list-disc list-inside text-gray-300">
                      {analysis.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="p-4 bg-orange-900/30 rounded-lg border border-orange-500">
                    <h4 className="font-bold text-orange-400 mb-2">⚠️ Weaknesses</h4>
                    <ul className="list-disc list-inside text-gray-300">
                      {analysis.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    DeckDoctor Score: {analysis.doctor_score}/100
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;