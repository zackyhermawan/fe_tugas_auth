import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import { useAuthStore } from "../stores/auth.js";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
            meta: { requiresAuth: true } // Proteksi route halaman ini
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterPage
        }
    ]
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router