"use client";

import { useState, useEffect } from "react";
import { Users, Shield, Trophy, FileText, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("teams");
  const [user, setUser] = useState<{username: string, email: string} | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }
  }, []);

  const tabs = [
    { id: "teams", name: "Teams", icon: Users },
    { id: "players", name: "Players", icon: Shield },
    { id: "matches", name: "Matches", icon: Trophy },
    { id: "scorecard", name: "Scorecard Entry", icon: FileText },
    { id: "stats", name: "Player Stats", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans selection:bg-green-500/30 overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed inset-y-0 left-0 w-64 bg-neutral-950/80 backdrop-blur-xl border-r border-green-500/20 p-6 flex flex-col z-50 shadow-[4px_0_24px_rgba(34,197,94,0.1)]"
      >
        <div className="flex items-center gap-3 mb-10">
          <motion.div 
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="bg-green-500 p-2 rounded-lg text-black shadow-[0_0_15px_rgba(34,197,94,0.5)]"
          >
            <Trophy size={24} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-xl font-bold tracking-tight">CricManager</h1>
        </div>

        <nav className="space-y-2 flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${isActive
                    ? "bg-green-500/20 text-green-400 font-medium border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                    : "text-neutral-400 hover:bg-green-500/10 hover:text-green-300"
                  }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={20} className={isActive ? "text-green-400" : "opacity-70 group-hover:text-green-300"} />
                {tab.name}
              </motion.button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-green-500/20">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 shadow-[0_0_10px_rgba(52,211,153,0.5)] flex items-center justify-center text-black font-bold overflow-hidden select-none">
              {user ? user.username.charAt(0).toUpperCase() : ""}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-neutral-200 truncate" title={user?.username || "Admin User"}>{user ? user.username : "Admin User"}</p>
              <p className="text-xs text-neutral-500 truncate" title={user?.email || "admin@cricmanager.com"}>{user ? user.email : "admin@cricmanager.com"}</p>
            </div>
            {user && (
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { localStorage.removeItem('user'); setUser(null); }}
                className="ml-auto p-1.5 hover:bg-red-500/10 rounded-lg text-neutral-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </motion.button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="ml-64 p-10 max-w-6xl">
        <header className="mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            key={activeTab}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-300 to-green-600 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]"
          >
            {tabs.find((t) => t.id === activeTab)?.name}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-green-500/60 mt-2 font-medium"
          >
            Manage your cricket data efficiently.
          </motion.p>
        </header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-neutral-900/50 backdrop-blur-md border border-green-500/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(34,197,94,0.05)] relative overflow-hidden"
        >
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 blur-[100px] rounded-full pointer-events-none" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" 
          />

          <div className="relative z-10 w-full min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "teams" && <TeamForm />}
                {activeTab === "players" && <PlayerForm />}
                {activeTab === "matches" && <MatchForm />}
                {activeTab === "scorecard" && <ScorecardForm />}
                {activeTab === "stats" && <StatsView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
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
          className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
          placeholder="e.g. Mumbai Indians"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Coach Name</label>
        <input
          type="text"
          value={coachName}
          onChange={(e) => setCoachName(e.target.value)}
          className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
          placeholder="e.g. Mahela Jayawardene"
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34,197,94,0.4)" }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCreateTeam}
        disabled={loading}
        className="w-full bg-green-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]"
      >
        {loading ? "Creating..." : "Create Team"}
      </motion.button>
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
          className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
          placeholder="e.g. Virat Kohli"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Date of Birth</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Batting Style</label>
          <select
            value={battingStyle}
            onChange={(e) => setBattingStyle(e.target.value)}
            className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
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
            className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
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
          className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
        >
          <option value="">Select a team...</option>
          {teams.map((t) => (
            <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
          ))}
        </select>
      </div>
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34,197,94,0.4)" }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAddPlayer}
        disabled={loading}
        className="w-full bg-green-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]"
      >
        {loading ? "Adding..." : "Add Player"}
      </motion.button>
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
    <div className="space-y-6 max-w-lg w-full">
      {message.text && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'}`}
        >
          {message.text}
        </motion.div>
      )}
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Match Date</label>
        <input
          type="date"
          value={matchDate}
          onChange={(e) => setMatchDate(e.target.value)}
          className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Venue</label>
        <input
          type="text"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
          placeholder="e.g. Wankhede Stadium"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Team 1</label>
          <select
            value={team1Id}
            onChange={(e) => setTeam1Id(e.target.value)}
            className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
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
            className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
          >
            <option value="">Select team...</option>
            {teams.map((t) => (
              <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
            ))}
          </select>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34,197,94,0.4)" }}
        whileTap={{ scale: 0.98 }}
        onClick={handleScheduleMatch}
        disabled={loading}
        className="w-full bg-green-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]"
      >
        {loading ? "Scheduling..." : "Schedule Match"}
      </motion.button>
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
    <div className="space-y-6 w-full">
      {message.text && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'}`}
        >
          {message.text}
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Select Match</label>
          <select
            value={matchId} onChange={e => setMatchId(e.target.value)}
            className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]">
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
            className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]">
            <option value="1">1st Innings</option>
            <option value="2">2nd Innings</option>
            <option value="3">3rd Innings</option>
            <option value="4">4th Innings</option>
          </select>
        </div>
        <div className="col-span-2 flex items-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFetchInnings}
            disabled={loading}
            className="w-full bg-green-500/10 text-green-400 font-medium px-6 py-3 rounded-lg border border-green-500/30 hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,197,94,0.1)]"
          >
            Fetch Match Saved Details
          </motion.button>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Batting Team</label>
          <select
            value={battingTeamId} onChange={e => setBattingTeamId(e.target.value)}
            className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]">
            <option value="">Select team...</option>
            {teams.map((t) => <option key={t.team_id} value={t.team_id}>{t.team_name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Bowling Team</label>
          <select
            value={bowlingTeamId} onChange={e => setBowlingTeamId(e.target.value)}
            className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]">
            <option value="">Select team...</option>
            {teams.map((t) => <option key={t.team_id} value={t.team_id}>{t.team_name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-neutral-800">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Total Runs</label>
          <input type="number" value={totalRuns} onChange={e => setTotalRuns(e.target.value)} className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Total Wickets</label>
          <input type="number" value={totalWickets} onChange={e => setTotalWickets(e.target.value)} className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Extras</label>
          <input type="number" value={extras} onChange={e => setExtras(e.target.value)} className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]" placeholder="0" />
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

      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(34,197,94,0.4)" }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSaveScorecard}
        disabled={loading}
        className="w-full bg-green-500 text-black font-extrabold px-6 py-4 rounded-xl hover:bg-green-400 transition-colors shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : "Save Full Scorecard"}
      </motion.button>
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
      <div className="overflow-x-auto rounded-xl border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.05)] bg-black/50 backdrop-blur-md">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-black/80 text-green-400 uppercase font-bold text-xs tracking-wider border-b border-green-500/20">
            <tr>
              <th className="px-6 py-5">Player Name</th>
              <th className="px-6 py-5">Team</th>
              <th className="px-6 py-5 text-right">Runs</th>
              <th className="px-6 py-5 text-right">Bat Avg</th>
              <th className="px-6 py-5 text-right">Wickets</th>
              <th className="px-6 py-5 text-right">Bowl Avg</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-500/10">
            {stats.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  No player statistics available yet.
                </td>
              </tr>
            ) : (
              stats.map((player, idx) => (
                <motion.tr 
                  key={player.player_id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-green-500/5 transition-colors group cursor-default"
                >
                  <td className="px-6 py-4 font-medium text-neutral-200 group-hover:text-green-300 transition-colors">{player.player_name}</td>
                  <td className="px-6 py-4">{player.team_name || "N/A"}</td>
                  <td className="px-6 py-4 text-right text-green-400 font-bold">{player.total_runs || 0}</td>
                  <td className="px-6 py-4 text-right group-hover:text-neutral-200">{(player.batting_average != null) ? Number(player.batting_average).toFixed(2) : "0.00"}</td>
                  <td className="px-6 py-4 text-right text-emerald-400 font-bold">{player.total_wickets || 0}</td>
                  <td className="px-6 py-4 text-right group-hover:text-neutral-200">{(player.bowling_average != null) ? Number(player.bowling_average).toFixed(2) : "0.00"}</td>
                </motion.tr>
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
