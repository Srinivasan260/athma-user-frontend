import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

export default function NotFoundPage() {
  return (
    <div className="bg-auth flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md rounded-2xl border border-ink-100 bg-white p-10 text-center shadow-lift">
        <div className="text-6xl font-extrabold text-brand-500">404</div>
        <h1 className="mt-2 text-xl font-bold text-navy-800">Page not found</h1>
        <p className="mt-2 text-sm text-ink-500">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link to={ROUTES.login} className="mt-6 inline-block">
          <Button>Go to login</Button>
        </Link>
      </div>
    </div>
  );
}
