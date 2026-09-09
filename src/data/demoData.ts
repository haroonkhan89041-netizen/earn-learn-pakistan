// Sample/demo content used only as a local fallback when Supabase is not connected.
import type { AppNotification } from '@/types';
export const DEMO_OPPORTUNITIES = [
  { id:'demo-op-1', title:'Freelance Data Entry', description:'Illustrative local fallback.', category:'freelancing', difficulty:'beginner', estimated_earning:'Varies', time_required:'Flexible', external_url:'https://www.upwork.com', is_verified:true, is_featured:true, status:'approved', click_count:0, created_at:'2026-07-01T00:00:00Z' },
  { id:'demo-op-2', title:'AI Prompt Writing Gigs', description:'Illustrative local fallback.', category:'ai_tools', difficulty:'intermediate', estimated_earning:'Varies', time_required:'Flexible', external_url:'https://www.fiverr.com', is_verified:true, is_featured:false, status:'approved', click_count:0, created_at:'2026-07-03T00:00:00Z' },
] as any[];
export const DEMO_TASKS = [
  { id:'demo-task-1', title:'Freelancing Safety Basics', description:'Illustrative local fallback task.', instructions:'Read the instructions.', task_type:'article', reward_points:20, estimated_minutes:6, is_active:true, proof_required:false, proof_type:'text', status:'published', starts_at:null, ends_at:null, max_completions:null, created_by:null, created_at:'2026-08-10T00:00:00Z' },
  { id:'demo-task-2', title:'Digital Marketing Basics', description:'Illustrative local fallback task.', instructions:'Complete the lesson.', task_type:'quiz', reward_points:30, estimated_minutes:8, is_active:true, proof_required:false, proof_type:'text', status:'published', starts_at:null, ends_at:null, max_completions:null, created_by:null, created_at:'2026-08-11T00:00:00Z' },
] as any[];
export const DEMO_COURSES = [
  { id:'c1', title:'Freelancing Fundamentals', description:'Illustrative local fallback course.', thumbnail_url:'', difficulty:'beginner', lesson_count:0, is_premium:false, category_id:null, slug:'freelancing-fundamentals', short_description:'Learn freelancing basics.', instructor:null, level:'beginner', duration_minutes:60, is_free:true, certificate_available:false, status:'published', created_by:null, created_at:'2026-06-01T00:00:00Z', updated_at:'2026-06-01T00:00:00Z' },
  { id:'c2', title:'Graphic Design with Canva', description:'Illustrative local fallback course.', thumbnail_url:'', difficulty:'beginner', lesson_count:0, is_premium:false, category_id:null, slug:'graphic-design-canva', short_description:'Learn Canva basics.', instructor:null, level:'beginner', duration_minutes:60, is_free:true, certificate_available:false, status:'published', created_by:null, created_at:'2026-06-01T00:00:00Z', updated_at:'2026-06-01T00:00:00Z' },
] as any[];
export const DEMO_NOTIFICATIONS: AppNotification[] = [];
export const DEMO_LEADERBOARD: any[] = [];
