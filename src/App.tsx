import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './providers/AuthProvider';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { LandingPage } from './features/landing/LandingPage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { VerifyEmailPage } from './features/auth/VerifyEmailPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/ResetPasswordPage';
import { StudentDashboard } from './features/dashboard/StudentDashboard';
import { InstructorDashboard } from './features/dashboard/InstructorDashboard';
import { BusinessDashboard } from './features/dashboard/BusinessDashboard';
import { AdminDashboard } from './features/dashboard/AdminDashboard';
import { CoursesPage } from './features/lms/CoursesPage';
import { CourseDetailsPage } from './features/lms/CourseDetailsPage';
import { LessonWorkspacePage } from './features/lms/LessonWorkspacePage';
import { CommunityWorkspacePage } from './features/community/CommunityWorkspacePage';
import { DiscussionThreadPage } from './features/community/DiscussionThreadPage';
import { ContactPage } from './features/contact/ContactPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes with standard Layout */}
            <Route path="/" element={<Layout><LandingPage /></Layout>} />
            <Route path="/courses" element={<Layout><CoursesPage /></Layout>} />
            <Route path="/courses/:id" element={<Layout><CourseDetailsPage /></Layout>} />
            <Route path="/community" element={<Layout><CommunityWorkspacePage /></Layout>} />
            <Route path="/community/threads/:id" element={<Layout><DiscussionThreadPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected LMS Route */}
            <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']} />}>
              <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonWorkspacePage />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
              <Route path="/dashboard/student" element={<StudentDashboard />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['INSTRUCTOR']} />}>
              <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['BUSINESS']} />}>
              <Route path="/dashboard/business" element={<BusinessDashboard />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
