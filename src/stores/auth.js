import { defineStore } from 'pinia';
import api from '../services/api';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(username, password) {
      try {
        this.loading = true;

        const res = await api.post('/auth/login', {
          username,
          password
        });

        this.token = res.data.token;

        localStorage.setItem('token', res.data.token);

        router.push('/');
      } finally {
        this.loading = false;
      }
    },

    async register(username, password) {
      try {
        this.loading = true;

        await api.post('/auth/register', {
          username,
          password
        });

        router.push('/login');
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = null;
      localStorage.removeItem('token');
      router.push('/login');
    }
  }
});