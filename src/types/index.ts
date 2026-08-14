// Core domain types for Earn & Learn Pakistan.
// These mirror the Supabase schema in /supabase/schema.sql.

export type AccountStatus = 'active' | 'suspended' | 'pending_verification';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  city: string | null;
  skills: string[];
  referral_code: string;
  referred_by: string | null;
  points_balance: number;
  account_status: AccountStatus;
  is_admin: boolean;
  hide_from_leaderboard: boolean;
  created_at: string;
}

export type OpportunityCategory =
  | 'freelancing' | 'remote_jobs' | 'ai_tools' | 'digital_marketing'
  | 'content_creation' | 'affiliate_marketing' | 'micro_tasks'
  | 'digital_services' | 'youtube' | 'student';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: OpportunityCategory;
  difficulty: Difficulty;
  estimated_earning: string; // range text e.g. "PKR 5,000 - 20,000 / month"
  time_required: string; // e.g. "2-4 hrs/week"
  external_url: string;
  is_verified: boolean;
  is_featured: boolean;
  status: ApprovalStatus;
  click_count: number;
  created_at: string;
}

export type TaskType = 'article' | 'video' | 'quiz' | 'skill_lesson' | 'survey' | 'sponsored';

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  instructions: string;
  task_type: TaskType;
  reward_points: number;
  estimated_minutes: number;
  is_active: boolean;
  created_at: string;
}

export type CompletionStatus = 'in_progress' | 'submitted' | 'verified' | 'rejected';

export interface TaskCompletion {
  id: string;
  task_id: string;
  user_id: string;
  status: CompletionStatus;
  submitted_at: string | null;
  verified_at: string | null;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  difficulty: Difficulty;
  lesson_count: number;
  is_premium: boolean;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  order_index: number;
  duration_minutes: number;
}

export type TransactionType = 'task_reward' | 'referral_reward' | 'admin_adjustment' | 'withdrawal_deduction' | 'bonus';

export interface PointsTransaction {
  id: string;
  user_id: string;
  amount: number; // positive = credit, negative = debit
  type: TransactionType;
  description: string;
  created_at: string;
}

export type WithdrawalMethod = 'easypaisa' | 'jazzcash' | 'bank_transfer';
export type WithdrawalStatus = 'pending' | 'approved' | 'paid' | 'rejected';

export interface Withdrawal {
  id: string;
  user_id: string;
  amount_points: number;
  amount_pkr: number;
  method: WithdrawalMethod;
  account_name: string;
  account_number: string;
  status: WithdrawalStatus;
  requested_at: string;
  processed_at: string | null;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  status: 'pending' | 'active' | 'flagged';
  reward_points: number;
  created_at: string;
}

export type NotificationType =
  | 'new_task' | 'new_opportunity' | 'reward_approved' | 'withdrawal_status'
  | 'referral_reward' | 'new_course' | 'admin_announcement';

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SupportTicket {
  id: string;
  user_id: string;
  category: string;
  message: string;
  status: TicketStatus;
  created_at: string;
}

export interface AdminSettings {
  points_to_pkr_rate: number; // 1 point = X PKR
  minimum_withdrawal_points: number;
  referral_reward_points: number;
  platform_announcement: string | null;
}

export interface Advertisement {
  id: string;
  placement: 'home_hero' | 'dashboard_sidebar' | 'opportunities_inline';
  is_enabled: boolean;
  ad_code: string;
  impressions: number;
  clicks: number;
}
