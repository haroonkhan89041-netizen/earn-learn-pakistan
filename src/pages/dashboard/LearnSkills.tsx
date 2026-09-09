import { useEffect, useState } from 'react';
import { BookOpen, PlayCircle } from 'lucide-react';
import { DifficultyBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Course } from '@/types';

export function LearnSkills() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      if (data) setCourses(data as Course[]);

      if (user) {
        const { data: rows } = await supabase
          .from('course_progress')
          .select('course_id, progress_percent')
          .eq('user_id', user.id);
        const map: Record<string, number> = {};
        (rows ?? []).forEach((row) => { map[row.course_id] = row.progress_percent; });
        setProgress(map);
      } else setProgress({});
      setLoading(false);
    })();
  }, [user]);

  const visible = courses.filter((c) =>
    filter === 'all' ? true : filter === 'free' ? c.is_free : !c.is_free
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Learn Skills</h1>
        <p className="text-sm text-navy-500">Free, beginner-friendly courses to build real digital skills.</p>
      </div>

      <div className="flex gap-2">
        {(['all', 'free', 'paid'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? <p className="text-sm text-navy-500">Loading courses…</p> : visible.length === 0 ? (
        <div className="card p-8 text-center text-sm text-navy-500">No published courses are available yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => {
            const pct = progress[c.id] ?? 0;
            return (
              <div key={c.id} className="card overflow-hidden">
                <div className="flex h-28 items-center justify-center bg-gradient-to-br from-navy-900 to-navy-700 text-white">
                  <BookOpen size={28} />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <DifficultyBadge level={c.level} />
                    <span className="badge bg-navy-100 text-navy-600">{c.is_free ? 'Free' : 'Paid'}</span>
                  </div>
                  <p className="font-display text-sm font-bold text-navy-900">{c.title}</p>
                  <p className="mt-1 text-xs text-navy-500 line-clamp-2">{c.short_description || c.description}</p>
                  <p className="mt-2 text-xs text-navy-400">{c.duration_minutes} minutes</p>
                  {pct > 0 && <div className="mt-3"><div className="mb-1 flex justify-between text-xs text-navy-500"><span>Progress</span><span>{pct}%</span></div><ProgressBar value={pct} color="green" /></div>}
                  <button className="btn-primary mt-4 w-full" onClick={() => window.location.href = `/dashboard/learn/${c.slug}`}>
                    <PlayCircle size={16} /> {pct > 0 ? 'Continue' : 'Start course'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
