import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { Trophy, Medal, Star, ArrowUp, ArrowDown, Minus, Users } from "lucide-react";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await axios.get("/api/leaderboard");
      setLeaderboard(data);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 bg-yellow-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border-4 border-yellow-100"
        >
          <Trophy className="w-10 h-10 text-yellow-600" />
        </motion.div>
        <h1 className="text-4xl font-bold">Global Leaderboard</h1>
        <p className="text-neutral-600">Compete with the most productive students in the community.</p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xl">
        <div className="grid grid-cols-12 px-8 py-4 bg-neutral-50 border-b border-neutral-200 text-xs font-bold text-neutral-400 uppercase tracking-wider">
          <div className="col-span-1">Rank</div>
          <div className="col-span-6">Student</div>
          <div className="col-span-2 text-center">Level</div>
          <div className="col-span-3 text-right">Total XP</div>
        </div>

        <div className="divide-y divide-neutral-100">
          {leaderboard.map((profile, i) => (
            <motion.div 
              key={profile.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`grid grid-cols-12 px-8 py-6 items-center hover:bg-neutral-50 transition-colors ${
                i === 0 ? "bg-yellow-50/30" : 
                i === 1 ? "bg-neutral-50/30" : 
                i === 2 ? "bg-orange-50/30" : ""
              }`}
            >
              <div className="col-span-1 flex items-center space-x-2">
                {i === 0 ? <Medal className="w-6 h-6 text-yellow-600" /> :
                 i === 1 ? <Medal className="w-6 h-6 text-neutral-400" /> :
                 i === 2 ? <Medal className="w-6 h-6 text-orange-600" /> :
                 <span className="text-lg font-bold text-neutral-400 pl-1">{i + 1}</span>}
              </div>

              <div className="col-span-6 flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                  i === 0 ? "bg-yellow-100 text-yellow-700" :
                  i === 1 ? "bg-neutral-100 text-neutral-700" :
                  i === 2 ? "bg-orange-100 text-orange-700" :
                  "bg-indigo-50 text-indigo-600"
                }`}>
                  {profile.user?.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-lg">{profile.user?.username}</div>
                  <div className="text-xs font-semibold text-neutral-400 flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{profile.experienceLevel}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-2 text-center">
                <span className="px-3 py-1 bg-white border border-neutral-200 rounded-lg font-bold text-sm">
                  Lvl {profile.level}
                </span>
              </div>

              <div className="col-span-3 text-right">
                <div className="text-xl font-black text-indigo-600">{profile.xp.toLocaleString()}</div>
                <div className="text-xs font-bold text-green-600 flex items-center justify-end space-x-1">
                  <ArrowUp className="w-3 h-3" />
                  <span>+{Math.floor(Math.random() * 500)} today</span>
                </div>
              </div>
            </motion.div>
          ))}

          {leaderboard.length === 0 && (
            <div className="py-24 text-center space-y-4">
              <Trophy className="w-16 h-16 text-neutral-200 mx-auto" />
              <p className="text-neutral-400 font-medium">No data available yet. Be the first to join!</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-8 rounded-3xl text-white space-y-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Monthly Rewards</h3>
          <p className="text-indigo-100 text-sm">Top 3 students each month receive exclusive badges and premium features.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
            <Star className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold">XP Multipliers</h3>
          <p className="text-neutral-600 text-sm">Complete tasks before deadlines to earn bonus XP and climb faster.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold">Team Bonuses</h3>
          <p className="text-neutral-600 text-sm">Collaborate in sessions with 3+ members to unlock team XP multipliers.</p>
        </div>
      </div>
    </div>
  );
}
