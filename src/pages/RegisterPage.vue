<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const username = ref('');
const password = ref('');

const isLoading = ref(false);

const successMessage = ref('');
const errorMessage = ref('');

const handleRegister = async () => {
  try {
    isLoading.value = true;

    await auth.register(
      username.value,
      password.value
    );

    successMessage.value =
      'Akun berhasil dibuat';
  } catch (err) {
    errorMessage.value =
      err.response?.data?.error ||
      'Registrasi gagal';
  } finally {
    isLoading.value = false;
  }
};
</script>