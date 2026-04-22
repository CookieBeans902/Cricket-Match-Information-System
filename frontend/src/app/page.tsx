"use client";

import { useState, useEffect } from "react";
import { Users, Shield, Trophy, FileText, Activity } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("teams");

  const tabs = [
    { id: "teams", name: "Teams", icon: Users },
    { id: "players", name: "Players", icon: Shield },
    { id: "matches", name: "Matches", icon: Trophy },
    { id: "scorecard", name: "Scorecard Entry", icon: FileText },
    { id: "stats", name: "Player Stats", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-emerald-500 p-2 rounded-lg text-neutral-950">
            <Trophy size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">CricManager</h1>
        </div>

        <nav className="space-y-2 flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                    ? "bg-emerald-500/10 text-emerald-400 font-medium"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                  }`}
              >
                <Icon size={20} className={isActive ? "text-emerald-400" : "opacity-70"} />
                {tab.name}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-neutral-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 shadow-lg" />
            <div>
              <p className="text-sm font-medium text-neutral-200">Admin User</p>
              <p className="text-xs text-neutral-500">admin@cricmanager.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-10 max-w-6xl">
        <header className="mb-10">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
            {tabs.find((t) => t.id === activeTab)?.name}
          </h2>
          <p className="text-neutral-400 mt-2">Manage your cricket data efficiently.</p>
        </header>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full" />

          <div className="relative z-10">
            {activeTab === "teams" && <TeamForm />}
            {activeTab === "players" && <PlayerForm />}
            {activeTab === "matches" && <MatchForm />}
            {activeTab === "scorecard" && <ScorecardForm />}
            {activeTab === "stats" && <StatsView />}
          </div>
        </div>
      </main>
    </div>
  );
}

function TeamForm() {
  const [teamName, setTeamName] = useState("");
  const [coachName, setCoachName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleCreateTeam = async () => {
    if (!teamName) {
      setMessage({ text: "Team name is required", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("http://localhost:8000/teams/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team_name: teamName,
          coach_name: coachName || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create team. It might already exist.");
      }

      setMessage({ text: "New team created successfully!", type: "success" });
      setTeamName("");
      setCoachName("");
    } catch (error: any) {
      setMessage({ text: error.message || "An error occurred", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-md">
      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message.text}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Team Name</label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          placeholder="e.g. Mumbai Indians"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Coach Name</label>
        <input
          type="text"
          value={coachName}
          onChange={(e) => setCoachName(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          placeholder="e.g. Mahela Jayawardene"
        />
      </div>
      <button
        onClick={handleCreateTeam}
        disabled={loading}
        className="bg-emerald-500 text-neutral-950 font-semibold px-6 py-3 rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create Team"}
      </button>
    </div>
  );
}

function PlayerForm() {
  const [teams, setTeams] = useState<any[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [dob, setDob] = useState("");
  const [battingStyle, setBattingStyle] = useState("Right-hand bat");
  const [bowlingStyle, setBowlingStyle] = useState("Right-arm fast");
  const [teamId, setTeamId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetch("http://localhost:8000/teams/")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTeams(data);
        }
      })
      .catch(err => console.error("Failed to fetch teams:", err));
  }, []);

  const handleAddPlayer = async () => {
    if (!playerName || !teamId) {
      setMessage({ text: "Player name and Team are required", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("http://localhost:8000/players/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player_name: playerName,
          dob: dob || null,
          batting_style: battingStyle,
          bowling_style: bowlingStyle,
          team_id: parseInt(teamId),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add player.");
      }

      setMessage({ text: "Player added successfully!", type: "success" });
      setPlayerName("");
      setDob("");
      setBattingStyle("Right-hand bat");
      setBowlingStyle("Right-arm fast");
      setTeamId("");
    } catch (error: any) {
      setMessage({ text: error.message || "An error occurred", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-md">
      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message.text}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Player Name</label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          placeholder="e.g. Virat Kohli"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Date of Birth</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Batting Style</label>
          <select
            value={battingStyle}
            onChange={(e) => setBattingStyle(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          >
            <option>Right-hand bat</option>
            <option>Left-hand bat</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Bowling Style</label>
          <select
            value={bowlingStyle}
            onChange={(e) => setBowlingStyle(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          >
            <option>Right-arm fast</option>
            <option>Right-arm spin</option>
            <option>Left-arm fast</option>
            <option>Left-arm spin</option>
            <option>None</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Select Team</label>
        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        >
          <option value="">Select a team...</option>
          {teams.map((t) => (
            <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
          ))}
        </select>
      </div>
      <button
        onClick={handleAddPlayer}
        disabled={loading}
        className="bg-emerald-500 text-neutral-950 font-semibold px-6 py-3 rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Adding..." : "Add Player"}
      </button>
    </div>
  );
}

function MatchForm() {
  const [teams, setTeams] = useState<any[]>([]);
  const [matchDate, setMatchDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [venue, setVenue] = useState("");
  const [team1Id, setTeam1Id] = useState("");
  const [team2Id, setTeam2Id] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetch("http://localhost:8000/teams/")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTeams(data);
        }
      })
      .catch(err => console.error("Failed to fetch teams:", err));
  }, []);

  const handleScheduleMatch = async () => {
    if (!matchDate || !venue || !team1Id || !team2Id) {
      setMessage({ text: "All fields are required", type: "error" });
      return;
    }

    if (team1Id === team2Id) {
      setMessage({ text: "Team 1 and Team 2 must be different", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("http://localhost:8000/matches/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_date: matchDate,
          venue: venue,
          team1_id: parseInt(team1Id),
          team2_id: parseInt(team2Id),
        }),
      });

      if (!response.ok) {
        let errMsg = "Failed to schedule match.";
        try {
          const errData = await response.json();
          if (errData.detail) errMsg = errData.detail;
        } catch { }
        throw new Error(errMsg);
      }

      setMessage({ text: "Match scheduled successfully!", type: "success" });
      setMatchDate(new Date().toISOString().split("T")[0]);
      setVenue("");
      setTeam1Id("");
      setTeam2Id("");
    } catch (error: any) {
      setMessage({ text: error.message || "An error occurred", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message.text}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Match Date</label>
        <input
          type="date"
          value={matchDate}
          onChange={(e) => setMatchDate(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Venue</label>
        <input
          type="text"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          placeholder="e.g. Wankhede Stadium"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Team 1</label>
          <select
            value={team1Id}
            onChange={(e) => setTeam1Id(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          >
            <option value="">Select team...</option>
            {teams.map((t) => (
              <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Team 2</label>
          <select
            value={team2Id}
            onChange={(e) => setTeam2Id(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          >
            <option value="">Select team...</option>
            {teams.map((t) => (
              <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={handleScheduleMatch}
        disabled={loading}
        className="bg-emerald-500 text-neutral-950 font-semibold px-6 py-3 rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Scheduling..." : "Schedule Match"}
      </button>
    </div>
  );
}

function ScorecardForm() {
  const [matches, setMatches] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);

  const [matchId, setMatchId] = useState("");
  const [inningsNumber, setInningsNumber] = useState("1");
  const [battingTeamId, setBattingTeamId] = useState("");
  const [bowlingTeamId, setBowlingTeamId] = useState("");

  const [totalRuns, setTotalRuns] = useState("");
  const [totalWickets, setTotalWickets] = useState("");
  const [extras, setExtras] = useState("");

  const [batters, setBatters] = useState([{ playerId: "", runs: "", balls: "", dismissal: "Not Out" }]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8000/matches/").then(res => res.json()),
      fetch("http://localhost:8000/teams/").then(res => res.json()),
      fetch("http://localhost:8000/players/").then(res => res.json())
    ]).then(([matchesData, teamsData, playersData]) => {
      if (Array.isArray(matchesData)) setMatches(matchesData);
      if (Array.isArray(teamsData)) setTeams(teamsData);
      if (Array.isArray(playersData)) setPlayers(playersData);
    }).catch(err => console.error("Failed to fetch scorecard data:", err));
  }, []);

  const handleAddBatter = () => {
    setBatters([...batters, { playerId: "", runs: "", balls: "", dismissal: "Not Out" }]);
  };

  const handleBatterChange = (index: number, field: string, value: string) => {
    const newBatters = [...batters];
    newBatters[index] = { ...newBatters[index], [field]: value };
    setBatters(newBatters);
  };

  const handleFetchInnings = async () => {
    if (!matchId || !inningsNumber) {
      setMessage({ text: "Please select match and innings number first.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`http://localhost:8000/innings/${matchId}/${inningsNumber}`);
      if (!response.ok) {
        throw new Error("Scorecard not found");
      }

      const data = await response.json();
      setBattingTeamId(data.batting_team_id.toString());
      setBowlingTeamId(data.bowling_team_id.toString());
      setTotalRuns(data.total_runs.toString());
      setTotalWickets(data.total_wickets.toString());
      setExtras(data.extras.toString());

      if (data.batting_stats && data.batting_stats.length > 0) {
        setBatters(data.batting_stats.map((b: any) => ({
          playerId: b.player_id.toString(),
          runs: b.runs_scored.toString(),
          balls: b.balls_faced.toString(),
          dismissal: b.dismissal_type
        })));
      } else {
        setBatters([{ playerId: "", runs: "", balls: "", dismissal: "Not Out" }]);
      }

      setMessage({ text: "Fetched match saved details successfully!", type: "success" });
    } catch (error: any) {
      setMessage({ text: error.message || "An error occurred", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScorecard = async () => {
    if (!matchId || !battingTeamId || !bowlingTeamId) {
      setMessage({ text: "Match, Batting and Bowling teams are required.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    const battingStats = batters
      .filter(b => b.playerId)
      .map(b => ({
        player_id: parseInt(b.playerId),
        runs_scored: parseInt(b.runs) || 0,
        balls_faced: parseInt(b.balls) || 0,
        fours: 0,
        sixes: 0,
        dismissal_type: b.dismissal,
        bowler_id: null
      }));

    try {
      const response = await fetch("http://localhost:8000/innings/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_id: parseInt(matchId),
          innings_number: parseInt(inningsNumber),
          batting_team_id: parseInt(battingTeamId),
          bowling_team_id: parseInt(bowlingTeamId),
          total_runs: parseInt(totalRuns) || 0,
          total_wickets: parseInt(totalWickets) || 0,
          extras: parseInt(extras) || 0,
          batting_stats: battingStats,
          bowling_stats: []
        })
      });

      if (!response.ok) {
        let errMsg = "Failed to save scorecard.";
        try {
          const errData = await response.json();
          if (errData.detail) errMsg = errData.detail;
        } catch { }
        throw new Error(errMsg);
      }

      setMessage({ text: "Scorecard saved successfully!", type: "success" });
    } catch (error: any) {
      setMessage({ text: error.message || "An error occurred", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Select Match</label>
          <select
            value={matchId} onChange={e => setMatchId(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 transition-all">
            <option value="">Select match...</option>
            {matches.map(m => (
              <option key={m.match_id} value={m.match_id}>
                {m.match_date} - {m.venue}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Innings</label>
          <select
            value={inningsNumber} onChange={e => setInningsNumber(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 transition-all">
            <option value="1">1st Innings</option>
            <option value="2">2nd Innings</option>
            <option value="3">3rd Innings</option>
            <option value="4">4th Innings</option>
          </select>
        </div>
        <div className="col-span-2 flex items-end">
          <button
            onClick={handleFetchInnings}
            disabled={loading}
            className="w-full bg-cyan-500/10 text-cyan-400 font-medium px-6 py-3 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Fetch Match Saved Details
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Batting Team</label>
          <select
            value={battingTeamId} onChange={e => setBattingTeamId(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 transition-all">
            <option value="">Select team...</option>
            {teams.map((t) => <option key={t.team_id} value={t.team_id}>{t.team_name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Bowling Team</label>
          <select
            value={bowlingTeamId} onChange={e => setBowlingTeamId(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 transition-all">
            <option value="">Select team...</option>
            {teams.map((t) => <option key={t.team_id} value={t.team_id}>{t.team_name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-neutral-800">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Total Runs</label>
          <input type="number" value={totalRuns} onChange={e => setTotalRuns(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 transition-all" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Total Wickets</label>
          <input type="number" value={totalWickets} onChange={e => setTotalWickets(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 transition-all" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Extras</label>
          <input type="number" value={extras} onChange={e => setExtras(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 transition-all" placeholder="0" />
        </div>
      </div>

      <div className="bg-neutral-950/50 p-6 rounded-xl border border-neutral-800/50 space-y-4">
        <h3 className="text-lg font-medium text-emerald-400 flex items-center gap-2">
          <Activity size={18} /> Add Batting Performance
        </h3>

        {batters.map((batter, index) => (
          <div key={index} className="grid grid-cols-6 gap-4 items-end">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-500 mb-1">Batter</label>
              <select
                value={batter.playerId} onChange={e => handleBatterChange(index, "playerId", e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200">
                <option value="">Select player...</option>
                {players.map(p => <option key={p.player_id} value={p.player_id}>{p.player_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Runs</label>
              <input type="number" value={batter.runs} onChange={e => handleBatterChange(index, "runs", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Balls</label>
              <input type="number" value={batter.balls} onChange={e => handleBatterChange(index, "balls", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200" placeholder="0" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-500 mb-1">Dismissal</label>
              <select
                value={batter.dismissal} onChange={e => handleBatterChange(index, "dismissal", e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200">
                <option>Not Out</option>
                <option>Bowled</option>
                <option>Caught</option>
                <option>LBW</option>
                <option>Run Out</option>
              </select>
            </div>
          </div>
        ))}

        <button onClick={handleAddBatter} className="mt-4 text-sm text-emerald-500 hover:text-emerald-400 font-medium">+ Add another batter</button>
      </div>

      <button
        onClick={handleSaveScorecard}
        disabled={loading}
        className="w-full bg-emerald-500 text-neutral-950 font-bold px-6 py-4 rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : "Save Full Scorecard"}
      </button>
    </div>
  );
}

function StatsView() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/stats/players")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStats(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch player stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-neutral-400">Loading statistics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-neutral-950/50 text-neutral-300 uppercase font-medium">
            <tr>
              <th className="px-4 py-4 rounded-tl-lg">Player Name</th>
              <th className="px-4 py-4">Team</th>
              <th className="px-4 py-4 text-right">Runs</th>
              <th className="px-4 py-4 text-right">Bat Avg</th>
              <th className="px-4 py-4 text-right">Wickets</th>
              <th className="px-4 py-4 text-right rounded-tr-lg">Bowl Avg</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {stats.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  No player statistics available yet.
                </td>
              </tr>
            ) : (
              stats.map(player => (
                <tr key={player.player_id} className="hover:bg-neutral-800/20 transition-colors">
                  <td className="px-4 py-4 font-medium text-neutral-200">{player.player_name}</td>
                  <td className="px-4 py-4">{player.team_name || "N/A"}</td>
                  <td className="px-4 py-4 text-right text-emerald-400 font-medium">{player.total_runs || 0}</td>
                  <td className="px-4 py-4 text-right">{(player.batting_average != null) ? Number(player.batting_average).toFixed(2) : "0.00"}</td>
                  <td className="px-4 py-4 text-right">{player.total_wickets || 0}</td>
                  <td className="px-4 py-4 text-right">{(player.bowling_average != null) ? Number(player.bowling_average).toFixed(2) : "0.00"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-neutral-500 text-center mt-4">
        * Statistics are dynamically calculated from the BCNF-compliant Oracle Database view.
      </p>
    </div>
  );
}
