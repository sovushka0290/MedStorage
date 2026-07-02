import axios from 'axios';
import { Platform } from 'react-native';

// Умное переключение URL: для Android эмулятора нужен 10.0.2.2, для iOS и веба - 127.0.0.1
// Render endpoint:
const baseURL = 'https://medstorage.onrender.com/api';

export const api = axios.create({
  baseURL,
});
