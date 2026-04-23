from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import secrets
import os
from auth_module import send_otp_email
import models, schemas, database
from dotenv import load_dotenv

load_dotenv()


app = FastAPI(title="Cricket Match Information System")

# Configure CORS for Next.js frontend
origins = [
    "http://localhost:3000",
    os.getenv("FRONTEND_URL"),
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoints for Series

@app.post("/series/", response_model=schemas.Series)
def create_series(series: schemas.SeriesCreate, db: Session = Depends(database.get_db)):
    db_series = models.Series(**series.model_dump())
    db.add(db_series)
    db.commit()
    db.refresh(db_series)
    return db_series

@app.get("/series/", response_model=List[schemas.Series])
def get_series(db: Session = Depends(database.get_db)):
    return db.query(models.Series).all()

# Endpoints for authentication

# In-memory store for OTPs
otp_store: dict[str, str] = {}

@app.post("/auth/send-otp")
def api_send_otp(req: schemas.OTPRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if user:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    otp = str(int(secrets.token_hex(3), base=16)%1000000).rjust(6,'0')
    otp_store[req.email] = otp
    # Calling placeholder or real send_otp_email
    if not send_otp_email(req.email, otp):
        raise HTTPException(status_code=500, detail="Failed to send OTP")
    return {"message": "OTP sent successfully"}

@app.post("/auth/signup", response_model=schemas.User)
def signup(req: schemas.UserSignup, db: Session = Depends(database.get_db)):
    if req.email not in otp_store or otp_store[req.email] != req.otp:
        # otp_store.pop(req.email, None)
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    user_data = req.model_dump()
    user_data.pop("otp")
    db_user = models.User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    otp_store.pop(req.email, None)
    return db_user

@app.post("/auth/login")
def login(req: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user or user.password != req.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful", "user": {"email": user.email, "username": user.username}}

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
        extras=innings_data.extras,
        overs_played=innings_data.overs_played,
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
            bowler_id=bat_stat.bowler_id,
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
            maidens=bowl_stat.maidens,
            no_balls=bowl_stat.no_balls,
            wides=bowl_stat.wides,
        )
        db.add(db_bowl_stat)

    db.commit()
    return db_innings

@app.get("/innings/{match_id}/{innings_number}", response_model=schemas.InningsDetail)
def get_innings(match_id: int, innings_number: int, db: Session = Depends(database.get_db)):
    innings = db.query(models.Innings).filter(
        models.Innings.match_id == match_id,
        models.Innings.innings_number == innings_number
    ).first()
    if not innings:
        raise HTTPException(status_code=404, detail="Innings not found")
    return innings

# Endpoints for Statistics

@app.get("/stats/players", response_model=List[schemas.PlayerCareerStats])
def get_player_career_stats(db: Session = Depends(database.get_db)):
    return db.query(models.PlayerCareerStats).all()
