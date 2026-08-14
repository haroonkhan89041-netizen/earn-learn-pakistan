import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { DEMO_COURSES } from '@/data/demoData';
import { DifficultyBadge } from '@/components/ui/Badge';

export function PublicLearn() {
  return (
    <div className="container-app py-14 md:py-20">
      <h1 className="font-display text-3xl font-extrabold text-navy-900 md:text-4xl">Learn Skills</h1>
      <p className="mt-2 max-w-xl text-navy-500">
        Free, beginner-friendly courses. <Link to="/signup" className="font-semibold text-brand-blue">Create a free account</Link> to start tracking your progress.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_COURSES.map((c) => (
          <div key={c.id} className="card flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green-dark">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-navy-900">{c.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <DifficultyBadge level={c.difficulty} />
                <span className="text-xs text-navy-400">{c.lesson_count} lessons</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
