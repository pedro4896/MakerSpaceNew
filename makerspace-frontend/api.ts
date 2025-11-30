// api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ Ajuste o IP/porta conforme seu backend
const API_BASE_URL = 'http://192.168.1.130:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para adicionar JWT e tratar corretamente FormData
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');

    if (!config.headers) {
      config.headers = {};
    }

    // Token, se existir
    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }

    // 🔑 Se o corpo for FormData, garante multipart/form-data
    if (config.data instanceof FormData) {
      (config.headers as any)['Content-Type'] = 'multipart/form-data';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
