export function AdminAds() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Advertising</h1>
        <p className="mt-1 text-sm text-navy-500">
          Advertising is not connected yet. No fake placements or traffic metrics are shown.
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-navy-50 p-3 text-navy-600">
            <span className="text-lg" aria-hidden="true">◌</span>
          </div>
          <div className="max-w-2xl">
            <h2 className="font-display text-lg font-bold text-navy-900">Advertising backend not configured</h2>
            <p className="mt-2 text-sm leading-6 text-navy-600">
              The production database currently has no advertisements table or ad-network integration.
              This keeps the admin panel truthful and prevents local-only settings from being mistaken for
              live advertising controls.
            </p>
            <div className="mt-5 rounded-xl border border-navy-100 bg-navy-50/60 p-4 text-sm text-navy-600">
              <p className="font-semibold text-navy-800">When advertising is added, it should include:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>A dedicated advertisements schema with role-protected admin access.</li>
                <li>Placement, enable/disable status, creative or network reference, and scheduling.</li>
                <li>Server-side impression/click tracking with appropriate validation.</li>
                <li>Clear reporting so displayed metrics come from real production data.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
