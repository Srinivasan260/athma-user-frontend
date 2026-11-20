export type QuestionType = 'single_choice' | 'multi_choice' | 'scale';

export interface PatientOption {
  id: string;
  text: string;
  displayOrder: number;
}

/** Shape returned by GET /api/v1/categories/:categoryId/questions (patient view). */
export interface PatientQuestion {
  id: string;
  questionText: string;
  questionType: QuestionType;
  displayOrder: number;
  isRequired: boolean;
  options: PatientOption[];
}
