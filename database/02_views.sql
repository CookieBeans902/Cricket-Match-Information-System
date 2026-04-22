-- 02_views.sql
-- Oracle Database Dynamic Calculations Views for Cricket Match Information System
-- All views use CREATE OR REPLACE, making them safe to run multiple times.

-- Career Statistics View
-- Aggregates batting and bowling stats across all innings to prevent update anomalies.
CREATE OR REPLACE VIEW PLAYER_CAREER_STATS AS
SELECT 
    p.Player_ID,
    p.Player_Name,
    t.Team_Name,
    -- Batting Stats
    COALESCE(SUM(bat.Runs_Scored), 0)   AS Total_Runs,
    COALESCE(SUM(bat.Balls_Faced), 0)   AS Balls_Faced,
    COALESCE(MAX(bat.Runs_Scored), 0)   AS Highest_Score,
    COALESCE(SUM(bat.Fours), 0)         AS Total_Fours,
    COALESCE(SUM(bat.Sixes), 0)         AS Total_Sixes,
    -- Batting Average = Total Runs / Dismissals (excludes Not Out / Retired Hurt / Did Not Bat)
    CASE 
        WHEN SUM(CASE WHEN bat.Dismissal_Type NOT IN ('Not Out', 'Retired Hurt', 'Did Not Bat') THEN 1 ELSE 0 END) = 0 THEN NULL
        ELSE ROUND(
            SUM(bat.Runs_Scored) /
            NULLIF(SUM(CASE WHEN bat.Dismissal_Type NOT IN ('Not Out', 'Retired Hurt', 'Did Not Bat') THEN 1 ELSE 0 END), 0),
            2)
    END AS Batting_Average,
    -- Batting Strike Rate = (Total Runs / Balls Faced) * 100
    CASE
        WHEN SUM(bat.Balls_Faced) = 0 THEN 0
        ELSE ROUND((SUM(bat.Runs_Scored) / NULLIF(SUM(bat.Balls_Faced), 0)) * 100, 2)
    END AS Batting_Strike_Rate,
    -- Bowling Stats
    COALESCE(SUM(bowl.Wickets_Taken), 0)  AS Total_Wickets,
    COALESCE(SUM(bowl.Runs_Conceded), 0)  AS Runs_Conceded,
    COALESCE(SUM(bowl.Overs_Bowled), 0)   AS Overs_Bowled,
    COALESCE(SUM(bowl.Maidens), 0)        AS Maiden_Overs,
    -- Bowling Average = Runs Conceded / Wickets Taken
    CASE
        WHEN SUM(bowl.Wickets_Taken) = 0 THEN NULL
        ELSE ROUND(SUM(bowl.Runs_Conceded) / NULLIF(SUM(bowl.Wickets_Taken), 0), 2)
    END AS Bowling_Average,
    -- Economy Rate = Runs Conceded / Overs Bowled
    CASE
        WHEN SUM(bowl.Overs_Bowled) = 0 THEN NULL
        ELSE ROUND(SUM(bowl.Runs_Conceded) / NULLIF(SUM(bowl.Overs_Bowled), 0), 2)
    END AS Economy_Rate,
    -- Bowling Strike Rate = Balls Bowled / Wickets Taken
    -- Overs in cricket notation (e.g. 4.3 means 4 full overs + 3 balls = 27 balls)
    CASE
        WHEN SUM(bowl.Wickets_Taken) = 0 THEN NULL
        ELSE ROUND(
            (FLOOR(SUM(bowl.Overs_Bowled)) * 6 + (SUM(bowl.Overs_Bowled) - FLOOR(SUM(bowl.Overs_Bowled))) * 10) /
            NULLIF(SUM(bowl.Wickets_Taken), 0),
            2)
    END AS Bowling_Strike_Rate
FROM 
    PLAYER p
LEFT JOIN 
    TEAM t ON p.Team_ID = t.Team_ID
LEFT JOIN 
    BATTING_STATS bat ON p.Player_ID = bat.Player_ID
LEFT JOIN 
    BOWLING_STATS bowl ON p.Player_ID = bowl.Player_ID
GROUP BY 
    p.Player_ID, p.Player_Name, t.Team_Name;
