import React, { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import axiosClient from '../../lib/axiosClient';
import { BookOpen, Award, Calendar, Bell, Loader2, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get('/users/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleMarkRead = async (notifId: string) => {
    try {
      await axiosClient.patch(`/users/notifications/${notifId}/read`);
      setStats((prev: any) => ({
        ...prev,
        notifications: prev.notifications.filter((n: any) => n.id !== notifId),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4 text-white">
        <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
        <p className="text-sm text-gray-500 font-display">Synchronizing dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] py-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header banner */}
        <div className="glass-panel p-8 rounded-2xl border border-slate-800/40 bg-slate-950/40 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-extrabold text-white">
              Welcome back, {user?.profile?.firstName || 'Student'}!
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Track your learning syllabus, upcoming hackathons, and credentials here.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider">
              {user?.role} Profile
            </span>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg"><BookOpen className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-gray-500 block">Enrolled Courses</span>
              <span className="text-2xl font-display font-bold text-white">{stats?.enrollmentsCount || 0}</span>
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg"><CheckCircle2 className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-gray-500 block">Completed Syllabus</span>
              <span className="text-2xl font-display font-bold text-white">{stats?.completedCount || 0}</span>
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg"><Award className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-gray-500 block">Credentials Earned</span>
              <span className="text-2xl font-display font-bold text-white">{stats?.certificatesCount || 0}</span>
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-lg"><Calendar className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-gray-500 block">RSVP Events</span>
              <span className="text-2xl font-display font-bold text-white">{stats?.eventsCount || 0}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main learning status */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-950/30 border border-slate-900/60 p-6 rounded-xl">
              <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-400" />
                Active Classrooms
              </h3>
              
              {stats?.recentProgress && stats.recentProgress.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentProgress.map((item: any) => (
                    <div key={item.id} className="p-4 bg-slate-900/50 border border-slate-800/60 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-white text-sm sm:text-base">{item.course?.title}</h4>
                        <span className="text-xs font-semibold text-indigo-400">{Math.round(item.progress)}%</span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden mb-4">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <Link
                        to={`/courses/${item.courseId}`}
                        className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 w-fit"
                      >
                        Resume Lessons
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">Not enrolled in any courses yet.</p>
                  <Link to="/courses" className="text-indigo-400 text-xs mt-2 inline-block hover:underline">
                    Browse Academy Courses
                  </Link>
                </div>
              )}
            </div>

            {/* AI Advisor recommendations */}
            <div className="bg-slate-950/30 border border-slate-900/60 p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl" />
              <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                AI Pathway Advisor
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">
                Based on current skills, we recommend validating your **Express API backend patterns** or participating in the upcoming Hackathon to match with business requests.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] bg-slate-900 text-gray-300 border border-slate-800 px-2 py-1 rounded">
                  Express.js
                </span>
                <span className="text-[10px] bg-slate-900 text-gray-300 border border-slate-800 px-2 py-1 rounded">
                  PostgreSQL
                </span>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded">
                  Hackathon match
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Notifications & Actions */}
          <div className="space-y-6">
            {/* Live Alerts */}
            <div className="bg-slate-950/30 border border-slate-900/60 p-6 rounded-xl">
              <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-indigo-400" />
                System Alerts
              </h3>
              
              {stats?.notifications && stats.notifications.length > 0 ? (
                <div className="space-y-3">
                  {stats.notifications.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-900/40 border border-slate-800/40 rounded-lg text-xs flex justify-between items-start gap-2"
                    >
                      <div>
                        <h5 className="font-semibold text-gray-200 mb-0.5">{item.title}</h5>
                        <p className="text-gray-400">{item.message}</p>
                      </div>
                      <button
                        onClick={() => handleMarkRead(item.id)}
                        className="text-[10px] text-gray-500 hover:text-white"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 text-center py-4">No unread notifications.</p>
              )}
            </div>
            
            {/* Quick logout */}
            <button
              onClick={logout}
              className="w-full bg-slate-950 hover:bg-rose-500/10 border border-slate-900 text-rose-400 rounded-xl py-2.5 text-sm font-semibold transition"
            >
              Sign out of Portal
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};
