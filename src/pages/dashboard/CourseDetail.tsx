import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, CheckCircle2, Circle, PlayCircle, LockKeyhole } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Course, Lesson, CourseCertificate } from '@/types';

function videoEmbedUrl(url: string | null) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (parsed.hostname === 'youtu.be') return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
  } catch { /* keep original URL */ }
  return url;
}

export function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [enrolled, setEnrolled] = useState(false);
  const [certificate, setCertificate] = useState<CourseCertificate | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !slug) { setLoading(false); return; }
    (async () => {
      setLoading(true);
      const { data: courseRow, error } = await supabase.from('courses').select('*').eq('slug', slug).eq('status', 'published').maybeSingle();
      if (error || !courseRow) { setLoading(false); return; }
      const c = courseRow as Course;
      setCourse(c);
      const { data: lessonRows } = await supabase.from('course_lessons').select('*').eq('course_id', c.id).eq('is_published', true).order('lesson_order', { ascending: true });
      const ls = (lessonRows ?? []) as Lesson[];
      setLessons(ls);
      if (ls.length) setSelected(ls[0].id);
      if (user) {
        const [{ data: enrollment }, { data: progressRows }, { data: cert }] = await Promise.all([
          supabase.from('course_enrollments').select('*').eq('user_id', user.id).eq('course_id', c.id).maybeSingle(),
          supabase.from('lesson_progress').select('lesson_id').eq('user_id', user.id).in('lesson_id', ls.map(l => l.id)),
          supabase.from('course_certificates').select('*').eq('user_id', user.id).eq('course_id', c.id).maybeSingle(),
        ]);
        setEnrolled(!!enrollment);
        setCertificate((cert ?? null) as CourseCertificate | null);
        const map: Record<string, boolean> = {};
        (progressRows ?? []).forEach(r => { map[r.lesson_id] = true; });
        setCompleted(map);
        const pct = ls.length ? Math.round(((progressRows ?? []).length / ls.length) * 100) : 0;
        await supabase.from('course_progress').upsert({ user_id: user.id, course_id: c.id, progress_percent: pct, completed_at: pct === 100 && ls.length ? new Date().toISOString() : null });
      }
      setLoading(false);
    })();
  }, [slug, user]);

  const current = useMemo(() => lessons.find(l => l.id === selected) ?? null, [lessons, selected]);
  const completedCount = Object.values(completed).filter(Boolean).length;
  const percent = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;

  async function enroll() {
    if (!user) return navigate('/login');
    if (!course) return;
    setEnrolling(true);
    const { error } = await supabase.from('course_enrollments').upsert({ user_id: user.id, course_id: course.id, last_accessed_at: new Date().toISOString() });
    setEnrolling(false);
    if (error) return toast.error(error.message);
    setEnrolled(true);
    toast.success('You are enrolled. Start learning!');
  }

  async function markComplete(lesson: Lesson) {
    if (!user) return navigate('/login');
    if (!enrolled) return toast.error('Enroll in the course first.');
    if (completed[lesson.id]) return;
    const { error } = await supabase.from('lesson_progress').upsert({ user_id: user.id, lesson_id: lesson.id, completed_at: new Date().toISOString() });
    if (error) return toast.error(error.message);
    const nextCount = completedCount + 1;
    const nextPercent = lessons.length ? Math.round((nextCount / lessons.length) * 100) : 0;
    const { error: progressError } = await supabase.from('course_progress').upsert({ user_id: user.id, course_id: course!.id, progress_percent: nextPercent, completed_at: nextPercent === 100 ? new Date().toISOString() : null });
    if (progressError) return toast.error(progressError.message);
    await supabase.from('course_enrollments').update({ last_accessed_at: new Date().toISOString() }).eq('user_id', user.id).eq('course_id', course!.id);
    setCompleted(m => ({ ...m, [lesson.id]: true }));
    toast.success(nextPercent === 100 ? 'Course completed! 🎉' : 'Lesson completed. Progress saved.');
  }

  async function getCertificate() {
    if (!user || !course) return navigate('/login');
    const { data, error } = await supabase.rpc('issue_course_certificate', { p_course_id: course.id });
    if (error) return toast.error(error.message);
    setCertificate(data as CourseCertificate);
    toast.success('Certificate issued successfully!');
  }

  if (loading) return <p className="text-sm text-navy-500">Loading course…</p>;
  if (!course) return <div className="card p-8 text-center"><p className="font-semibold text-navy-900">Course not found</p><button className="btn-primary mt-4" onClick={() => navigate('/dashboard/learn')}>Back to courses</button></div>;

  return <div className="space-y-6">
    <button className="flex items-center gap-2 text-sm font-semibold text-navy-500 hover:text-navy-900" onClick={() => navigate('/dashboard/learn')}><ArrowLeft size={16}/> Back to courses</button>
    <div className="card overflow-hidden">
      {course.thumbnail_url && <img src={course.thumbnail_url} alt="" className="h-52 w-full object-cover" />}
      <div className="p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div><div className="mb-2 flex flex-wrap gap-2"><span className="badge bg-navy-100 text-navy-600">{course.level}</span><span className="badge bg-brand-green/10 text-brand-green">{course.is_free ? 'Free' : 'Paid'}</span></div><h1 className="font-display text-2xl font-extrabold text-navy-900">{course.title}</h1><p className="mt-2 max-w-2xl text-sm text-navy-500">{course.description}</p></div>
        {!enrolled && <button className="btn-primary shrink-0" onClick={() => void enroll()} disabled={enrolling}>{enrolling ? 'Enrolling…' : course.is_free ? 'Enroll & Start Learning' : 'Enroll in Course'}</button>}
      </div>
      {enrolled && <div className="mt-5 rounded-2xl bg-navy-50 p-4"><div className="mb-2 flex justify-between text-xs text-navy-500"><span>Your progress</span><span>{percent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-brand-green transition-all" style={{width:`${percent}%`}} /></div></div>}
      </div>
    </div>
    {!enrolled ? <div className="card flex items-center gap-4 p-6"><LockKeyhole className="text-navy-400"/><div><p className="font-semibold text-navy-900">Enroll to unlock the lessons</p><p className="text-sm text-navy-500">Your lesson progress will be saved automatically after enrollment.</p></div></div> : lessons.length === 0 ? <div className="card p-8 text-center text-sm text-navy-500">Lessons will be available soon.</div> : <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="card p-3"><p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-navy-400">Course lessons</p>{lessons.map((lesson,i)=><button key={lesson.id} onClick={()=>setSelected(lesson.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${selected===lesson.id?'bg-navy-900 text-white':'text-navy-700 hover:bg-navy-50'}`}><span className="shrink-0">{completed[lesson.id]?<CheckCircle2 size={18}/>:<Circle size={18}/>}</span><span className="min-w-0"><span className="block text-xs opacity-60">Lesson {i+1}</span><span className="block truncate text-sm font-semibold">{lesson.title}</span></span></button>)}</div>
      <div className="card p-6">{current&&<><div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue"><PlayCircle size={22}/></div><div><h2 className="font-display text-xl font-bold text-navy-900">{current.title}</h2><p className="mt-1 text-xs text-navy-400">{current.duration_minutes??0} minutes</p></div></div>{current.video_url&&<div className="mt-6 aspect-video overflow-hidden rounded-xl bg-black"><iframe className="h-full w-full" src={videoEmbedUrl(current.video_url) ?? undefined} title={current.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/></div>}<div className="mt-6 whitespace-pre-line text-sm leading-7 text-navy-700">{current.content||current.description||'No lesson content available yet.'}</div><div className="mt-6 flex justify-end"><button className="btn-primary" onClick={()=>void markComplete(current)} disabled={!!completed[current.id]}>{completed[current.id]?'Lesson completed ✓':'Mark lesson complete'}</button></div></>}</div>
    </div>}
    {enrolled && percent===100 && course.certificate_available && <div className="card border border-brand-green/20 bg-brand-green/5 p-6"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><Award className="text-brand-green" size={28}/><div><p className="font-display font-bold text-navy-900">Course certificate</p><p className="text-sm text-navy-500">You completed this course. {certificate ? `Certificate #${certificate.certificate_number}` : 'Your certificate is ready to issue.'}</p></div></div>{certificate?<button className="btn-outline" onClick={()=>window.print()}>Print certificate</button>:<button className="btn-primary" onClick={()=>void getCertificate()}>Get certificate</button>}</div></div>}
  </div>;
}
