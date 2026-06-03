import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosClient from '../../lib/axiosClient';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing. Please check your verification link.');
        return;
      }
      try {
        const response = await axiosClient.post('/auth/verify-email', { token });
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Email verification failed. The token may be invalid or expired.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center glass-panel p-8 rounded-2xl border border-slate-800/80 bg-[#070b19]/60 backdrop-blur-xl">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-background shadow-glow-primary">
            IX
          </span>
        </Link>

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
            <h2 className="text-xl font-display font-bold text-white">Verifying account...</h2>
            <p className="text-sm text-gray-500">Contacting Innovexa core security ledger...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-2xl font-display font-bold text-white">Account Verified!</h2>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">{message}</p>
            <div className="mt-8">
              <Link
                to="/login"
                className="w-full block text-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition"
              >
                Sign In to Workspace
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="py-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-rose-500/10 rounded-full text-rose-400 border border-rose-500/20">
                <AlertCircle className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-2xl font-display font-bold text-white">Verification Failed</h2>
            <p className="mt-2 text-sm text-rose-300 leading-relaxed">{message}</p>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                to="/register"
                className="w-full block text-center bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg border border-slate-800 transition text-sm"
              >
                Create new account
              </Link>
              <Link to="/" className="text-xs text-indigo-400 hover:underline">
                Return to home portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
