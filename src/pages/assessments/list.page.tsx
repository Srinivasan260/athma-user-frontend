import { AlertCircle } from 'lucide-react';
import { isAxiosError } from 'axios';
import { useCategories } from '@/features/category/hooks/use-categories';
import { CategoryCard } from '@/features/category/components/category-card';
import { Button } from '@/components/ui/button';

function friendlyError(err: unknown): string {
  if (isAxiosError(err)) {
    if (!err.response) return "We couldn't reach the server. Check your connection and try again.";
    if (err.response.status === 401) return 'Your session has expired. Please log in again.';
    if (err.response.status >= 500) return 'The server ran into a problem. Please try again in a moment.';
  }
  return "We couldn't load assessments right now. Please try again.";
}

export default function AssessmentsListPage() {
  const { data: categories = [], isLoading, isError, error, refetch, isRefetching } =
    useCategories();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-600">
          Assessments
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-navy-800 sm:text-5xl">
          Take a <span className="text-brand-500">Quiz</span>
        </h1>
        <p className="text-ink-500">Choose an assessment below to begin. It only takes a few minutes.</p>
      </header>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl border border-ink-100 bg-white"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/50 p-10 text-center">
          <AlertCircle className="h-8 w-8 text-rose-500" />
          <div>
            <div className="font-semibold text-rose-700">Couldn&apos;t load assessments</div>
            <div className="mt-1 text-sm text-ink-500">{friendlyError(error)}</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} isLoading={isRefetching}>
            Try again
          </Button>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-12 text-center text-ink-500">
          No assessments available right now.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      )}
    </div>
  );
}
