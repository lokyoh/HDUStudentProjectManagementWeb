import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'regiserr',
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: '/app',
      name: 'app',
      component: () => import("../views/AppView.vue"),
    },
    {
      path: '/project/:id',
      name: 'project',
      component: () => import('../views/ProjectView.vue'),
    },
    {
      path: '/task/:id',
      name: 'task',
      component: () => import('../views/TaskView.vue'),
    },
    {
      path: '/class/:id',
      name: 'class',
      component: () => import('../views/ClassView.vue'),
    },
    {
      path: '/announcement/:id',
      name: 'announcement',
      component: () => import('../views/AnnoView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/Notfount.vue'),
    },
  ],
})

export default router
