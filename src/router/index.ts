import { createRouter, createWebHistory } from 'vue-router';
import ResultsView from '@/views/ResultsView.vue';
import HomeView from '../views/HomeView.vue';
import ResetPasswordView from '../views/ResetPasswordView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      component: HomeView,
      name: 'home',
      path: '/',
      alias: '/home'
    },
    {
      component: ResetPasswordView,
      name: 'reset-password',
      path: '/reset-password'
    },
    {
      alias: '/jogos',
      component: ResultsView,
      name: 'jogos',
      path: '/resultados'
    },
    // {
    //   component: BetsView,
    //   name: 'apostar',
    //   path: '/apostar'
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   // component: () => import('../views/BetsView.vue'),
    // },
    {
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ExtrasView.vue'),
      name: 'extras',
      path: '/extras'
    },
    {
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RulesView.vue'),
      name: 'regras',
      path: '/regras'
    }
  ]
});

export default router;
