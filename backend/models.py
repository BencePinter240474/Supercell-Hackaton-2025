from pydantic import BaseModel
from typing import List, Optional

class Card(BaseModel):
    card_name: str
    card_id: int
    level: int
    maxLevel: int
    starLevel: Optional[int] = None
    evolutionLevel: Optional[int] = None
    maxEvolutionLevel: Optional[int] = None
    rarity: str
    count: Optional[int] = None
    elixirCost: Optional[int] = None
    iconUrls: Optional[dict] = None

class PlayerInfo(BaseModel):
    tag: str
    name: str
    expLevel: int
    trophies: int
    bestTrophies: int
    wins: int
    losses: int
    battleCount: int
    arena_name: Optional[str] = None

class PlayerData(BaseModel):
    player_info: PlayerInfo
    current_deck: List[Card]
    all_cards: Optional[List[Card]] = None