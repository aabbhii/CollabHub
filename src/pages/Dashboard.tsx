import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import { Plus, Users, Calendar, ArrowRight, CheckCircle2, Clock, BarChart3, Zap } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function Dashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSession, setNewSession] = useState({ title: "", description: "", deadline: "" });
  const { user } = useAuthStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsRes, profileRes, notificationsRes] = await Promise.all([
        axios.get("/api/sessions"),
        axios.get("/api/profile"),
        axios.get("/api/notifications")
      ]);
      setSessions(sessionsRes.data);
      setProfile(profileRes.data);
      setNotifications(notificationsRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/sessions", newSession);
      setShowCreateModal(false);
      setNewSession({ title: "", description: "", deadline: "" });
      fetchData();
    } catch (err) {
      console.error("Failed to create session", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.username}!</h1>
          <p className="text-neutral-600">Here's what's happening with your study groups.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus className="w-5 h-5" />
          <span>New Session</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+2 new</span>
          </div>
          <div className="text-2xl font-bold">{sessions.length}</div>
          <div className="text-sm text-neutral-600">Active Sessions</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-sm text-neutral-600">Tasks Completed</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold">{profile?.xp || 0}</div>
          <div className="text-sm text-neutral-600">Total XP Earned</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold">Level {profile?.level || 1}</div>
          <div className="text-sm text-neutral-600">Current Rank</div>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold">Active Collaboration Sessions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {sessions.map((session) => (
              <motion.div 
                key={session.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold line-clamp-1">{session.title}</h3>
                    <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                      {session.members?.length || 0} Members
                    </span>
                  </div>
                  <p className="text-neutral-600 text-sm line-clamp-2">{session.description}</p>
                  
                  <div className="flex items-center text-sm text-neutral-500 space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(session.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{session.tasks?.length || 0} Tasks</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {session.members?.slice(0, 3).map((m: any, i: number) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">
                          {m.user?.username.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <Link 
                      to={`/sessions/${session.id}`}
                      className="text-indigo-600 font-semibold text-sm flex items-center space-x-1 hover:underline"
                    >
                      <span>View Session</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Notifications Sidebar */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Notifications</h2>
          <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100 shadow-sm overflow-hidden">
            {notifications.length > 0 ? notifications.map((notif) => (
              <div key={notif.id} className="p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{notif.title}</div>
                    <div className="text-xs text-neutral-500">{notif.message}</div>
                    <div className="text-[10px] text-neutral-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-neutral-400 text-sm">
                No new notifications.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">Create New Session</h2>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Session Title</label>
                <input 
                  type="text"
                  required
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. AI Project Session"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Description</label>
                <textarea 
                  required
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                  placeholder="What are we studying?"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Deadline</label>
                <input 
                  type="date"
                  required
                  value={newSession.deadline}
                  onChange={(e) => setNewSession({ ...newSession, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
