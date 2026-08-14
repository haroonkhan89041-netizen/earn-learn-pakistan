import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-6xl font-extrabold text-navy-200">404</p>
      <h1 className="mt-3 font-display text-xl font-bold text-navy-900">Page not found</h1>
      <p className="mt-1 text-navy-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}
