import json
import re
from typing import List, Dict, Any
from analysis import communication, extract_json_from_response

def generate_puzzle(deck: List[Dict], deck_analysis: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate ONE puzzle scenario based on deck and its analysis
    
    Args:
        deck: List of card dictionaries from the API
        deck_analysis: Dict with strengths, weaknesses from analyze_deck_ai
    
    Returns:
        Dict with puzzle scenario and solution
    """
    
    # Extract card names from deck
    if deck and isinstance(deck[0], dict):
        card_names = [card.get('card_name', 'Unknown') for card in deck]
    else:
        card_names = deck
    
    card_list = ', '.join(card_names)
    weaknesses = deck_analysis.get('weaknesses', ['General defense issues'])
    strengths = deck_analysis.get('strengths', ['Good cycle'])
    doctor_score = deck_analysis.get('doctor_score', 50)
    
    # Adjust difficulty based on doctor_score
    if doctor_score < 40:
        elixir = 8  # More elixir for weaker decks
        focus = "basic defense"
    elif doctor_score < 70:
        elixir = 7  # Standard
        focus = f"addressing '{weaknesses[0]}'"
    else:
        elixir = 6  # Less elixir for strong decks
        focus = "advanced counter-play"
    
    prompt = f"""
    Create a Clash Royale puzzle scenario as a JSON response.
    
    Player's deck: {card_list}
    Main weakness: {weaknesses[0] if weaknesses else 'General defense'}
    Deck strength: {strengths[0] if strengths else 'Versatility'}
    
    Create a realistic battle scenario focusing on {focus}.
    The opponent plays 2-3 cards that create a threatening push.
    Player has {elixir} elixir available.
    
    Return ONLY this JSON structure:
    {{
        "title": "Catchy puzzle title",
        "scenario": "Detailed description of the battle situation",
        "enemy_cards": ["card1", "card2"],
        "enemy_elixir_cost": 8,
        "player_elixir": {elixir},
        "tower_hp": {{"left": 2500, "right": 2500, "king": 5000}},
        "time_remaining": "2:00",
        "optimal_counter": ["player_card1", "player_card2"],
        "placement": "Where and when to place the cards",
        "explanation": "Detailed explanation why this counter works",
        "common_mistake": "What most players do wrong in this situation",
        "lesson": "Key strategic concept to remember"
    }}
    """
    
    role = """You are a Clash Royale coach creating educational puzzles. 
    Create realistic scenarios that teach players to handle common battle situations.
    Focus on practical counters using the player's actual deck cards."""
    
    try:
        response = communication(prompt, role)
        json_str = extract_json_from_response(response)
        puzzle = json.loads(json_str)
        
        # Validate puzzle has required fields
        required_fields = ["title", "scenario", "enemy_cards", "optimal_counter", "explanation"]
        for field in required_fields:
            if field not in puzzle:
                raise ValueError(f"Missing field: {field}")
        
        # Add metadata
        puzzle["difficulty"] = "Hard" if doctor_score < 40 else "Medium" if doctor_score < 70 else "Easy"
        puzzle["focus_area"] = weaknesses[0] if weaknesses else "General defense"
        
        return puzzle
        
    except Exception as e:
        print(f"Error generating puzzle: {e}")
        
        # Fallback puzzle that works with most decks
        # Fallback puzzle that works with most decks
    return {
        "title": "Bridge Spam Defense!",
        "scenario": "Your opponent just placed a Hog Rider at the bridge followed by an Ice Golem! They're going for a quick push while you're low on elixir.",
        "enemy_cards": ["Hog Rider", "Ice Golem"],
        "enemy_elixir_cost": 6,
        "player_elixir": elixir,
        "tower_hp": {"left": 2500, "right": 2500, "king": 5000},
        "time_remaining": "2:00",
        "optimal_counter": _find_best_counter(card_names),  # Fixed: removed self
        "placement": "Place defensive building in the center, troops behind",
        "explanation": "The building pulls both units while your troops deal damage",
        "common_mistake": "Placing troops too early or too close to the bridge",
        "lesson": "Proper placement and timing can defend pushes with less elixir",
        "difficulty": "Medium",
        "focus_area": "Bridge spam defense"
    }


def _find_best_counter(deck_cards: List[str]) -> List[str]:
    """
    Helper to find reasonable counter cards from the player's deck
    """
    # Common defensive cards to look for
    buildings = ["Cannon", "Tesla", "Inferno Tower", "Goblin Cage", "Tombstone"]
    troops = ["Knight", "Valkyrie", "Mini P.E.K.K.A", "Goblins", "Skeletons"]
    
    counter = []
    
    # Check for buildings first
    for card in deck_cards:
        if card in buildings and len(counter) < 2:
            counter.append(card)
            break
    
    # Then add troops
    for card in deck_cards:
        if card in troops and len(counter) < 2:
            counter.append(card)
            if len(counter) == 2:
                break
    
    # Fallback if no specific cards found
    if not counter:
        counter = deck_cards[:2]  # Just use first two cards
    
    return counter

def validate_player_answer(puzzle: Dict, player_cards: List[str]) -> Dict[str, Any]:
    """
    Check if player's answer is close to optimal
    
    Args:
        puzzle: The puzzle dictionary
        player_cards: List of cards the player chose
    
    Returns:
        Dict with score and feedback
    """
    optimal = puzzle.get("optimal_counter", [])
    
    # Simple scoring system
    score = 0
    if set(player_cards) == set(optimal):
        score = 100
        feedback = "Perfect! That's exactly the optimal counter!"
    elif any(card in optimal for card in player_cards):
        score = 70
        feedback = "Good thinking! You got part of the solution right."
    else:
        score = 40
        feedback = "Not quite optimal, but could work with good placement!"
    
    return {
        "score": score,
        "feedback": feedback,
        "optimal_solution": optimal,
        "explanation": puzzle.get("explanation", ""),
        "lesson": puzzle.get("lesson", "")
    }

# Integration function for your API
def create_puzzle_for_deck(deck_data: List[Dict], analysis_data: Dict) -> Dict:
    """
    Main function to call from your FastAPI endpoint
    
    Args:
        deck_data: Current deck from the API
        analysis_data: Analysis from analyze_deck_ai
    
    Returns:
        Complete puzzle package
    """
    puzzle = generate_puzzle(deck_data, analysis_data)
    
    return {
        "puzzle": puzzle,
        "deck_score": analysis_data.get("doctor_score", 50),
        "targeting_weakness": puzzle.get("focus_area", "General defense")
    }