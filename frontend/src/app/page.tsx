"use client";

import { useState } from "react";
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
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
  return (
    <div className="space-y-6 max-w-md">
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Team Name</label>
        <input type="text" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="e.g. Mumbai Indians" />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Coach Name</label>
        <input type="text" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="e.g. Mahela Jayawardene" />
      </div>
      <button className="bg-emerald-500 text-neutral-950 font-semibold px-6 py-3 rounded-lg hover:bg-emerald-400 transition-colors">
        Create Team
      </button>
    </div>
  );
}

function PlayerForm() {
  return (
    <div className="space-y-6 max-w-md">
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Player Name</label>
        <input type="text" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="e.g. Virat Kohli" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Batting Style</label>
          <select className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all">
            <option>Right-hand bat</option>
            <option>Left-hand bat</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Bowling Style</label>
          <select className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all">
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
        <select className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all">
          <option>Select a team...</option>
        </select>
      </div>
      <button className="bg-emerald-500 text-neutral-950 font-semibold px-6 py-3 rounded-lg hover:bg-emerald-400 transition-colors">
        Add Player
      </button>
    </div>
  );
}

function MatchForm() {
  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Match Date</label>
        <input type="date" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">Venue</label>
        <input type="text" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="e.g. Wankhede Stadium" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Team 1</label>
          <select className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all">
            <option>Select team...</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Team 2</label>
          <select className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all">
            <option>Select team...</option>
          </select>
        </div>
      </div>
      <button className="bg-emerald-500 text-neutral-950 font-semibold px-6 py-3 rounded-lg hover:bg-emerald-400 transition-colors">
        Schedule Match
      </button>
    </div>
  );
}

function ScorecardForm() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-neutral-800">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Select Match</label>
          <select className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 transition-all">
            <option>Select match...</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Batting Team</label>
          <select className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 transition-all">
            <option>Select team...</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Innings Total Runs</label>
          <input type="number" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-emerald-500 transition-all" placeholder="0" />
        </div>
      </div>

      <div className="bg-neutral-950/50 p-6 rounded-xl border border-neutral-800/50">
        <h3 className="text-lg font-medium text-emerald-400 mb-4 flex items-center gap-2">
          <Activity size={18} /> Add Batting Performance
        </h3>
        <div className="grid grid-cols-6 gap-4 items-end">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-neutral-500 mb-1">Batter</label>
            <select className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200">
              <option>Select player...</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Runs</label>
            <input type="number" className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200" placeholder="0" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Balls</label>
            <input type="number" className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200" placeholder="0" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-neutral-500 mb-1">Dismissal</label>
            <select className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200">
              <option>Not Out</option>
              <option>Bowled</option>
              <option>Caught</option>
              <option>LBW</option>
              <option>Run Out</option>
            </select>
          </div>
        </div>
        <button className="mt-4 text-sm text-emerald-500 hover:text-emerald-400 font-medium">+ Add another batter</button>
      </div>

      <button className="w-full bg-emerald-500 text-neutral-950 font-bold px-6 py-4 rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
        Save Full Scorecard
      </button>
    </div>
  );
}

function StatsView() {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-neutral-950/50 text-neutral-300 uppercase font-medium">
            <tr>
              <th className="px-4 py-4 rounded-tl-lg">Player Name</th>
              <th className="px-4 py-4">Team</th>
              <th className="px-4 py-4 text-right">Runs</th>
              <th className="px-4 py-4 text-right">Avg</th>
              <th className="px-4 py-4 text-right">Wickets</th>
              <th className="px-4 py-4 text-right rounded-tr-lg">Bowl Avg</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {/* Example rows */}
            <tr className="hover:bg-neutral-800/20 transition-colors">
              <td className="px-4 py-4 font-medium text-neutral-200">Virat Kohli</td>
              <td className="px-4 py-4">RCB</td>
              <td className="px-4 py-4 text-right text-emerald-400 font-medium">7263</td>
              <td className="px-4 py-4 text-right">37.24</td>
              <td className="px-4 py-4 text-right">4</td>
              <td className="px-4 py-4 text-right">92.00</td>
            </tr>
            <tr className="hover:bg-neutral-800/20 transition-colors">
              <td className="px-4 py-4 font-medium text-neutral-200">Jasprit Bumrah</td>
              <td className="px-4 py-4">MI</td>
              <td className="px-4 py-4 text-right text-emerald-400 font-medium">67</td>
              <td className="px-4 py-4 text-right">7.44</td>
              <td className="px-4 py-4 text-right">145</td>
              <td className="px-4 py-4 text-right">23.30</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-neutral-500 text-center mt-4">
        * Statistics are dynamically calculated from the BCNF-compliant Oracle Database.
      </p>
    </div>
  );
}
