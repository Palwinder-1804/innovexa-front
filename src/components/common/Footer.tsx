import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#020617] border-t border-slate-900 text-gray-500 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Pitch */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-background text-xs">
                IX
              </span>
              <span className="font-display font-bold text-lg tracking-tight text-white">
                INNOV<span className="text-indigo-400">EXA</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">
              The AI-powered ecosystem connecting students, businesses, and creators to co-create digital futures.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4">Ecosystem</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-white transition">IX Academy</Link></li>
              <li><Link to="/community?tab=events" className="hover:text-white transition">Hackathons & Workshops</Link></li>
              <li><Link to="/community?tab=forum" className="hover:text-white transition">Community Forum</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4">Enterprise</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-white transition">Request Digital Solution</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Book Consultation</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Startup Incubator</Link></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Security Audit</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Innovexa Inc. All rights reserved.</p>
          <p className="flex gap-4">
            <span>Powered by Gemini AI</span>
            <span>•</span>
            <span>Zero-Trust Architecture</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
