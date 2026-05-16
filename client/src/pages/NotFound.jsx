import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-8xl font-bold text-primary-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>
      <p className="mt-2 text-gray-500">The page you are looking for does not exist.</p>
      <Link to="/dashboard" className="btn-primary mt-8">
        Go to Dashboard
      </Link>
    </div>
  );
}
