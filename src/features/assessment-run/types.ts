export type AssessmentStatus = 'in_progress' | 'completed' | 'abandoned';
/**
 * Backend risk levels vary per quiz: low/moderate/high (total quizzes),
 * no_autism/mild/moderate/severe (ISAA), normal/flagged (SCARED),
 * low/average/high (personality), etc. Keep this a string so new quizzes
 * don't require a type change here — the UI resolves display styling via
 * a lookup with a safe fallback.
 */
export type RiskLevel = string;

export interface AssessmentCategoryRef {
  id: string;
  name: string;
  slug: string;
}

/** POST /categories/:categoryId/assessments payload */
export interface StartAssessmentPayload {
  categoryId: string;
}

/** A minimal (questionId, selectedOptionId) pair used to rehydrate the quiz UI. */
export interface SavedAnswerSeed {
  questionId: string;
  selectedOptionId: string;
}

/** POST /categories/:categoryId/assessments response */
export interface StartAssessmentResult {
  id: string;
  status: AssessmentStatus;
  startedAt: string;
  category: AssessmentCategoryRef;
  resumed: boolean;
  answers: SavedAnswerSeed[];
}

/** POST /assessments/:id/answers payload */
export interface SubmitAnswerPayload {
  questionId: string;
  selectedOptionId: string;
}

/** POST /assessments/:id/answers response */
export interface AnswerResult {
  id: string;
  questionId: string;
  selectedOptionId: string;
  scoreSnapshot: number;
  answeredAt: string;
}

export interface SubscaleResult {
  subscale: string | null;
  totalScore: number;
  riskLevel: RiskLevel;
}

/** POST /assessments/:id/submit response */
export interface FinalizeAssessmentResult {
  id: string;
  status: AssessmentStatus;
  startedAt: string;
  completedAt: string | null;
  overallRiskLevel: RiskLevel | null;
  category: AssessmentCategoryRef;
  scoringType: string;
  results: SubscaleResult[];
  answersCount: number;
}

export interface AssessmentAnswer {
  questionId: string;
  selectedOptionId: string;
  scoreSnapshot: number;
  answeredAt: string;
}

/** GET /assessments/:id response */
export interface AssessmentDetail {
  id: string;
  status: AssessmentStatus;
  startedAt: string;
  completedAt: string | null;
  overallRiskLevel: RiskLevel | null;
  category: AssessmentCategoryRef;
  answers: AssessmentAnswer[];
  results: SubscaleResult[];
}
