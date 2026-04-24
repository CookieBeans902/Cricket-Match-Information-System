"use client";

import { API_BASE_URL } from "@/lib/constants";
import { useState, useEffect } from "react";
import { FileText, Activity, Trophy, Eye, Search, BarChart3, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LiquidEther from "@/components/LiquidEther";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("scorecard");
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }
  }, []);

  const tabs = [
    { id: "scorecard", name: "Scorecard Viewer", icon: FileText },
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
            <Eye size={24} strokeWidth={2.5} />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">CricManager</h1>
            <span className="text-[10px] font-medium text-green-500/70 uppercase tracking-widest">Viewer</span>
          </div>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? "bg-green-500/20 text-green-400 font-medium border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                    : "text-neutral-400 hover:bg-green-500/10 hover:text-green-300"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="userActiveTabIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={20} className={isActive ? "text-green-400" : "opacity-70"} />
                {tab.name}
              </motion.button>
            );
          })}
        </nav>

        {/* Info Badge */}
        <div className="mt-4 mb-6 p-3 bg-green-500/5 rounded-xl border border-green-500/10">
          <div className="flex items-center gap-2 mb-1">
            <Eye size={14} className="text-green-500/60" />
            <span className="text-[11px] font-semibold text-green-400/80 uppercase tracking-wider">Read-Only Mode</span>
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            This view only fetches data. No modifications can be made.
          </p>
        </div>

        <div className="mt-auto pt-6 border-t border-green-500/20">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 shadow-[0_0_10px_rgba(52,211,153,0.5)] flex items-center justify-center text-black font-bold overflow-hidden select-none">
              {user ? user.username.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <p
                className="text-sm font-medium text-neutral-200 truncate"
                title={user?.username || "User"}
              >
                {user ? user.username : "User"}
              </p>
              <p
                className="text-xs text-neutral-500 truncate"
                title={user?.email || "user@cricmanager.com"}
              >
                {user ? user.email : "user@cricmanager.com"}
              </p>
            </div>
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
            Browse cricket data and statistics.
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
                {activeTab === "scorecard" && <ScorecardViewer />}
                {activeTab === "stats" && <StatsView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   SCORECARD VIEWER — Read-only, GET requests only
   ────────────────────────────────────────────────────────────────────────── */

function ScorecardViewer() {
  const [matches, setMatches] = useState<any[]>([]);
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const [matchTeams, setMatchTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [seriesList, setSeriesList] = useState<any[]>([]);

  const [matchId, setMatchId] = useState("");
  const [inningsNumber, setInningsNumber] = useState("1");

  const [inningsData, setInningsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/matches/`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/teams/`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/players/`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/series/`).then((res) => res.json()),
    ])
      .then(([matchesData, teamsData, playersData, seriesData]) => {
        if (Array.isArray(matchesData)) setMatches(matchesData);
        if (Array.isArray(teamsData)) setAllTeams(teamsData);
        if (Array.isArray(playersData)) setPlayers(playersData);
        if (Array.isArray(seriesData)) setSeriesList(seriesData);
      })
      .catch((err) => console.error("Failed to fetch data:", err));
  }, []);

  const getTeamName = (id: number | null) => {
    if (!id) return "—";
    return allTeams.find((t) => t.team_id === id)?.team_name || "Unknown";
  };
  const getSeriesName = (id: number | null) => {
    if (!id) return "—";
    return seriesList.find((s) => s.series_id === id)?.series_name || "Unknown";
  };
  const getPlayerName = (id: number | null) => {
    if (!id) return "—";
    return players.find((p) => p.player_id === id)?.player_name || "Unknown";
  };

  const selectedMatch = matchId ? matches.find((m) => String(m.match_id) === matchId) : null;

  const handleMatchChange = (selectedMatchId: string) => {
    setMatchId(selectedMatchId);
    setInningsData(null);
    if (!selectedMatchId) {
      setMatchTeams([]);
      return;
    }
    const match = matches.find((m) => String(m.match_id) === selectedMatchId);
    if (match) {
      const t1 = allTeams.find((t) => t.team_id === match.team1_id);
      const t2 = allTeams.find((t) => t.team_id === match.team2_id);
      setMatchTeams([t1, t2].filter(Boolean));
    } else {
      setMatchTeams([]);
    }
  };

  const handleFetchInnings = async () => {
    if (!matchId || !inningsNumber) {
      setMessage({ text: "Please select match and innings number first.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });
    setInningsData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/innings/${matchId}/${inningsNumber}`);
      if (!response.ok) {
        throw new Error("Scorecard not found for this match/innings combination.");
      }

      const data = await response.json();
      setInningsData(data);
      setMessage({ text: "Scorecard fetched successfully!", type: "success" });
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
          className={`p-4 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
              : "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Match & Innings Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Select Match</label>
          <select
            value={matchId}
            onChange={(e) => handleMatchChange(e.target.value)}
            className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
          >
            <option value="">Select match...</option>
            {matches.map((m) => {
              const t1 = allTeams.find((t) => t.team_id === m.team1_id);
              const t2 = allTeams.find((t) => t.team_id === m.team2_id);
              return (
                <option key={m.match_id} value={m.match_id}>
                  {t1?.team_name || "Team " + m.team1_id} vs {t2?.team_name || "Team " + m.team2_id} — {m.match_date} — {m.venue}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Innings</label>
          <select
            value={inningsNumber}
            onChange={(e) => setInningsNumber(e.target.value)}
            className="w-full bg-black border border-green-500/30 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
          >
            <option value="1">1st Innings</option>
            <option value="2">2nd Innings</option>
            <option value="3">3rd Innings</option>
            <option value="4">4th Innings</option>
          </select>
        </div>
        <div className="flex items-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFetchInnings}
            disabled={loading}
            className="w-full bg-green-500/10 text-green-400 font-medium px-6 py-3 rounded-lg border border-green-500/30 hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,197,94,0.1)] flex items-center justify-center gap-2"
          >
            <Search size={16} />
            {loading ? "Fetching..." : "Fetch Scorecard"}
          </motion.button>
        </div>
      </div>

      {/* Match Info Panel */}
      {selectedMatch && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-neutral-950/60 border border-green-500/10 rounded-xl p-5 mb-2"
        >
          <h4 className="text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Trophy size={14} /> Match Information
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="block text-xs text-neutral-500 mb-1">Date</span>
              <span className="text-sm text-neutral-200 font-medium">{selectedMatch.match_date || "—"}</span>
            </div>
            <div>
              <span className="block text-xs text-neutral-500 mb-1">Venue</span>
              <span className="text-sm text-neutral-200 font-medium">{selectedMatch.venue || "—"}</span>
            </div>
            <div>
              <span className="block text-xs text-neutral-500 mb-1">Match Type</span>
              <span className="text-sm text-neutral-200 font-medium">{selectedMatch.match_type || "—"}</span>
            </div>
            <div>
              <span className="block text-xs text-neutral-500 mb-1">Series</span>
              <span className="text-sm text-neutral-200 font-medium">{getSeriesName(selectedMatch.series_id)}</span>
            </div>
            <div>
              <span className="block text-xs text-neutral-500 mb-1">Team 1</span>
              <span className="text-sm text-neutral-200 font-medium">{getTeamName(selectedMatch.team1_id)}</span>
            </div>
            <div>
              <span className="block text-xs text-neutral-500 mb-1">Team 2</span>
              <span className="text-sm text-neutral-200 font-medium">{getTeamName(selectedMatch.team2_id)}</span>
            </div>
            <div>
              <span className="block text-xs text-neutral-500 mb-1">Toss Winner</span>
              <span className="text-sm text-neutral-200 font-medium">{getTeamName(selectedMatch.toss_winner_id)}</span>
            </div>
            <div>
              <span className="block text-xs text-neutral-500 mb-1">Toss Decision</span>
              <span className="text-sm text-neutral-200 font-medium">{selectedMatch.toss_decision || "—"}</span>
            </div>
            <div>
              <span className="block text-xs text-neutral-500 mb-1">Winner</span>
              <span className="text-sm text-neutral-200 font-medium">{getTeamName(selectedMatch.winner_team_id)}</span>
            </div>
            <div>
              <span className="block text-xs text-neutral-500 mb-1">Man of the Match</span>
              <span className="text-sm text-neutral-200 font-medium">{getPlayerName(selectedMatch.man_of_match_id)}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Scorecard Display — Read-only */}
      {inningsData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Innings Summary */}
          <div className="bg-neutral-950/60 border border-green-500/15 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-emerald-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 size={14} /> Innings Summary
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-black/40 rounded-lg p-3 border border-neutral-800/40">
                <span className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1">Batting Team</span>
                <span className="text-base text-neutral-100 font-semibold">{getTeamName(inningsData.batting_team_id)}</span>
              </div>
              <div className="bg-black/40 rounded-lg p-3 border border-neutral-800/40">
                <span className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1">Bowling Team</span>
                <span className="text-base text-neutral-100 font-semibold">{getTeamName(inningsData.bowling_team_id)}</span>
              </div>
              <div className="bg-black/40 rounded-lg p-3 border border-neutral-800/40">
                <span className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1">Total</span>
                <span className="text-2xl text-emerald-400 font-bold">{inningsData.total_runs || 0}</span>
                <span className="text-sm text-neutral-500">/{inningsData.total_wickets || 0}</span>
              </div>
              <div className="bg-black/40 rounded-lg p-3 border border-neutral-800/40">
                <span className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1">Overs</span>
                <span className="text-base text-neutral-100 font-semibold">{inningsData.overs_played ?? "—"}</span>
              </div>
              <div className="bg-black/40 rounded-lg p-3 border border-neutral-800/40">
                <span className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1">Extras</span>
                <span className="text-base text-neutral-100 font-semibold">{inningsData.extras || 0}</span>
              </div>
            </div>
          </div>

          {/* Batting Scorecard Table */}
          {inningsData.batting_stats && inningsData.batting_stats.length > 0 && (
            <div className="bg-neutral-950/50 p-6 rounded-xl border border-neutral-800/50">
              <h3 className="text-lg font-medium text-emerald-400 flex items-center gap-2 mb-4">
                <Activity size={18} /> Batting Scorecard
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-400">
                  <thead className="bg-neutral-950/70 text-neutral-300 uppercase font-medium text-xs">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Batter</th>
                      <th className="px-4 py-3 text-right">Runs</th>
                      <th className="px-4 py-3 text-right">Balls</th>
                      <th className="px-4 py-3 text-right">4s</th>
                      <th className="px-4 py-3 text-right">6s</th>
                      <th className="px-4 py-3 text-right">SR</th>
                      <th className="px-4 py-3 text-right rounded-tr-lg">Dismissal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    {inningsData.batting_stats.map((b: any, idx: number) => {
                      const sr = b.balls_faced > 0 ? ((b.runs_scored / b.balls_faced) * 100).toFixed(1) : "—";
                      return (
                        <tr key={idx} className="hover:bg-neutral-800/20 transition-colors">
                          <td className="px-4 py-3 font-medium text-neutral-200">{getPlayerName(b.player_id)}</td>
                          <td className="px-4 py-3 text-right text-emerald-400 font-semibold">{b.runs_scored}</td>
                          <td className="px-4 py-3 text-right">{b.balls_faced}</td>
                          <td className="px-4 py-3 text-right">{b.fours}</td>
                          <td className="px-4 py-3 text-right">{b.sixes}</td>
                          <td className="px-4 py-3 text-right text-neutral-300">{sr}</td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                b.dismissal_type === "Not Out"
                                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                  : "bg-red-500/10 text-red-400 border border-red-500/20"
                              }`}
                            >
                              {b.dismissal_type}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bowling Figures Table */}
          {inningsData.bowling_stats && inningsData.bowling_stats.length > 0 && (
            <div className="bg-neutral-950/50 p-6 rounded-xl border border-neutral-800/50">
              <h3 className="text-lg font-medium text-cyan-400 flex items-center gap-2 mb-4">
                <TrendingUp size={18} /> Bowling Figures
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-400">
                  <thead className="bg-neutral-950/70 text-neutral-300 uppercase font-medium text-xs">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Bowler</th>
                      <th className="px-4 py-3 text-right">Overs</th>
                      <th className="px-4 py-3 text-right">Maidens</th>
                      <th className="px-4 py-3 text-right">Runs</th>
                      <th className="px-4 py-3 text-right">Wkts</th>
                      <th className="px-4 py-3 text-right">NB</th>
                      <th className="px-4 py-3 text-right">Wd</th>
                      <th className="px-4 py-3 text-right rounded-tr-lg">Econ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    {inningsData.bowling_stats.map((b: any, idx: number) => {
                      const econ = b.overs_bowled > 0 ? (b.runs_conceded / b.overs_bowled).toFixed(2) : "—";
                      return (
                        <tr key={idx} className="hover:bg-neutral-800/20 transition-colors">
                          <td className="px-4 py-3 font-medium text-neutral-200">{getPlayerName(b.player_id)}</td>
                          <td className="px-4 py-3 text-right">{Number(b.overs_bowled).toFixed(1)}</td>
                          <td className="px-4 py-3 text-right">{b.maidens}</td>
                          <td className="px-4 py-3 text-right">{b.runs_conceded}</td>
                          <td className="px-4 py-3 text-right text-cyan-400 font-semibold">{b.wickets_taken}</td>
                          <td className="px-4 py-3 text-right">{b.no_balls}</td>
                          <td className="px-4 py-3 text-right">{b.wides}</td>
                          <td className="px-4 py-3 text-right text-neutral-300">{econ}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty state when no batting/bowling data */}
          {(!inningsData.batting_stats || inningsData.batting_stats.length === 0) &&
            (!inningsData.bowling_stats || inningsData.bowling_stats.length === 0) && (
              <div className="text-center py-10 text-neutral-500">
                <Activity size={40} className="mx-auto mb-3 opacity-30" />
                <p>Innings data found but no batting or bowling stats recorded yet.</p>
              </div>
            )}
        </motion.div>
      )}

      {/* Initial empty state */}
      {!inningsData && !loading && (
        <div className="text-center py-16 text-neutral-500">
          <FileText size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium text-neutral-400">Select a match and innings to view the scorecard</p>
          <p className="text-sm mt-1 text-neutral-600">Data is fetched in read-only mode</p>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   PLAYER STATS VIEW — Read-only, GET requests only
   ────────────────────────────────────────────────────────────────────────── */

function StatsView() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/stats/players`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStats(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch player stats:", err);
        setLoading(false);
      });
  }, []);

  const filteredStats = stats.filter(
    (p) =>
      p.player_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.team_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-16 text-neutral-400">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full mb-4"
        />
        Loading statistics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search players or teams..."
          className="w-full bg-black border border-green-500/30 rounded-lg pl-10 pr-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-green-500 transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
        />
      </div>

      {/* Batting Stats */}
      <div>
        <h3 className="text-base font-semibold text-emerald-400 mb-3 flex items-center gap-2">
          <BarChart3 size={16} /> Batting Statistics
        </h3>
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
              {filteredStats.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-neutral-500">
                    No player statistics available yet.
                  </td>
                </tr>
              ) : (
                filteredStats.map((player) => (
                  <tr key={`bat-${player.player_id}`} className="hover:bg-neutral-800/20 transition-colors">
                    <td className="px-4 py-4 font-medium text-neutral-200">{player.player_name}</td>
                    <td className="px-4 py-4">{player.team_name || "N/A"}</td>
                    <td className="px-4 py-4 text-right text-emerald-400 font-medium">{player.total_runs || 0}</td>
                    <td className="px-4 py-4 text-right">{player.highest_score || 0}</td>
                    <td className="px-4 py-4 text-right">{player.total_fours || 0}</td>
                    <td className="px-4 py-4 text-right">{player.total_sixes || 0}</td>
                    <td className="px-4 py-4 text-right">
                      {player.batting_average != null ? Number(player.batting_average).toFixed(2) : "—"}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {player.batting_strike_rate != null ? Number(player.batting_strike_rate).toFixed(2) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bowling Stats */}
      <div>
        <h3 className="text-base font-semibold text-cyan-400 mb-3 flex items-center gap-2">
          <TrendingUp size={16} /> Bowling Statistics
        </h3>
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
              {filteredStats.filter((p) => (p.total_wickets || 0) > 0 || (p.overs_bowled || 0) > 0).length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-neutral-500">
                    No bowling figures available yet.
                  </td>
                </tr>
              ) : (
                filteredStats
                  .filter((p) => (p.total_wickets || 0) > 0 || (p.overs_bowled || 0) > 0)
                  .map((player) => (
                    <tr key={`bowl-${player.player_id}`} className="hover:bg-neutral-800/20 transition-colors">
                      <td className="px-4 py-4 font-medium text-neutral-200">{player.player_name}</td>
                      <td className="px-4 py-4">{player.team_name || "N/A"}</td>
                      <td className="px-4 py-4 text-right">
                        {player.overs_bowled != null ? Number(player.overs_bowled).toFixed(1) : "0.0"}
                      </td>
                      <td className="px-4 py-4 text-right">{player.maiden_overs || 0}</td>
                      <td className="px-4 py-4 text-right">{player.runs_conceded || 0}</td>
                      <td className="px-4 py-4 text-right text-cyan-400 font-medium">{player.total_wickets || 0}</td>
                      <td className="px-4 py-4 text-right">
                        {player.bowling_average != null ? Number(player.bowling_average).toFixed(2) : "—"}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {player.economy_rate != null ? Number(player.economy_rate).toFixed(2) : "—"}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {player.bowling_strike_rate != null ? Number(player.bowling_strike_rate).toFixed(2) : "—"}
                      </td>
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
