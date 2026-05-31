<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

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