<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { ref } from 'vue';


const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await authStore.register(
        email.value,
        password.value
    )
    successMessage.value = 'Registrasi berhasil! Anda dapat masuk sekarang.';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-gray-100">
        <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
          <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Buat Akun</h2>
          
          <div v-if="errorMessage" class="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg animate-pulse">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
            {{ successMessage }}
          </div>
      
          <form @submit.prevent="handleRegister" class="space-y-5">
      
            <div>
              <label class="block mb-1.5 text-sm font-medium text-gray-700">Email</label>
              <input v-model="email" type="email" placeholder="nama@email.com" required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            </div>
      
            <div>
              <label class="block mb-1.5 text-sm font-medium text-gray-700">Password</label>
              <input v-model="password" type="password" placeholder="••••••••" required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            </div>
      
            <button type="submit" :disabled="isLoading"
              class="w-full py-3 px-4 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition disabled:bg-blue-400">
              {{ isLoading ? 'Memproses...' : 'Daftar Sekarang' }}
            </button>
          </form>
      
          <p class="mt-6 text-sm text-center text-gray-600">
            Sudah punya akun? 
            <RouterLink to="/login" class="text-blue-600 font-semibold hover:underline">Login di sini</RouterLink>
          </p>
        </div>
    </div>
</template>