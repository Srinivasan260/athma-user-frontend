import { Link } from 'react-router-dom';
import { ArrowRight, CheckSquare, HelpCircle } from 'lucide-react';
import { buildRoute } from '@/constants';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border-2 border-ink-100 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-lift">
      <header className="flex items-start gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lift">
          <CheckSquare className="h-6 w-6" />
        </span>
      </header>

      <h3 className="mt-5 text-lg font-bold text-navy-800 leading-tight">{category.name}</h3>
      {category.description && (
        <p className="mt-2 text-sm text-ink-500 line-clamp-3">{category.description}</p>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-dashed border-ink-100 pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500">
          <HelpCircle className="h-3.5 w-3.5" />
          {category.questionCount} {category.questionCount === 1 ? 'question' : 'questions'}
        </span>
        <Link
          to={buildRoute.quiz(category.id)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
        >
          Start
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
