import { defineStore } from 'pinia';
import api from '../services/api';

export const useMahasiswaStore = defineStore('mahasiswa', {
  state: () => ({
    daftarMahasiswa: [],
    loading: false
  }),

  actions: {
    async getMahasiswa() {
      try {
        this.loading = true;

        const res = await api.get('/mahasiswa');

        this.daftarMahasiswa = res.data;
      } finally {
        this.loading = false;
      }
    },

    async tambahMahasiswa(data) {
      await api.post('/mahasiswa', data);

      await this.getMahasiswa();
    },

    async updateMahasiswa(id, data) {
      await api.put(`/mahasiswa/${id}`, data);

      await this.getMahasiswa();
    },

    async deleteMahasiswa(id) {
      await api.delete(`/mahasiswa/${id}`);

      await this.getMahasiswa();
    }
  }
});