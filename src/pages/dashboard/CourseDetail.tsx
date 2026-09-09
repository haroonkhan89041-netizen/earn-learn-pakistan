import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Course, Lesson } from '@/types';

export function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !slug) { setLoading(false); return; }
    (async () => {
      const { data: courseRow, error } = await supabase.from('courses').select('*').eq('slug', slug).eq('status', 'published').maybeSingle();
      if (error || !courseRow) { setLoading(false); return; }
      const c = courseRow as Course;
      setCourse(c);
      const { data: lessonRows } = await supabase.from('course_lessons').select('*').eq('course_id', c.id).eq('is_published', true).order('lesson_order', { ascending: true });
      const ls = (lessonRows ?? []) as Lesson[];
      setLessons(ls);
      if (ls.length) setSelected(ls[0].id);
      if (user) {
        const { data: progressRows } = await supabase.from('lesson_progress').select('lesson_id').eq('user_id', user.id).in('lesson_id', ls.map((l) => l.id));
        const map: Record<string, boolean> = {};
        (progressRows ?? []).forEach((r) => { map[r.lesson_id] = true; });
        setCompleted(map);
        const pct = ls.length ? Math.round(((progressRows ?? []).length / ls.length) * 100) : 0;
        await supabase.from('course_progress').upsert({ user_id: user.id, course_id: c.id, progress_percent: pct, completed_at: pct === 100 && ls.length ? new Date().toISOString() : null });
      }
      setLoading(false);
    })();
  }, [slug, user]);

  const current = useMemo(() => lessons.find((l) => l.id === selected) ?? null, [lessons, selected]);
  const completedCount = Object.values(completed).filter(Boolean).length;
  const percent = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;

  async function markComplete(lesson: Lesson) {
    if (!user) return toast.error('Please sign in to track your progress.');
    if (completed[lesson.id]) return;
    const { error } = await supabase.from('lesson_progress').upsert({ user_id: user.id, lesson_id: lesson.id, completed_at: new Date().toISOString() });
    if (error) return toast.error(error.message);
    const nextCount = completedCount + 1;
    const nextPercent = lessons.length ? Math.round((nextCount / lessons.length) * 100) : 0;
    const { error: progressError } = await supabase.from('course_progress').upsert({ user_id: user.id, course_id: course!.id, progress_percent: nextPercent, completed_at: nextPercent === 100 ? new Date().toISOString() : null });
    if (progressError) return toast.error(progressError.message);
    setCompleted((m) => ({ ...m, [lesson.id]: true }));
    toast.success(nextPercent === 100 ? 'Course completed! 🎉' : 'Lesson completed. Progress saved.');
  }

  if (loading) return <p className="text-sm text-navy-500">Loading course…</p>;
  if (!course) return <div className="card p-8 text-center"><p className="font-semibold text-navy-900">Course not found</p><button className="btn-primary mt-4" onClick={() => navigate('/dashboard/learn')}>Back to courses</button></div>;

  return <div className="space-y-6">
    <button className="flex items-center gap-2 text-sm font-semibold text-navy-500 hover:text-navy-900" onClick={() => navigate('/dashboard/learn')}><ArrowLeft size={16} /> Back to courses</button>
    <div className="card p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div><h1 className="font-display text-2xl font-extrabold text-navy-900">{course.title}</h1><p className="mt-1 text-sm text-navy-500">{course.description}</p></div>
        <div className="min-w-40"><div className="mb-1 flex justify-between text-xs text-navy-500"><span>Course progress</span><span>{percent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-navy-100"><div className="h-full rounded-full bg-brand-green transition-all" style={{ width: `${percent}%` }} /></div></div>
      </div>
    </div>
    {lessons.length === 0 ? <div className="card p-8 text-center text-sm text-navy-500">Lessons will be available soon.</div> : <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="card p-3"><p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-navy-400">Lessons</p>{lessons.map((lesson, i) => <button key={lesson.id} onClick={() => setSelected(lesson.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${selected === lesson.id ? 'bg-navy-900 text-white' : 'text-navy-700 hover:bg-navy-50'}`}><span className="shrink-0">{completed[lesson.id] ? <CheckCircle2 size={18} /> : <Circle size={18} />}</span><span className="min-w-0"><span className="block text-xs opacity-60">Lesson {i + 1}</span><span className="block truncate text-sm font-semibold">{lesson.title}</span></span></button>)}</div>
      <div className="card p-6">{current && <><div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue"><PlayCircle size={22} /></div><div><h2 className="font-display text-xl font-bold text-navy-900">{current.title}</h2><p className="mt-1 text-xs text-navy-400">{current.duration_minutes} minutes</p></div></div>{current.video_url && <div className="mt-6 aspect-video overflow-hidden rounded-xl bg-black"><iframe className="h-full w-full" src={current.video_url} title={current.title} allowFullScreen /></div>}<div className="mt-6 whitespace-pre-line text-sm leading-7 text-navy-700">{current.content || current.description || 'No lesson content available yet.'}</div><div className="mt-6 flex justify-end"><button className="btn-primary" onClick={() => markComplete(current)} disabled={!!completed[current.id]}>{completed[current.id] ? 'Lesson completed ✓' : 'Mark lesson complete'}</button></div></>}</div>
    </div>}
  </div>;
}
