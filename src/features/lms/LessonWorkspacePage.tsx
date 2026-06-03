import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../lib/axiosClient';
import { ChevronLeft, Loader2, PlayCircle, CheckCircle2 } from 'lucide-react';

export const LessonWorkspacePage: React.FC = () => {
  const { courseId, lessonId } = useParams();

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  const fetchLesson = async () => {
    try {
      const res = await axiosClient.get(`/courses/${courseId}`);
      const courseData = res.data.data;
      
      // Find current lesson in data
      let currentLesson = null;
      courseData.course.modules.forEach((mod: any) => {
        const found = mod.lessons.find((l: any) => l.id === lessonId);
        if (found) currentLesson = found;
      });

      setData({
        course: courseData.course,
        isEnrolled: courseData.isEnrolled,
        enrollment: courseData.enrollment,
        lesson: currentLesson,
      });
      // Reset quiz states
      setSelectedAnswers({});
      setQuizResult(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, [courseId, lessonId]);

  const handleMarkComplete = async () => {
    setIsCompleting(true);
    try {
      const res = await axiosClient.post(`/courses/lessons/${lessonId}/complete`);
      const payload = res.data.data;
      
      if (payload.certificate) {
        alert(`Congratulations! You earned a course certificate. Code: ${payload.certificate.certCode}`);
      }

      await fetchLesson();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleQuizSubmit = async (quizId: string) => {
    setIsSubmittingQuiz(true);
    try {
      const res = await axiosClient.post(`/courses/quizzes/${quizId}/submit`, {
        answers: selectedAnswers,
      });
      setQuizResult(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4 text-white">
        <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
        <p className="text-sm text-gray-500 font-display">Mounting interactive workspace...</p>
      </div>
    );
  }

  const { course, lesson, enrollment } = data;
  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center text-white">
        <p>Lesson not found in syllabus.</p>
        <Link to={`/courses/${courseId}`} className="text-indigo-400 text-sm hover:underline mt-2">
          Return to Course Details
        </Link>
      </div>
    );
  }

  // Check if lesson is marked completed in progress records
  const isLessonCompleted = enrollment?.progresses?.some((p: any) => p.lessonId === lessonId && p.completed);

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col lg:flex-row pt-16">
      
      {/* LEFT: Lesson workspace panel */}
      <div className="flex-grow p-6 lg:p-8 max-w-5xl overflow-y-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <Link to={`/courses/${courseId}`} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition">
          <ChevronLeft className="h-4 w-4" />
          Back to syllabus
        </Link>

        {/* Header Title */}
        <div className="border-b border-slate-900 pb-4">
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-tight">
            {lesson.title}
          </h1>
          <span className="text-xs text-gray-500 mt-1 block">Est duration: {lesson.duration} mins</span>
        </div>

        {/* Video Sandbox Placeholder */}
        {lesson.videoUrl && (
          <div className="aspect-video relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-900 shadow-xl">
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-slate-900/60 p-4 text-center">
              <PlayCircle className="h-16 w-16 text-indigo-500/80 mb-2" />
              <span className="font-semibold text-sm">Classroom Video: Stream Online</span>
              <span className="text-[10px] text-gray-500 mt-1">{lesson.videoUrl}</span>
            </div>
          </div>
        )}

        {/* Lesson Markdown Content */}
        <div className="bg-slate-950/20 border border-slate-900 p-6 rounded-2xl">
          <h3 className="font-display font-bold text-lg mb-4 text-gray-200">Study Guide</h3>
          <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line font-light">
            {lesson.content}
          </p>
        </div>

        {/* Interactive Quizzes Sandbox */}
        {lesson.quizzes && lesson.quizzes.length > 0 && (
          <div className="bg-slate-950/40 border border-slate-800/40 p-6 rounded-2xl space-y-6">
            {lesson.quizzes.map((quiz: any) => (
              <div key={quiz.id} className="space-y-4">
                <h3 className="text-lg font-display font-bold text-indigo-400">Quiz: {quiz.title}</h3>
                
                {quiz.questions && (quiz.questions as any[]).map((q: any) => (
                  <div key={q.id} className="space-y-2 bg-slate-900/40 p-4 rounded-xl border border-slate-900">
                    <span className="text-xs font-semibold text-gray-400">Question</span>
                    <p className="text-sm font-medium text-white">{q.question}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {q.options.map((opt: string) => (
                        <button
                          key={opt}
                          onClick={() => {
                            if (quizResult) return;
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [q.id]: opt,
                            }));
                          }}
                          className={`text-left text-xs p-3 rounded-lg border transition ${
                            selectedAnswers[q.id] === opt
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'bg-slate-950 border-slate-900 text-gray-400 hover:border-slate-800 hover:text-white'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Submitting result feedback */}
                {quizResult && (
                  <div
                    className={`p-4 rounded-xl border text-sm ${
                      quizResult.passed
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                    }`}
                  >
                    <h5 className="font-bold mb-1">
                      {quizResult.passed ? 'Assessment Passed!' : 'Assessment Failed'}
                    </h5>
                    <p className="text-xs">Your score: {Math.round(quizResult.score)}% (Passing mark: 70%)</p>
                  </div>
                )}

                {!quizResult && (
                  <button
                    onClick={() => handleQuizSubmit(quiz.id)}
                    disabled={isSubmittingQuiz}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-6 py-2.5 rounded-lg transition disabled:opacity-50"
                  >
                    Submit Quiz Answers
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Completion Action Trigger */}
        <div className="flex justify-between items-center border-t border-slate-900 pt-6">
          <div className="flex items-center gap-2">
            {isLessonCompleted ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="h-4 w-4" />
                Lesson Completed
              </span>
            ) : (
              <button
                onClick={handleMarkComplete}
                disabled={isCompleting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-6 py-2.5 rounded-lg transition disabled:opacity-50"
              >
                Mark Lesson Complete
              </button>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT: Course syllabus side navigation */}
      <div className="w-full lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-900 bg-slate-950/40 p-6 overflow-y-auto max-h-[85vh] lg:max-h-[92vh]">
        <h3 className="font-display font-bold text-sm text-gray-500 uppercase tracking-wider mb-4">Course syllabus</h3>
        
        {course.modules && course.modules.map((mod: any) => (
          <div key={mod.id} className="mb-6">
            <span className="text-[10px] font-semibold text-indigo-400 uppercase block mb-2">
              Module {mod.order}: {mod.title}
            </span>
            <div className="space-y-1.5">
              {mod.lessons.map((l: any) => {
                const active = l.id === lessonId;
                const isCompleted = enrollment?.progresses?.some((p: any) => p.lessonId === l.id && p.completed);
                return (
                  <Link
                    key={l.id}
                    to={`/courses/${courseId}/lessons/${l.id}`}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs transition ${
                      active
                        ? 'bg-indigo-600/10 border border-indigo-500/25 text-white font-semibold'
                        : 'text-gray-400 hover:bg-slate-900/50 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 line-clamp-1 pr-2">
                      <PlayCircle className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-indigo-400' : 'text-gray-600'}`} />
                      <span>{l.title}</span>
                    </div>
                    {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
