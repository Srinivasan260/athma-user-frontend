import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import { useCategoryQuestions } from '@/features/question/hooks/use-category-questions';
import { useCategory } from '@/features/category/hooks/use-category';
import { useCategories } from '@/features/category/hooks/use-categories';
import {
  friendlyStartError,
  useStartAssessment,
} from '@/features/assessment-run/hooks/use-start-assessment';
import { useSubmitAnswer } from '@/features/assessment-run/hooks/use-submit-answer';
import { useFinalizeAssessment } from '@/features/assessment-run/hooks/use-finalize-assessment';
import type { PatientQuestion } from '@/features/question/types';
import type { CategoryDetail, Category } from '@/features/category/types';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import { ROUTES, QUESTION_BLOCK_SIZE } from '@/constants';
import { cn } from '@/lib/utils';

export default function QuizPage() {
  const { categoryId = '' } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const startAssessment = useStartAssessment();
  const finalizeAssessment = useFinalizeAssessment();
  const submitAnswerMutation = useSubmitAnswer(startAssessment.data?.id);
  const questionsQuery = useCategoryQuestions(categoryId);
  const categoryQuery = useCategory(categoryId);
  const categoriesQuery = useCategories();

  // Kick off the assessment exactly once per categoryId.
  const startedForRef = useRef<string | null>(null);
  useEffect(() => {
    if (!categoryId) return;
    if (startedForRef.current === categoryId) return;
    startedForRef.current = categoryId;
    startAssessment.mutate({ categoryId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const assessmentId = startAssessment.data?.id;

  const sortedQuestions = useMemo<PatientQuestion[]>(
    () =>
      questionsQuery.data
        ? [...questionsQuery.data].sort((a, b) => a.displayOrder - b.displayOrder)
        : [],
    [questionsQuery.data],
  );

  // Client-side chunking into fixed-size blocks (see QUESTION_BLOCK_SIZE).
  const blocks = useMemo(() => {
    const out: { start: number; end: number; questions: PatientQuestion[] }[] = [];
    for (let i = 0; i < sortedQuestions.length; i += QUESTION_BLOCK_SIZE) {
      const slice = sortedQuestions.slice(i, i + QUESTION_BLOCK_SIZE);
      out.push({ start: i + 1, end: i + slice.length, questions: slice });
    }
    return out;
  }, [sortedQuestions]);

  const [blockIndex, setBlockIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);

  // Rehydrate previously-saved answers once per assessment, using the answers
  // the backend returns from POST /categories/:id/assessments. Jump the user
  // to the first block that still has unanswered questions.
  const seededForRef = useRef<string | null>(null);
  useEffect(() => {
    if (!assessmentId || !startAssessment.data) return;
    if (seededForRef.current === assessmentId) return;
    if (blocks.length === 0) return;
    seededForRef.current = assessmentId;

    const saved: Record<string, string> = {};
    for (const a of startAssessment.data.answers) {
      saved[a.questionId] = a.selectedOptionId;
    }
    setAnswers(saved);

    const firstIncomplete = blocks.findIndex(
      (b) => b.questions.some((q) => !saved[q.id]),
    );
    setBlockIndex(firstIncomplete === -1 ? blocks.length - 1 : firstIncomplete);
  }, [assessmentId, startAssessment.data, blocks]);

  const currentBlock = blocks[blockIndex];
  const totalQuestions = sortedQuestions.length;
  const answeredTotal = Object.keys(answers).length;
  const remaining = Math.max(0, totalQuestions - answeredTotal);
  const isLastBlock = blocks.length > 0 && blockIndex === blocks.length - 1;

  const blockAnsweredCount = (b: { questions: PatientQuestion[] }) =>
    b.questions.reduce((n, q) => n + (answers[q.id] ? 1 : 0), 0);
  const answeredInCurrentBlock = currentBlock ? blockAnsweredCount(currentBlock) : 0;
  const isCurrentBlockComplete =
    !!currentBlock && answeredInCurrentBlock === currentBlock.questions.length;

  // A block is reachable only if every block before it is fully answered.
  // Going backward to an already-complete earlier block is always allowed.
  const isBlockReachable = (idx: number) =>
    idx === blockIndex ||
    blocks.slice(0, idx).every((b) => blockAnsweredCount(b) === b.questions.length);

  const handleSelect = (question: PatientQuestion, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
    submitAnswerMutation.mutate({ questionId: question.id, selectedOptionId: optionId });
  };

  const handleGoToBlock = (idx: number) => {
    if (!isBlockReachable(idx)) return;
    setBlockIndex(idx);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = async () => {
    if (!isLastBlock) {
      if (!isCurrentBlockComplete) return;
      handleGoToBlock(blockIndex + 1);
      return;
    }
    if (!assessmentId) return;
    try {
      await finalizeAssessment.mutateAsync(assessmentId);
      // Patients don't see their own score — show a success popup, then they
      // tap Continue to return to the categories list. Admins view results.
      setShowSubmittedModal(true);
    } catch {
      // surfaced below
    }
  };

  const handleCloseSubmittedModal = () => {
    setShowSubmittedModal(false);
    navigate(ROUTES.assessments);
  };

  // --- Up-next (next active category by displayOrder) --------------------
  const upNext = useMemo<Category | null>(() => {
    const list = categoriesQuery.data;
    const current = categoryQuery.data;
    if (!list || !current) return null;
    const after = list
      .filter((c) => c.id !== current.id)
      .find((c) => (c as CategoryDetail).displayOrder === undefined
        ? false
        : (c as CategoryDetail).displayOrder > current.displayOrder);
    if (after) return after;
    // Fallback: any category other than current that comes after it in the list order.
    const myIdx = list.findIndex((c) => c.id === current.id);
    return myIdx >= 0 ? list[myIdx + 1] ?? null : null;
  }, [categoriesQuery.data, categoryQuery.data]);

  // --- Loading / error states --------------------------------------------

  if (startAssessment.isPending || (startAssessment.isIdle && !startAssessment.data)) {
    return <LoadingShell label="Starting your assessment…" />;
  }
  if (startAssessment.isError) {
    return (
      <ErrorShell
        title="Couldn't start this assessment"
        message={friendlyStartError(startAssessment.error)}
      />
    );
  }
  if (questionsQuery.isLoading || categoryQuery.isLoading) {
    return <LoadingShell label="Loading questions…" />;
  }
  if (questionsQuery.isError || categoryQuery.isError) {
    return (
      <ErrorShell
        title="Couldn't load assessment"
        message="Please try again in a moment."
      />
    );
  }
  if (!currentBlock) {
    return (
      <ErrorShell
        title="No questions available"
        message="This assessment doesn't have any questions yet."
      />
    );
  }

  const category = categoryQuery.data!;

  // --- Main 3-column layout ----------------------------------------------

  return (
    <div className="space-y-5">
      {/* Top strip: back link + title + type badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={ROUTES.assessments}
          className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 transition-colors hover:text-ink-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-extrabold text-brand-600 sm:text-xl">{category.name}</h1>
          <span className="inline-flex items-center rounded-md border border-ink-200 bg-white px-2 py-0.5 text-xs font-medium text-ink-600">
            Multiple choice
          </span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)_280px] xl:gap-6">
        {/* LEFT: assessment info card */}
        <aside className="order-2 space-y-4 lg:order-1 lg:sticky lg:top-20 lg:self-start">
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">
            Assessment Info
          </div>

          <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-5 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-sm font-extrabold uppercase tracking-wide text-navy-800">
              {category.name}
            </h2>
            {category.description && (
              <p className="mt-2 text-sm text-ink-600">{category.description}</p>
            )}

            <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>Please choose the option that best matches your experience.</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 rounded-lg border border-ink-100 bg-white px-2.5 py-2 text-ink-700">
                <HelpCircle className="h-3.5 w-3.5 text-ink-400" />
                <span className="font-semibold">{totalQuestions} Questions</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-ink-100 bg-white px-2.5 py-2 text-ink-700">
                <Clock className="h-3.5 w-3.5 text-ink-400" />
                <span className="font-semibold">{estimateMinutes(totalQuestions)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-ink-500">
              <span>Overall progress</span>
              <span className="font-semibold text-ink-800">
                {totalQuestions === 0 ? 0 : Math.round((answeredTotal / totalQuestions) * 100)}%
              </span>
            </div>
            <ProgressBar value={answeredTotal} max={Math.max(totalQuestions, 1)} tone="teal" />
            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-ink-500">Answered</span>
              <span className="font-semibold text-ink-800">
                {answeredTotal} / {totalQuestions}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-500">Remaining</span>
              <span className="font-semibold text-amber-600">{remaining}</span>
            </div>
          </div>

          {upNext && (
            <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                Up Next
              </div>
              <div className="mt-1 text-sm font-semibold uppercase text-navy-800">
                {upNext.name}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-xs text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Answers are saved automatically</span>
          </div>

          <p className="text-center text-xs italic text-ink-500">
            Take your time, we&apos;re here with you
          </p>
        </aside>

        {/* CENTER: block of questions */}
        <section className="order-1 space-y-5 lg:order-2">
          {currentBlock.questions.map((q, i) => {
            const globalNumber = currentBlock.start + i;
            const selected = answers[q.id] ?? null;
            return (
              <QuestionCard
                key={q.id}
                number={globalNumber}
                question={q}
                selectedOptionId={selected}
                onSelect={(optionId) => handleSelect(q, optionId)}
              />
            );
          })}

          {submitAnswerMutation.isError && (
            <p className="text-xs text-rose-500">
              We couldn&apos;t save that answer. Pick again or move on — we&apos;ll retry on submit.
            </p>
          )}
          {finalizeAssessment.isError && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Something went wrong finalizing your assessment. Please try again.</span>
            </div>
          )}

          <div className="sticky bottom-4 z-20 rounded-2xl border border-ink-100 bg-white/95 p-3 shadow-lift backdrop-blur sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                leftIcon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => handleGoToBlock(Math.max(0, blockIndex - 1))}
                disabled={blockIndex === 0 || finalizeAssessment.isPending}
              >
                Previous block
              </Button>
              <div className="hidden text-xs font-medium text-ink-500 sm:block">
                Block {blockIndex + 1} of {blocks.length} ·{' '}
                <span className="text-ink-800">
                  {answeredTotal}/{totalQuestions} answered
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={finalizeAssessment.isPending || !isCurrentBlockComplete}
                  isLoading={finalizeAssessment.isPending && isLastBlock}
                  rightIcon={
                    isLastBlock ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />
                  }
                >
                  {isLastBlock ? 'Submit' : 'Next block'}
                </Button>
                {!isCurrentBlockComplete && (
                  <span className="text-[11px] font-medium text-amber-600">
                    Answer all {currentBlock.questions.length} questions to continue
                    {' '}({answeredInCurrentBlock}/{currentBlock.questions.length})
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: blocks nav */}
        <aside className="order-3 space-y-3 lg:sticky lg:top-20 lg:self-start">
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">
            Question Blocks
          </div>
          {blocks.map((b, i) => {
            const answeredInBlock = blockAnsweredCount(b);
            const isActive = i === blockIndex;
            const reachable = isBlockReachable(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleGoToBlock(i)}
                disabled={!reachable}
                aria-disabled={!reachable}
                title={reachable ? undefined : 'Complete the current block to unlock'}
                className={cn(
                  'w-full rounded-xl border bg-white p-3 text-left transition-all',
                  isActive
                    ? 'border-teal-500 ring-2 ring-teal-100'
                    : reachable
                      ? 'border-ink-100 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-card'
                      : 'cursor-not-allowed border-ink-100 opacity-50',
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                      isActive ? 'bg-teal-600 text-white' : 'bg-ink-100 text-ink-700',
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-navy-800">
                      Q {b.start} - {b.end}
                    </div>
                    <div className="text-[11px] text-ink-500">{b.questions.length} questions</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-xs font-medium text-ink-500">
                    {answeredInBlock}/{b.questions.length}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </aside>
      </div>

      {showSubmittedModal && (
        <SubmittedModal
          categoryName={category.name}
          onClose={handleCloseSubmittedModal}
        />
      )}
    </div>
  );
}

function SubmittedModal({
  categoryName,
  onClose,
}: {
  categoryName: string;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submitted-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2
          id="submitted-modal-title"
          className="mt-5 text-2xl font-extrabold tracking-tight text-navy-800"
        >
          Your quiz is successfully submitted
        </h2>
        <p className="mt-3 text-sm text-ink-500">
          Thanks for completing <span className="font-semibold text-ink-700">{categoryName}</span>.
          Your responses have been saved.
        </p>
        <Button className="mt-6 w-full" size="lg" onClick={onClose} autoFocus>
          Continue
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function QuestionCard({
  number,
  question,
  selectedOptionId,
  onSelect,
}: {
  number: number;
  question: PatientQuestion;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
}) {
  const isAnswered = selectedOptionId !== null;
  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 bg-white px-5 py-6 shadow-card transition-all sm:px-8 sm:py-8',
        isAnswered
          ? 'border-teal-400 shadow-lift hover:border-teal-500'
          : 'border-teal-200 hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-lift',
      )}
    >
      <span className="absolute -top-3 left-1/2 inline-flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white shadow">
        {number}
      </span>

      {isAnswered && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Saved
        </span>
      )}

      <div className="mx-auto max-w-2xl space-y-2 pt-2 text-center">
        <h3 className="text-base font-semibold text-navy-800 sm:text-lg">
          {question.questionText}
        </h3>
      </div>

      <fieldset
        className="mx-auto mt-6 flex max-w-2xl flex-col gap-2.5"
        aria-label={`Question ${number}`}
      >
        {question.options.map((opt) => {
          const selected = selectedOptionId === opt.id;
          return (
            <label
              key={opt.id}
              className={cn(
                'group flex cursor-pointer items-center justify-center rounded-full border px-5 py-3 text-center text-sm font-medium transition-all',
                selected
                  ? 'border-teal-600 bg-teal-600 text-white shadow-[0_6px_14px_-6px_rgba(13,148,136,0.55)]'
                  : 'border-teal-200 bg-white text-ink-800 hover:-translate-y-0.5 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800 hover:shadow-sm',
              )}
            >
              <span>{opt.text}</span>
              <input
                type="radio"
                name={question.id}
                value={opt.id}
                checked={selected}
                onChange={() => onSelect(opt.id)}
                className="sr-only"
              />
            </label>
          );
        })}
      </fieldset>
    </div>
  );
}

/** Rough estimate: 20–25 seconds per question → "X-Y mins". */
function estimateMinutes(count: number): string {
  if (count <= 0) return '1 min';
  const low = Math.max(1, Math.round((count * 20) / 60));
  const high = Math.max(low, Math.round((count * 25) / 60));
  return low === high ? `${low} mins` : `${low}-${high} mins`;
}

function LoadingShell({ label }: { label: string }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-2xl border border-ink-100 bg-white p-12 text-center shadow-card">
      <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      <p className="text-sm text-ink-500">{label}</p>
    </div>
  );
}

function ErrorShell({ title, message }: { title: string; message: string }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/50 p-10 text-center">
        <AlertCircle className="h-8 w-8 text-rose-500" />
        <div>
          <div className="font-semibold text-rose-700">{title}</div>
          <div className="mt-1 text-sm text-ink-500">{message}</div>
        </div>
        <Link
          to={ROUTES.assessments}
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          ← Back to assessments
        </Link>
      </div>
    </div>
  );
}
