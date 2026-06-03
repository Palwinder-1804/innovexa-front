import React, { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import axiosClient from '../../lib/axiosClient';
import { Calendar, PlusCircle, Clock, Loader2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BusinessDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get('/users/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load business dashboard stats', err);
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
        <p className="text-sm text-gray-500 font-display">Synchronizing enterprise stats...</p>
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
              Enterprise Hub, {user?.profile?.firstName || 'Director'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Submit digital specifications, track delivery timelines, and schedule consulting.
            </p>
          </div>
          <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider">
            {user?.role} Access
          </span>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg"><FileText className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-gray-500 block">Submitted Requirements</span>
              <span className="text-2xl font-display font-bold text-white">{stats?.requestsCount || 0}</span>
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-lg"><Calendar className="h-6 w-6" /></div>
            <div>
              <span className="text-xs text-gray-500 block">Scheduled Advisory</span>
              <span className="text-2xl font-display font-bold text-white">{stats?.consultationsCount || 0}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Service requests */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-950/30 border border-slate-900/60 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-display font-bold text-white">Your Project Requests</h3>
                <Link
                  to="/contact"
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Submit Request
                </Link>
              </div>

              {stats?.recentRequests && stats.recentRequests.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentRequests.map((req: any) => (
                    <div key={req.id} className="p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h4 className="font-semibold text-white text-sm">{req.title}</h4>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-950 text-indigo-400 font-medium">
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 mb-3">{req.description}</p>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-slate-900/60 pt-2">
                        <span>Budget Allocated:</span>
                        <span className="font-semibold text-white">${req.budget.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 text-center py-6">No custom requests submitted yet.</p>
              )}
            </div>
          </div>

          {/* Sidebar Advisory */}
          <div className="space-y-6">
            <div className="bg-slate-950/30 border border-slate-900/60 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-display font-bold text-white">Upcoming Calls</h3>
                <Link to="/contact" className="text-indigo-400 hover:underline text-xs">
                  Schedule Call
                </Link>
              </div>

              {stats?.upcomingConsultations && stats.upcomingConsultations.length > 0 ? (
                <div className="space-y-3">
                  {stats.upcomingConsultations.map((c: any) => (
                    <div key={c.id} className="p-3 bg-slate-900/40 border border-slate-805/40 rounded-lg text-xs">
                      <h5 className="font-semibold text-gray-200 mb-1">{c.subject}</h5>
                      <div className="flex items-center gap-1.5 text-[10px] text-indigo-400">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(c.date).toLocaleDateString()} at {c.timeSlot}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 text-center py-4">No consulting calls booked.</p>
              )}
            </div>

            <button
              onClick={logout}
              className="w-full bg-slate-950 hover:bg-rose-500/10 border border-slate-900 text-rose-400 rounded-xl py-2.5 text-sm font-semibold transition"
            >
              Sign Out
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
