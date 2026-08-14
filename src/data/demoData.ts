// Sample/demo content used when Supabase isn't connected yet, and to seed
// a new database. All content here is clearly illustrative — no fake
// payment proofs, no fake balances, no guaranteed-income claims.
import type { Opportunity, DailyTask, Course, AppNotification } from '@/types';

export const DEMO_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'demo-op-1', title: 'Freelance Data Entry (Upwork)',
    description: 'Verified Upwork listings for data entry and admin support roles suited to beginners. Availability and pay vary by client.',
    category: 'freelancing', difficulty: 'beginner',
    estimated_earning: 'PKR 15,000 – 40,000 / month (varies by workload)',
    time_required: '3–5 hrs/day', external_url: 'https://www.upwork.com',
    is_verified: true, is_featured: true, status: 'approved', click_count: 214,
    created_at: '2026-07-01T00:00:00Z',
  },
  {
    id: 'demo-op-2', title: 'AI Prompt Writing Gigs',
    description: 'Curated marketplace listings for AI content and prompt-writing tasks. Requires strong written English.',
    category: 'ai_tools', difficulty: 'intermediate',
    estimated_earning: 'PKR 10,000 – 30,000 / month',
    time_required: '2–4 hrs/day', external_url: 'https://www.fiverr.com',
    is_verified: true, is_featured: true, status: 'approved', click_count: 158,
    created_at: '2026-07-03T00:00:00Z',
  },
  {
    id: 'demo-op-3', title: 'YouTube Shorts Editing',
    description: 'Remote editing gigs for creators needing short-form video cuts. Portfolio required.',
    category: 'youtube', difficulty: 'intermediate',
    estimated_earning: 'PKR 20,000 – 60,000 / month',
    time_required: '4–6 hrs/day', external_url: 'https://www.fiverr.com',
    is_verified: true, is_featured: false, status: 'approved', click_count: 97,
    created_at: '2026-07-05T00:00:00Z',
  },
  {
    id: 'demo-op-4', title: 'Student Micro-Internship — Digital Marketing',
    description: 'Part-time micro-internship for university students to assist small businesses with social media.',
    category: 'student', difficulty: 'beginner',
    estimated_earning: 'PKR 8,000 – 15,000 / month',
    time_required: '10 hrs/week', external_url: 'https://www.internshala.com',
    is_verified: true, is_featured: false, status: 'approved', click_count: 63,
    created_at: '2026-07-08T00:00:00Z',
  },
  {
    id: 'demo-op-5', title: 'Affiliate Marketing Starter Kit',
    description: 'Guide + verified affiliate programs relevant to Pakistani audiences (hosting, courses, fintech apps).',
    category: 'affiliate_marketing', difficulty: 'beginner',
    estimated_earning: 'Commission-based — no fixed amount',
    time_required: 'Flexible', external_url: 'https://www.impact.com',
    is_verified: true, is_featured: false, status: 'approved', click_count: 141,
    created_at: '2026-07-10T00:00:00Z',
  },
  {
    id: 'demo-op-6', title: 'Micro-Task Surveys (Verified Panels)',
    description: 'Legitimate, verified survey panels. Payout per survey is small — best as a side activity, not primary income.',
    category: 'micro_tasks', difficulty: 'beginner',
    estimated_earning: 'PKR 50 – 300 per survey',
    time_required: '10–20 min/task', external_url: 'https://www.surveytime.io',
    is_verified: true, is_featured: false, status: 'approved', click_count: 302,
    created_at: '2026-07-12T00:00:00Z',
  },
];

export const DEMO_TASKS: DailyTask[] = [
  {
    id: 'demo-task-1', title: 'Read: How Freelancing Platforms Verify Clients',
    description: 'A short educational article on spotting legitimate clients vs. scams on freelance platforms.',
    instructions: 'Read the full article, then answer the 3-question check at the end.',
    task_type: 'article', reward_points: 20, estimated_minutes: 6, is_active: true,
    created_at: '2026-08-10T00:00:00Z',
  },
  {
    id: 'demo-task-2', title: 'Watch: Writing a Winning Upwork Proposal',
    description: 'A 5-minute video lesson on structuring proposals that get replies.',
    instructions: 'Watch the full video. Points are awarded once playback completes.',
    task_type: 'video', reward_points: 25, estimated_minutes: 5, is_active: true,
    created_at: '2026-08-10T00:00:00Z',
  },
  {
    id: 'demo-task-3', title: 'Quiz: Digital Marketing Basics',
    description: 'Test your understanding of core digital marketing terms.',
    instructions: 'Score at least 70% to earn points. You can retake it once per day.',
    task_type: 'quiz', reward_points: 30, estimated_minutes: 8, is_active: true,
    created_at: '2026-08-11T00:00:00Z',
  },
  {
    id: 'demo-task-4', title: 'Skill Lesson: Canva for Social Media Graphics',
    description: 'A hands-on mini lesson on building a simple social post in Canva.',
    instructions: 'Complete the guided steps and submit a screenshot of your result for review.',
    task_type: 'skill_lesson', reward_points: 35, estimated_minutes: 15, is_active: true,
    created_at: '2026-08-12T00:00:00Z',
  },
];

export const DEMO_COURSES: Course[] = [
  { id: 'c1', title: 'Freelancing Fundamentals', description: 'Set up a winning profile and land your first client.', thumbnail_url: '', difficulty: 'beginner', lesson_count: 8, is_premium: false, created_at: '2026-06-01T00:00:00Z' },
  { id: 'c2', title: 'Graphic Design with Canva', description: 'Design social posts, thumbnails, and simple brand kits.', thumbnail_url: '', difficulty: 'beginner', lesson_count: 10, is_premium: false, created_at: '2026-06-01T00:00:00Z' },
  { id: 'c3', title: 'Video Editing for Shorts & Reels', description: 'Cut, caption, and export short-form content efficiently.', thumbnail_url: '', difficulty: 'intermediate', lesson_count: 12, is_premium: true, created_at: '2026-06-01T00:00:00Z' },
  { id: 'c4', title: 'AI Tools for Everyday Work', description: 'Practical AI tool workflows for writing, research, and design.', thumbnail_url: '', difficulty: 'beginner', lesson_count: 9, is_premium: false, created_at: '2026-06-01T00:00:00Z' },
  { id: 'c5', title: 'Growing a YouTube Channel', description: 'Planning, filming, and publishing consistently.', thumbnail_url: '', difficulty: 'intermediate', lesson_count: 14, is_premium: true, created_at: '2026-06-01T00:00:00Z' },
  { id: 'c6', title: 'WordPress Website Basics', description: 'Build and launch a simple WordPress site.', thumbnail_url: '', difficulty: 'beginner', lesson_count: 11, is_premium: false, created_at: '2026-06-01T00:00:00Z' },
  { id: 'c7', title: 'Web Development Starter Path', description: 'HTML, CSS, and JavaScript fundamentals.', thumbnail_url: '', difficulty: 'intermediate', lesson_count: 20, is_premium: true, created_at: '2026-06-01T00:00:00Z' },
  { id: 'c8', title: 'Digital Marketing Essentials', description: 'SEO, ads, and content basics for small businesses.', thumbnail_url: '', difficulty: 'beginner', lesson_count: 10, is_premium: false, created_at: '2026-06-01T00:00:00Z' },
  { id: 'c9', title: 'Social Media Marketing', description: 'Grow and monetize a brand presence online.', thumbnail_url: '', difficulty: 'beginner', lesson_count: 9, is_premium: false, created_at: '2026-06-01T00:00:00Z' },
];

export const DEMO_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', user_id: 'demo', type: 'new_task', title: 'New daily task available', message: 'A new quiz on Digital Marketing Basics is ready.', is_read: false, created_at: '2026-08-13T08:00:00Z' },
  { id: 'n2', user_id: 'demo', type: 'referral_reward', title: 'Referral bonus earned', message: 'You earned 50 points for a new active referral.', is_read: false, created_at: '2026-08-12T14:00:00Z' },
  { id: 'n3', user_id: 'demo', type: 'withdrawal_status', title: 'Withdrawal update', message: 'Your withdrawal request is now Pending admin review.', is_read: true, created_at: '2026-08-10T09:00:00Z' },
];

export const DEMO_LEADERBOARD = [
  { rank: 1, name: 'Ayesha K.', points: 4820, tasks: 142 },
  { rank: 2, name: 'Bilal R.', points: 4510, tasks: 130 },
  { rank: 3, name: 'Hidden User', points: 4200, tasks: 118 },
  { rank: 4, name: 'Sana M.', points: 3990, tasks: 111 },
  { rank: 5, name: 'Usman T.', points: 3760, tasks: 104 },
];
