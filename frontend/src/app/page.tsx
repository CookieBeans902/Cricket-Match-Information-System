"use client";

import { API_BASE_URL } from "@/lib/constants";
import { useState, useEffect } from "react";
import { Users, Shield, Trophy, FileText, Activity, CalendarRange } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LiquidEther from "@/components/LiquidEther";

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
    { id: "series", name: "Series", icon: CalendarRange },
    { id: "matches", name: "Matches", icon: Trophy },
    { id: "scorecard", name: "Scorecard Entry", icon: FileText },
    { id: "stats", name: "Player Stats", icon: Activity },
  ];

  return (
    <div className="relative min-h-screen bg-black text-neutral-100 font-sans selection:bg-green-500/30 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none w-full h-full z-0">
        <LiquidEther
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          colors={["#22c55e", "#4ade80", "#10b981"]}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          isBounce={false}
          resolution={0.5}
          className="w-full h-full"
        />
      </div>
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
      <main className="ml-64 p-10 max-w-6xl relative z-10 w-full min-h-screen">
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
                {activeTab === "series" && <SeriesForm />}
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
      const response = await fetch(`${API_BASE_URL}/teams/`, {
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

function SeriesForm() {
  const [seriesName, setSeriesName] = useState("");
  const [seriesType, setSeriesType] = useState("Bilateral");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleCreateSeries = async () => {
    if (!seriesName) {
      setMessage({ text: "Series name is required", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/series/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          series_name: seriesName,
          series_type: seriesType,
          start_date: startDate || null,
          end_date: endDate || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create series. It might already exist.");
      }

      setMessage({ text: "Series created successfully!", type: "success" });
      setSeriesName("");
      setSeriesType("Bilateral");
      setStartDate("");
      setEndDate("");
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
        <label className="block text-sm font-medium text-neutral-400 mb-2">Series Name</label>
        <input
          type="text"
          value={seriesName}
          onChange={(e) => setSeriesName(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          placeholder="e.g. India vs Australia 2024"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Series Type</label>
        <select
          value={seriesType}
          onChange={(e) => setSeriesType(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        >
          <option>Bilateral</option>
          <option>Tournament</option>
          <option>Tri-Series</option>
          <option>Other</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>
      <button
        onClick={handleCreateSeries}
        disabled={loading}
        className="bg-emerald-500 text-neutral-950 font-semibold px-6 py-3 rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create Series"}
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
    fetch(`${API_BASE_URL}/teams/`)
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
      const response = await fetch(`${API_BASE_URL}/players/`, {
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
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [matchDate, setMatchDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [venue, setVenue] = useState("");
  const [matchType, setMatchType] = useState("ODI");
  const [team1Id, setTeam1Id] = useState("");
  const [team2Id, setTeam2Id] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [tossWinnerId, setTossWinnerId] = useState("");
  const [tossDecision, setTossDecision] = useState("Bat");
  const [manOfMatchId, setManOfMatchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/teams/`).then(res => res.json()),
      fetch(`${API_BASE_URL}/series/`).then(res => res.json()),
      fetch(`${API_BASE_URL}/players/`).then(res => res.json()),
    ]).then(([teamsData, seriesData, playersData]) => {
      if (Array.isArray(teamsData)) setTeams(teamsData);
      if (Array.isArray(seriesData)) setSeriesList(seriesData);
      if (Array.isArray(playersData)) setPlayers(playersData);
    }).catch(err => console.error("Failed to fetch match form data:", err));
  }, []);

  const handleScheduleMatch = async () => {
    if (!matchDate || !venue || !team1Id || !team2Id) {
      setMessage({ text: "Match date, venue, and both teams are required", type: "error" });
      return;
    }

    if (team1Id === team2Id) {
      setMessage({ text: "Team 1 and Team 2 must be different", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/matches/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_date: matchDate,
          venue: venue,
          match_type: matchType,
          team1_id: parseInt(team1Id),
          team2_id: parseInt(team2Id),
          series_id: seriesId ? parseInt(seriesId) : null,
          toss_winner_id: tossWinnerId ? parseInt(tossWinnerId) : null,
          toss_decision: tossWinnerId ? tossDecision : null,
          man_of_match_id: manOfMatchId ? parseInt(manOfMatchId) : null,
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
      setMatchType("ODI");
      setTeam1Id("");
      setTeam2Id("");
      setSeriesId("");
      setTossWinnerId("");
      setTossDecision("Bat");
      setManOfMatchId("");
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
      <div className="grid grid-cols-2 gap-4">
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
          <label className="block text-sm font-medium text-neutral-400 mb-2">Match Type</label>
          <select
            value={matchType}
            onChange={(e) => setMatchType(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          >
            <option>Test</option>
            <option>ODI</option>
            <option>T20I</option>
            <option>T10</option>
            <option>The Hundred</option>
            <option>Other</option>
          </select>
        </div>
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

      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Series <span className="text-neutral-600">(optional)</span></label>
        <select
          value={seriesId}
          onChange={(e) => setSeriesId(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        >
          <option value="">No series</option>
          {seriesList.map((s) => (
            <option key={s.series_id} value={s.series_id}>{s.series_name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Toss Winner <span className="text-neutral-600">(optional)</span></label>
          <select
            value={tossWinnerId}
            onChange={(e) => setTossWinnerId(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          >
            <option value="">Not set</option>
            {teams.filter(t => [team1Id, team2Id].includes(String(t.team_id))).map((t) => (
              <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Toss Decision</label>
          <select
            value={tossDecision}
            onChange={(e) => setTossDecision(e.target.value)}
            disabled={!tossWinnerId}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-40"
          >
            <option>Bat</option>
            <option>Bowl</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Man of the Match <span className="text-neutral-600">(optional)</span></label>
        <select
          value={manOfMatchId}
          onChange={(e) => setManOfMatchId(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        >
          <option value="">Not yet awarded</option>
          {players.map((p) => (
            <option key={p.player_id} value={p.player_id}>{p.player_name}</option>
          ))}
        </select>
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
  const [oversPlayed, setOversPlayed] = useState("");

  const [batters, setBatters] = useState([{ playerId: "", runs: "", balls: "", fours: "", sixes: "", dismissal: "Not Out" }]);
  const [bowlers, setBowlers] = useState([{ playerId: "", overs: "", runs: "", wickets: "", maidens: "", noBalls: "", wides: "" }]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/matches/`).then(res => res.json()),
      fetch(`${API_BASE_URL}/teams/`).then(res => res.json()),
      fetch(`${API_BASE_URL}/players/`).then(res => res.json())
    ]).then(([matchesData, teamsData, playersData]) => {
      if (Array.isArray(matchesData)) setMatches(matchesData);
      if (Array.isArray(teamsData)) setTeams(teamsData);
      if (Array.isArray(playersData)) setPlayers(playersData);
    }).catch(err => console.error("Failed to fetch scorecard data:", err));
  }, []);

  const handleAddBatter = () => {
    setBatters([...batters, { playerId: "", runs: "", balls: "", fours: "", sixes: "", dismissal: "Not Out" }]);
  };

  const handleBatterChange = (index: number, field: string, value: string) => {
    const updated = [...batters];
    updated[index] = { ...updated[index], [field]: value };
    setBatters(updated);
  };

  const handleRemoveBatter = (index: number) => {
    setBatters(batters.filter((_, i) => i !== index));
  };

  const handleAddBowler = () => {
    setBowlers([...bowlers, { playerId: "", overs: "", runs: "", wickets: "", maidens: "", noBalls: "", wides: "" }]);
  };

  const handleBowlerChange = (index: number, field: string, value: string) => {
    const updated = [...bowlers];
    updated[index] = { ...updated[index], [field]: value };
    setBowlers(updated);
  };

  const handleRemoveBowler = (index: number) => {
    setBowlers(bowlers.filter((_, i) => i !== index));
  };

  const handleFetchInnings = async () => {
    if (!matchId || !inningsNumber) {
      setMessage({ text: "Please select match and innings number first.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/innings/${matchId}/${inningsNumber}`);
      if (!response.ok) {
        throw new Error("Scorecard not found");
      }

      const data = await response.json();
      setBattingTeamId(data.batting_team_id.toString());
      setBowlingTeamId(data.bowling_team_id.toString());
      setTotalRuns(data.total_runs.toString());
      setTotalWickets(data.total_wickets.toString());
      setExtras(data.extras.toString());
      setOversPlayed(data.overs_played?.toString() || "");

      if (data.batting_stats && data.batting_stats.length > 0) {
        setBatters(data.batting_stats.map((b: any) => ({
          playerId: b.player_id.toString(),
          runs: b.runs_scored.toString(),
          balls: b.balls_faced.toString(),
          fours: b.fours.toString(),
          sixes: b.sixes.toString(),
          dismissal: b.dismissal_type,
        })));
      } else {
        setBatters([{ playerId: "", runs: "", balls: "", fours: "", sixes: "", dismissal: "Not Out" }]);
      }

      if (data.bowling_stats && data.bowling_stats.length > 0) {
        setBowlers(data.bowling_stats.map((b: any) => ({
          playerId: b.player_id.toString(),
          overs: b.overs_bowled.toString(),
          runs: b.runs_conceded.toString(),
          wickets: b.wickets_taken.toString(),
          maidens: b.maidens.toString(),
          noBalls: b.no_balls.toString(),
          wides: b.wides.toString(),
        })));
      } else {
        setBowlers([{ playerId: "", overs: "", runs: "", wickets: "", maidens: "", noBalls: "", wides: "" }]);
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
        fours: parseInt(b.fours) || 0,
        sixes: parseInt(b.sixes) || 0,
        dismissal_type: b.dismissal,
        bowler_id: null,
      }));

    const bowlingStats = bowlers
      .filter(b => b.playerId)
      .map(b => ({
        player_id: parseInt(b.playerId),
        overs_bowled: parseFloat(b.overs) || 0,
        runs_conceded: parseInt(b.runs) || 0,
        wickets_taken: parseInt(b.wickets) || 0,
        maidens: parseInt(b.maidens) || 0,
        no_balls: parseInt(b.noBalls) || 0,
        wides: parseInt(b.wides) || 0,
      }));

    try {
      const response = await fetch(`${API_BASE_URL}/innings/`, {
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
          overs_played: parseFloat(oversPlayed) || 0,
          batting_stats: battingStats,
          bowling_stats: bowlingStats,
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
                {m.match_date} — {m.venue}
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

      <div className="grid grid-cols-4 gap-6 mb-8 pb-8 border-b border-neutral-800">
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
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Overs Played</label>
          <input type="number" step="0.1" value={oversPlayed} onChange={e => setOversPlayed(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 transition-all" placeholder="0.0" />
        </div>
      </div>

      {/* Batting Section */}
      <div className="bg-neutral-950/50 p-6 rounded-xl border border-neutral-800/50 space-y-4">
        <h3 className="text-lg font-medium text-emerald-400 flex items-center gap-2">
          <Activity size={18} /> Batting Performance
        </h3>

        {batters.map((batter, index) => (
          <div key={index} className="grid grid-cols-8 gap-3 items-end">
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
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">4s</label>
              <input type="number" value={batter.fours} onChange={e => handleBatterChange(index, "fours", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">6s</label>
              <input type="number" value={batter.sixes} onChange={e => handleBatterChange(index, "sixes", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Dismissal</label>
              <select
                value={batter.dismissal} onChange={e => handleBatterChange(index, "dismissal", e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200">
                <option>Not Out</option>
                <option>Bowled</option>
                <option>Caught</option>
                <option>LBW</option>
                <option>Run Out</option>
                <option>Stumped</option>
                <option>Hit Wicket</option>
                <option>Retired Hurt</option>
                <option>Did Not Bat</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              {batters.length > 1 && (
                <button onClick={() => handleRemoveBatter(index)} className="text-red-500/70 hover:text-red-400 text-xs">✕</button>
              )}
            </div>
          </div>
        ))}

        <button onClick={handleAddBatter} className="mt-2 text-sm text-emerald-500 hover:text-emerald-400 font-medium">+ Add another batter</button>
      </div>

      {/* Bowling Section */}
      <div className="bg-neutral-950/50 p-6 rounded-xl border border-neutral-800/50 space-y-4">
        <h3 className="text-lg font-medium text-cyan-400 flex items-center gap-2">
          <Activity size={18} /> Bowling Figures
        </h3>

        {bowlers.map((bowler, index) => (
          <div key={index} className="grid grid-cols-8 gap-3 items-end">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-500 mb-1">Bowler</label>
              <select
                value={bowler.playerId} onChange={e => handleBowlerChange(index, "playerId", e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200">
                <option value="">Select player...</option>
                {players.map(p => <option key={p.player_id} value={p.player_id}>{p.player_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Overs</label>
              <input type="number" step="0.1" value={bowler.overs} onChange={e => handleBowlerChange(index, "overs", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200" placeholder="0.0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Runs</label>
              <input type="number" value={bowler.runs} onChange={e => handleBowlerChange(index, "runs", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Wkts</label>
              <input type="number" value={bowler.wickets} onChange={e => handleBowlerChange(index, "wickets", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Mdns</label>
              <input type="number" value={bowler.maidens} onChange={e => handleBowlerChange(index, "maidens", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">NB / Wd</label>
              <div className="flex gap-1">
                <input type="number" value={bowler.noBalls} onChange={e => handleBowlerChange(index, "noBalls", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-2 py-2 text-sm text-neutral-200" placeholder="0" />
                <input type="number" value={bowler.wides} onChange={e => handleBowlerChange(index, "wides", e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-2 py-2 text-sm text-neutral-200" placeholder="0" />
              </div>
            </div>
            <div className="flex items-end pb-1">
              {bowlers.length > 1 && (
                <button onClick={() => handleRemoveBowler(index)} className="text-red-500/70 hover:text-red-400 text-xs">✕</button>
              )}
            </div>
          </div>
        ))}

        <button onClick={handleAddBowler} className="mt-2 text-sm text-cyan-500 hover:text-cyan-400 font-medium">+ Add another bowler</button>
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
    fetch(`${API_BASE_URL}/stats/players`)
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
    <div className="space-y-8">
      {/* Batting Stats */}
      <div>
        <h3 className="text-base font-semibold text-emerald-400 mb-3">Batting Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-950/50 text-neutral-300 uppercase font-medium">
              <tr>
                <th className="px-4 py-4 rounded-tl-lg">Player</th>
                <th className="px-4 py-4">Team</th>
                <th className="px-4 py-4 text-right">Runs</th>
                <th className="px-4 py-4 text-right">HS</th>
                <th className="px-4 py-4 text-right">4s</th>
                <th className="px-4 py-4 text-right">6s</th>
                <th className="px-4 py-4 text-right">Avg</th>
                <th className="px-4 py-4 text-right rounded-tr-lg">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {stats.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-neutral-500">No player statistics available yet.</td>
                </tr>
              ) : (
                stats.map(player => (
                  <tr key={`bat-${player.player_id}`} className="hover:bg-neutral-800/20 transition-colors">
                    <td className="px-4 py-4 font-medium text-neutral-200">{player.player_name}</td>
                    <td className="px-4 py-4">{player.team_name || "N/A"}</td>
                    <td className="px-4 py-4 text-right text-emerald-400 font-medium">{player.total_runs || 0}</td>
                    <td className="px-4 py-4 text-right">{player.highest_score || 0}</td>
                    <td className="px-4 py-4 text-right">{player.total_fours || 0}</td>
                    <td className="px-4 py-4 text-right">{player.total_sixes || 0}</td>
                    <td className="px-4 py-4 text-right">{player.batting_average != null ? Number(player.batting_average).toFixed(2) : "—"}</td>
                    <td className="px-4 py-4 text-right">{player.batting_strike_rate != null ? Number(player.batting_strike_rate).toFixed(2) : "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bowling Stats */}
      <div>
        <h3 className="text-base font-semibold text-cyan-400 mb-3">Bowling Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-950/50 text-neutral-300 uppercase font-medium">
              <tr>
                <th className="px-4 py-4 rounded-tl-lg">Player</th>
                <th className="px-4 py-4">Team</th>
                <th className="px-4 py-4 text-right">Overs</th>
                <th className="px-4 py-4 text-right">Mdns</th>
                <th className="px-4 py-4 text-right">Runs</th>
                <th className="px-4 py-4 text-right">Wkts</th>
                <th className="px-4 py-4 text-right">Avg</th>
                <th className="px-4 py-4 text-right">Econ</th>
                <th className="px-4 py-4 text-right rounded-tr-lg">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {stats.filter(p => (p.total_wickets || 0) > 0 || (p.overs_bowled || 0) > 0).length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-neutral-500">No bowling figures available yet.</td>
                </tr>
              ) : (
                stats
                  .filter(p => (p.total_wickets || 0) > 0 || (p.overs_bowled || 0) > 0)
                  .map(player => (
                    <tr key={`bowl-${player.player_id}`} className="hover:bg-neutral-800/20 transition-colors">
                      <td className="px-4 py-4 font-medium text-neutral-200">{player.player_name}</td>
                      <td className="px-4 py-4">{player.team_name || "N/A"}</td>
                      <td className="px-4 py-4 text-right">{player.overs_bowled != null ? Number(player.overs_bowled).toFixed(1) : "0.0"}</td>
                      <td className="px-4 py-4 text-right">{player.maiden_overs || 0}</td>
                      <td className="px-4 py-4 text-right">{player.runs_conceded || 0}</td>
                      <td className="px-4 py-4 text-right text-cyan-400 font-medium">{player.total_wickets || 0}</td>
                      <td className="px-4 py-4 text-right">{player.bowling_average != null ? Number(player.bowling_average).toFixed(2) : "—"}</td>
                      <td className="px-4 py-4 text-right">{player.economy_rate != null ? Number(player.economy_rate).toFixed(2) : "—"}</td>
                      <td className="px-4 py-4 text-right">{player.bowling_strike_rate != null ? Number(player.bowling_strike_rate).toFixed(2) : "—"}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-neutral-500 text-center">
        * Statistics are dynamically calculated from the BCNF-compliant Oracle Database view.
      </p>
    </div>
  );
}
