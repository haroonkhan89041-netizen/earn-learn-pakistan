import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';

import { PublicLayout } from '@/components/layout/PublicLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';

import { Home } from '@/pages/public/Home';
import { About } from '@/pages/public/About';
import { Contact } from '@/pages/public/Contact';
import { Faq } from '@/pages/public/Faq';
import { PublicOpportunities } from '@/pages/public/PublicOpportunities';
import { PublicLearn } from '@/pages/public/PublicLearn';
import { NotFound } from '@/pages/public/NotFound';

import { Privacy } from '@/pages/legal/Privacy';
import { Terms } from '@/pages/legal/Terms';
import { EarningsDisclaimer } from '@/pages/legal/EarningsDisclaimer';
import { CommunityGuidelines } from '@/pages/legal/CommunityGuidelines';

import { Login } from '@/pages/auth/Login';
import { Signup } from '@/pages/auth/Signup';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';

import { Dashboard } from '@/pages/dashboard/Dashboard';
import { Opportunities } from '@/pages/dashboard/Opportunities';
import { DailyTasks } from '@/pages/dashboard/DailyTasks';
import { LearnSkills } from '@/pages/dashboard/LearnSkills';
import { Rewards } from '@/pages/dashboard/Rewards';
import { Referrals } from '@/pages/dashboard/Referrals';
import { Leaderboard } from '@/pages/dashboard/Leaderboard';
import { Notifications } from '@/pages/dashboard/Notifications';
import { Profile } from '@/pages/dashboard/Profile';
import { Support } from '@/pages/dashboard/Support';

import { AdminOverview } from '@/pages/admin/AdminOverview';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminOpportunities } from '@/pages/admin/AdminOpportunities';
import { AdminTasks } from '@/pages/admin/AdminTasks';
import { AdminCourses } from '@/pages/admin/AdminCourses';
import { AdminWithdrawals } from '@/pages/admin/AdminWithdrawals';
import { AdminAds } from '@/pages/admin/AdminAds';
import { AdminAnalytics } from '@/pages/admin/AdminAnalytics';
import { AdminSettings } from '@/pages/admin/AdminSettings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { fontSize: '14px' } }} />
        <Routes>
          {/* Public site */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/opportunities" element={<PublicOpportunities />} />
            <Route path="/learn" element={<PublicLearn />} />
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="/legal/terms" element={<Terms />} />
            <Route path="/legal/earnings-disclaimer" element={<EarningsDisclaimer />} />
            <Route path="/legal/community-guidelines" element={<CommunityGuidelines />} />
          </Route>

          {/* Auth (no shared layout — full-bleed centered card) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Authenticated user dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="tasks" element={<DailyTasks />} />
            <Route path="learn" element={<LearnSkills />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* Admin panel */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="opportunities" element={<AdminOpportunities />} />
            <Route path="tasks" element={<AdminTasks />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="withdrawals" element={<AdminWithdrawals />} />
            <Route path="ads" element={<AdminAds />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
