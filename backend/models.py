from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey, CheckConstraint, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Series(Base):
    __tablename__ = "series"
    series_id = Column(Integer, primary_key=True)
    series_name = Column(String(200), unique=True, nullable=False)
    series_type = Column(String(50), default="Bilateral")
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

    __table_args__ = (
        CheckConstraint(
            "series_type IN ('Bilateral', 'Tournament', 'Tri-Series', 'Other')",
            name='chk_series_type'
        ),
    )

    matches = relationship("Match", back_populates="series")

class User(Base):
    __tablename__ = "users"
    email = Column(String(100), primary_key=True)
    username = Column(String(100), nullable=False)
    password = Column(String(100), nullable=False)
    age = Column(Integer)
    iiti = Column(Boolean)

class Team(Base):
    __tablename__ = "team"
    team_id = Column(Integer, primary_key=True)
    team_name = Column(String(100), unique=True, nullable=False)
    coach_name = Column(String(100))

    players = relationship("Player", back_populates="team")

class Player(Base):
    __tablename__ = "player"
    player_id = Column(Integer, primary_key=True)
    player_name = Column(String(100), nullable=False)
    dob = Column(Date)
    batting_style = Column(String(50))
    bowling_style = Column(String(50))
    team_id = Column(Integer, ForeignKey("team.team_id", ondelete="CASCADE"), nullable=False)

    team = relationship("Team", back_populates="players")
    batting_stats = relationship("BattingStats", back_populates="player", foreign_keys="[BattingStats.player_id]")
    bowling_stats = relationship("BowlingStats", back_populates="player")

class Match(Base):
    __tablename__ = "match"
    match_id = Column(Integer, primary_key=True)
    match_date = Column(Date, nullable=False)
    venue = Column(String(150), nullable=False)
    match_type = Column(String(20), default="ODI")
    team1_id = Column(Integer, ForeignKey("team.team_id"), nullable=False)
    team2_id = Column(Integer, ForeignKey("team.team_id"), nullable=False)
    winner_team_id = Column(Integer, ForeignKey("team.team_id"), nullable=True)
    series_id = Column(Integer, ForeignKey("series.series_id"), nullable=True)
    toss_winner_id = Column(Integer, ForeignKey("team.team_id"), nullable=True)
    toss_decision = Column(String(10), nullable=True)
    man_of_match_id = Column(Integer, ForeignKey("player.player_id"), nullable=True)

    __table_args__ = (
        CheckConstraint('team1_id <> team2_id', name='chk_teams_different'),
        CheckConstraint("match_type IN ('Test', 'ODI', 'T20I', 'T10', 'The Hundred', 'Other')", name='chk_match_type'),
        CheckConstraint("toss_decision IN ('Bat', 'Bowl')", name='chk_toss_decision'),
    )

    innings = relationship("Innings", back_populates="match")
    team1 = relationship("Team", foreign_keys=[team1_id])
    team2 = relationship("Team", foreign_keys=[team2_id])
    winner_team = relationship("Team", foreign_keys=[winner_team_id])
    series = relationship("Series", back_populates="matches")
    toss_winner = relationship("Team", foreign_keys=[toss_winner_id])
    man_of_match = relationship("Player", foreign_keys=[man_of_match_id])

class Innings(Base):
    __tablename__ = "innings"
    innings_id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey("match.match_id", ondelete="CASCADE"), nullable=False)
    innings_number = Column(Integer, nullable=False)
    batting_team_id = Column(Integer, ForeignKey("team.team_id"), nullable=False)
    bowling_team_id = Column(Integer, ForeignKey("team.team_id"), nullable=False)
    total_runs = Column(Integer, default=0)
    total_wickets = Column(Integer, default=0)
    extras = Column(Integer, default=0)
    overs_played = Column(Numeric(5, 1), default=0)

    __table_args__ = (
        CheckConstraint('innings_number IN (1, 2, 3, 4)', name='chk_innings_number'),
        CheckConstraint('batting_team_id <> bowling_team_id', name='chk_bat_bowl_different'),
    )

    match = relationship("Match", back_populates="innings")
    batting_team = relationship("Team", foreign_keys=[batting_team_id])
    bowling_team = relationship("Team", foreign_keys=[bowling_team_id])
    batting_stats = relationship("BattingStats", back_populates="innings")
    bowling_stats = relationship("BowlingStats", back_populates="innings")

class BattingStats(Base):
    __tablename__ = "batting_stats"
    player_id = Column(Integer, ForeignKey("player.player_id"), primary_key=True)
    innings_id = Column(Integer, ForeignKey("innings.innings_id", ondelete="CASCADE"), primary_key=True)
    runs_scored = Column(Integer, default=0)
    balls_faced = Column(Integer, default=0)
    fours = Column(Integer, default=0)
    sixes = Column(Integer, default=0)
    dismissal_type = Column(String(50), default='Did Not Bat')
    bowler_id = Column(Integer, ForeignKey("player.player_id"), nullable=True)

    player = relationship("Player", back_populates="batting_stats", foreign_keys=[player_id])
    innings = relationship("Innings", back_populates="batting_stats")
    bowler = relationship("Player", foreign_keys=[bowler_id])

class BowlingStats(Base):
    __tablename__ = "bowling_stats"
    player_id = Column(Integer, ForeignKey("player.player_id"), primary_key=True)
    innings_id = Column(Integer, ForeignKey("innings.innings_id", ondelete="CASCADE"), primary_key=True)
    overs_bowled = Column(Numeric(5, 1), default=0)
    runs_conceded = Column(Integer, default=0)
    wickets_taken = Column(Integer, default=0)
    maidens = Column(Integer, default=0)
    no_balls = Column(Integer, default=0)
    wides = Column(Integer, default=0)

    player = relationship("Player", back_populates="bowling_stats")
    innings = relationship("Innings", back_populates="bowling_stats")

# Read-only model for the SQL View
class PlayerCareerStats(Base):
    __tablename__ = "player_career_stats"
    player_id = Column(Integer, primary_key=True)
    player_name = Column(String)
    team_name = Column(String)
    total_runs = Column(Integer)
    balls_faced = Column(Integer)
    highest_score = Column(Integer)
    total_fours = Column(Integer)
    total_sixes = Column(Integer)
    batting_average = Column(Numeric)
    batting_strike_rate = Column(Numeric)
    total_wickets = Column(Integer)
    runs_conceded = Column(Numeric)
    overs_bowled = Column(Numeric)
    maiden_overs = Column(Integer)
    bowling_average = Column(Numeric)
    economy_rate = Column(Numeric)
    bowling_strike_rate = Column(Numeric)
