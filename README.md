# Deck Doctor
### AI-Powered Clash Royale Deck Optimizer & Strategy Trainer
### Supercell Hackathon 2025 Project

## About The Project
Deck Doctor is an intelligent tutoring system that helps Clash Royale players optimize their decks while improving their strategic gameplay through personalized puzzles. By analyzing your current deck configuration, Deck Doctor identifies strengths and weaknesses, suggests improvements that match your playstyle, and generates custom puzzles to help you master your deck's potential.

## Problem Statement
### Building an effective Clash Royale deck that suits your unique playstyle is challenging. 
### Players often struggle to:
- Identify weaknesses in their current deck composition
- Find the right balance between offensive and defensive capabilities
- Learn optimal card combinations and strategies
- Practice deck-specific scenarios effectively

### Core Functionality
Users simply enter their Clash Royale account ID, and Deck Doctor automatically fetches and displays their current deck. Our AI then performs a comprehensive analysis, highlighting strengths and weaknesses while providing an overall deck score. Based on this analysis, players can generate custom puzzles specifically tailored to their deck composition, helping them improve their problem-solving skills and strategic thinking.

## Tech Stack
- Frontend: React
- Backend: Python
- 
### APIs:
- OpenAI API (for AI analysis and recommendations)
- ElevenLabs API (for voice features)
- Clash Royale API (official Supercell API)
- Database: Custom database generated from Clash Royale API data
  
## Features
- Deck Analysis: Comprehensive evaluation of your current deck with scoring
- Weakness Detection: Identifies gaps in your deck strategy
- Strength Highlighting: Shows what your deck excels at
- Custom Puzzles: AI-generated scenarios tailored to your specific deck
- Personalized Recommendations: Deck improvements that match your playstyle

## Getting Started
### Prerequisites
- Node.js and npm (for React frontend)
- Python 3.x
- API Keys:
- Clash Royale API key
- OpenAI API key
- ElevenLabs API key

## Installation
Backend Setup (Python with Conda/Mamba)
bash
## Clone the repository
git clone https://github.com/[your-username]/Supercell-Hackaton-2025.git
cd Supercell-Hackaton-2025

## Create conda environment from environment.yaml
conda env create -f environment.yaml
## OR if using mamba (faster)
mamba env create -f environment.yaml

## Activate the environment
conda activate deck-doctor
## Note: The environment name will be specified in environment.yaml

## Set up environment variables
### Create a .env file in the root directory:
touch .env

## Add your API keys to .env:
echo "CLASH_ROYALE_API_KEY=your_clash_royale_key_here" >> .env
echo "OPENAI_API_KEY=your_openai_key_here" >> .env
echo "ELEVENLABS_API_KEY=your_elevenlabs_key_here" >> .env
Frontend Setup (React)
bash
### Navigate to frontend directory
cd frontend

### Install dependencies using npm
npm install
### OR using npm ci for exact versions from package-lock.json
npm ci

### Return to root directory
cd ..
Running the Application
bash
### Terminal 1: Start the backend server
conda activate deck-doctor
python app.py
### Backend will run on http://localhost:5000 (or your configured port)

## Terminal 2: Start the frontend development server
cd frontend
npm start
### Frontend will run on http://localhost:3000

## Team
- Máté Kovásznai - Data Handling & API Integration
- Gergő Honyák - Full Stack Developer (React Framework Lead) & Game Logic Development 
- Bence Pintér - Puzzle Generation & Game Logic Development

## How It Works
- Connect Your Account: Enter your Clash Royale player ID
- Deck Analysis: View your current deck with AI-powered insights
- Review Feedback: Understand your deck's strengths and weaknesses
- Practice with Puzzles: Solve custom scenarios designed for your deck
- Improve Your Game: Apply learned strategies in real matches
  
## Challenges Overcome
- IP Configuration Issues: Successfully resolved Clash Royale API access restrictions
- Unique Concept Development: Created an innovative approach combining deck analysis with educational puzzles
- Pipeline Architecture: Developed an efficient data flow from API to AI analysis to user interface

## Future Enhancements
### Given more development time, we would focus on:

#### Enhanced Puzzle System:
- More detailed and varied puzzle scenarios
- Difficulty levels and progression tracking
- Replay analysis of puzzle solutions
#### Community Features:
- Share and challenge friends with custom puzzles
- Leaderboards for puzzle completion
- Deck sharing and rating system

## Contributing
This project was created for the Supercell Hackathon 2025. Feel free to fork and expand upon our ideas!

## Acknowledgments
- Supercell for organizing the hackathon
- Clash Royale API for providing comprehensive game data
- OpenAI for powering our intelligent analysis
-ElevenLabs for voice synthesis capabilities
- Built with ❤️ for the Supercell Hackathon 2025

