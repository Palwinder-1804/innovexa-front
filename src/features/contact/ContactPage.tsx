import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../../lib/axiosClient';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  isdCode: z.string().min(1, 'ISD code is required'),
  phone: z.string().min(6, 'Phone number must be at least 6 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
  userType: z.enum(['Student', 'Instructor', 'Business Client', 'Admin', 'Guest']),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      userType: 'Guest',
      isdCode: '+91',
      phone: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: `${data.isdCode} ${data.phone}`,
        userType: data.userType,
        subject: data.subject,
        message: data.message,
      };
      const response = await axiosClient.post('/contact', payload);
      setSubmitStatus({
        type: 'success',
        message: response.data.message || 'Thank you! Your query has been logged and we will be in touch shortly.',
      });
      reset();
    } catch (error: any) {
      setSubmitStatus({
        type: 'error',
        message: error.response?.data?.message || 'Something went wrong. Please check your inputs and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Neon glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-display font-extrabold text-white mb-4"
          >
            Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Collaboration</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Have a question, want to pitch a custom business project, or looking for mentorship? Contact the Innovexa Core Team.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Side */}
          <div className="lg:col-span-1 space-y-6 flex flex-col justify-between h-full bg-slate-950/40 p-8 rounded-2xl border border-slate-800/40 backdrop-blur-xl">
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-white mb-6">Contact Channels</h2>
              
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-200">Email Address</h4>
                  <p className="text-sm text-gray-405 mt-1 text-indigo-450 hover:underline cursor-pointer">
                    therocks252612@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-200">Campus Address</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    SCO 112, Maxon Tower, Urban Estate Phase 2 Road, Jalandhar, Punjab
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-900 pt-6 mt-6">
              <span className="text-xs text-gray-600 block">Avg Response Latency</span>
              <span className="text-sm font-display font-medium text-cyan-400">&lt; 12 Hours (SLA)</span>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2 bg-slate-950/40 p-8 rounded-2xl border border-slate-800/40 backdrop-blur-xl">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Leave a Message</h2>

            {submitStatus && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${
                  submitStatus.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                }`}
              >
                {submitStatus.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 shrink-0" />
                )}
                <span className="text-sm">{submitStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition text-sm"
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Your Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition text-sm"
                    placeholder="name@example.com"
                  />
                  {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone input with ISD code selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                  <div className="flex gap-2">
                    <select
                      {...register('isdCode')}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs sm:text-sm shrink-0 w-24"
                    >
                      <option value="+91">+91 (IN)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+61">+61 (AU)</option>
                      <option value="+971">+971 (AE)</option>
                      <option value="+81">+81 (JP)</option>
                      <option value="+49">+49 (DE)</option>
                      <option value="+33">+33 (FR)</option>
                      <option value="+65">+65 (SG)</option>
                    </select>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition text-sm"
                      placeholder="9876543210"
                    />
                  </div>
                  {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                {/* User Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Profile Category</label>
                  <select
                    {...register('userType')}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
                  >
                    <option value="Guest">Guest Explorer</option>
                    <option value="Student">Student Learner</option>
                    <option value="Instructor">Instructor / Mentor</option>
                    <option value="Business Client">Business / Enterprise</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                <input
                  type="text"
                  {...register('subject')}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition text-sm"
                  placeholder="How can we help you?"
                />
                {errors.subject && <p className="text-rose-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Detailed Message</label>
                <textarea
                  rows={5}
                  {...register('message')}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition resize-none text-sm"
                  placeholder="Describe your inquiry or project pitch..."
                />
                {errors.message && <p className="text-rose-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg py-3 font-semibold hover:from-indigo-500 hover:to-indigo-400 transition shadow-glow-primary flex justify-center items-center gap-2 disabled:opacity-50 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                    Transmitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Query
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
