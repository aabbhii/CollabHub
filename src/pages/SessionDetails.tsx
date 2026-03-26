import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { motion } from "motion/react";
import { 
  CheckCircle2, Clock, AlertCircle, Plus, 
  User, Calendar, ChevronRight, MessageSquare,
  MoreVertical, Trash2, Edit2
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const socket = io();

export default function SessionDetails() {
  const { id } = useParams();
  const [session, setSession] = useState<any>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: "", description: "", status: "PENDING", 
    priority: "MEDIUM", deadline: "", assignedToId: "" 
  });
  const { user } = useAuthStore();

  useEffect(() => {
    fetchSession();
    socket.emit("join-session", id);

    socket.on("task-updated", (data) => {
      if (data.sessionId === Number(id)) {
        fetchSession();
      }
    });

    return () => {
      socket.off("task-updated");
    };
  }, [id]);

  const fetchSession = async () => {
    try {
      const { data } = await axios.get(`/api/sessions/${id}`);
      setSession(data);
    } catch (err) {
      console.error("Failed to fetch session", err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/tasks", { ...newTask, sessionId: Number(id) });
      setShowTaskModal(false);
      setNewTask({ 
        title: "", description: "", status: "PENDING", 
        priority: "MEDIUM", deadline: "", assignedToId: "" 
      });
      socket.emit("task-update", { sessionId: Number(id) });
      fetchSession();
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  const updateTaskStatus = async (taskId: number, status: string) => {
    try {
      await axios.patch(`/api/tasks/${taskId}/status`, { status });
      socket.emit("task-update", { sessionId: Number(id) });
      fetchSession();
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  };

  if (!session) return <div className="flex items-center justify-center h-64">Loading session...</div>;

  const tasksByStatus = {
    PENDING: session.tasks?.filter((t: any) => t.status === "PENDING") || [],
    IN_PROGRESS: session.tasks?.filter((t: any) => t.status === "IN_PROGRESS") || [],
    COMPLETED: session.tasks?.filter((t: any) => t.status === "COMPLETED") || [],
    REVIEW: session.tasks?.filter((t: any) => t.status === "REVIEW") || [],
  };

  return (
    <div className="space-y-8">
      {/* Session Header */}
      <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-indigo-600 font-bold uppercase tracking-wider">
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <ChevronRight className="w-4 h-4" />
              <span>Session Details</span>
            </div>
            <h1 className="text-4xl font-bold">{session.title}</h1>
            <p className="text-neutral-600 max-w-2xl">{session.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-neutral-500">Deadline</div>
              <div className="font-bold">{new Date(session.deadline).toLocaleDateString()}</div>
            </div>
            <button 
              onClick={() => setShowTaskModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div className="text-sm text-neutral-500 mb-1">Total Tasks</div>
            <div className="text-2xl font-bold">{session.tasks?.length || 0}</div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div className="text-sm text-neutral-500 mb-1">Members</div>
            <div className="text-2xl font-bold">{session.members?.length || 0}</div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div className="text-sm text-neutral-500 mb-1">Progress</div>
            <div className="text-2xl font-bold">{session.progress || 0}%</div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div className="text-sm text-neutral-500 mb-1">Status</div>
            <div className="text-2xl font-bold text-green-600">Active</div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(tasksByStatus).map(([status, tasks]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-neutral-500 uppercase tracking-wider text-xs">
                {status.replace("_", " ")} ({tasks.length})
              </h3>
            </div>
            
            <div className="space-y-4 min-h-[500px] p-2 bg-neutral-100/50 rounded-2xl border border-dashed border-neutral-200">
              {tasks.map((task: any) => (
                <motion.div 
                  key={task.id}
                  layoutId={task.id.toString()}
                  className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.priority === "HIGH" ? "bg-red-50 text-red-600" :
                      task.priority === "MEDIUM" ? "bg-orange-50 text-orange-600" :
                      "bg-blue-50 text-blue-600"
                    }`}>
                      {task.priority}
                    </span>
                    <button className="text-neutral-400 hover:text-neutral-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h4 className="font-bold text-sm leading-tight">{task.title}</h4>
                  <p className="text-xs text-neutral-500 line-clamp-2">{task.description}</p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                        {task.assignedTo?.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[10px] text-neutral-500 font-medium">
                        {task.assignedTo?.username || "Unassigned"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-[10px] text-neutral-400">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-50 flex items-center space-x-2">
                    {status !== "COMPLETED" && (
                      <button 
                        onClick={() => updateTaskStatus(task.id, "COMPLETED")}
                        className="flex-1 bg-green-50 text-green-600 py-1.5 rounded-lg text-[10px] font-bold hover:bg-green-100 transition-colors"
                      >
                        Complete
                      </button>
                    )}
                    {status === "PENDING" && (
                      <button 
                        onClick={() => updateTaskStatus(task.id, "IN_PROGRESS")}
                        className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors"
                      >
                        Start
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">Assign New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Task Title</label>
                <input 
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Implement Auth"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Description</label>
                <textarea 
                  required
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                  placeholder="What needs to be done?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Priority</label>
                  <select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Deadline</label>
                  <input 
                    type="date"
                    required
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Assign To</label>
                <select 
                  required
                  value={newTask.assignedToId}
                  onChange={(e) => setNewTask({ ...newTask, assignedToId: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Member</option>
                  {session.members?.map((m: any) => (
                    <option key={m.userId} value={m.userId}>{m.user?.username}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
