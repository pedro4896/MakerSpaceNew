import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🚨 IMPORTANTE: Mude '192.168.1.X' para o IP local da sua máquina (ou a URL do seu servidor).
const API_BASE_URL = 'http://192.168.1.130:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Interceptor para adicionar o JWT a todas as requisições autenticadas
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;