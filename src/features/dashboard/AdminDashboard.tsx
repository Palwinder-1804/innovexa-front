import React, { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import axiosClient from '../../lib/axiosClient';
import { Shield, Users, BookOpen, Calendar, Mail, CheckCircle2, Loader2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await axiosClient.get('/users/stats');
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to load admin metrics', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleResolveMessage = async (msgId: string) => {
    try {
      await axiosClient.patch(`/contact/queries/${msgId}/resolve`);
      // Reload stats/queries
      fetchStats();
    } catch (err) {
      console.error('Failed to resolve query', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4 text-white">
        <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
        <p className="text-sm text-gray-500 font-display">Loading administration console...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] py-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="glass-panel p-8 rounded-2xl border border-slate-800/40 bg-slate-950/40 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-extrabold text-white flex items-center gap-2">
              <Shield className="h-8 w-8 text-rose-500" />
              Administrative Command Center
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Oversee platform growth metrics and manage incoming user collaborations.
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-slate-900 border border-slate-800 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-850 hover:text-white transition"
          >
            Sign out
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg"><Users className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-gray-500 block">Total User Base</span>
              <span className="text-2xl font-display font-bold text-white">{stats?.totalUsers || 0}</span>
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg"><BookOpen className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-gray-500 block">Syllabus Courses</span>
              <span className="text-2xl font-display font-bold text-white">{stats?.totalCourses || 0}</span>
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg"><Calendar className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-gray-500 block">System Events</span>
              <span className="text-2xl font-display font-bold text-white">{stats?.totalEvents || 0}</span>
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg"><Mail className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-gray-500 block">Open Queries</span>
              <span className="text-2xl font-display font-bold text-white">{stats?.openQueriesCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Contact Queries Manager */}
        <div className="bg-slate-950/30 border border-slate-900/60 p-6 rounded-xl">
          <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
            <Mail className="h-5 w-5 text-indigo-400" />
            Collaboration Inbox (Contact Messages)
          </h3>

          {stats?.recentQueries && stats.recentQueries.length > 0 ? (
            <div className="space-y-4">
              {stats.recentQueries.map((query: any) => (
                <div
                  key={query.id}
                  className={`p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                    query.resolved
                      ? 'bg-slate-900/10 border-slate-900 text-gray-500'
                      : 'bg-slate-900/50 border-slate-800/80 text-white shadow-lg'
                  }`}
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-gray-200">{query.name}</span>
                      <span className="text-[10px] bg-slate-950 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-medium">
                        {query.userType}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {new Date(query.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <h5 className="font-semibold text-xs text-gray-300">
                      Subject: {query.subject} <span className="text-gray-500">({query.email})</span>
                    </h5>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">
                      "{query.message}"
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {query.resolved ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleResolveMessage(query.id)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-6">All inbox messages resolved! Good job.</p>
          )}
        </div>

      </div>
    </div>
  );
};
