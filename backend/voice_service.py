import requests
import os
from dotenv import load_dotenv
import base64

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
VOICE_ID = "CwhRBWXzGAHq8TQ4Fs17"

def create_voice(text):
    """Generate speech from text using ElevenLabs API"""
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.8
        }
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        # Return base64 encoded audio for frontend
        audio_base64 = base64.b64encode(response.content).decode('utf-8')
        return audio_base64
    else:
        raise Exception(f"Voice generation failed: {response.status_code}")

def format_analysis_text(analysis):
    """Format the analysis into readable text for speech"""
    strengths = ' and '.join(analysis.get('strengths', []))
    weaknesses = ' plus '.join(analysis.get('weaknesses', []))
    improvements = ' You should also '.join(analysis.get('improvements', []))
    
    text = f"""
    {analysis.get('roast', '')}
    
    {strengths}.
    
    Unfortunately, {weaknesses}.
    
    Try this - {improvements}.
    
    Final score: {analysis.get('doctor_score', 0)} out of 100. {analysis.get("doctor_score_explonation")}
    """
    return text.strip()