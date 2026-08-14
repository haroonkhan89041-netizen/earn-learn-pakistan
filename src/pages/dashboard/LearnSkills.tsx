import { useEffect, useState } from 'react';
import { BookOpen, Lock, PlayCircle } from 'lucide-react';
import { DEMO_COURSES } from '@/data/demoData';
import { DifficultyBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Course } from '@/types';

const demoProgress: Record<string, number> = { c1: 60, c2: 20, c4: 100 };

export function LearnSkills() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [allCourses, setAllCourses] = useState<Course[]>(DEMO_COURSES);
  const [progress, setProgress] = useState<Record<string, number>>(demoProgress);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (data) setAllCourses(data as Course[]);
      // INTEGRATION POINT: compute per-course progress from
      // (quiz_results / lessons completed) once lesson-completion tracking
      // is added; left as 0% for real accounts until then.
      if (user) setProgress({});
    })();
  }, [user]);

  const courses = allCourses.filter((c) =>
    filter === 'all' ? true : filter === 'free' ? !c.is_premium : c.is_premium
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Learn Skills</h1>
        <p className="text-sm text-navy-500">Free, beginner-friendly courses to build real digital skills.</p>
      </div>

      <div className="flex gap-2">
        {(['all', 'free', 'premium'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => {
          const pct = progress[c.id] ?? 0;
          return (
            <div key={c.id} className="card overflow-hidden">
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-navy-900 to-navy-700 text-white">
                <BookOpen size={28} />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <DifficultyBadge level={c.difficulty} />
                  {c.is_premium && <span className="badge bg-navy-100 text-navy-600"><Lock size={11} /> Premium</span>}
                </div>
                <p className="font-display text-sm font-bold text-navy-900">{c.title}</p>
                <p className="mt-1 text-xs text-navy-500 line-clamp-2">{c.description}</p>
                <p className="mt-2 text-xs text-navy-400">{c.lesson_count ?? 0} lessons</p>
                {pct > 0 && (
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs text-navy-500">
                      <span>Progress</span><span>{pct}%</span>
                    </div>
                    <ProgressBar value={pct} color="green" />
                  </div>
                )}
                <button className="btn-primary mt-4 w-full">
                  <PlayCircle size={16} /> {pct > 0 ? 'Continue' : 'Start course'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
