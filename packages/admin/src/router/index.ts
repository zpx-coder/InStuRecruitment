import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/applications',
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/applications',
      name: 'Applications',
      component: () => import('../views/ApplicationListView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

// Auth guard — check both localStorage and sessionStorage
router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth) {
    const token =
      localStorage.getItem('token') ||
      sessionStorage.getItem('token');
    if (!token) {
      next({ name: 'Login', query: { redirect: to.fullPath } });
      return;
    }
  }
  // If already logged in and going to /login, redirect to applications
  if (to.name === 'Login') {
    const token =
      localStorage.getItem('token') ||
      sessionStorage.getItem('token');
    if (token) {
      next({ name: 'Applications' });
      return;
    }
  }
  next();
});

export default router;
