import { defineStore } from 'pinia';
import api from '../services/api';
// 1. Impor router secara manual menggunakan jalur relatif (keluar folder stores)
import router from '../router/index.js'; 

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
        const res = await api.post('/auth/login', { username, password });
        
        // Simpan token ke state dan localStorage
        this.token = res.data.token;
        localStorage.setItem('token', res.data.token);

        // 2. Gunakan objek 'router' langsung yang kita impor di atas (BUKAN this.router)
        router.push('/'); 
      } catch (error) {
        console.error("Login gagal:", error.response?.data || error.message);
        throw error; // Lempar eror agar bisa ditangkap di komponen UI LoginPage
      } finally {
        this.loading = false;
      }
    },

    async register(username, password) {
      try {
        this.loading = true;
        await api.post('/auth/register', { username, password });

        // 3. Gunakan objek 'router' langsung
        router.push('/login'); 
      } catch (error) {
        console.error("Register gagal:", error.response?.data || error.message);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = null;
      localStorage.removeItem('token');

      // 4. Gunakan objek 'router' langsung
      router.push('/login'); 
    }
  }
});