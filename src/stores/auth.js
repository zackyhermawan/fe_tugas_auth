import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('access_token'));
  const loading = ref(false);
  const errorMsg = ref(null);

  const isAuthenticated = computed(() => !!token.value);

  // Mengambil daftar user terdaftar dari localStorage (jika belum ada, default kosong)
  const getRegisteredUsers = () => {
    const users = localStorage.getItem('registered_users');
    return users ? JSON.parse(users) : [];
  };

  // Fungsi membuat JWT Tiruan (Base64)
  function generateMockJWT(username) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ 
      username: username, 
      role: "user", 
      exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }));
    const signature = "mock_signature_key_123";
    return `${header}.${payload}.${signature}`;
  }

  // ACTION: Register Akun Baru ke LocalStorage
  async function register(username, password) {
    loading.value = true;
    errorMsg.value = null;
    await new Promise((resolve) => setTimeout(resolve, 500)); // Variasi loading estetik

    try {
      const users = getRegisteredUsers();

      // Cek apakah username sudah pernah terdaftar
      const isExist = users.some(u => u.username.toLowerCase() === username.toLowerCase());
      if (isExist || username.toLowerCase() === 'admin') {
        throw new Error('Username sudah digunakan! Silakan cari nama lain.');
      }

      // Tambah user baru ke dalam array
      users.push({ username, password });
      localStorage.setItem('registered_users', JSON.stringify(users));
      return true;
    } catch (err) {
      errorMsg.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  // ACTION: Login (Mencocokkan data akun default atau akun hasil register)
  async function login(username, password) {
    loading.value = true;
    errorMsg.value = null;
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // 1. Cek Akun Master Default
      if (username === 'admin' && password === 'admin123') {
        const mockToken = generateMockJWT(username);
        token.value = mockToken;
        localStorage.setItem('access_token', mockToken);
        return true;
      }

      // 2. Cek Akun dari Hasil Register
      const users = getRegisteredUsers();
      const userValid = users.find(u => u.username === username && u.password === password);

      if (userValid) {
        const mockToken = generateMockJWT(username);
        token.value = mockToken;
        localStorage.setItem('access_token', mockToken);
        return true;
      } else {
        throw new Error('Username atau password salah!');
      }
    } catch (err) {
      errorMsg.value = err.message || 'Terjadi kesalahan login';
      return false;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    token.value = null;
    localStorage.removeItem('access_token');
  }

  return {
    token,
    loading,
    errorMsg,
    isAuthenticated,
    login,
    register,
    logout,
  };
});