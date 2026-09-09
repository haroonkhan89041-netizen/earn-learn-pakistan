import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DEMO_COURSES } from '@/data/demoData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DifficultyBadge } from '@/components/ui/Badge';

const courseImages = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=85',
];

interface CourseCard { id: string; title: string; description: string | null; level: 'beginner' | 'intermediate' | 'advanced'; lesson_count?: number; }

export function PublicLearn() {
  const [courses, setCourses] = useState<CourseCard[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setCourses(DEMO_COURSES.map((c) => ({ id: c.id, title: c.title, description: null, level: c.difficulty, lesson_count: c.lesson_count })));
      return;
    }

    const loadCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id,title,description,level,course_lessons(count)')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          level: course.level,
          lesson_count: course.course_lessons?.[0]?.count ?? 0,
        }));
        setCourses(mapped);
      }
    };
    void loadCourses();
  }, []);

  return (
    <div className="container-app py-14 md:py-20">
      <div className="mb-8 max-w-2xl"><span className="badge bg-brand-green/10 text-brand-green-dark">Free learning</span><h1 className="mt-3 font-display text-3xl font-extrabold text-navy-900 md:text-4xl">Learn Skills</h1><p className="mt-2 text-navy-500">Free, beginner-friendly courses designed to help you build practical digital skills. <Link to="/signup" className="font-semibold text-brand-blue">Create a free account</Link> to start tracking your progress.</p></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c, i) => <div key={c.id} className="card group overflow-hidden"><img src={courseImages[i % courseImages.length]} alt={`${c.title} course`} className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" /><div className="p-5"><div className="flex items-center justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green-dark"><BookOpen size={18} /></div><DifficultyBadge level={c.level} /></div><p className="mt-4 font-display text-base font-bold text-navy-900">{c.title}</p>{c.description && <p className="mt-2 line-clamp-2 text-sm text-navy-500">{c.description}</p>}<div className="mt-3 flex items-center justify-between text-xs text-navy-400"><span>{c.lesson_count ?? 0} lessons</span><Link to="/signup" className="font-semibold text-brand-blue">Start learning <ArrowRight size={13} className="inline" /></Link></div></div></div>)}
      </div>
      {courses.length === 0 && <div className="card mt-6 p-10 text-center text-sm text-navy-500">No published courses are available yet. Check back soon.</div>}
    </div>
  );
}
