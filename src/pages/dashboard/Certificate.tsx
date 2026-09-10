import { useEffect, useState } from 'react';
import { Award, Printer, ShieldCheck } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { CourseCertificate } from '@/types';

export function Certificate() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<CourseCertificate | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id || !isSupabaseConfigured) { setLoading(false); return; }
    (async () => {
      const { data: cert } = await supabase.from('course_certificates').select('*').eq('id', id).eq('user_id', user.id).maybeSingle();
      if (cert) {
        setCertificate(cert as CourseCertificate);
        const { data: course } = await supabase.from('courses').select('title').eq('id', cert.course_id).maybeSingle();
        setCourseTitle(course?.title ?? 'Earn & Learn Pakistan Course');
      }
      setLoading(false);
    })();
  }, [id, user]);

  if (loading) return <p className="text-sm text-navy-500">Loading certificate…</p>;
  if (!certificate) return <div className="card p-8 text-center"><p className="font-semibold text-navy-900">Certificate not found</p><button className="btn-primary mt-4" onClick={() => navigate('/dashboard/learn')}>Back to courses</button></div>;

  return <div className="space-y-5">
    <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-extrabold text-navy-900">Certificate</h1><p className="text-sm text-navy-500">Your verified course completion certificate.</p></div><button className="btn-primary" onClick={() => window.print()}><Printer size={16}/> Print</button></div>
    <div className="mx-auto max-w-4xl rounded-3xl border-8 border-navy-900 bg-white p-3 shadow-xl print:shadow-none">
      <div className="border border-navy-200 p-10 text-center md:p-16">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10 text-brand-green"><Award size={34}/></div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.35em] text-navy-400">Earn & Learn Pakistan</p>
        <h2 className="mt-5 font-display text-4xl font-black text-navy-900">Certificate of Completion</h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-navy-500">This certificate confirms that</p>
        <p className="mt-3 text-2xl font-bold text-navy-900">{user?.email || 'Learner'}</p>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-navy-500">has successfully completed the course</p>
        <p className="mt-3 font-display text-2xl font-extrabold text-brand-blue">{courseTitle}</p>
        <div className="mx-auto mt-10 h-px max-w-md bg-navy-200" />
        <div className="mt-8 flex flex-col justify-center gap-5 text-xs text-navy-500 md:flex-row md:gap-14"><span>Issued: {new Date(certificate.issued_at).toLocaleDateString()}</span><span>Certificate ID: {certificate.certificate_number}</span></div>
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold text-brand-green"><ShieldCheck size={16}/> Verified by Earn & Learn Pakistan</div>
      </div>
    </div>
  </div>;
}
