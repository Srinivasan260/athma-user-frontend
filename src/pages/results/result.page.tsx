import { Link, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAssessment } from '@/features/assessment-run/hooks/use-assessment';
import type { SubscaleResult } from '@/features/assessment-run/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants';

interface RiskStyle {
  label: string;
  className: string;
  description: string;
}

const UNKNOWN_STYLE: RiskStyle = {
  label: 'Result',
  className: 'from-slate-50 to-white text-slate-700 border-slate-200',
  description: 'Your responses have been scored. See the breakdown below.',
};

const RISK_STYLES: Record<string, RiskStyle> = {
  // Generic / total scoring
  low: {
    label: 'Low risk',
    className: 'from-emerald-50 to-white text-emerald-700 border-emerald-200',
    description:
      'Your responses suggest low concern in this area. Keep up the healthy habits you already have.',
  },
  moderate: {
    label: 'Moderate risk',
    className: 'from-brand-50 to-white text-brand-700 border-brand-200',
    description:
      'Some signals worth discussing with your care team. Nothing alarming on its own, but worth a conversation.',
  },
  high: {
    label: 'High risk',
    className: 'from-rose-50 to-white text-rose-700 border-rose-200',
    description:
      'Your responses suggest higher concern. Please share this with your assigned doctor at your next session.',
  },
  // Depression / autism severity
  minimal: {
    label: 'Minimal',
    className: 'from-emerald-50 to-white text-emerald-700 border-emerald-200',
    description: 'Little or no indication of distress on this screen.',
  },
  none: {
    label: 'No indication',
    className: 'from-emerald-50 to-white text-emerald-700 border-emerald-200',
    description: 'No concerning indicators were detected in your responses.',
  },
  no_autism: {
    label: 'No autism indicators',
    className: 'from-emerald-50 to-white text-emerald-700 border-emerald-200',
    description: 'Your responses do not meet the threshold for autism indicators on this scale.',
  },
  mild: {
    label: 'Mild',
    className: 'from-amber-50 to-white text-amber-700 border-amber-200',
    description: 'Mild signals present. A follow-up conversation can help contextualise these.',
  },
  moderately_severe: {
    label: 'Moderately severe',
    className: 'from-rose-50 to-white text-rose-700 border-rose-200',
    description: 'Moderately severe signals. Please discuss these with your assigned doctor.',
  },
  severe: {
    label: 'Severe',
    className: 'from-rose-100 to-white text-rose-800 border-rose-300',
    description: 'Severe signals detected. Please share this with your doctor as soon as possible.',
  },
  // SCARED
  normal: {
    label: 'Within normal range',
    className: 'from-emerald-50 to-white text-emerald-700 border-emerald-200',
    description: 'Your responses fall within the expected range on this subscale.',
  },
  flagged: {
    label: 'Flagged for follow-up',
    className: 'from-rose-50 to-white text-rose-700 border-rose-200',
    description: 'This subscale was flagged above the cutoff. Worth discussing with your doctor.',
  },
  // Personality / BFI / BEIS
  average: {
    label: 'Average',
    className: 'from-brand-50 to-white text-brand-700 border-brand-200',
    description: 'Your score sits in the typical range for this trait.',
  },
  very_low: {
    label: 'Very low',
    className: 'from-amber-50 to-white text-amber-700 border-amber-200',
    description: 'Very low on this trait relative to typical ranges.',
  },
  very_high: {
    label: 'Very high',
    className: 'from-amber-50 to-white text-amber-700 border-amber-200',
    description: 'Very high on this trait relative to typical ranges.',
  },
};

function resolveRiskStyle(level: string | null | undefined): RiskStyle {
  if (!level) return UNKNOWN_STYLE;
  const direct = RISK_STYLES[level];
  if (direct) return direct;
  // Fallback: fuzzy match on substring
  const l = level.toLowerCase();
  if (/severe|high|flag|danger/.test(l)) return RISK_STYLES.high!;
  if (/mild|moderate|average/.test(l)) return RISK_STYLES.moderate!;
  if (/low|none|normal|minimal|no_/.test(l)) return RISK_STYLES.low!;
  return { ...UNKNOWN_STYLE, label: humanize(level) };
}

function humanize(s: string): string {
  return s.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ResultPage() {
  const { assessmentId = '' } = useParams<{ assessmentId: string }>();
  const { data: assessment, isLoading, isError } = useAssessment(assessmentId);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 rounded-2xl border border-ink-100 bg-white p-12 text-center shadow-card">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        <p className="text-sm text-ink-500">Loading your results…</p>
      </div>
    );
  }

  if (isError || !assessment) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/50 p-10 text-center">
          <AlertCircle className="h-8 w-8 text-rose-500" />
          <div>
            <div className="font-semibold text-rose-700">Couldn&apos;t load your results</div>
            <div className="mt-1 text-sm text-ink-500">Please try again in a moment.</div>
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

  const hasOverall = !!assessment.overallRiskLevel;
  const overallStyle = resolveRiskStyle(assessment.overallRiskLevel);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to={ROUTES.assessments}
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to assessments
      </Link>

      <div className="rounded-2xl border border-ink-100 bg-white p-8 shadow-card">
        <div className="flex items-center gap-2 text-sm text-ink-500">
          <Sparkles className="h-4 w-4 text-brand-500" />
          Result for
        </div>
        <h1 className="mt-1 text-2xl font-extrabold text-navy-800 sm:text-3xl">
          {assessment.category.name}
        </h1>

        {hasOverall ? (
          <div
            className={cn(
              'mt-6 rounded-2xl border bg-gradient-to-br p-5',
              overallStyle.className,
            )}
          >
            <div className="text-xs font-bold uppercase tracking-wider">Overall</div>
            <div className="mt-1 text-2xl font-extrabold">{overallStyle.label}</div>
            <p className="mt-2 text-sm text-ink-700">{overallStyle.description}</p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-ink-100 bg-ink-50/60 p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-ink-500">
              Subscale breakdown below
            </div>
            <p className="mt-2 text-sm text-ink-700">
              This assessment produces one result per subscale rather than a single overall score.
              Review each row to see where attention may be needed.
            </p>
          </div>
        )}

        {assessment.results.length > 0 && (
          <section className="mt-8 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500">
              {assessment.results.length === 1 ? 'Score breakdown' : 'Subscale breakdown'}
            </h2>
            <div className="space-y-2">
              {assessment.results.map((r, i) => (
                <SubscaleRow key={`${r.subscale ?? 'overall'}-${i}`} result={r} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 flex items-start gap-2 rounded-xl bg-ink-50 p-4 text-xs text-ink-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <span>
            This screening is not a clinical diagnosis. A copy is shared with your assigned doctor
            for discussion in your next session.
          </span>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link to={ROUTES.assessments}>
            <Button variant="outline" fullWidth>
              Take another assessment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function SubscaleRow({ result }: { result: SubscaleResult }) {
  const style = resolveRiskStyle(result.riskLevel);
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-ink-100 bg-white p-4">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-ink-800">
          {result.subscale ? humanize(result.subscale) : 'Overall score'}
        </div>
        <div className="text-xs text-ink-500">Total: {result.totalScore}</div>
      </div>
      <span
        className={cn(
          'shrink-0 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider',
          style.className,
        )}
      >
        {style.label}
      </span>
    </div>
  );
}
