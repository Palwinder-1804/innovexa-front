import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { Menu, X, LogOut, LayoutDashboard, User as UserIcon, BookOpen, Calendar, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigation = [
    { name: 'Academy', href: '/courses', icon: BookOpen },
    { name: 'Events', href: '/community?tab=events', icon: Calendar },
    { name: 'Community', href: '/community?tab=forum', icon: MessageSquare },
    { name: 'Contact', href: '/contact', icon: UserIcon },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-slate-800/40 bg-[#030712]/60 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-background shadow-glow-primary">
                IX
              </span>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                INNOV<span className="text-indigo-400">EXA</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative text-sm font-medium transition-colors duration-200 py-1 ${
                    active ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {item.name}
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTAs / User Panel */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg hover:border-slate-700 transition"
                >
                  <img
                    src={user.profile?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
                    alt="Avatar"
                    className="h-6 w-6 rounded-full border border-indigo-500/50 bg-slate-950"
                  />
                  <span className="text-sm font-medium text-gray-300">
                    {user.profile?.firstName || 'User'}
                  </span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-950 border border-slate-800/80 p-2 shadow-2xl z-20"
                      >
                        <Link
                          to={`/dashboard/${user.role.toLowerCase()}`}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-slate-900 hover:text-white transition"
                        >
                          <LayoutDashboard className="h-4 w-4 text-indigo-400" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-indigo-500 hover:to-indigo-400 transition shadow-glow-primary"
                >
                  Join Platform
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white p-2 rounded-lg bg-slate-900/50 border border-slate-800"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950 border-b border-slate-800/80"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition ${
                      active ? 'bg-slate-900 text-white' : 'text-gray-400 hover:bg-slate-900/50 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5 text-indigo-400" />
                    {item.name}
                  </Link>
                );
              })}

              <div className="border-t border-slate-800 my-4 pt-4 space-y-3">
                {isAuthenticated && user ? (
                  <>
                    <Link
                      to={`/dashboard/${user.role.toLowerCase()}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-900 transition"
                    >
                      <LayoutDashboard className="h-5 w-5 text-indigo-400" />
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-base font-medium text-rose-400 hover:bg-rose-500/10 transition text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block text-center w-full px-3 py-2.5 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-900 transition"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block text-center w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-3 py-2.5 rounded-lg font-medium shadow-glow-primary"
                    >
                      Join Platform
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
