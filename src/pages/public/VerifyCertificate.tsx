import { useEffect, useState } from 'react';
import { Award, CheckCircle2, Search, ShieldCheck, XCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export function VerifyCertificate() {
  const [number, setNumber] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ certificate_number: string; issued_at: string; course_title: string; learner_name: string } | null>(null);

  async function verify(value = number) {
    const certificateNumber = value.trim();
    if (!certificateNumber || !isSupabaseConfigured) return;
    setLoading(true);
    setSearched(true);
    setResult(null);
    const { data, error } = await supabase.rpc('verify_course_certificate', { p_certificate_number: certificateNumber });
    if (!error && data) setResult(Array.isArray(data) ? data[0] ?? null : data);
    setLoading(false);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('certificate');
    if (value) { setNumber(value); void verify(value); }
  }, []);

  return <div className="min-h-[70vh] py-10">
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green"><ShieldCheck size={28}/></div>
        <h1 className="mt-5 font-display text-3xl font-black text-navy-900">Verify a certificate</h1>
        <p className="mt-2 text-sm text-navy-500">Enter an Earn & Learn Pakistan certificate number to verify course completion.</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); void verify(); }} className="card mx-auto mt-8 flex max-w-xl gap-2 p-2">
        <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. ELP-2026-000123" className="min-w-0 flex-1 rounded-xl border-0 bg-transparent px-4 py-3 text-sm outline-none focus:ring-0" aria-label="Certificate number" />
        <button className="btn-primary shrink-0" disabled={loading || !number.trim()}><Search size={16}/>{loading ? 'Checking…' : 'Verify'}</button>
      </form>
      {searched && !loading && <div className="mt-6">
        {result ? <div className="card overflow-hidden border border-brand-green/20"><div className="bg-brand-green/5 p-6"><div className="flex items-center gap-3"><CheckCircle2 className="text-brand-green" size={26}/><div><p className="font-display font-bold text-navy-900">Certificate verified</p><p className="text-xs text-navy-500">This certificate is valid in Earn & Learn Pakistan records.</p></div></div></div><div className="grid gap-5 p-6 sm:grid-cols-2"><div><p className="text-xs uppercase tracking-wide text-navy-400">Learner</p><p className="mt-1 font-semibold text-navy-900">{result.learner_name}</p></div><div><p className="text-xs uppercase tracking-wide text-navy-400">Course</p><p className="mt-1 font-semibold text-navy-900">{result.course_title}</p></div><div><p className="text-xs uppercase tracking-wide text-navy-400">Issued</p><p className="mt-1 text-sm text-navy-700">{new Date(result.issued_at).toLocaleDateString()}</p></div><div><p className="text-xs uppercase tracking-wide text-navy-400">Certificate number</p><p className="mt-1 font-mono text-sm text-navy-700">{result.certificate_number}</p></div></div><div className="flex items-center gap-2 border-t border-navy-100 px-6 py-4 text-xs font-semibold text-brand-green"><Award size={15}/> Official verification result</div></div> : <div className="card p-8 text-center"><XCircle className="mx-auto text-red-500" size={30}/><p className="mt-3 font-semibold text-navy-900">Certificate not found</p><p className="mt-1 text-sm text-navy-500">Check the certificate number and try again.</p></div>}
      </div>}
    </div>
  </div>;
}
