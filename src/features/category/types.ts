/**
 * Shape returned by `GET /api/v1/categories` (per backend convention).
 * In the user-facing UI this is what the patient picks to "take a quiz" —
 * the Athma reference calls these "assessments" but the backend models them
 * as categories.
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  questionCount: number;
}

/**
 * Shape returned by `GET /api/v1/categories/:id` (patient view).
 * Includes a couple of extra fields the assessment-run sidebar uses.
 */
export interface CategoryDetail extends Category {
  scoringType: string;
  displayOrder: number;
}
