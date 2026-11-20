import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/constants';

const RegisterPage = lazy(() => import('@/pages/auth/register.page'));
const LoginPage = lazy(() => import('@/pages/auth/login.page'));
const AssessmentsListPage = lazy(() => import('@/pages/assessments/list.page'));
const QuizPage = lazy(() => import('@/pages/assessments/quiz.page'));
const ResultPage = lazy(() => import('@/pages/results/result.page'));
const NotFoundPage = lazy(() => import('@/pages/errors/not-found.page'));

const withSuspense = (node: React.ReactNode) => (
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center text-sm text-ink-500">
        Loading…
      </div>
    }
  >
    {node}
  </Suspense>
);

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to={ROUTES.login} replace />;
  return <Outlet />;
}

function GuestOnlyRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to={ROUTES.assessments} replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to={ROUTES.login} replace /> },
  {
    element: <GuestOnlyRoute />,
    children: [
      { path: ROUTES.register, element: withSuspense(<RegisterPage />) },
      { path: ROUTES.login, element: withSuspense(<LoginPage />) },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.assessments, element: withSuspense(<AssessmentsListPage />) },
          { path: ROUTES.quiz, element: withSuspense(<QuizPage />) },
          { path: ROUTES.result, element: withSuspense(<ResultPage />) },
        ],
      },
    ],
  },
  { path: '*', element: withSuspense(<NotFoundPage />) },
]);
