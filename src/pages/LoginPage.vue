<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();

const username = ref('');
const password = ref('');

const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  try {
    isLoading.value = true;

    await auth.login(
      username.value,
      password.value
    );
  } catch (err) {
    errorMessage.value =
      err.response?.data?.error ||
      'Login gagal';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-2">Selamat Datang</h2>
      <p class="text-center text-gray-500 mb-6 text-sm">Silakan masuk ke akun Anda</p>
      
      <div v-if="errorMessage" class="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        {{ errorMessage }}
      </div>
  
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block mb-1.5 text-sm font-medium text-gray-700">Username</label>
          <input v-model="username" type="text" placeholder="Masukkan username atau email" required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
        </div>
  
        <div>
          <label class="block mb-1.5 text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" placeholder="••••••••" required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
        </div>
  
        <button type="submit" :disabled="isLoading"
          class="w-full py-3 px-4 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition disabled:bg-blue-400">
          {{ isLoading ? 'Membuka Sesi...' : 'Masuk' }}
        </button>
      </form>
  
      <p class="mt-6 text-sm text-center text-gray-600">
        Belum punya akun? 
        <RouterLink to="/register" class="text-blue-600 font-semibold hover:underline">Daftar di sini</RouterLink>
      </p>
    </div>
  </div>
</template>