import { createRouter, createWebHashHistory } from "vue-router";
import SignUpView from "../views/SignUpView.vue";

const routes = [
 
  {
    path: '/',
    name: 'sign-up',
    component: () => import(/* webpackChunkName: "sign-up" */ '../views/SignUpView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/DashboardView.vue'),meta: { requiresAuth: true }
  },
  {
    path: '/category',
    name: 'category',
    component: () => import(/* webpackChunkName: "category" */ '../views/CategoryView.vue'),meta: { requiresAuth: true }
  },
  {
    path: '/cars',
    name: 'cars',
    component: () => import(/* webpackChunkName: "cars" */ '../views/CarsView.vue'),meta: { requiresAuth: true }
  },
];



const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('userToken');

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // This route requires auth, check if logged in. If not, redirect to login page.
    next({ path: '/login' });
  } else {
    next(); // always call next()!
  }
});
export default router;
