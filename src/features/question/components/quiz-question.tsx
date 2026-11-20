import { cn } from '@/lib/utils';
import type { PatientQuestion } from '../types';

interface QuizQuestionProps {
  question: PatientQuestion;
  index: number;
  total: number;
  selectedOptionId: string | null;
  onChange: (optionId: string) => void;
}

export function QuizQuestion({
  question,
  index,
  total,
  selectedOptionId,
  onChange,
}: QuizQuestionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
          Question {index + 1} of {total}
        </span>
        <h2 className="text-xl font-bold text-navy-800 sm:text-2xl">{question.questionText}</h2>
        {question.isRequired && (
          <p className="text-xs text-ink-400">* Required</p>
        )}
      </div>

      <fieldset className="space-y-2" aria-label={`Question ${index + 1}`}>
        {question.options.map((opt) => {
          const selected = selectedOptionId === opt.id;
          return (
            <label
              key={opt.id}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-4 transition-all',
                selected
                  ? 'border-brand-500 ring-2 ring-brand-100'
                  : 'border-ink-200 hover:border-ink-300',
              )}
            >
              <span
                className={cn(
                  'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                  selected ? 'border-brand-500 bg-brand-500' : 'border-ink-300',
                )}
              >
                {selected && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>
              <span className="text-sm font-medium text-ink-800">{opt.text}</span>
              <input
                type="radio"
                name={question.id}
                value={opt.id}
                checked={selected}
                onChange={() => onChange(opt.id)}
                className="sr-only"
              />
            </label>
          );
        })}
      </fieldset>
    </div>
  );
}
