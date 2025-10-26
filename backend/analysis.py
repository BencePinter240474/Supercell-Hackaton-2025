import json
import re
from openai import OpenAI

client = OpenAI(api_key="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")

def communication(message, role):
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # Fixed model name (was gpt-4.1-mini)
        messages=[
            {"role": "system", "content": role},
            {"role": "user", "content": message}
        ]
    )
    return response.choices[0].message.content

def extract_json_from_response(text):
    """Extract JSON from response that might include markdown code blocks"""
    # Try to find JSON in code blocks first
    json_pattern = r'```(?:json)?\s*(\{.*?\})\s*```'
    match = re.search(json_pattern, text, re.DOTALL)
    
    if match:
        json_str = match.group(1)
    else:
        # Try to find raw JSON
        json_str = text.strip()
        # Remove any leading/trailing text that's not JSON
        start = json_str.find('{')
        end = json_str.rfind('}')
        if start != -1 and end != -1:
            json_str = json_str[start:end+1]
    
    return json_str

def analyze_deck_ai(deck):
    """
    deck: list of card dictionaries or names
    returns: dict with roast, strengths, weaknesses, improvements, doctor_score
    """
    # Extract just the card names if deck contains full card objects
    if deck and isinstance(deck[0], dict):
        card_names = [card.get('card_name', 'Unknown') for card in deck]
    else:
        card_names = deck
    
    prompt = f"""
    Analyze this Clash Royale deck: {', '.join(card_names)}
    
    Return ONLY a JSON object with this exact structure:
    {{
        "roast": "a funny, creative roast about the deck, pointing out the weak points where improvement is needed",
        "strengths": ["strength 1", "strength 2", "strength 3"],
        "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
        "improvements": ["improvement 1", "improvement 2"],
        "doctor_score": 75
        "doctor_score_explonation": "Make a funny insultion sentence according to how good the doctor score is"
    }}
    
    Make it entertaining but insightful. The doctor_score should be 0-100, based on how well will the deck perform in battles.
    Return ONLY the JSON, no other text. Do not ever use this "—".
    """
    
    role = "You are DeckDoctor, a sarcastic but knowledgeable Clash Royale expert who gives humorous deck analysis."
    
    try:
        raw = communication(prompt, role)
        print(f"Raw AI response: {raw[:200]}...")  # Debug log
        
        # Extract JSON from the response
        json_str = extract_json_from_response(raw)
        result = json.loads(json_str)
        
        # Validate the response has required fields
        required_fields = ["roast", "strengths", "weaknesses", "improvements", "doctor_score", "doctor_score_explonation"]
        for field in required_fields:
            if field not in result:
                raise ValueError(f"Missing field: {field}")
        
        # Ensure all lists are actually lists
        if not isinstance(result.get("strengths"), list):
            result["strengths"] = [str(result.get("strengths", "Good deck"))]
        if not isinstance(result.get("weaknesses"), list):
            result["weaknesses"] = [str(result.get("weaknesses", "Could be better"))]
        if not isinstance(result.get("improvements"), list):
            result["improvements"] = [str(result.get("improvements", "Consider card synergy"))]
        
        # Ensure doctor_score is an integer
        result["doctor_score"] = int(result.get("doctor_score", 60))
        
        return result
        
    except Exception as e:
        print(f"Error parsing AI response: {e}")
        print(f"Raw response was: {raw if 'raw' in locals() else 'No response'}")
        
        # Fallback response
        return {
            "roast": "Your deck is so unique that even the AI is confused!",
            "strengths": ["Has 8 cards", "Can be played in a match", "Exists"],
            "weaknesses": ["Needs better synergy", "Missing key defensive options", "Questionable choices"],
            "improvements": ["Try adding a win condition", "Consider spell diversity"],
            "doctor_score": 50
        }