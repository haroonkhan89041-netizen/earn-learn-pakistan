import { useEffect, useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Lock } from 'lucide-react';
import { DEMO_COURSES } from '@/data/demoData';
import type { Course } from '@/types';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>(DEMO_COURSES);
  const [showForm, setShowForm] = useState(false);
  const { confirm, dialog } = useConfirmDialog();

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (error) { toast.error(error.message); return; }
      if (data) setCourses(data as Course[]);
    })();
  }, []);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get('title')), description: String(fd.get('description')),
      thumbnail_url: '', difficulty: 'beginner' as const,
      is_premium: fd.get('premium') === 'on',
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('courses').insert(payload).select().single();
      if (error) { toast.error(error.message); return; }
      setCourses((prev) => [data as Course, ...prev]);
    } else {
      setCourses((prev) => [
        { ...payload, id: `c-${Date.now()}`, lesson_count: 0, created_at: new Date().toISOString() },
        ...prev,
      ]);
    }
    setShowForm(false);
    toast.success('Course created — add lessons and quizzes next');
  }

  function remove(c: Course) {
    confirm({
      title: 'Delete course', description: `Delete "${c.title}" and all its lessons?`, confirmLabel: 'Delete', danger: true,
      onConfirm: async () => {
        if (isSupabaseConfigured) {
          // ON DELETE CASCADE on lessons.course_id (see supabase/schema.sql)
          // removes lessons, quizzes, and quiz_results for this course too.
          const { error } = await supabase.from('courses').delete().eq('id', c.id);
          if (error) { toast.error(error.message); return; }
        }
        setCourses((prev) => prev.filter((x) => x.id !== c.id));
        toast.success('Deleted');
      },
    });
  }

  return (
    <div className="space-y-6">
      {dialog}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy-900">Courses</h1>
          <p className="text-sm text-navy-500">Create courses, then add lessons and quizzes.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}><Plus size={16} /> New course</button>
      </div>

      {showForm && (
        <form onSubmit={onCreate} className="card grid gap-3 p-5 sm:grid-cols-2">
          <input name="title" required placeholder="Course title" className="input sm:col-span-2" />
          <textarea name="description" required placeholder="Description" className="input sm:col-span-2" rows={2} />
          <label className="flex items-center gap-2 text-sm text-navy-600"><input type="checkbox" name="premium" /> Premium course</label>
          <div className="sm:col-span-2 flex gap-2">
            <button className="btn-primary">Create course</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <div key={c.id} className="card p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="badge bg-navy-100 text-navy-600 capitalize">{c.difficulty}</span>
              {c.is_premium && <span className="badge bg-brand-amber/10 text-amber-700"><Lock size={11} /> Premium</span>}
            </div>
            <p className="font-display text-sm font-bold text-navy-900">{c.title}</p>
            <p className="mt-1 text-xs text-navy-500 line-clamp-2">{c.description}</p>
            <p className="mt-2 text-xs text-navy-400">{c.lesson_count ?? 0} lessons</p>
            <div className="mt-4 flex gap-2">
              <button
                className="btn-outline flex-1 !py-1.5 text-xs"
                onClick={() => toast('Lesson editor is the next build increment — see README "Still local-state-only" notes.', { icon: 'ℹ️' })}
              >
                Manage lessons
              </button>
              <button onClick={() => remove(c)} className="rounded-lg bg-navy-50 p-1.5 text-navy-500"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
      {courses.length === 0 && (
        <p className="text-sm text-navy-400">No courses yet — create one above.</p>
      )}
    </div>
  );
}
