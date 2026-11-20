export const AUTH_TOKEN_KEY = 'athma_user_token';

export const QUERY_KEYS = {
  categories: ['categories'] as const,
  category: (categoryId: string) => ['categories', categoryId] as const,
  categoryQuestions: (categoryId: string) => ['categories', categoryId, 'questions'] as const,
  assessment: (assessmentId: string) => ['assessments', assessmentId] as const,
} as const;

/** Patient view groups questions into fixed-size blocks client-side. */
export const QUESTION_BLOCK_SIZE = 20;

export const ROUTES = {
  register: '/register',
  login: '/login',
  assessments: '/questions',
  quiz: '/questions/:categoryId',
  result: '/results/:assessmentId',
} as const;

export const buildRoute = {
  quiz: (categoryId: string) => `/questions/${categoryId}`,
  result: (assessmentId: string) => `/results/${assessmentId}`,
};

export const BRAND = {
  hospitalName: 'Athma Mind Care Hospital',
  tagline: 'Beacon of Hope',
  since: 'Since 1995',
  productName: 'Patient Portal',
} as const;

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;

export const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'other', label: 'Other' },
] as const;
