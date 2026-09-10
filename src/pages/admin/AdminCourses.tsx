import { useEffect, useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, BookOpen, Archive, Send } from 'lucide-react';
import type { Course } from '@/types';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type CourseCategory = { id: string; name: string };

export function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { confirm, dialog } = useConfirmDialog();

  async function loadCourses() {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    const [{ data: courseData, error: courseError }, { data: categoryData, error: categoryError }] = await Promise.all([
      supabase.from('courses').select('*').order('created_at', { ascending: false }),
      supabase.from('course_categories').select('id,name').order('name'),
    ]);
    if (courseError) toast.error(courseError.message);
    else setCourses((courseData ?? []) as Course[]);
    if (!categoryError) setCategories((categoryData ?? []) as CourseCategory[]);
    setLoading(false);
  }

  useEffect(() => { void loadCourses(); }, []);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get('title') ?? '').trim();
    const description = String(fd.get('description') ?? '').trim();
    const instructor = String(fd.get('instructor') ?? '').trim() || null;
    const duration = Number(fd.get('duration_minutes') ?? 60);
    const categoryId = String(fd.get('category_id') ?? '').trim() || null;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `course-${Date.now()}`;
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) { toast.error('You must be signed in as an admin.'); return; }

    const payload = {
      title,
      slug,
      description,
      short_description: description.slice(0, 160),
      thumbnail_url: String(fd.get('thumbnail_url') ?? '').trim() || null,
      instructor,
      level: String(fd.get('level') ?? 'beginner') as 'beginner' | 'intermediate' | 'advanced',
      duration_minutes: Number.isFinite(duration) && duration >= 0 ? duration : 60,
      is_free: fd.get('paid') !== 'on',
      certificate_available: fd.get('certificate') === 'on',
      status: String(fd.get('status') ?? 'draft') as 'draft' | 'published' | 'archived',
      category_id: categoryId,
      created_by: user.id,
    };

    const { data, error } = await supabase.from('courses').insert(payload).select().single();
    if (error) { toast.error(error.message); return; }
    setCourses(prev => [data as Course, ...prev]);
    setShowForm(false);
    e.currentTarget.reset();
    toast.success('Course created');
  }

  async function changeStatus(course: Course, status: 'draft' | 'published' | 'archived') {
    const { data, error } = await supabase.from('courses').update({ status, updated_at: new Date().toISOString() }).eq('id', course.id).select().single();
    if (error) { toast.error(error.message); return; }
    setCourses(prev => prev.map(item => item.id === course.id ? data as Course : item));
    toast.success(status === 'published' ? 'Course published' : status === 'archived' ? 'Course archived' : 'Course moved to draft');
  }

  function remove(course: Course) {
    confirm({
      title: 'Delete course',
      description: `Delete “${course.title}”? This can fail if the course already has dependent progress or lessons.`,
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: async () => {
        const { error } = await supabase.from('courses').delete().eq('id', course.id);
        if (error) { toast.error(error.message); return; }
        setCourses(prev => prev.filter(item => item.id !== course.id));
        toast.success('Deleted');
      },
    });
  }

  return <div className="space-y-6">{dialog}
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Courses</h1>
        <p className="text-sm text-navy-500">Create, publish and manage real courses in Supabase.</p>
      </div>
      <button className="btn-primary shrink-0" onClick={() => setShowForm(s => !s)}><Plus size={16}/> New course</button>
    </div>

    {showForm && <form onSubmit={onCreate} className="card grid gap-3 p-5 md:grid-cols-2">
      <input name="title" required placeholder="Course title" className="input md:col-span-2" />
      <textarea name="description" required placeholder="Full course description" className="input md:col-span-2" rows={4} />
      <input name="instructor" placeholder="Instructor name" className="input" />
      <input name="thumbnail_url" type="url" placeholder="Thumbnail URL (optional)" className="input" />
      <select name="category_id" className="input">
        <option value="">No category</option>
        {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
      <select name="level" defaultValue="beginner" className="input">
        <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
      </select>
      <input name="duration_minutes" type="number" min="0" defaultValue="60" placeholder="Duration (minutes)" className="input" />
      <select name="status" defaultValue="draft" className="input">
        <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
      </select>
      <div className="flex flex-wrap items-center gap-4 text-sm text-navy-600 md:col-span-2">
        <label><input type="checkbox" name="paid" className="mr-2" /> Paid course</label>
        <label><input type="checkbox" name="certificate" className="mr-2" /> Certificate available</label>
      </div>
      <div className="flex gap-2 md:col-span-2"><button className="btn-primary">Create course</button><button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button></div>
    </form>}

    {loading ? <div className="card p-8 text-center text-sm text-navy-400">Loading courses…</div> : courses.length === 0 ? <div className="card p-8 text-center"><BookOpen className="mx-auto text-navy-300" size={28}/><p className="mt-2 text-sm text-navy-400">No courses yet. Create the first one.</p></div> :
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{courses.map(course => <div key={course.id} className="card p-5">
        <div className="flex items-center justify-between gap-2"><span className="badge bg-navy-100 text-navy-600">{course.level}</span><span className="text-xs font-semibold text-navy-400">{course.status}</span></div>
        <p className="mt-2 font-display text-sm font-bold text-navy-900">{course.title}</p>
        <p className="mt-1 text-xs text-navy-500 line-clamp-2">{course.description}</p>
        <p className="mt-2 text-xs text-navy-400">{course.is_free ? 'Free' : 'Paid'} · {course.duration_minutes ?? 0} min{course.instructor ? ` · ${course.instructor}` : ''}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {course.status !== 'published' && <button onClick={() => void changeStatus(course, 'published')} className="btn-outline text-xs"><Send size={13}/> Publish</button>}
          {course.status === 'published' && <button onClick={() => void changeStatus(course, 'archived')} className="btn-outline text-xs"><Archive size={13}/> Archive</button>}
          {course.status === 'archived' && <button onClick={() => void changeStatus(course, 'draft')} className="btn-outline text-xs">Restore draft</button>}
          <button onClick={() => remove(course)} aria-label={`Delete ${course.title}`} className="rounded-lg bg-navy-50 p-2 text-navy-500 hover:bg-navy-100"><Trash2 size={15}/></button>
        </div>
      </div>)}</div>}
  </div>;
}
