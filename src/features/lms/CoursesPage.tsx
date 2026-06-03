import React, { useEffect, useState } from 'react';
import axiosClient from '../../lib/axiosClient';
import { Search, Loader2, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    'All',
    'AI & Machine Learning',
    'Full Stack Development',
    'Cybersecurity',
    'Cloud Computing',
    'DevOps',
  ];

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const catQuery = category && category !== 'All' ? `category=${category}` : '';
      const searchQuery = search ? `search=${search}` : '';
      const queryStr = [catQuery, searchQuery].filter(Boolean).join('&');
      
      const res = await axiosClient.get(`/courses?${queryStr}`);
      setCourses(res.data.data);
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [category]);

  return (
    <div className="min-h-screen bg-[#030712] py-16 text-white relative">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title */}
        <div className="mb-12 text-center md:text-left space-y-2">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs font-semibold text-indigo-400 uppercase tracking-widest"
          >
            LMS Classrooms
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-display font-extrabold text-white"
          >
            IX Academy Catalog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-sm sm:text-base max-w-2xl font-light"
          >
            Upgrade your capabilities by building actual production SaaS features. Code vetted by automated evaluation models.
          </motion.p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-12 bg-slate-950/40 p-4 rounded-2xl border border-slate-900/60 backdrop-blur-xl">
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 h-5 w-5 pointer-events-none mt-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchCourses()}
              placeholder="Filter by keyword (Press Enter)..."
              className="w-full bg-slate-900 border border-slate-800/80 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm transition"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition ${
                  (cat === 'All' && !category) || category === cat
                    ? 'bg-indigo-650 text-white shadow-glow-primary'
                    : 'bg-slate-900 text-gray-450 hover:bg-slate-850 hover:text-white border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
            <p className="text-xs text-gray-500 font-display">Synchronizing academy directories...</p>
          </div>
        ) : courses.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -6, borderColor: 'rgba(99,102,241,0.2)' }}
                  className="bg-slate-950/60 border border-slate-900/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between group transition duration-300"
                >
                  <div>
                    {/* Image Header */}
                    <div className="aspect-video relative overflow-hidden bg-slate-900 border-b border-slate-900">
                      <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-3 right-3 text-[10px] bg-slate-950/80 border border-slate-805/50 backdrop-blur px-2.5 py-1 rounded-full font-semibold text-cyan-400">
                        {course.difficulty}
                      </span>
                    </div>

                    {/* Metadata body */}
                    <div className="p-6 space-y-3.5">
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-indigo-400">
                        <span>{course.category}</span>
                        <span className="text-white bg-slate-900 border border-slate-805 px-2 py-0.5 rounded-full font-sans lowercase">
                          {course.price > 0 ? `$${course.price}` : 'Free'}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-display font-bold text-white line-clamp-1 leading-snug group-hover:text-indigo-300 transition">
                        {course.title}
                      </h3>
                      
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 font-light">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Syllabus summary */}
                  <div className="px-6 pb-6 pt-4 border-t border-slate-900/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <User className="h-4 w-4 text-indigo-400" />
                      <span className="font-medium text-gray-400">
                        {course.instructor?.profile?.firstName} {course.instructor?.profile?.lastName}
                      </span>
                    </div>
                    <Link
                      to={`/courses/${course.id}`}
                      className="bg-indigo-650/10 hover:bg-indigo-650 border border-indigo-500/20 hover:border-indigo-500 text-indigo-300 hover:text-white px-4 py-2 rounded-xl font-bold transition text-[11px] uppercase tracking-wider shadow-sm"
                    >
                      Enter Classroom
                    </Link>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-24 text-gray-500">
            <p className="text-sm">No courses matching that query could be found.</p>
          </div>
        )}

      </div>
    </div>
  );
};
