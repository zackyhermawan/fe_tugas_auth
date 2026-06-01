<script setup>
import { onMounted, ref } from 'vue';

import { useAuthStore } from '../stores/auth';
import { useMahasiswaStore } from '../stores/mahasiswa';

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

<template>
  <div class="w-full max-w-5xl mx-auto p-6 space-y-6">
    
    <div class="flex flex-col md:flex-row justify-between items-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div class="text-center md:text-left mb-4 md:mb-0">
        <h1 class="text-2xl font-bold text-gray-800">Selamat Datang!</h1>
      </div>
      <button @click="handleLogout" class="px-5 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 shadow-md transition duration-200">
        Keluar
      </button>
    </div>

    <div class="p-6 bg-slate-900 text-slate-100 rounded-xl shadow-md space-y-3">
      <div class="flex justify-between items-center border-b border-slate-700 pb-2">
        <h2 class="text-md font-semibold tracking-wide text-amber-400 uppercase">🛡️ JSON Web Token (JWT)</h2>
        <span class="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded font-mono">Authenticated</span>
      </div>
      <div class="p-3 bg-slate-950 rounded border border-slate-800 text-xs font-mono break-all max-h-24 overflow-y-auto text-emerald-400 select-all">
        {{ auth.token }}
      </div>
    </div>

    <div v-if="message" :class="`p-4 text-sm rounded-xl font-medium shadow-sm ${isError ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`">
      {{ message }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div class="p-6 bg-white rounded-xl shadow-md border border-gray-100 h-fit">
        <h2 class="text-lg font-bold text-gray-800 mb-4">
          {{ isEditMode ? '✏️ Edit Data Mahasiswa' : '📝 Tambah Mahasiswa' }}
        </h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">NPM</label>
            <input v-model="npm" type="text" placeholder="Masukkan NPM" required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition" />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input v-model="nama" type="text" placeholder="Masukkan nama" required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition" />
          </div>
          <div class="flex flex-col gap-2 pt-2">
            <button type="submit" :class="`w-full py-2.5 px-4 text-white font-medium text-sm rounded-lg shadow transition ${isEditMode ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`">
              {{ isEditMode ? 'Simpan Perubahan' : 'Simpan' }}
            </button>
            <button v-if="isEditMode" type="button" @click="resetForm" class="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium text-sm rounded-lg transition">
              Batal / Cancel
            </button>
          </div>
        </form>
      </div>

      <div class="lg:col-span-2 p-6 bg-white rounded-xl shadow-md border border-gray-100">
        <h2 class="text-lg font-bold text-gray-800 mb-4">📊 Data Mahasiswa</h2>
        
        <div v-if="mhsStore.loading" class="text-center py-12 text-gray-400 text-sm">
          Sedang memuat data dari database...
        </div>

        <div v-else-if="mhsStore.daftarMahasiswa.length === 0" class="text-center py-12 text-gray-400 text-sm">
          Belum ada data mahasiswa di database MySQL.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                <th class="p-3">NPM</th>
                <th class="p-3">Nama</th>
                <th class="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mhs in mhsStore.daftarMahasiswa" :key="mhs.id" class="border-b border-gray-100 hover:bg-gray-50/70 transition">
                <td class="p-3 font-mono text-gray-700 font-medium">{{ mhs.npm }}</td>
                <td class="p-3 text-gray-800">{{ mhs.nama }}</td>
                <td class="p-3 text-center">
                    <button @click="editMahasiswa(mhs)" class="text-xs text-amber-600 hover:text-amber-800 font-semibold mr-3 hover:underline">
                        Edit
                    </button>
                    <button @click="handleDelete(mhs.id)" class="text-xs text-red-500 hover:text-red-700 font-semibold hover:underline">
                        Hapus
                    </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>