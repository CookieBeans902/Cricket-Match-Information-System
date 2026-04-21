from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas, database

app = FastAPI(title="Cricket Match Information System")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoints for Team
@app.post("/teams/", response_model=schemas.Team)
def create_team(team: schemas.TeamCreate, db: Session = Depends(database.get_db)):
    db_team = models.Team(**team.model_dump())
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

@app.get("/teams/", response_model=List[schemas.Team])
def get_teams(db: Session = Depends(database.get_db)):
    return db.query(models.Team).all()

# Endpoints for Player
@app.post("/players/", response_model=schemas.Player)
def create_player(player: schemas.PlayerCreate, db: Session = Depends(database.get_db)):
    db_player = models.Player(**player.model_dump())
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

@app.get("/players/", response_model=List[schemas.Player])
def get_players(db: Session = Depends(database.get_db)):
    return db.query(models.Player).all()

# Endpoints for Match
@app.post("/matches/", response_model=schemas.Match)
def create_match(match: schemas.MatchCreate, db: Session = Depends(database.get_db)):
    if match.team1_id == match.team2_id:
        raise HTTPException(status_code=400, detail="Team 1 and Team 2 must be different.")
    db_match = models.Match(**match.model_dump())
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match

@app.get("/matches/", response_model=List[schemas.Match])
def get_matches(db: Session = Depends(database.get_db)):
    return db.query(models.Match).all()

# Endpoints for Innings & Scorecard
@app.post("/innings/", response_model=schemas.Innings)
def create_innings_scorecard(innings_data: schemas.InningsCreate, db: Session = Depends(database.get_db)):
    # Create Innings
    db_innings = models.Innings(
        match_id=innings_data.match_id,
        innings_number=innings_data.innings_number,
        batting_team_id=innings_data.batting_team_id,
        bowling_team_id=innings_data.bowling_team_id,
        total_runs=innings_data.total_runs,
        total_wickets=innings_data.total_wickets,
        extras=innings_data.extras
    )
    db.add(db_innings)
    db.commit()
    db.refresh(db_innings)

    # Create Batting Stats
    for bat_stat in innings_data.batting_stats:
        db_bat_stat = models.BattingStats(
            player_id=bat_stat.player_id,
            innings_id=db_innings.innings_id,
            runs_scored=bat_stat.runs_scored,
            balls_faced=bat_stat.balls_faced,
            fours=bat_stat.fours,
            sixes=bat_stat.sixes,
            dismissal_type=bat_stat.dismissal_type,
            bowler_id=bat_stat.bowler_id
        )
        db.add(db_bat_stat)

    # Create Bowling Stats
    for bowl_stat in innings_data.bowling_stats:
        db_bowl_stat = models.BowlingStats(
            player_id=bowl_stat.player_id,
            innings_id=db_innings.innings_id,
            overs_bowled=bowl_stat.overs_bowled,
            runs_conceded=bowl_stat.runs_conceded,
            wickets_taken=bowl_stat.wickets_taken,
            maidens=bowl_stat.maidens
        )
        db.add(db_bowl_stat)

    db.commit()
    return db_innings

# Endpoints for Statistics
@app.get("/stats/players", response_model=List[schemas.PlayerCareerStats])
def get_player_career_stats(db: Session = Depends(database.get_db)):
    # Using the Oracle View to fetch dynamically calculated stats
    return db.query(models.PlayerCareerStats).all()
