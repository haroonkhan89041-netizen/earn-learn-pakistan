export function CardSkeleton() {
  return (
    <div className="card p-5">
      <div className="skeleton mb-3 h-4 w-2/3" />
      <div className="skeleton mb-2 h-3 w-full" />
      <div className="skeleton mb-4 h-3 w-5/6" />
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16" />
        <div className="skeleton h-6 w-16" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="card p-5">
      <div className="skeleton mb-2 h-3 w-1/2" />
      <div className="skeleton h-7 w-1/3" />
    </div>
  );
}
