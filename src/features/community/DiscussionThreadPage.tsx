import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import axiosClient from '../../lib/axiosClient';
import { ChevronLeft, MessageSquare, Loader2, CornerDownRight, Send } from 'lucide-react';

export const DiscussionThreadPage: React.FC = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [newReplyContent, setNewReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchThread = async () => {
    try {
      const res = await axiosClient.get(`/discussions/${id}`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThread();
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const content = parentId ? newReplyContent : newComment;
    if (!content) return;

    setIsSubmitting(true);
    try {
      await axiosClient.post(`/discussions/${id}/comments`, {
        content,
        parentId,
      });
      setNewComment('');
      setNewReplyContent('');
      setReplyToId(null);
      await fetchThread();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4 text-white">
        <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
        <p className="text-sm text-gray-500 font-display">Rendering discussion logs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] py-12 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link */}
        <Link to="/community?tab=forum" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition w-fit">
          <ChevronLeft className="h-4 w-4" />
          Back to forum
        </Link>

        {/* Thread Thread */}
        <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-semibold text-gray-400">
              {data.author?.profile?.firstName} {data.author?.profile?.lastName}
            </span>
            <span>•</span>
            <span>{new Date(data.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span className="bg-slate-900 text-indigo-400 border border-indigo-500/10 px-2 py-0.5 rounded-full font-medium">
              {data.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-tight">
            {data.title}
          </h1>

          <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line font-light">
            {data.content}
          </p>
        </div>

        {/* Comments Title */}
        <div className="border-t border-slate-900 pt-6">
          <h3 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-400" />
            Comments & Replies ({data.comments?.length || 0})
          </h3>

          {/* New comment input */}
          <form onSubmit={(e) => handleSubmitComment(e, null)} className="mb-8 space-y-3">
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={isAuthenticated ? "Write a response to this thread..." : "Sign in to reply..."}
              disabled={!isAuthenticated || isSubmitting}
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition resize-none disabled:opacity-50"
            />
            {isAuthenticated && (
              <button
                type="submit"
                disabled={isSubmitting || !newComment}
                className="bg-indigo-650 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                Post Comment
              </button>
            )}
          </form>

          {/* Comments list rendering */}
          {data.comments && data.comments.length > 0 ? (
            <div className="space-y-6">
              {data.comments.map((comment: any) => (
                <div key={comment.id} className="space-y-4">
                  {/* Top comment */}
                  <div className="p-4 bg-slate-950/20 border border-slate-900 rounded-xl">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span className="font-semibold text-gray-300">
                        {comment.author?.profile?.firstName} {comment.author?.profile?.lastName}
                      </span>
                      <span>•</span>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
                      {comment.content}
                    </p>

                    {isAuthenticated && !replyToId && (
                      <button
                        onClick={() => setReplyToId(comment.id)}
                        className="text-[10px] text-indigo-400 hover:underline mt-3 block"
                      >
                        Reply
                      </button>
                    )}
                  </div>

                  {/* Reply text-box */}
                  {replyToId === comment.id && (
                    <form onSubmit={(e) => handleSubmitComment(e, comment.id)} className="pl-6 space-y-2">
                      <textarea
                        rows={2}
                        value={newReplyContent}
                        onChange={(e) => setNewReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition resize-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setReplyToId(null)}
                          className="text-[10px] text-gray-500 hover:text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!newReplyContent}
                          className="bg-indigo-650 hover:bg-indigo-500 text-white font-semibold text-[10px] px-3.5 py-1 rounded-lg transition"
                        >
                          Post Reply
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Replies nesting */}
                  {comment.replies && comment.replies.map((reply: any) => (
                    <div key={reply.id} className="pl-6 flex gap-3">
                      <CornerDownRight className="h-4 w-4 text-gray-700 shrink-0 mt-1" />
                      <div className="flex-grow p-3 bg-slate-950/40 border border-slate-900 rounded-xl text-xs">
                        <div className="flex items-center gap-2 text-gray-500 mb-1.5">
                          <span className="font-semibold text-gray-300">
                            {reply.author?.profile?.firstName} {reply.author?.profile?.lastName}
                          </span>
                          <span>•</span>
                          <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed font-light">{reply.content}</p>
                      </div>
                    </div>
                  ))}

                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-6">No comments posted yet.</p>
          )}
        </div>

      </div>
    </div>
  );
};
