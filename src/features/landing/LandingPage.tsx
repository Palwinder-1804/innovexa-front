import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  Code2,
  Shield,
  Cloud,
  Terminal,
  Database,
  Sparkles,
  ArrowRight,
  Users,
  Building,
  GraduationCap,
  Globe,
  Layers,
  ArrowUpRight,
  Cpu,
  MonitorPlay,
  Share2
} from 'lucide-react';

const stats = [
  { id: 1, name: 'Active Student Developers', value: '12,000+', icon: Users, delay: 0.1 },
  { id: 2, name: 'Digital Solutions Deployed', value: '340+', icon: Building, delay: 0.2 },
  { id: 3, name: 'Mentorship Hackathons Hosted', value: '45+', icon: GraduationCap, delay: 0.3 },
  { id: 4, name: 'SLA Project Deliveries', value: '99.4%', icon: Globe, delay: 0.4 },
];

const domains = [
  { 
    name: 'AI & Machine Learning', 
    icon: Brain, 
    color: 'from-purple-500 to-indigo-500', 
    shadow: 'shadow-purple-500/10',
    desc: 'Deploy neural networks, configure transformers, and run localized LLM inference engines.' 
  },
  { 
    name: 'Full Stack Development', 
    icon: Code2, 
    color: 'from-cyan-500 to-blue-500', 
    shadow: 'shadow-cyan-500/10',
    desc: 'Build reactive SPAs and high-concurrency Express APIs communicating via secure channels.' 
  },
  { 
    name: 'Cybersecurity & Auditing', 
    icon: Shield, 
    color: 'from-rose-500 to-red-500', 
    shadow: 'shadow-rose-500/10',
    desc: 'Zero trust setups, OAuth tokens auditing, and protection against XSS/CSRF vulnerabilities.' 
  },
  { 
    name: 'Cloud Computing & Serverless', 
    icon: Cloud, 
    color: 'from-amber-500 to-orange-500', 
    shadow: 'shadow-amber-500/10',
    desc: 'Deploy edge runtimes, object stores, and manage state across geo-replicated clusters.' 
  },
  { 
    name: 'DevOps & GitOps', 
    icon: Terminal, 
    color: 'from-emerald-500 to-teal-500', 
    shadow: 'shadow-emerald-500/10',
    desc: 'Continuous integration, dockerized services management, and kubernetes orchestration.' 
  },
  { 
    name: 'Data Science & Querying', 
    icon: Database, 
    color: 'from-pink-500 to-purple-500', 
    shadow: 'shadow-pink-500/10',
    desc: 'Aggregate data warehouses, query massive relational stores, and build analytics feeds.' 
  },
];

const features = [
  {
    title: 'Project-Driven EdTech',
    desc: 'Ditch boring video lectures. Students learn core engineering concepts by developing production-ready SaaS projects for actual businesses.',
    icon: GraduationCap,
  },
  {
    title: 'Enterprise Digital Solutions',
    desc: 'Businesses submit project proposals, requirements, and budget criteria. Elite student cohorts develop custom systems guided by senior engineers.',
    icon: Building,
  },
  {
    title: 'AI Innovation Sandbox',
    desc: 'Leverage our integrated generative AI modules to inspect code patterns, recommend curriculum paths, and auto-evaluate project tests.',
    icon: Sparkles,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 15 }
  }
};

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-[#030712] min-h-screen text-white relative selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Dynamic Glowing Mesh Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center pt-24 pb-20 overflow-hidden">
        {/* Animated Neon Spheres */}
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" 
        />
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center max-w-5xl mx-auto space-y-10">
            
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-300 shadow-glow-primary hover:bg-indigo-500/20 transition cursor-pointer"
            >
              <Sparkles className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
              The Digital Innovation Ledger
            </motion.div>

            {/* Huge Bold Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 50, damping: 10 }}
              className="text-5xl sm:text-8xl font-display font-extrabold tracking-tight leading-none text-gradient py-2"
            >
              Knowledge Meets<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 drop-shadow-lg">
                Production Code
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto font-light leading-relaxed"
            >
              Innovexa connects student developers with business clients to build and deploy scalable, production-ready SaaS systems. Learning powered by AI, verified by code.
            </motion.p>

            {/* CTA Buttons with hover scaling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold px-8 py-4 rounded-xl hover:from-indigo-500 hover:to-indigo-400 transition shadow-glow-primary flex justify-center items-center gap-2 text-sm uppercase tracking-wider"
                >
                  Explore IX Academy
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto bg-slate-950 border border-slate-800 text-gray-200 px-8 py-4 rounded-xl hover:bg-slate-900 hover:text-white transition flex justify-center items-center gap-2 text-sm uppercase tracking-wider"
                >
                  Pitch Custom Request
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Diagonal Bottom Line Decorator */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
      </section>

      {/* 2. DYNAMIC STATISTICS (Staggered On Scroll) */}
      <section className="py-16 border-y border-slate-900 bg-[#020617]/70 relative backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div 
                key={stat.id} 
                variants={itemVariants}
                className="text-center space-y-3 p-4 hover:bg-slate-900/20 rounded-xl transition duration-300"
              >
                <div className="flex justify-center text-indigo-400">
                  <stat.icon className="h-7 w-7 text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.4)]" />
                </div>
                <div className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest font-bold">
                  {stat.name}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. INNOVATION FEATURES */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight">
              A Unified Ecosystem for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Collaboration</span>
            </h2>
            <p className="text-gray-400 font-light text-sm sm:text-base leading-relaxed">
              Traditional portfolios are obsolete. We have built an active sandbox matching talent directly to business requirements.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, border: '1px solid rgba(99,102,241,0.3)' }}
                className="bg-slate-950/60 border border-slate-900 p-8 rounded-2xl relative overflow-hidden group transition duration-300"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition" />
                
                <div className="p-4 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/25 w-fit mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                
                <h3 className="text-xl font-display font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. TECHNICAL DOMAINS SHOWCASE (Bold Grid Cards) */}
      <section className="py-24 bg-[#020617]/30 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight">
              Engineered Across <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">Modern Domains</span>
            </h2>
            <p className="text-gray-400 font-light">
              Students build capabilities and businesses receive applications covering bleeding-edge software vectors.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {domains.map((dom, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.15)' }}
                className={`bg-slate-950/60 border border-slate-900/60 p-6 rounded-2xl flex flex-col justify-between hover:bg-slate-900/20 hover:shadow-2xl transition duration-300 group`}
              >
                <div>
                  <div className={`p-3 bg-gradient-to-br ${dom.color} rounded-xl text-background w-fit mb-6 font-bold shadow-lg shadow-black/50`}>
                    <dom.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-indigo-300 transition">
                    {dom.name}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed font-light">
                    {dom.desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-900/60 flex items-center justify-between text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Browse related projects</span>
                  <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#030712] to-[#020617] border-t border-slate-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel p-12 sm:p-16 rounded-3xl border border-indigo-500/20 text-center space-y-8 bg-slate-950/60 shadow-glow-primary"
          >
            <h2 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight">
              Ready to Accelerate Innovation?
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed font-light">
              Join thousands of developers upgrading their skills on actual codebases, or submit your business challenge to receive a custom software delivery at startup speeds.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <motion.div whileHover={{ scale: 1.05 }} className="w-full sm:w-auto">
                <Link
                  to="/register"
                  className="w-full block bg-indigo-650 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-glow-primary text-sm uppercase tracking-wider"
                >
                  Join as Student
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="w-full sm:w-auto">
                <Link
                  to="/contact"
                  className="w-full block bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-xl border border-slate-805 transition text-sm uppercase tracking-wider"
                >
                  Book Consultation
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
    </div>
  );
};
