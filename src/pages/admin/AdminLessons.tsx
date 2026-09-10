import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Archive, BookOpen, Pencil, Plus, Send, Trash2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';

type Course = { id: string; title: string; status: 'draft' | 'published' | 'archived' };
type Lesson = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  content: string | null;
  lesson_order: number;
  duration_minutes: number | null;
  is_published: boolean;
};

export function AdminLessons() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseId, setCourseId] = useState('');
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { confirm, dialog } = useConfirmDialog();

  async function load() {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    const [{ data: courseData, error: courseError }, { data: lessonData, error: lessonError }] = await Promise.all([
      supabase.from('courses').select('id,title,status').order('title'),
      supabase.from('course_lessons').select('*').order('course_id').order('lesson_order'),
    ]);
    if (courseError) toast.error(courseError.message);
    if (lessonError) toast.error(lessonError.message);
    setCourses((courseData ?? []) as Course[]);
    setLessons((lessonData ?? []) as Lesson[]);
    if (!courseId && courseData?.[0]?.id) setCourseId(courseData[0].id);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  function openCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(lesson: Lesson) {
    setEditing(lesson);
    setCourseId(lesson.course_id);
    setShowForm(true);
  }

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const selectedCourse = String(fd.get('course_id') ?? '').trim();
    const title = String(fd.get('title') ?? '').trim();
    const description = String(fd.get('description') ?? '').trim() || null;
    const video_url = String(fd.get('video_url') ?? '').trim() || null;
    const content = String(fd.get('content') ?? '').trim() || null;
    const lesson_order = Math.max(1, Number(fd.get('lesson_order') ?? 1) || 1);
    const duration = Number(fd.get('duration_minutes') ?? 0);
    const duration_minutes = Number.isFinite(duration) && duration >= 0 ? duration : 0;
    const is_published = fd.get('is_published') === 'on';
    if (!selectedCourse || !title) return;

    const payload = { course_id: selectedCourse, title, description, video_url, content, lesson_order, duration_minutes, is_published };
    const result = editing
      ? await supabase.from('course_lessons').update(payload).eq('id', editing.id).select().single()
      : await supabase.from('course_lessons').insert(payload).select().single();
    if (result.error) { toast.error(result.error.message); return; }
    toast.success(editing ? 'Lesson updated' : 'Lesson created');
    setShowForm(false);
    setEditing(null);
    await load();
  }

  async function togglePublished(lesson: Lesson) {
    const { data, error } = await supabase.from('course_lessons').update({ is_published: !lesson.is_published }).eq('id', lesson.id).select().single();
    if (error) { toast.error(error.message); return; }
    setLessons(prev => prev.map(item => item.id === lesson.id ? data as Lesson : item));
    toast.success(data.is_published ? 'Lesson published' : 'Lesson archived');
  }

  function remove(lesson: Lesson) {
    confirm({
      title: 'Delete lesson',
      description: `Delete “${lesson.title}”? Student progress linked to this lesson may prevent deletion.`,
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: async () => {
        const { error } = await supabase.from('course_lessons').delete().eq('id', lesson.id);
        if (error) { toast.error(error.message); return; }
        setLessons(prev => prev.filter(item => item.id !== lesson.id));
        toast.success('Lesson deleted');
      },
    });
  }

  const visibleLessons = courseId ? lessons.filter(lesson => lesson.course_id === courseId) : lessons;
  const selectedCourseTitle = courses.find(course => course.id === courseId)?.title ?? 'All courses';

  return <div className="space-y-6">{dialog}
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="font-display text-2xl font-extrabold text-navy-900">Lessons</h1><p className="text-sm text-navy-500">Create and publish real course lessons in Supabase.</p></div>
      <button className="btn-primary" onClick={openCreate}><Plus size={16}/> New lesson</button>
    </div>

    <div className="card flex flex-wrap items-center gap-3 p-4">
      <label className="text-sm font-semibold text-navy-700">Course</label>
      <select value={courseId} onChange={e => setCourseId(e.target.value)} className="input max-w-md">
        {courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}
      </select>
      <span className="text-xs text-navy-400">{visibleLessons.length} lesson{visibleLessons.length === 1 ? '' : 's'}</span>
    </div>

    {showForm && <form onSubmit={save} className="card grid gap-3 p-5 md:grid-cols-2">
      <div className="md:col-span-2 flex items-center justify-between"><h2 className="font-display font-bold text-navy-900">{editing ? 'Edit lesson' : 'Create lesson'}</h2></div>
      <select name="course_id" value={courseId} onChange={e => setCourseId(e.target.value)} className="input" required>
        <option value="">Select course</option>{courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}
      </select>
      <input name="title" required defaultValue={editing?.title ?? ''} placeholder="Lesson title" className="input" />
      <textarea name="description" defaultValue={editing?.description ?? ''} placeholder="Short lesson description" className="input md:col-span-2" rows={3} />
      <input name="video_url" type="url" defaultValue={editing?.video_url ?? ''} placeholder="Video URL (optional)" className="input" />
      <input name="lesson_order" type="number" min="1" defaultValue={editing?.lesson_order ?? visibleLessons.length + 1} placeholder="Lesson order" className="input" />
      <input name="duration_minutes" type="number" min="0" defaultValue={editing?.duration_minutes ?? 0} placeholder="Duration (minutes)" className="input" />
      <textarea name="content" defaultValue={editing?.content ?? ''} placeholder="Lesson content" className="input md:col-span-2" rows={8} />
      <label className="flex items-center gap-2 text-sm text-navy-700 md:col-span-2"><input type="checkbox" name="is_published" defaultChecked={editing?.is_published ?? false} /> Publish lesson immediately</label>
      <div className="flex gap-2 md:col-span-2"><button className="btn-primary">{editing ? 'Save changes' : 'Create lesson'}</button><button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-outline">Cancel</button></div>
    </form>}

    {loading ? <div className="card p-8 text-center text-sm text-navy-400">Loading lessons…</div> : visibleLessons.length === 0 ? <div className="card p-8 text-center"><BookOpen className="mx-auto text-navy-300" size={28}/><p className="mt-2 text-sm text-navy-400">No lessons for {selectedCourseTitle} yet.</p></div> :
      <div className="space-y-3">{visibleLessons.map(lesson => <div key={lesson.id} className="card flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="badge bg-navy-100 text-navy-600">#{lesson.lesson_order}</span><h3 className="font-display font-bold text-navy-900">{lesson.title}</h3></div><p className="mt-1 text-xs text-navy-500 line-clamp-2">{lesson.description || lesson.content || 'No description provided.'}</p><p className="mt-1 text-xs text-navy-400">{lesson.duration_minutes ?? 0} min · {lesson.is_published ? 'Published' : 'Draft'}</p></div>
        <div className="flex flex-wrap gap-2"><button onClick={() => openEdit(lesson)} className="btn-outline text-xs"><Pencil size={13}/> Edit</button><button onClick={() => void togglePublished(lesson)} className="btn-outline text-xs">{lesson.is_published ? <><Archive size={13}/> Unpublish</> : <><Send size={13}/> Publish</>}</button><button onClick={() => remove(lesson)} aria-label={`Delete ${lesson.title}`} className="rounded-lg bg-navy-50 p-2 text-navy-500 hover:bg-navy-100"><Trash2 size={15}/></button></div>
      </div>)}</div>}
  </div>;
}
