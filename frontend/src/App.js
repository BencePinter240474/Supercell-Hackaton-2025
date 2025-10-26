import React, { useState, useEffect, useRef } from 'react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Puzzle states
  const [puzzle, setPuzzle] = useState(null);
  const [loadingPuzzle, setLoadingPuzzle] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [puzzleResult, setPuzzleResult] = useState(null);
  const [availableCards, setAvailableCards] = useState([]);

  // Helper: card image
  const getCardImageUrl = (card) => {
    return (
      card.iconUrls?.medium ||
      `https://cdn.royaleapi.com/static/img/cards-150/${card.card_name
        ?.toLowerCase()
        .replace(/\s+/g, '-')}.png`
    );
  };

  // Helper: rarity border
  const getRarityColor = (rarity) => {
    const colors = {
      common: 'border-gray-400',
      rare: 'border-orange-400',
      epic: 'border-purple-500',
      legendary: 'border-yellow-400',
      champion: 'border-red-500',
    };
    return colors[rarity?.toLowerCase()] || 'border-gray-400';
  };

  // 🔹 Fetch Player
  const fetchPlayerData = async () => {
    setLoading(true);
    setAnalysis(null);
    setPuzzle(null);
    setPuzzleResult(null);
    try {
      const response = await axios.get(
        `http://localhost:8000/player/${playerTag.replace('#', '%23')}`
      );
      setPlayerData(response.data);
    } catch (error) {
      console.error('Error fetching player data:', error);
      alert(
        `Failed to load player: ${error.response?.data?.detail || 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Analyze Deck
  const analyzeDeck = async () => {
    if (!playerData) return;
    setAnalyzing(true);
    try {
      const response = await axios.post('http://localhost:8000/analyze-deck', {
        deck: playerData.current_deck,
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error analyzing deck:', error);
      alert('Failed to analyze deck. Check backend logs.');
    } finally {
      setAnalyzing(false);
    }
  };

  // 🔹 Generate Puzzle
  const generatePuzzle = async () => {
    if (!playerData || !analysis) {
      alert('Analyze the deck first to generate puzzles!');
      return;
    }
    setLoadingPuzzle(true);
    setPuzzleResult(null);
    setSelectedCards([]);

    // Random hand (4 cards)
    const shuffled = [...playerData.current_deck].sort(() => 0.5 - Math.random());
    const hand = shuffled.slice(0, 4);
    setAvailableCards(hand);

    try {
      const response = await axios.post('http://localhost:8000/generate-puzzle', {
        deck: playerData.current_deck,
        analysis: analysis,
      });
      setPuzzle(response.data.puzzle);
    } catch (error) {
      console.error('Error generating puzzle:', error);
      alert('Failed to generate puzzle.');
    } finally {
      setLoadingPuzzle(false);
    }
  };

  // 🔹 Check Puzzle Answer
  const checkPuzzleAnswer = async () => {
    if (!puzzle || selectedCards.length === 0) {
      alert('Please select cards to counter with!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/check-puzzle-answer', {
        puzzle: puzzle,
        player_cards: selectedCards,
      });
      setPuzzleResult(response.data.result);
    } catch (error) {
      console.error('Error checking answer:', error);
    }
  };

  // 🔹 Toggle Card Selection
  const toggleCardSelection = (cardName) => {
    setSelectedCards((prev) => {
      if (prev.includes(cardName)) {
        return prev.filter((c) => c !== cardName);
      } else if (prev.length < 2) {
        return [...prev, cardName];
      }
      return prev;
    });
  };

  // 🔹 Audio controls
  const handleAudioPlay = () => setIsPlaying(true);
  const handleAudioPause = () => setIsPlaying(false);
  const handleAudioEnded = () => setIsPlaying(false);

  useEffect(() => {
    fetchPlayerData();
  }, []);

  return (
    <div className="min-h-screen clash-bg relative">
      {/* Floating Dr. Deckstein */}
      {(analysis || puzzle) && (
        <div
          className="fixed bottom-4 right-4 z-50 transition-all duration-300 hover:scale-110"
          style={{
            filter: isPlaying ? 'none' : 'grayscale(0.3)',
            maxWidth: 'calc(100vw - 2rem)',
            right: '1rem',
          }}
        >
          <div className="relative">
            {(isPlaying || puzzle) && (
              <div className="absolute bottom-full mb-2 right-0 bg-white text-black p-2 rounded-lg shadow-lg w-[120px] sm:w-[150px] animate-pulse">
                <p className="text-xs sm:text-sm font-semibold">
                  {puzzle ? 'Test your skills!' : 'Analyzing your deck...'}
                </p>
                <div className="absolute bottom-[-8px] right-4 sm:right-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
              </div>
            )}

            <img
              src={
                isPlaying || puzzle
                  ? '/deckstein-talking.png'
                  : '/deckstein-idle.png'
              }
              alt="Dr. Deckstein"
              className="w-20 h-20 sm:w-32 sm:h-32 object-contain drop-shadow-2xl"
              style={{
                animation: isPlaying || puzzle ? 'bounce 1s infinite' : 'none',
              }}
            />
            <div className="text-center mt-1 sm:mt-2 bg-blue-900/80 px-2 py-1 rounded-full">
              <p className="text-[10px] sm:text-xs text-white font-bold">
                Dr. Deckstein
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg mb-2">
            DeckDoctor
          </h1>
          <p className="text-lg text-gray-200">
            AI-Powered Clash Royale Deck Analysis & Puzzles
          </p>
        </header>

        {/* Player Tag Input */}
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

        {/* Player Data */}
        {playerData && (
          <>
            <PlayerInfo playerInfo={playerData.player_info} />
            <DeckDisplay deck={playerData.current_deck} />

            {/* Buttons */}
            <div className="text-center mt-8 space-x-4">
              <button
                onClick={analyzeDeck}
                disabled={analyzing}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-bold text-lg disabled:opacity-50 text-white transition-all transform hover:scale-105"
              >
                {analyzing ? 'Analyzing...' : 'Analyze This Deck'}
              </button>

              <button
                onClick={generatePuzzle}
                disabled={loadingPuzzle}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold text-lg disabled:opacity-50 text-white transition-all transform hover:scale-105"
              >
                {loadingPuzzle ? 'Creating...' : 'Practice Puzzle'}
              </button>
            </div>

            {/* Analysis Section */}
            {analysis && (
              <div className="mt-8 p-6 bg-gray-800 rounded-xl border border-blue-500 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">
                  Analysis Results
                </h3>

                {analysis.audio && (
                  <div className="mb-6 p-4 bg-purple-900/20 rounded-lg border border-purple-400">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-purple-400 font-semibold text-lg">
                        🔊 Listen to Dr. Deckstein's Analysis
                      </span>
                      <audio
                        ref={audioRef}
                        controls
                        className="w-full max-w-md"
                        src={`data:audio/mpeg;base64,${analysis.audio}`}
                        onPlay={handleAudioPlay}
                        onPause={handleAudioPause}
                        onEnded={handleAudioEnded}
                        style={{ filter: 'hue-rotate(240deg)', outline: 'none' }}
                      />
                    </div>
                  </div>
                )}

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

                  {analysis.improvements?.length > 0 && (
                    <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500">
                      <h4 className="font-bold text-blue-400 mb-2">
                        Suggested Improvements
                      </h4>
                      <ul className="list-disc list-inside text-gray-300">
                        {analysis.improvements.map((improvement, i) => (
                          <li key={i}>{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-center pt-4">
                    <div className="inline-block p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl border-2 border-blue-400">
                      <div className="text-sm text-gray-400 mb-1">DeckDoctor Score</div>
                      <div className="text-4xl font-bold text-blue-400">
                        {analysis.doctor_score}/100
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Puzzle Section */}
            {puzzle && (
              <div className="mt-8 p-6 bg-gray-800 rounded-xl border border-purple-500 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">
                  Puzzle: {puzzle.title}
                </h3>

                <div className="space-y-4">
                  <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500">
                    <p className="text-gray-300 mb-3">{puzzle.scenario}</p>
                    <div className="flex justify-around text-center">
                      <div>
                        <span className="text-purple-400">Enemy Plays:</span>
                        <div className="text-white font-bold">
                          {puzzle.enemy_cards.join(' + ')}
                        </div>
                        <div className="text-sm text-gray-400">
                          ({puzzle.enemy_elixir_cost} elixir)
                        </div>
                      </div>
                      <div>
                        <span className="text-purple-400">Your Elixir:</span>
                        <div className="text-white font-bold text-2xl">
                          {puzzle.player_elixir} ⚡
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Your Hand */}
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <h4 className="font-bold text-purple-400 mb-3">
                      Your Hand (Select up to 2 cards to counter):
                    </h4>
                    <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                      {availableCards.map((card, i) => (
                        <div
                          key={i}
                          onClick={() => toggleCardSelection(card.card_name)}
                          className={`relative bg-gray-700 rounded-lg p-2 border-2 cursor-pointer transition-all ${
                            selectedCards.includes(card.card_name)
                              ? `${getRarityColor(card.rarity)} scale-110 shadow-lg shadow-purple-500/50`
                              : `${getRarityColor(card.rarity)} hover:scale-105 opacity-70 hover:opacity-100`
                          }`}
                        >
                          <img
                            src={getCardImageUrl(card)}
                            alt={card.card_name}
                            className="w-full h-auto rounded"
                            onError={(e) => {
                              e.target.src =
                                'https://via.placeholder.com/100x120?text=Card';
                            }}
                          />
                          <div className="absolute top-1 left-1 bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {card.elixirCost}
                          </div>
                          {selectedCards.includes(card.card_name) && (
                            <div className="absolute top-1 right-1 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                              ✓
                            </div>
                          )}
                          <p className="text-xs text-center mt-1 truncate text-white">
                            {card.card_name}
                          </p>
                        </div>
                      ))}
                    </div>

                    {selectedCards.length > 0 && (
                      <div className="mt-3 text-center">
                        <span className="text-purple-300">
                          Selected: {selectedCards.join(' + ')}
                        </span>
                        <span className="text-gray-400 ml-2">
                          (
                          {availableCards
                            .filter((c) => selectedCards.includes(c.card_name))
                            .reduce((sum, c) => sum + c.elixirCost, 0)}{' '}
                          elixir)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Check Answer */}
                  <div className="text-center">
                    <button
                      onClick={checkPuzzleAnswer}
                      disabled={selectedCards.length === 0}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold disabled:opacity-50 text-white transition-all"
                    >
                      Check Answer
                    </button>
                  </div>

                  {/* Result */}
                  {puzzleResult && (
                    <div className={`p-4 rounded-lg border ${
                      puzzleResult.score >= 70 
                        ? 'bg-green-900/30 border-green-500' 
                        : 'bg-orange-900/30 border-orange-500'
                    }`}>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-xl">
                          Score: {puzzleResult.score}/100
                        </h4>
                        <span className="text-lg">
                          {puzzleResult.score >= 100 ? '🏆' : puzzleResult.score >= 70 ? '✅' : '📚'}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 mb-3">{puzzleResult.feedback}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-green-400 font-bold">Optimal Solution:</span>
                          <span className="text-gray-300 ml-2">
                            {puzzleResult.optimal_solution.join(' + ')}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-400 font-bold">Explanation:</span>
                          <span className="text-gray-300 ml-2">{puzzleResult.explanation}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-600">
                          <span className="text-purple-400 font-bold">Lesson:</span>
                          <span className="text-gray-300 ml-2">{puzzleResult.lesson}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={generatePuzzle}
                        className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold"
                      >
                        Try Another Puzzle
                      </button>
                    </div>
                  )}
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
