<script setup>
import { onMounted, ref } from 'vue';

import { useAuthStore } from '@/stores/auth';
import { useMahasiswaStore } from '@/stores/mahasiswa';

const auth = useAuthStore();
const mhsStore = useMahasiswaStore();

const npm = ref('');
const nama = ref('');

const message = ref('');
const isError = ref(false);

const isEditMode = ref(false);
const editId = ref(null);

onMounted(async () => {
  await mhsStore.getMahasiswa();
});

const handleSubmit = async () => {
  try {
    const payload = {
      npm: npm.value,
      nama: nama.value
    };

    if (isEditMode.value) {
      await mhsStore.updateMahasiswa(editId.value, payload);

      message.value = 'Data berhasil diperbarui';
    } else {
      await mhsStore.tambahMahasiswa(payload);

      message.value = 'Data berhasil ditambahkan';
    }

    resetForm();
    isError.value = false;
  } catch (err) {
    isError.value = true;
    message.value = err.response?.data?.error || 'Terjadi kesalahan';
  }
};

const editMahasiswa = (mhs) => {
  npm.value = mhs.npm;
  nama.value = mhs.nama;

  editId.value = mhs.id;
  isEditMode.value = true;
};

const handleDelete = async (id) => {
  if (!confirm('Yakin ingin menghapus data?')) return;

  await mhsStore.deleteMahasiswa(id);
};

const resetForm = () => {
  npm.value = '';
  nama.value = '';

  editId.value = null;
  isEditMode.value = false;
};

const handleLogout = () => {
  auth.logout();
};
</script>