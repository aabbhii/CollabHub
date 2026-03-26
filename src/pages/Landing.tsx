import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { BookOpen, Users, CheckCircle, Trophy, Zap, MessageSquare } from "lucide-react";

export default function Landing() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 pt-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold tracking-tight text-neutral-900 sm:text-7xl"
        >
          Study Better, <span className="text-indigo-600">Together.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-neutral-600 max-w-2xl mx-auto"
        >
          The ultimate collaboration platform for students. Manage tasks, track progress, 
          and level up your productivity with real-time study sessions.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center space-x-4"
        >
          <Link to="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            Get Started for Free
          </Link>
          <Link to="/leaderboard" className="bg-white text-neutral-900 border border-neutral-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-neutral-50 transition-all">
            View Leaderboard
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Users, title: "Study Sessions", desc: "Create or join real-time collaboration sessions with your peers." },
          { icon: CheckCircle, title: "Task Management", desc: "Assign tasks, set deadlines, and track project progress effortlessly." },
          { icon: Zap, title: "Real-time Updates", desc: "Stay in sync with live task updates and collaboration notifications." },
          { icon: Trophy, title: "Gamification", desc: "Earn XP, level up, and compete on the global leaderboard." },
          { icon: MessageSquare, title: "Live Chat", desc: "Communicate with your team in real-time within study sessions." },
          { icon: BookOpen, title: "Skill Tracking", desc: "Showcase your expertise and find collaborators with matching skills." },
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
              <feature.icon className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-neutral-600">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="bg-indigo-600 rounded-3xl p-12 text-white text-center">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold mb-2">10k+</div>
            <div className="text-indigo-100">Active Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">50k+</div>
            <div className="text-indigo-100">Tasks Completed</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">5k+</div>
            <div className="text-indigo-100">Study Sessions</div>
          </div>
        </div>
      </section>
    </div>
  );
}
