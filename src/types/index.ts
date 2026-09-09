export type ProfileRole = 'user' | 'admin';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  role: ProfileRole;
  points: number;
  balance: number;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
  email?: string;
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'published' | 'archived';

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: string;
}

export interface Course {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  short_description: string | null;
  description: string;
  thumbnail_url: string | null;
  instructor: string | null;
  level: Difficulty;
  duration_minutes: number;
  is_free: boolean;
  certificate_available: boolean;
  status: CourseStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  content: string | null;
  lesson_order: number;
  duration_minutes: number;
  is_published: boolean;
  created_at: string;
}

export interface CourseProgress {
  user_id: string;
  course_id: string;
  progress_percent: number;
  completed_at: string | null;
}

export interface LessonProgress {
  user_id: string;
  lesson_id: string;
  completed_at: string;
}

export interface OpportunityCategory {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export type OpportunityVerification = 'verified' | 'needs_review' | 'closed';
export type OpportunityStatus = 'draft' | 'published' | 'archived';

export interface Opportunity {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  platform_name: string | null;
  description: string;
  requirements: string | null;
  how_to_start: string | null;
  earning_estimate: string | null;
  application_url: string | null;
  country_eligibility: string | null;
  verification_status: OpportunityVerification;
  status: OpportunityStatus;
  featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type ProofType = 'text' | 'url' | 'image';
export type TaskStatus = 'draft' | 'published' | 'archived';

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  instructions: string;
  reward_points: number;
  proof_required: boolean;
  proof_type: ProofType;
  status: TaskStatus;
  starts_at: string | null;
  ends_at: string | null;
  max_completions: number | null;
  created_by: string | null;
  created_at: string;
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface TaskSubmission {
  id: string;
  task_id: string;
  user_id: string;
  proof_text: string | null;
  proof_url: string | null;
  status: SubmissionStatus;
  reviewer_id: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export type TransactionType = 'task' | 'referral' | 'bonus' | 'withdrawal' | 'adjustment';

export interface PointsTransaction {
  id: string;
  user_id: string;
  points: number;
  transaction_type: TransactionType;
  reference_id: string | null;
  description: string | null;
  created_at: string;
}

export type WithdrawalMethod = 'easypaisa' | 'jazzcash' | 'bank_transfer';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected';

export interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  method: WithdrawalMethod;
  account_details: Record<string, unknown>;
  status: WithdrawalStatus;
  reviewer_id: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_user_id: string;
  reward_points: number;
  status: 'pending' | 'qualified' | 'rewarded';
  created_at: string;
}

export type NotificationType = 'new_task' | 'new_opportunity' | 'reward_approved' | 'withdrawal_status' | 'referral_reward' | 'new_course' | 'admin_announcement';

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: unknown;
  updated_by: string | null;
  updated_at: string;
}

export interface AdminSettings {
  points_to_pkr_rate: number;
  minimum_withdrawal_points: number;
  referral_reward_points: number;
  platform_announcement: string | null;
}

export interface Advertisement {
  id: string;
  placement: string;
  is_enabled: boolean;
  ad_code: string;
  impressions: number;
  clicks: number;
}
