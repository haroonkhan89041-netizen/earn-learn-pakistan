import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-navy-100 bg-navy-950 text-navy-200">
      <div className="container-app grid grid-cols-2 gap-8 py-14 md:grid-cols-4">
        <div className="col-span-2">
          <p className="font-display text-lg font-extrabold text-white">Earn &amp; Learn Pakistan</p>
          <p className="mt-2 max-w-xs text-sm text-navy-400">
            Learn skills, complete verified tasks, and discover legitimate online earning
            opportunities. Earnings depend on available opportunities and your activity —
            we never guarantee income.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Platform</p>
          <ul className="space-y-2 text-sm text-navy-400">
            <li><Link to="/opportunities" className="hover:text-white">Opportunities</Link></li>
            <li><Link to="/learn" className="hover:text-white">Learn Skills</Link></li>
            <li><Link to="/leaderboard" className="hover:text-white">Leaderboard</Link></li>
            <li><Link to="/support" className="hover:text-white">Support</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Legal</p>
          <ul className="space-y-2 text-sm text-navy-400">
            <li><Link to="/legal/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/legal/terms" className="hover:text-white">Terms &amp; Conditions</Link></li>
            <li><Link to="/legal/earnings-disclaimer" className="hover:text-white">Earnings Disclaimer</Link></li>
            <li><Link to="/legal/community-guidelines" className="hover:text-white">Community Guidelines</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-800 py-5">
        <p className="container-app text-xs text-navy-500">
          © {new Date().getFullYear()} Earn &amp; Learn Pakistan. Not a guarantee of income. PKR values are estimates only.
        </p>
      </div>
    </footer>
  );
}
