import React, { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import axiosClient from '../../lib/axiosClient';
import { BookOpen, Users, BarChart3, Loader2, Sparkles, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const InstructorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get('/users/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load instructor metrics', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4 text-white">
        <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
        <p className="text-sm text-gray-500 font-display">Synchronizing instructor stats...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] py-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="glass-panel p-8 rounded-2xl border border-slate-800/40 bg-slate-950/40 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-extrabold text-white">
              Instructor Studio, {user?.profile?.firstName || 'Professor'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Create educational materials, evaluate quizzes, and audit student registrations.
            </p>
          </div>
          <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider">
            {user?.role} Access
          </span>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg"><BookOpen className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-gray-500 block">Authoring Courses</span>
              <span className="text-2xl font-display font-bold text-white">{stats?.coursesCreated || 0}</span>
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg"><Users className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-gray-500 block">Total Active Learners</span>
              <span className="text-2xl font-display font-bold text-white">{stats?.totalEnrollments || 0}</span>
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg"><BarChart3 className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-gray-500 block">Course Rating Avg</span>
              <span className="text-2xl font-display font-bold text-white">4.9 / 5.0</span>
            </div>
          </div>
        </div>

        {/* Course listing */}
        <div className="bg-slate-950/30 border border-slate-900/60 p-6 rounded-xl mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display font-bold text-white">Your Courses</h3>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition">
              <PlusCircle className="h-4 w-4" />
              Add Course
            </button>
          </div>

          {stats?.courses && stats.courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.courses.map((course: any) => (
                <div key={course.id} className="p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-white mb-1">{course.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-4">{course.description}</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-900 pt-3 text-xs">
                    <span className="text-gray-500">Learners Enrolled:</span>
                    <span className="font-semibold text-indigo-400">{course._count?.enrollments || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-6">You have not created any courses yet.</p>
          )}
        </div>

        {/* Quick logout */}
        <button
          onClick={logout}
          className="w-full md:w-auto bg-slate-950 hover:bg-rose-500/10 border border-slate-900 text-rose-400 rounded-xl px-6 py-2.5 text-sm font-semibold transition"
        >
          Sign out
        </button>

      </div>
    </div>
  );
};
