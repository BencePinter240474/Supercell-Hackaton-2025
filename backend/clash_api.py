import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('API_KEY')

def get_player_data(player_tag: str):
    headers = {"Authorization": f"Bearer {API_KEY}"}
    url = f"https://api.clashroyale.com/v1/players/{player_tag}"
    
    print(f"Calling Clash API: {url}")  # Debug log
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 404:
        raise Exception(f"Player not found: {player_tag}")
    elif response.status_code == 403:
        raise Exception("API key invalid or IP not whitelisted")
    elif response.status_code != 200:
        raise Exception(f"API error: {response.status_code} - {response.text}")
    
    return response.json()

def get_card_images():
    """Get card images from RoyaleAPI"""
    try:
        headers = {"Authorization": f"Bearer {API_KEY}"}
        url = "https://api.clashroyale.com/v1/cards"
        
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            cards = response.json()
            return {card['name']: card['iconUrls'] for card in cards.get('items', [])}
    except Exception as e:
        print(f"Failed to fetch card images: {e}")
    
    return {}