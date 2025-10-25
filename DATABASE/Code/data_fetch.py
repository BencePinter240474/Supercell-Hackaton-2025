import requests 
import pandas as pd
import json 

#### proper use = get_info(fetch_player_data("playertag"))

def fetch_player_data(playertag):
    API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImNjMTgwOGMyLTIzNTEtNDFhNS04Y2MxLWM0ZDVjYTRhYjA3NCIsImlhdCI6MTc2MTM5NTYxMSwic3ViIjoiZGV2ZWxvcGVyLzMwNzIzMzE2LTAzOWYtNTZjZC0wNTRhLTUxNWQxMjZkYTk4NiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIyMTIuMTc4LjgxLjI2Il0sInR5cGUiOiJjbGllbnQifV19.pzsbxyJgwgNBORe_UhkClvSI6-NOVAJKDpjmnSnWfOFzXfiQmUUuCJN9buiYeKv9rVpRmLyoeleGYX1IxNHBkg"
    headers = {"Authorization": f"Bearer {API_KEY}"}
    PLAYER_TAG = "%23"+playertag
    url = f"https://api.clashroyale.com/v1/players/{PLAYER_TAG}"

    

    response = requests.get(url, headers=headers)
    player_data = response.json()
    return player_data

    ####Fetch player info####
def get_playerinfo(response):
    player_info = {
        'tag': player_data.get('tag'),
        'name': player_data.get('name'),
        'expLevel': player_data.get('expLevel'),
        'trophies': player_data.get('trophies'),
        'bestTrophies': player_data.get('bestTrophies'),
        'wins': player_data.get('wins'),
        'losses': player_data.get('losses'),
        'battleCount': player_data.get('battleCount'),
        'threeCrownWins': player_data.get('threeCrownWins'),
        'challengeCardsWon': player_data.get('challengeCardsWon'),
        'challengeMaxWins': player_data.get('challengeMaxWins'),
        'tournamentCardsWon': player_data.get('tournamentCardsWon'),
        'tournamentBattleCount': player_data.get('tournamentBattleCount'),
        'role': player_data.get('role'),
        'donations': player_data.get('donations'),
        'donationsReceived': player_data.get('donationsReceived'),
        'totalDonations': player_data.get('totalDonations'),
        'warDayWins': player_data.get('warDayWins'),
        'clanCardsCollected': player_data.get('clanCardsCollected'),
        'clan_tag': player_data.get('clan', {}).get('tag'),
        'clan_name': player_data.get('clan', {}).get('name'),
        'clan_badgeId': player_data.get('clan', {}).get('badgeId'),
        'arena_id': player_data.get('arena', {}).get('id'),
        'arena_name': player_data.get('arena', {}).get('name'),
        'starPoints': player_data.get('starPoints'),
        'expPoints': player_data.get('expPoints'),
        }
    df_player_info = pd.DataFrame([player_info])
    return df_player_info

    ####Fetch all cards info####
def get_allcards(response):
    all_cards_data = []
    for card in response.get('cards', []):
        card_info = {
            'card_name': card.get('name'),
            'card_id': card.get('id'),
            'level': card.get('level'),
            'maxLevel': card.get('maxLevel'),
            'starLevel': card.get('starLevel'),
            'evolutionLevel': card.get('evolutionLevel'),
            'maxEvolutionLevel': card.get('maxEvolutionLevel'),
            'rarity': card.get('rarity'),
            'count': card.get('count'),
            'elixirCost': card.get('elixirCost'),
        }
        all_cards_data.append(card_info)
    df_all_cards = pd.DataFrame(all_cards_data)
    return df_all_cards



    ####Fetch current deck data####
def get_current_deck(response):
    current_deck_data = []
    for card in response.get('currentDeck', []):
        card_info = {
            'card_name': card.get('name'),
            'card_id': card.get('id'),
            'level': card.get('level'),
            'maxLevel': card.get('maxLevel'),
            'starLevel': card.get('starLevel'),
            'evolutionLevel': card.get('evolutionLevel'),
            'maxEvolutionLevel': card.get('maxEvolutionLevel'),
            'rarity': card.get('rarity'),
            'count': card.get('count'),
            'elixirCost': card.get('elixirCost'),
            }
        current_deck_data.append(card_info)
    df_current_deck = pd.DataFrame(current_deck_data)

    return df_current_deck


