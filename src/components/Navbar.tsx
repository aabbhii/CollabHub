import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { BookOpen, LayoutDashboard, Trophy, User, LogOut } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-indigo-600">
          <BookOpen className="w-8 h-8" />
          <span>CollabStudy</span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/leaderboard" className="flex items-center space-x-1 text-neutral-600 hover:text-indigo-600 transition-colors">
            <Trophy className="w-5 h-5" />
            <span className="hidden sm:inline">Leaderboard</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="flex items-center space-x-1 text-neutral-600 hover:text-indigo-600 transition-colors">
                <LayoutDashboard className="w-5 h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link to="/profile" className="flex items-center space-x-1 text-neutral-600 hover:text-indigo-600 transition-colors">
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">{user?.username}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 text-neutral-600 hover:text-red-600 transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-neutral-600 hover:text-indigo-600 transition-colors">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
