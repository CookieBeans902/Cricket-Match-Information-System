-- 02_views.sql
-- Oracle Database Dynamic Calculations Views for Cricket Match Information System

-- Career Statistics View
-- This view aggregates batting and bowling stats across all innings to prevent update anomalies.
CREATE OR REPLACE VIEW PLAYER_CAREER_STATS AS
SELECT 
    p.Player_ID,
    p.Player_Name,
    t.Team_Name,
    -- Batting Stats Calculation
    COALESCE(SUM(bat.Runs_Scored), 0) AS Total_Runs,
    COALESCE(SUM(bat.Balls_Faced), 0) AS Balls_Faced,
    COALESCE(MAX(bat.Runs_Scored), 0) AS Highest_Score,
    -- Average = Total Runs / Number of dismissals (Innings where dismissal is not 'Not Out' or 'Retired Hurt')
    -- We use NULLIF to avoid division by zero. If dismissals are 0, average will be NULL.
    CASE 
        WHEN SUM(CASE WHEN bat.Dismissal_Type NOT IN ('Not Out', 'Retired Hurt', 'Did Not Bat') THEN 1 ELSE 0 END) = 0 THEN NULL
        ELSE ROUND(SUM(bat.Runs_Scored) / NULLIF(SUM(CASE WHEN bat.Dismissal_Type NOT IN ('Not Out', 'Retired Hurt', 'Did Not Bat') THEN 1 ELSE 0 END), 0), 2)
    END AS Batting_Average,
    
    -- Strike Rate Calculation: (Total Runs / Balls Faced) * 100
    CASE
        WHEN SUM(bat.Balls_Faced) = 0 THEN 0
        ELSE ROUND((SUM(bat.Runs_Scored) / NULLIF(SUM(bat.Balls_Faced), 0)) * 100, 2)
    END AS Batting_Strike_Rate,

    -- Bowling Stats Calculation
    COALESCE(SUM(bowl.Wickets_Taken), 0) AS Total_Wickets,
    COALESCE(SUM(bowl.Runs_Conceded), 0) AS Runs_Conceded,
    
    -- Bowling Average = Runs Conceded / Wickets Taken
    CASE
        WHEN SUM(bowl.Wickets_Taken) = 0 THEN NULL
        ELSE ROUND(SUM(bowl.Runs_Conceded) / NULLIF(SUM(bowl.Wickets_Taken), 0), 2)
    END AS Bowling_Average

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
