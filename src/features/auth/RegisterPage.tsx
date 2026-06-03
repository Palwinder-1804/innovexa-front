import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../providers/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Lock, Mail, User as UserIcon, ArrowLeft } from 'lucide-react';

const registerFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'BUSINESS']),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export const RegisterPage: React.FC = () => {
  const { register: signup } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      role: 'STUDENT',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await signup({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center glass-panel p-8 rounded-2xl border border-slate-800/80 bg-[#070b19]/60 backdrop-blur-xl">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white">Registration Successful!</h2>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            We have dispatched a verification token to your email inbox. Please click the confirmation link to activate your innovation workspace.
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Neon glows */}
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Floating Back to Home button */}
      <div className="absolute top-6 left-6 z-10">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to portal
        </Link>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 glass-panel p-8 rounded-2xl border border-slate-800/60 bg-[#070b19]/60 backdrop-blur-xl">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-background shadow-glow-primary">
              IX
            </span>
          </Link>
          <h2 className="text-3xl font-display font-extrabold text-white">Create your account</h2>
          <p className="mt-1 text-sm text-gray-400">
            Join the Innovexa digital ecosystem today
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                {...register('firstName')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition text-sm"
                placeholder="John"
              />
              {errors.firstName && <p className="text-rose-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
              <input
                type="text"
                {...register('lastName')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition text-sm"
                placeholder="Doe"
              />
              {errors.lastName && <p className="text-rose-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                {...register('email')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition text-sm"
                placeholder="name@example.com"
              />
            </div>
            {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                {...register('password')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition text-sm"
                placeholder="Min 6 characters"
              />
            </div>
            {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Ecosystem Profile</label>
            <select
              {...register('role')}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
            >
              <option value="STUDENT">Student Learner (Access LMS & Hackathons)</option>
              <option value="INSTRUCTOR">Instructor / Expert (Teach & Grade Projects)</option>
              <option value="BUSINESS">Business Client (Book Advisory & Request Systems)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg py-2.5 font-semibold hover:from-indigo-500 hover:to-indigo-400 transition shadow-glow-primary flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <div className="text-center text-xs text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
