import axios from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
    const token = ref(localStorage.getItem('token') || null);

    const isAuthenticated = computed(() => !!token.value);

    const register = async(email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                email,
                password
            });
            return response.data;

        } catch (error) {
            console.error(error);
            throw error.response?.data?.message || 'Registrasi gagal';
        }
    }

    const login = async(email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            token.value = response.data.token;
            user.value = response.data.user;

            localStorage.setItem('token', token.value);
            localStorage.setItem('user', JSON.stringify(user.value));

            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response?.data?.message || 'Login gagal';
        }
    }

    const logout = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    return {
        user,
        token,
        isAuthenticated,
        register,
        login,
        logout
    };
});