import { createRouter, createWebHistory } from 'vue-router';
import { routes } from 'vue-router/auto-routes';

const rootRedirect = {
  path: '/',
  redirect: '/dashboard/default'
};

const notFoundRoute = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/pages/maintenance/error.vue'),
  meta: { requiresAuth: false }
};

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [rootRedirect, ...routes, notFoundRoute]
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthRoute = to.path.startsWith('/authentication');

  if (!token && !isAuthRoute && to.meta.requiresAuth !== false) {
    // Not logged in and trying to access a protected route
    next('/authentication/login');
  } else if (token && isAuthRoute) {
    // Logged in and trying to access auth pages
    next('/dashboard/default');
  } else {
    next();
  }
});
