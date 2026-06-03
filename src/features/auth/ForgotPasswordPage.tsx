import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../../lib/axiosClient';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

const forgotFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotFormData = z.infer<typeof forgotFormSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotFormSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await axiosClient.post('/auth/forgot-password', data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-panel p-8 rounded-2xl border border-slate-800/60 bg-[#070b19]/60 backdrop-blur-xl">
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition text-xs mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
          <h2 className="text-3xl font-display font-extrabold text-white">Recover Password</h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your email and we'll dispatch reset instructions.
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-4 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span className="text-sm">
              If an account with that email is registered, we have sent a secure recovery link. Check your inbox.
            </span>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition text-sm"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg py-2.5 font-semibold hover:from-indigo-500 hover:to-indigo-400 transition shadow-glow-primary flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                ) : (
                  'Send Recovery Link'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
