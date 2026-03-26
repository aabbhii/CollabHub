import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { User, Mail, Briefcase, Award, Zap, Code, Target, Edit3, Save, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", bio: "", techStack: "", experienceLevel: "" });
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("/api/profile");
      setProfile(data);
      setEditData({
        name: data.name || "",
        bio: data.bio || "",
        techStack: data.techStack || "",
        experienceLevel: data.experienceLevel || "BEGINNER"
      });
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put("/api/profile", editData);
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  if (!profile) return <div className="flex items-center justify-center h-64">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600" />
        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row md:items-end justify-between -mt-12 gap-6">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-indigo-600">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div className="pb-2">
                <h1 className="text-3xl font-bold">{profile.name || user?.username}</h1>
                <p className="text-neutral-500 flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </p>
              </div>
            </div>
            <div className="pb-2">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-xl font-semibold hover:bg-neutral-200 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex items-center space-x-2 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-xl font-semibold hover:bg-neutral-200 transition-all"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button 
                    onClick={handleUpdate}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Current Level</div>
              <div className="text-5xl font-black text-indigo-600">{profile.level}</div>
              <div className="text-sm font-semibold text-neutral-600">{profile.xp} XP Earned</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Next Level</span>
                <span>{Math.floor(Math.pow(profile.level, 2) * 100)} XP</span>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${(profile.xp / (Math.pow(profile.level, 2) * 100)) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-neutral-600">
                  <Award className="w-5 h-5" />
                  <span className="text-sm font-medium">Experience</span>
                </div>
                <span className="text-sm font-bold text-indigo-600">{profile.experienceLevel}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-neutral-600">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-medium">Rank</span>
                </div>
                <span className="text-sm font-bold text-indigo-600">#12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-8">
            <section className="space-y-4">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <User className="w-5 h-5 text-indigo-600" />
                <span>About Me</span>
              </h3>
              {isEditing ? (
                <textarea 
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-neutral-600 leading-relaxed">
                  {profile.bio || "No bio added yet. Tell the community about your study goals and interests!"}
                </p>
              )}
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <Code className="w-5 h-5 text-indigo-600" />
                <span>Tech Stack & Skills</span>
              </h3>
              {isEditing ? (
                <input 
                  type="text"
                  value={editData.techStack}
                  onChange={(e) => setEditData({ ...editData, techStack: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. React, Node.js, Python"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.techStack ? profile.techStack.split(",").map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold">
                      {skill.trim()}
                    </span>
                  )) : (
                    <span className="text-neutral-400 italic text-sm">No skills listed yet.</span>
                  )}
                </div>
              )}
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <span>Experience Level</span>
              </h3>
              {isEditing ? (
                <select 
                  value={editData.experienceLevel}
                  onChange={(e) => setEditData({ ...editData, experienceLevel: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600"
                      style={{ width: 
                        profile.experienceLevel === "BEGINNER" ? "25%" :
                        profile.experienceLevel === "INTERMEDIATE" ? "50%" :
                        profile.experienceLevel === "ADVANCED" ? "75%" : "100%"
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-neutral-600">{profile.experienceLevel}</span>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
