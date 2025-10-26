from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from models import PlayerData, PlayerInfo, Card
from clash_api import get_player_data, get_card_images
from analysis import *
from voice_service import *
from puzzle import create_puzzle_for_deck, validate_player_answer

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "DeckDoctor API is running!"}


@app.get("/player/{player_tag}")
def get_player(player_tag: str):
    try:
        # Clean up the player tag
        if not player_tag.startswith("%23"):
            if player_tag.startswith("#"):
                player_tag = player_tag.replace("#", "%23")
            else:
                player_tag = "%23" + player_tag

        print(f"Fetching player: {player_tag}")

        player_data = get_player_data(player_tag)
        if not player_data:
            raise HTTPException(status_code=404, detail="Player not found")

        card_images = get_card_images()

        player_info = {
            'tag': player_data.get('tag', 'Unknown'),
            'name': player_data.get('name', 'Unknown Player'),
            'expLevel': player_data.get('expLevel', 0),
            'trophies': player_data.get('trophies', 0),
            'bestTrophies': player_data.get('bestTrophies', 0),
            'wins': player_data.get('wins', 0),
            'losses': player_data.get('losses', 0),
            'battleCount': player_data.get('battleCount', 0),
            'arena_name': player_data.get('arena', {}).get('name', 'Unknown Arena'),
        }

        current_deck = []
        deck_data = player_data.get('currentDeck', [])

        if not deck_data:
            print("No current deck found for player")

        for card in deck_data:
            card_data = {
                'card_name': card.get('name', 'Unknown'),
                'card_id': card.get('id', 0),
                'level': card.get('level', 1),
                'maxLevel': card.get('maxLevel', 14),
                'starLevel': card.get('starLevel', 0),
                'evolutionLevel': card.get('evolutionLevel', 0),
                'maxEvolutionLevel': card.get('maxEvolutionLevel', 0),
                'rarity': card.get('rarity', 'common'),
                'count': card.get('count', 0),
                'elixirCost': card.get('elixirCost', 0),
                'iconUrls': card.get('iconUrls', card_images.get(card.get('name'), {}))
            }
            current_deck.append(card_data)

        return {
            "player_info": player_info,
            "current_deck": current_deck,
            "status": "success"
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error processing player {player_tag}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch player data: {str(e)}")


@app.post("/analyze-deck")
async def analyze_deck(request: Request):
    """
    Receives JSON from frontend: { "deck": [...] }
    Runs AI analysis + ElevenLabs TTS, returns analysis with base64 audio.
    """
    try:
        data = await request.json()
        deck = data.get("deck", [])
        if not deck:
            raise HTTPException(status_code=400, detail="Deck is empty")

        analysis = analyze_deck_ai(deck)

        # Ensure all keys exist
        analysis.setdefault("roast", "")
        analysis.setdefault("strengths", [])
        analysis.setdefault("weaknesses", [])
        analysis.setdefault("improvements", [])
        analysis.setdefault("doctor_score", 0)

        # Generate speech
        try:
            speech_text = format_analysis_text(analysis)
            audio_base64 = create_voice(speech_text)
            analysis["audio"] = audio_base64
            print("Audio generated successfully")
        except Exception as e:
            print(f"Voice generation failed: {e}")
            analysis["audio"] = None

        return analysis

    except Exception as e:
        print(f"Error in /analyze-deck: {e}")
        return {
            "roast": "This deck broke the analyzer!",
            "strengths": ["Unique card combination"],
            "weaknesses": ["May lack consistency"],
            "improvements": ["Try adding a win condition"],
            "doctor_score": 50,
            "audio": None
        }


# main.py - Fixed puzzle endpoints

@app.post("/generate-puzzle")
def generate_puzzle_endpoint(data: dict):
    """
    Generate a puzzle based on deck and its analysis
    """
    try:
        deck = data.get("deck", [])
        analysis = data.get("analysis", {})
        
        if not deck:
            raise HTTPException(status_code=400, detail="Deck is required")
        
        # If analysis not provided, generate it
        if not analysis:
            analysis = analyze_deck_ai(deck)
        
        # create_puzzle_for_deck returns a dict with 'puzzle' key
        puzzle_data = create_puzzle_for_deck(deck, analysis)
        
        # Return the puzzle directly, not nested
        return {
            "status": "success",
            "puzzle": puzzle_data["puzzle"],  # Extract the puzzle from the nested structure
            "deck_score": puzzle_data.get("deck_score", 50),
            "targeting_weakness": puzzle_data.get("targeting_weakness", "General defense")
        }
        
    except Exception as e:
        print(f"Error generating puzzle: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate puzzle: {str(e)}")

@app.post("/check-puzzle-answer")
def check_answer(data: dict):
    """
    Validate player's answer to a puzzle
    """
    try:
        puzzle = data.get("puzzle", {})
        player_cards = data.get("player_cards", [])
        
        if not puzzle or not player_cards:
            raise HTTPException(status_code=400, detail="Puzzle and player_cards required")
        
        result = validate_player_answer(puzzle, player_cards)
        
        return {
            "status": "success",
            "result": result
        }
        
    except Exception as e:
        print(f"Error checking answer: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to check answer: {str(e)}")