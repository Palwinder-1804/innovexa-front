import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import axiosClient from '../../lib/axiosClient';
import { BookOpen, User, Award, Loader2, PlayCircle } from 'lucide-react';

export const CourseDetailsPage: React.FC = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrollInProgress, setIsEnrollInProgress] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await axiosClient.get(`/courses/${id}`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsEnrollInProgress(true);
    try {
      await axiosClient.post(`/courses/${id}/enroll`);
      await fetchDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnrollInProgress(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4 text-white">
        <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
        <p className="text-sm text-gray-500 font-display">Loading syllabus outline...</p>
      </div>
    );
  }

  const { course, isEnrolled, enrollment } = data;
  const firstLesson = course.modules?.[0]?.lessons?.[0];

  return (
    <div className="min-h-screen bg-[#030712] py-12 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Course Header Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Headline details */}
          <div className="lg:col-span-2 space-y-6">
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider">
              {course.category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white leading-tight">
              {course.title}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 pt-2 border-t border-slate-900">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>
                  By {course.instructor?.profile?.firstName} {course.instructor?.profile?.lastName}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.modules?.length || 0} Modules</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>Certification Included</span>
              </div>
            </div>
          </div>

          {/* Action sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800/50 bg-slate-950/60 space-y-6">
              <div className="aspect-video relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800/40">
                <img
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-xs text-gray-500 block">Classroom Pricing</span>
                <span className="text-3xl font-display font-extrabold text-white">
                  {course.price > 0 ? `$${course.price}` : 'Free Access'}
                </span>
              </div>

              {isEnrolled ? (
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3 rounded-lg text-xs flex justify-between items-center">
                    <span>Enrolled</span>
                    <span className="font-semibold">{Math.round(enrollment?.progress || 0)}% Done</span>
                  </div>
                  {firstLesson && (
                    <Link
                      to={`/courses/${id}/lessons/${firstLesson.id}`}
                      className="w-full text-center block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition shadow-glow-primary text-sm"
                    >
                      Enter Classroom
                    </Link>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrollInProgress}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl py-3 font-semibold hover:from-indigo-500 hover:to-indigo-400 transition shadow-glow-primary flex justify-center items-center gap-2 disabled:opacity-50 text-sm"
                >
                  {isEnrollInProgress ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                  ) : (
                    'Enroll Now'
                  )}
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Syllabus structure */}
        <div className="space-y-6">
          <h3 className="text-2xl font-display font-bold text-white mb-4">Syllabus Outline</h3>
          
          {course.modules && course.modules.length > 0 ? (
            <div className="space-y-4">
              {course.modules.map((module: any) => (
                <div key={module.id} className="bg-slate-950/40 border border-slate-900 rounded-xl p-6">
                  <h4 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                    <span className="text-xs bg-slate-900 border border-slate-800 text-indigo-400 px-2 py-1 rounded">
                      Module {module.order}
                    </span>
                    {module.title}
                  </h4>
                  
                  {module.lessons && module.lessons.length > 0 ? (
                    <div className="divide-y divide-slate-900">
                      {module.lessons.map((lesson: any) => (
                        <div
                          key={lesson.id}
                          className="py-3 flex justify-between items-center text-xs sm:text-sm hover:text-gray-200 transition group"
                        >
                          <div className="flex items-center gap-3">
                            <PlayCircle className="h-4 w-4 text-indigo-500 shrink-0" />
                            <span className="text-gray-400 group-hover:text-gray-200">{lesson.title}</span>
                          </div>
                          <span className="text-gray-600 shrink-0">{lesson.duration}m</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No lessons defined in this module.</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">No curriculum modules mapped yet.</p>
          )}
        </div>

      </div>
    </div>
  );
};
