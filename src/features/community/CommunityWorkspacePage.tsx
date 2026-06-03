import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import axiosClient from '../../lib/axiosClient';
import { Calendar, MessageSquare, PlusCircle, Loader2, MapPin, Clock } from 'lucide-react';

export const CommunityWorkspacePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'events';
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState<any[]>([]);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitInProgress, setIsSubmitInProgress] = useState(false);

  // New thread form states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'events') {
        const res = await axiosClient.get('/events');
        setEvents(res.data.data);
      } else {
        const res = await axiosClient.get('/discussions');
        setDiscussions(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleRegisterEvent = async (eventId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await axiosClient.post(`/events/${eventId}/register`);
      alert('RSVP confirmed successfully!');
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'RSVP registration failed');
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!newTitle || !newContent) return;
    setIsSubmitInProgress(true);
    try {
      await axiosClient.post('/discussions', {
        title: newTitle,
        content: newContent,
        category: newCategory,
      });
      setNewTitle('');
      setNewContent('');
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitInProgress(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] py-12 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-display font-extrabold text-white">IX Community Hub</h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Participate in upcoming technical workshops, hackathons, and forums.
            </p>
          </div>
          
          <div className="flex gap-2 bg-slate-950 border border-slate-900 p-1.5 rounded-xl shrink-0">
            <button
              onClick={() => setSearchParams({ tab: 'events' })}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'events' ? 'bg-indigo-650 text-white shadow-glow-primary' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Events
            </button>
            <button
              onClick={() => setSearchParams({ tab: 'forum' })}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'forum' ? 'bg-indigo-650 text-white shadow-glow-primary' : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Forum
            </button>
          </div>
        </div>

        {/* Tab contents */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
            <p className="text-xs text-gray-500 font-display">Synchronizing community registry...</p>
          </div>
        ) : activeTab === 'events' ? (
          /* Events List */
          events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events.map((event) => (
                <div key={event.id} className="bg-slate-950/40 border border-slate-900 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-800 transition duration-300">
                  <div>
                    <div className="aspect-video relative overflow-hidden bg-slate-900 border-b border-slate-900">
                      <img
                        src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=650&q=80'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-display font-bold text-white line-clamp-1">{event.title}</h3>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{event.description}</p>
                      
                      <div className="flex flex-col gap-2 pt-2 border-t border-slate-900 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-indigo-400 shrink-0" />
                          <span>{new Date(event.date).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-indigo-400 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-4 border-t border-slate-900/60 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Capacity: {event._count?.registrations || 0} / {event.capacity}</span>
                    <button
                      onClick={() => handleRegisterEvent(event.id)}
                      className="bg-indigo-650 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg transition"
                    >
                      RSVP Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-10">No upcoming events listed.</p>
          )
        ) : (
          /* Forum Threads List */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-display font-bold text-white">Recent Forum Topics</h3>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                New Topic
              </button>
            </div>

            {discussions.length > 0 ? (
              <div className="space-y-4">
                {discussions.map((disc) => (
                  <div key={disc.id} className="p-5 bg-slate-950/40 border border-slate-900 rounded-xl hover:border-slate-805 transition duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="font-semibold text-gray-400">
                          {disc.author?.profile?.firstName} {disc.author?.profile?.lastName}
                        </span>
                        <span>•</span>
                        <span>{new Date(disc.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="bg-slate-950 text-indigo-400 border border-indigo-500/10 px-2 py-0.5 rounded-full font-medium">
                          {disc.category}
                        </span>
                      </div>
                      <Link to={`/community/threads/${disc.id}`} className="text-base font-bold text-white hover:text-indigo-400 transition leading-snug">
                        {disc.title}
                      </Link>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 text-xs text-gray-500">
                      <MessageSquare className="h-4 w-4 text-indigo-400" />
                      <span>{disc._count?.comments || 0} Replies</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-10">No discussions created. Be the first to start a thread!</p>
            )}
          </div>
        )}

      </div>

      {/* NEW THREAD CREATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="fixed inset-0 bg-[#030712]/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="max-w-md w-full bg-slate-950 border border-slate-900 p-8 rounded-2xl relative z-10 space-y-6">
            <h3 className="text-xl font-display font-bold text-white">Start a Discussion Topic</h3>
            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm transition"
                  placeholder="E.g. Help configuring prisma on windows"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm transition"
                >
                  <option value="General">General Sandbox</option>
                  <option value="AI & ML">AI & Machine Learning</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="Security">Security</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Content</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm transition resize-none"
                  placeholder="Explain your discussion context in detail..."
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-gray-400 hover:text-white px-4 py-2 rounded-lg text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitInProgress}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                >
                  Create Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
