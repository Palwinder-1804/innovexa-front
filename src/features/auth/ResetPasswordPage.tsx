import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../../lib/axiosClient';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';

const resetFormSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetFormData = z.infer<typeof resetFormSchema>;

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetFormSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    if (!token) {
      setError('Password reset token is missing. Please check your verification link.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await axiosClient.post('/auth/reset-password', {
        token,
        password: data.password,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-panel p-8 rounded-2xl border border-slate-800/60 bg-[#070b19]/60 backdrop-blur-xl">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-background shadow-glow-primary">
              IX
            </span>
          </Link>
          <h2 className="text-3xl font-display font-extrabold text-white">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-400">
            Set your new secure password below
          </p>
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-display font-bold text-white">Password Updated!</h3>
            <p className="mt-2 text-sm text-gray-400">
              Your password has been changed. You can now sign in using your new credentials.
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full block text-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition text-sm"
                  placeholder="Minimum 6 characters"
                />
              </div>
              {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  {...register('confirmPassword')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition text-sm"
                  placeholder="Repeat new password"
                />
              </div>
              {errors.confirmPassword && <p className="text-rose-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg py-2.5 font-semibold hover:from-indigo-500 hover:to-indigo-400 transition shadow-glow-primary flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                ) : (
                  'Confirm Password'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
