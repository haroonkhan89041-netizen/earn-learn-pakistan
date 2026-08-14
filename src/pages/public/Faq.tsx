import { SimplePage } from './SimplePage';

const faqs = [
  { q: 'Is this platform free?', a: 'Yes, creating an account is completely free. Some advanced courses may be marked premium in the future.' },
  { q: 'Do you guarantee income?', a: 'No. Read our Earnings Disclaimer — earnings depend on available opportunities and your own activity.' },
  { q: 'How are opportunities verified?', a: 'Our admin team manually reviews every opportunity before it is published publicly.' },
  { q: 'How long do withdrawals take?', a: 'Withdrawal requests are reviewed manually. Processing time depends on volume and is never automatic.' },
  { q: 'Can I refer friends?', a: 'Yes — every account gets a unique referral code and link. Self-referrals and duplicate accounts are not allowed.' },
];

export function Faq() {
  return (
    <SimplePage title="Frequently asked questions">
      <div className="not-prose space-y-3">
        {faqs.map((f) => (
          <div key={f.q} className="card p-5">
            <p className="font-display text-sm font-bold text-navy-900">{f.q}</p>
            <p className="mt-1 text-sm text-navy-600">{f.a}</p>
          </div>
        ))}
      </div>
    </SimplePage>
  );
}
