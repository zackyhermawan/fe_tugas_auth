import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMahasiswaStore = defineStore('mahasiswa', () => {
  // Mengambil data awal dari localStorage, jika kosong kasih array bawaan (dummy data awal)
  const initialData = localStorage.getItem('data_mahasiswa');
  const daftarMahasiswa = ref(initialData ? JSON.parse(initialData) : [
  ]);

  // Fungsi Helper untuk mensinkronisasi data ref ke LocalStorage setiap ada perubahan
  function saveToLocalStorage() {
    localStorage.setItem('data_mahasiswa', JSON.stringify(daftarMahasiswa.value));
  }

  // 1. CREATE (Tambah Mahasiswa)
  function tambahMahasiswa(mahasiswa) {
    const baru = {
      id: Date.now(), // Generate ID unik pake timestamp
      ...mahasiswa
    };
    daftarMahasiswa.value.push(baru);
    saveToLocalStorage();
  }

  // 2. UPDATE (Edit Mahasiswa)
  function ubahMahasiswa(id, dataBaru) {
    const index = daftarMahasiswa.value.findIndex(m => m.id === id);
    if (index !== -1) {
      daftarMahasiswa.value[index] = { ...daftarMahasiswa.value[index], ...dataBaru };
      saveToLocalStorage();
    }
  }

  // 3. DELETE (Hapus Mahasiswa)
  function hapusMahasiswa(id) {
    daftarMahasiswa.value = daftarMahasiswa.value.filter(m => m.id !== id);
    saveToLocalStorage();
  }

  return {
    daftarMahasiswa,
    tambahMahasiswa,
    ubahMahasiswa,
    hapusMahasiswa
  };
});