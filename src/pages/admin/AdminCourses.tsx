import { useEffect, useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import type { Course } from '@/types';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { confirm, dialog } = useConfirmDialog();

  useEffect(() => { if (!isSupabaseConfigured) return; (async () => {
    const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (error) toast.error(error.message); else setCourses((data ?? []) as Course[]);
  })(); }, []);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const fd = new FormData(e.currentTarget);
    const title = String(fd.get('title') ?? '').trim(); const description = String(fd.get('description') ?? '').trim();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `course-${Date.now()}`;
    const user = (await supabase.auth.getUser()).data.user;
    const payload = { title, slug, description, short_description: description.slice(0, 160), thumbnail_url: null, instructor: null, level: 'beginner' as const, duration_minutes: 60, is_free: fd.get('premium') !== 'on', certificate_available: false, status: 'draft' as const, created_by: user?.id ?? null };
    if (isSupabaseConfigured) { const { data, error } = await supabase.from('courses').insert(payload).select().single(); if (error) { toast.error(error.message); return; } setCourses(prev => [data as Course, ...prev]); }
    setShowForm(false); toast.success('Course created');
  }

  function remove(c: Course) { confirm({ title:'Delete course', description:`Delete "${c.title}"?`, confirmLabel:'Delete', danger:true, onConfirm: async () => { if (isSupabaseConfigured) { const { error } = await supabase.from('courses').delete().eq('id', c.id); if (error) { toast.error(error.message); return; } } setCourses(prev => prev.filter(x => x.id !== c.id)); toast.success('Deleted'); } }); }

  return <div className="space-y-6">{dialog}
    <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-extrabold text-navy-900">Courses</h1><p className="text-sm text-navy-500">Create and manage real courses in Supabase.</p></div><button className="btn-primary" onClick={() => setShowForm(s=>!s)}><Plus size={16}/> New course</button></div>
    {showForm && <form onSubmit={onCreate} className="card grid gap-3 p-5"><input name="title" required placeholder="Course title" className="input"/><textarea name="description" required placeholder="Description" className="input" rows={3}/><label className="text-sm"><input type="checkbox" name="premium"/> Paid/premium course</label><div className="flex gap-2"><button className="btn-primary">Create course</button><button type="button" onClick={()=>setShowForm(false)} className="btn-outline">Cancel</button></div></form>}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{courses.map(c=><div key={c.id} className="card p-5"><span className="badge bg-navy-100 text-navy-600">{c.level}</span><p className="mt-2 font-display text-sm font-bold text-navy-900">{c.title}</p><p className="mt-1 text-xs text-navy-500 line-clamp-2">{c.description}</p><p className="mt-2 text-xs text-navy-400">{c.status} · {c.duration_minutes} min</p><button onClick={()=>remove(c)} className="mt-4 rounded-lg bg-navy-50 p-1.5 text-navy-500"><Trash2 size={15}/></button></div>)}</div>
    {courses.length===0 && <p className="text-sm text-navy-400">No courses yet. Create the first one.</p>}
  </div>;
}
