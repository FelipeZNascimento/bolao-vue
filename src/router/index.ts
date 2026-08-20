import { createRouter, createWebHistory } from 'vue-router';
import MatchesView from '@/views/MatchesView.vue';
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
      component: MatchesView,
      name: 'jogos',
      path: '/resultados'
    },
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
    },
    {
      component: () => import('../views/RankingView.vue'),
      name: 'ranking',
      path: '/ranking'
    },
    {
      component: () => import('../views/TeamsView.vue'),
      name: 'teams',
      path: '/teams'
    },
    {
      component: () => import('../views/TeamView.vue'),
      name: 'team',
      path: '/teams/:id'
    }
  ]
});

export default router;
