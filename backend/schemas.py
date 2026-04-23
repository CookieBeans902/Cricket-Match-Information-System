from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from decimal import Decimal

# Series Schemas
class SeriesBase(BaseModel):
    series_name: str
    series_type: Optional[str] = "Bilateral"
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class SeriesCreate(SeriesBase):
    model_config = {
        "json_schema_extra": {
            "example": {
                "series_name": "India vs Australia 2024",
                "series_type": "Bilateral",
                "start_date": "2024-11-22",
                "end_date": "2024-12-08"
            }
        }
    }

class Series(SeriesBase):
    series_id: int
    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    email: str
    username: str
    age: Optional[int] = None
    iiti: Optional[bool] = False

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    class Config:
        from_attributes = True

class OTPRequest(BaseModel):
    email: str

class OTPVerify(BaseModel):
    email: str
    otp: str

class UserSignup(UserCreate):
    otp: str

# Team Schemas
class TeamBase(BaseModel):
    team_name: str
    coach_name: Optional[str] = None

class TeamCreate(TeamBase):
    model_config = {
        "json_schema_extra": {
            "example": {
                "team_name": "India National Cricket Team",
                "coach_name": "Rahul Dravid"
            }
        }
    }

class Team(TeamBase):
    team_id: int
    class Config:
        from_attributes = True

# Player Schemas
class PlayerBase(BaseModel):
    player_name: str
    dob: Optional[date] = None
    batting_style: Optional[str] = None
    bowling_style: Optional[str] = None
    team_id: int

class PlayerCreate(PlayerBase):
    pass

class Player(PlayerBase):
    player_id: int
    class Config:
        from_attributes = True

# Match Schemas
class MatchBase(BaseModel):
    match_date: date
    venue: str
    match_type: Optional[str] = "ODI"
    team1_id: int
    team2_id: int
    winner_team_id: Optional[int] = None
    series_id: Optional[int] = None
    toss_winner_id: Optional[int] = None
    toss_decision: Optional[str] = None
    man_of_match_id: Optional[int] = None

class MatchCreate(MatchBase):
    pass

class Match(MatchBase):
    match_id: int
    class Config:
        from_attributes = True

# Scorecard Schemas
class BattingStatsCreate(BaseModel):
    player_id: int
    runs_scored: int = 0
    balls_faced: int = 0
    fours: int = 0
    sixes: int = 0
    dismissal_type: str = 'Did Not Bat'
    bowler_id: Optional[int] = None

class BowlingStatsCreate(BaseModel):
    player_id: int
    overs_bowled: Decimal = Decimal('0.0')
    runs_conceded: int = 0
    wickets_taken: int = 0
    maidens: int = 0
    no_balls: int = 0
    wides: int = 0

class InningsCreate(BaseModel):
    match_id: int
    innings_number: int
    batting_team_id: int
    bowling_team_id: int
    total_runs: int = 0
    total_wickets: int = 0
    extras: int = 0
    overs_played: Decimal = Decimal('0.0')
    batting_stats: List[BattingStatsCreate] = []
    bowling_stats: List[BowlingStatsCreate] = []

class Innings(BaseModel):
    match_id: int
    innings_number: int
    class Config:
        from_attributes = True

class BattingStats(BattingStatsCreate):
    match_id: int
    innings_number: int
    class Config:
        from_attributes = True

class BowlingStats(BowlingStatsCreate):
    match_id: int
    innings_number: int
    class Config:
        from_attributes = True

class InningsDetail(Innings):
    batting_team_id: int
    bowling_team_id: int
    total_runs: int
    total_wickets: int
    extras: int
    overs_played: Decimal
    batting_stats: List[BattingStats] = []
    bowling_stats: List[BowlingStats] = []

# Career Stats Schema
class PlayerCareerStats(BaseModel):
    player_id: int
    player_name: str
    team_name: Optional[str] = None
    total_runs: int
    balls_faced: int
    highest_score: int
    total_fours: int = 0
    total_sixes: int = 0
    batting_average: Optional[Decimal] = None
    batting_strike_rate: Optional[Decimal] = None
    total_wickets: int
    runs_conceded: int
    overs_bowled: Optional[Decimal] = None
    maiden_overs: int = 0
    bowling_average: Optional[Decimal] = None
    economy_rate: Optional[Decimal] = None
    bowling_strike_rate: Optional[Decimal] = None

    class Config:
        from_attributes = True
